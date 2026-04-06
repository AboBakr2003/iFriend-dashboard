import api from "@/services/axios";

export interface AppVersion {
  id: number;
  platform: string;
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  storeUrl: string | null;
  releaseNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAppVersionResponse {
  success: boolean;
  data: AppVersion[];
}

export const getAppVersion = async () => {
  try {
    const res = await api.get<GetAppVersionResponse>("/app-version/get-app-version");
    return {
      success: true as const,
      data: res.data.data,
      message: "App versions fetched successfully ✅",
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      data: [] as AppVersion[],
      message: (data?.message as string) ?? "Failed to fetch app versions ❗",
    };
  }
};
