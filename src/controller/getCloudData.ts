import { NextRequest, NextResponse } from "next/server";
import { cloudFetchCall } from "../lib/rest/cloudFetchCall";
import { headers } from "next/headers";

const getCloudData = async (
  request: NextRequest,
  cloudEndpoint: string | undefined
): Promise<NextResponse> => {
  const cloudBaseUrl = process.env.API_URL;

  //Check if url and endpoint are defined
  if (!(cloudBaseUrl && cloudEndpoint)) {
    return new NextResponse(
      JSON.stringify({
        error: "Base url or sections endpoint is not defined",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const cloudCallURL = new URL(cloudBaseUrl.concat(cloudEndpoint));

  // Add search parameters to the API call URL
  request.nextUrl.searchParams.forEach((value, key) => {
    cloudCallURL.searchParams.set(key, value);
  });

  // Use the utility function to handle fetching, errors, and response
  const { data, status, contentType } = await cloudFetchCall(
    new Request(cloudCallURL, {
      headers: {
        "X-API-Key": process.env.API_KEY ?? "",
      },
    })
  );

  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": contentType },
  });
};

export default getCloudData;
