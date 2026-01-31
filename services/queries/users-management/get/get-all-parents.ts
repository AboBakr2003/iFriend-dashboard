import api from "@/services/axios";

export type AllParentsItem = {
  id: string;
  name: string;
  email: string;
  kidsCount: number;
  isSubscribed: boolean;
  registrationDate: string;
  avatarUrl?: string;
}

export type AllParentsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AllParentsData = {
  users: AllParentsItem[];
  meta: AllParentsMeta;
}

export type AllParentsResponse = {
  success: boolean;
  message: string;
  data: AllParentsData;
}

export const getAllParents = async () => {
  try {
    const res = await api.get<AllParentsResponse>("/user-management/get-all-parents");
    return {
      success: true as const,
      message: res?.data?.message ?? "All parents retrieved successfully",
      data: (res?.data?.data ?? {}) as AllParentsData,
    };
  } catch (err) {
    const error = err as { response?: { status?: number; data?: Record<string, unknown> } };
    const status = error?.response?.status;
    const data = error?.response?.data ?? {};
    return {
      success: false as const,
      status,
      message: (data?.message as string) ?? "Failed to fetch all parents",
    };
  }
};
