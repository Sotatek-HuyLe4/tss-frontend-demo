import { AxiosDefaults, AxiosRequestConfig } from "axios";

import httpRequest from "@/utils/httpRequest";

const BASE_URL = "faucet";

export const faucet = async ({ address }: { address: string }) => {
  const options: AxiosRequestConfig<AxiosDefaults> = {
    url: `${BASE_URL}`,
    method: "POST",
    data: {
      address,
    } as any,
  };

  const response = await httpRequest(options);
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to faucet");
  }

  return response.data.data;
};
