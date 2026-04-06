import api from "@/services/axios";

export interface UpdateAppVersionPayload {
  latestVersion: string;
  minVersion: string;
  forceUpdate: boolean;
  storeUrl?: string;
  releaseNotes: string;
}

export const updateAppVersion = async (platform: string, payload: UpdateAppVersionPayload) => {
  try {
    const res = await api.patch(
      `/app-version/create-update-app-version/${platform}`,
      payload
    );
    return {
      success: true as const,
      message: res.data?.message ?? "App version updated successfully ✅",
      data: res.data?.data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return {
      success: false as const,
      message: error.response?.data?.message ?? "Failed to update app version ❗",
    };
  }
};
