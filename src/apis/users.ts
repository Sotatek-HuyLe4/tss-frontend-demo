import { AxiosDefaults, AxiosRequestConfig } from "axios";

import httpRequest from "@/utils/httpRequest";

const BASE_URL = "users";

export const getUsers = async () => {
  const options: AxiosRequestConfig<AxiosDefaults> = {
    url: `${BASE_URL}`,
    method: "GET",
  };

  const response = await httpRequest(options);
  if (response.status >= 400) {
    throw new Error(response.data?.message || "Failed to get users");
  }

  return response.data.data;
};
