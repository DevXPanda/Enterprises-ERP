// ============================================================
//  API client — talks to the NestJS backend (NEXT_PUBLIC_API_URL,
//  default http://localhost:4000). Resource paths mirror frontend
//  routes: page /factory/store/current-stock reads from
//  GET  {API}/api/factory/store/current-stock
// ============================================================

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiColumn {
  key: string;
  type: "text" | "int" | "num" | "date" | "ts" | "bool" | "uuid" | "time" | "json";
}

export interface ListResponse<T = Record<string, unknown>> {
  resource?: string;
  label?: string;
  columns?: ApiColumn[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  data: T[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(", ") : body.message;
      }
    } catch {
      /* keep default message */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_BASE}/api${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  return handle<T>(res);
}

export async function apiSend<T>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handle<T>(res);
}

/** List a registry resource with search/pagination. */
export function listResource(
  path: string,
  opts: { search?: string; page?: number; pageSize?: number } = {},
): Promise<ListResponse> {
  return apiGet<ListResponse>(path, {
    search: opts.search,
    page: opts.page,
    pageSize: opts.pageSize,
  });
}

/** Render an API cell value for display. */
export function formatCell(value: unknown, type?: ApiColumn["type"]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "bool" || typeof value === "boolean") return value ? "Yes" : "No";
  if (type === "ts" || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}/.test(value))) {
    const d = new Date(value as string);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  if (type === "date" && typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    }
  }
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number") return value.toLocaleString("en-IN");
  return String(value);
}
