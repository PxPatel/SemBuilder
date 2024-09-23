import { NextRequest } from "next/server";

export async function cloudFetchCall(
  request: Request,
): Promise<{ data: any; status: number; contentType: string }> {
  try {
    const response = await fetch(request);
    const contentType = response.headers.get("Content-Type") || "";
    const status = response.status;

    //If response is successful
    if (response.ok) {
      const data = await response.json();
      return { data, status, contentType };
    }

    //If response is not ok, for either syntax or service reasons
    else {
      let data;

      //If JSON format
      if (contentType.includes("application/json")) {
        const responseJSON = await response.json();
        data = {
          error: responseJSON.error || responseJSON.message,
        };
      }

      //If HTML format
      else if (contentType.includes("text/html")) {
        data = { error: await response.text() };
      }

      //Otherwise
      else {
        console.error(
          "Fetch Error: Expected JSON or HTML but received:",
          contentType,
        );
        data = { error: `Unexpected response format: ${contentType}` };
      }
      return { data, status, contentType };
    }
  } catch (error) {
    //If Fetch call failed
    console.error("Fetch Error:", error);
    return {
      data: { error: "Internal Server Error" },
      status: 500,
      contentType: "application/json",
    };
  }
}
