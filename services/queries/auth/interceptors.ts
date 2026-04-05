import api from "@/services/axios";
import type { InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// 👇 skip auth flag
const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

api.interceptors.response.use(
  (response) => {
    // 👇 لو skipAuth شغال، تجاهل أي logic خاص بالـ auth
    if (skipAuth) return response;

    // Capture refreshToken on successful sign-in only if rememberMe is enabled
    try {
      if (typeof window !== "undefined") {
        const url = response?.config?.url as string | undefined;
        const isSignIn =
          typeof url === "string" && url.includes("/auth/sign-in");

        if (isSignIn) {
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          const rt = (response?.data?.data?.refreshToken ?? "") as string;

          if (rememberMe && rt) {
            localStorage.setItem("refreshToken", rt);
          } else {
            localStorage.removeItem("refreshToken");
          }
        }
      }
    } catch {}

    return response;
  },
  async (error) => {
    // 👇 لو skipAuth شغال، متعملش أي auth handling
    if (skipAuth) {
      return Promise.reject(error);
    }

    const resp = error?.response;
    const originalRequest =
      (error?.config || {}) as InternalAxiosRequestConfig & {
        _retry?: boolean;
        headers?: Record<string, unknown>;
      };

    if (!resp) {
      return Promise.reject(error);
    }

    if (
      resp?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (rememberMe && storedRefreshToken) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              }
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await api.post("/auth/refresh-token", {
            refreshToken: storedRefreshToken,
          });

          const newAccessToken: string | undefined =
            res?.data?.data?.accessToken;
          const newRefreshToken: string | undefined =
            res?.data?.data?.refreshToken;

          if (newRefreshToken) {
            try {
              localStorage.setItem("refreshToken", newRefreshToken);
            } catch {}
          }

          if (newAccessToken) {
            try {
              localStorage.setItem("accessToken", newAccessToken);
            } catch {}

            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // sync cookie
            try {
              document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${
                60 * 60 * 24 * 7
              }`;
            } catch {}

            onRefreshed(newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
            }

            return api(originalRequest);
          }
        } catch {
          // fall through
        } finally {
          isRefreshing = false;
        }
      }

      // logout
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("rememberMe");

        try {
          document.cookie = "accessToken=; path=/; max-age=0";
        } catch {}
      } catch {}

      // 👇 مهم: منع redirect لو skipAuth شغال (احتياطي)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        if (currentPath !== "/sign-in") {
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);

export {};
