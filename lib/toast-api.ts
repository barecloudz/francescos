/**
 * Toast API Client — Standard tier (read-only)
 * Handles OAuth token management and all available read endpoints.
 */

const TOAST_API_HOST = process.env.TOAST_API_HOST || 'https://ws-api.toasttab.com';
const TOAST_CLIENT_ID = process.env.TOAST_CLIENT_ID!;
const TOAST_CLIENT_SECRET = process.env.TOAST_CLIENT_SECRET!;
const TOAST_RESTAURANT_GUID = process.env.TOAST_RESTAURANT_GUID!;

// ---------------------------------------------------------------------------
// Token cache (in-process, survives for the lifetime of the server instance)
// ---------------------------------------------------------------------------
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  // Refresh 60 seconds before expiry
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const res = await fetch(`${TOAST_API_HOST}/authentication/v1/authentication/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: TOAST_CLIENT_ID,
      clientSecret: TOAST_CLIENT_SECRET,
      userAccessType: 'TOAST_MACHINE_CLIENT',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Toast auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = data.token?.accessToken as string;
  const expiresIn: number = data.token?.expiresIn ?? 86400; // default 24h
  tokenExpiresAt = now + expiresIn * 1000;

  if (!cachedToken) throw new Error('Toast auth response missing accessToken');
  return cachedToken;
}

// ---------------------------------------------------------------------------
// Date helpers
// Toast requires format: yyyy-MM-dd'T'HH:mm:ss.SSS+HHMM
// The + must be URL-encoded as %2B when used in query strings.
// ---------------------------------------------------------------------------
function toToastDate(date: Date): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  const y = date.getUTCFullYear();
  const mo = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const mi = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  const ms = pad(date.getUTCMilliseconds(), 3);
  return `${y}-${mo}-${d}T${h}:${mi}:${s}.${ms}%2B0000`;
}

export function toastDateRange(from: Date, to: Date) {
  return { startDate: toToastDate(from), endDate: toToastDate(to) };
}

// ---------------------------------------------------------------------------
// Base request helper
// ---------------------------------------------------------------------------
async function toastRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${TOAST_API_HOST}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Toast-Restaurant-External-ID': TOAST_RESTAURANT_GUID,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    throw new Error(`Toast rate limit hit. Retry after ${retryAfter ?? 'unknown'} seconds.`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Toast API error ${res.status} on ${path}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Restaurant
// ---------------------------------------------------------------------------
export async function getRestaurant() {
  return toastRequest<any>('/restaurants/v1/restaurant');
}

// ---------------------------------------------------------------------------
// Menus
// NOTE: Rate limit is 1 req/sec for /menus — do not poll aggressively.
// ---------------------------------------------------------------------------
export async function getMenus() {
  return toastRequest<any>('/menus/v2/menus');
}

// ---------------------------------------------------------------------------
// Orders
// Pass JS Date objects — the client handles formatting automatically.
// Regular endpoint: max 1 hour window per request.
// Bulk endpoint: max 1 month window per request.
// ---------------------------------------------------------------------------
export async function getOrders(from: Date, to: Date) {
  const { startDate, endDate } = toastDateRange(from, to);
  return toastRequest<any[]>(`/orders/v2/orders?startDate=${startDate}&endDate=${endDate}`);
}

export async function getOrdersBulk(from: Date, to: Date) {
  const { startDate, endDate } = toastDateRange(from, to);
  return toastRequest<any[]>(`/orders/v2/ordersBulk?startDate=${startDate}&endDate=${endDate}`);
}

export async function getOrder(orderGuid: string) {
  return toastRequest<any>(`/orders/v2/orders/${orderGuid}`);
}

// ---------------------------------------------------------------------------
// Stock
// ---------------------------------------------------------------------------
export async function getStock() {
  return toastRequest<any>('/stock/v1/inventory');
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
export async function getConfig() {
  return toastRequest<any>('/config/v2/restaurantServices');
}

// ---------------------------------------------------------------------------
// Digital / Online Ordering Schedule
// ---------------------------------------------------------------------------
export async function getDigitalSchedule() {
  return toastRequest<any>('/digital/v1/digitalSchedules');
}

// ---------------------------------------------------------------------------
// Labor / Employees
// ---------------------------------------------------------------------------
export async function getEmployees() {
  return toastRequest<any[]>('/labor/v1/employees');
}

export async function getTimeEntries(from: Date, to: Date) {
  const { startDate, endDate } = toastDateRange(from, to);
  return toastRequest<any[]>(`/labor/v1/timeEntries?startDate=${startDate}&endDate=${endDate}`);
}

// ---------------------------------------------------------------------------
// Cash Management
// ---------------------------------------------------------------------------
export async function getCashEntries(from: Date, to: Date) {
  const { startDate, endDate } = toastDateRange(from, to);
  return toastRequest<any[]>(`/cashmgmt/v1/cashEntries?startDate=${startDate}&endDate=${endDate}`);
}
