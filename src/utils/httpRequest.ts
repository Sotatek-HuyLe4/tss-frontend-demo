import axios, { AxiosRequestConfig, AxiosDefaults } from "axios";

import env from "./env";

const httpRequestClient = axios.create({
  baseURL: `${env.public.url.tssBackend}/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000, // 60 seconds
});

const httpRequest = async ({
  ...options
}: AxiosRequestConfig<AxiosDefaults>) => {
  try {
    const response = await httpRequestClient({ ...options });

    return response;
  } catch (error: any) {
    console.log(error);

    return error?.response;
  }
};

export default httpRequest;
