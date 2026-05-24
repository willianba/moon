import { env } from "$env/dynamic/public";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return env.PUBLIC_API_URL || "http://localhost:5173";
};

export interface HealthResponse {
  checks?: Record<string, "error" | "ok">;
  status: string;
  timestamp: string;
}

export interface UserResponse {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

interface CreateUserInput {
  email: string;
  name: string;
}

const createUrl = (path: string, baseUrl?: string) =>
  new URL(path, baseUrl ?? getBaseUrl()).toString();

const getErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
};

const request = async <T>(
  path: string,
  init?: RequestInit,
  baseUrl?: string
) => {
  const response = await fetch(createUrl(path, baseUrl), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
};

export const createApiClient = (baseUrl?: string) => ({
  health: {
    get: () => request<HealthResponse>("/api/health", undefined, baseUrl),
  },
  users: {
    create: (input: CreateUserInput) =>
      request<ApiResponse<UserResponse>>(
        "/api/users",
        {
          body: JSON.stringify(input),
          method: "POST",
        },
        baseUrl
      ),
    list: () =>
      request<ApiResponse<UserResponse[]>>("/api/users", undefined, baseUrl),
    remove: (id: string) =>
      request<ApiResponse<UserResponse>>(
        `/api/users/${id}`,
        {
          method: "DELETE",
        },
        baseUrl
      ),
  },
});

export const api = createApiClient();
