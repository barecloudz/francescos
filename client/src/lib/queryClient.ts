import { QueryClient, type QueryFunction } from "@tanstack/react-query";
import { SelectUser } from "@shared/schema";
import { supabase } from './supabase';

type UnauthorizedBehavior = "throw" | "returnNull";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    return headers;
  } catch (error) {
    console.error('❌ Critical error getting auth headers:', error);
    return headers;
  }
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  unauthorizedBehavior: UnauthorizedBehavior = "throw"
): Promise<Response> {
  const headers = await getAuthHeaders();

  // Check if data is FormData (for file uploads)
  const isFormData = data instanceof FormData;

  const fetchOptions: RequestInit = {
    method,
    headers: isFormData
      ? headers // Don't set Content-Type for FormData - browser will set it with boundary
      : {
          "Content-Type": "application/json",
          ...headers,
        },
    credentials: "include", // Include cookies for any remaining legacy endpoints
  };

  if (data) {
    fetchOptions.body = isFormData ? data : JSON.stringify(data);
  }

  // Reduced logging - only log failures
  // console.log(`🌐 API ${method} ${url}`, {
  //   hasAuth: !!headers.Authorization,
  //   authType: headers.Authorization ? 'Supabase' : 'none'
  // });

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    // Only log actual errors (not 401/403 which are expected sometimes)
    if (response.status !== 401 && response.status !== 403) {
      console.error(`❌ API ${method} ${url} failed (${response.status}):`, errorText.substring(0, 200));
    }

    if (response.status === 401 && unauthorizedBehavior === "returnNull") {
      return new Response("null", { status: 200 });
    }

    throw new Error(`${response.status}: ${errorText}`);
  }

  return response;
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  const [url] = queryKey as [string];
  const response = await apiRequest("GET", url, undefined, "returnNull");
  return await response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('401')) {
          return false; // Don't retry unauthorized requests
        }
        return failureCount < 3;
      },
    },
  },
});