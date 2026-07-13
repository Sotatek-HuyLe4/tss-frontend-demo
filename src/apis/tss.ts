import { AxiosDefaults, AxiosRequestConfig } from "axios";

import httpRequest from "@/utils/httpRequest";

const BASE_URL = "tss";

export const createChannel = async () => {
  const options: AxiosRequestConfig<AxiosDefaults> = {
    url: `${BASE_URL}/channel`,
    method: "POST",
    data: {
      expire: 30,
    } as any,
  };

  const response = await httpRequest(options);
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to create channel");
  }

  return response.data.data;
};

export const initVault = async ({ vault }: { vault: string }) => {
  const options: AxiosRequestConfig<AxiosDefaults> = {
    url: `${BASE_URL}/init-vault`,
    method: "POST",
    data: {
      vault,
      password: "123456789",
    } as any,
  };

  const response = await httpRequest(options);
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to init vault");
  }

  return response.data.data;
};

export const generateKeyShare = async ({
  vault,
  channelId,
}: {
  vault: string;
  channelId: string;
}) => {
  const options: AxiosRequestConfig<AxiosDefaults> = {
    url: `${BASE_URL}/generate-key`,
    method: "POST",
    data: {
      vault,
      password: "123456789",
      parties: 3,
      threshold: 1,
      channelId,
    } as any,
  };

  const response = await httpRequest(options);
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to generate key share");
  }

  return response.data.data;
};
