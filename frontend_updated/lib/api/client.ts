import axios, { AxiosError } from "axios";

/**
 * Single source of truth for the backend base URL.
 * Never hardcode URLs elsewhere — read from env config only.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000, // JD parsing / chat go through an LLM and can be slow
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  status?: number;
  detail: string;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail ?? message;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string }>) => {
    const status = error.response?.status;
    const detail =
      error.response?.data?.detail ??
      (error.code === "ECONNABORTED"
        ? "The request timed out. The AI engine may be under load — try again."
        : error.message);

    if (!error.response) {
      throw new ApiError(
        "Could not reach the Talent Intelligence backend. Confirm NEXT_PUBLIC_API_BASE_URL is set and the API is running.",
        undefined,
        detail
      );
    }

    throw new ApiError(detail, status, detail);
  }
);
