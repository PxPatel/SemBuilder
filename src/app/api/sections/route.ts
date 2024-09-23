import { NextRequest, NextResponse } from "next/server";
import getCloudData from "../../../controller/getCloudData";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return getCloudData(request, process.env.SECTIONS_ENDPOINT);
}
