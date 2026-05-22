import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/middleware/rate-limit";

export const config = {
  matcher: ["/api/chat"],
};

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  let allowed: boolean;
  try {
    ({ allowed } = await checkRateLimit(ip));
  } catch {
    // If KV is unavailable, fail open so the app still works
    return NextResponse.next();
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  return NextResponse.next();
}
