import api from "@/services/axios";

export const signIn = async (email: string, password: string) => {
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

  // ✅ mock login
  if (skipAuth) {
    const fakeToken = "dev-token";

    if (typeof window !== "undefined") {
      api.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;
    }

    return {
      success: true,
      message: "Mock login success ✅",
      accessToken: fakeToken,
    };
  }

  // ✅ real API
  try {
    const res = await api.post("/auth/sign-in", { email, password });
    const accessToken: string | undefined = res?.data?.data?.accessToken;

    if (typeof window !== "undefined" && accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    return {
      success: true,
      message: res?.data?.message ?? "Login successfully ✅",
      accessToken: accessToken,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};

    return {
      success: false,
      message: status === 500 ? "Internal Server Error 🛢️" : `${data?.message} `,
    };
  }
};
