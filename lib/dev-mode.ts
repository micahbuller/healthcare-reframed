import { cookies } from "next/headers";

/**
 * Returns true when running in development AND the devmode cookie is not
 * explicitly set to "0". Defaults to true in dev so all scheduled posts
 * are visible out-of-the-box when you run `npm run dev`.
 *
 * Always returns false in production — the toggle is invisible there.
 */
export async function getDevMode(): Promise<boolean> {
  if (process.env.NODE_ENV !== "development") return false;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("devmode");
  // Default: dev mode ON unless the user explicitly switched to prod preview
  return !cookie || cookie.value !== "0";
}
