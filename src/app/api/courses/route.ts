import { NextRequest, NextResponse } from "next/server";
import getCloudData from "../../../controller/getCloudData";

// Next.js will invalidate the cache when a
// request comes in, at most once every 1,800,000 seconds (30 minutes)
// export const revalidate = 1000 * 60 * 30;

export async function GET(request: NextRequest): Promise<NextResponse> {
  return getCloudData(request, process.env.COURSES_ENDPOINT);
}
