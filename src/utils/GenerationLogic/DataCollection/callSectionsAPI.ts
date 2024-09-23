import FetchError from "../../../lib/error/FetchError";
import { QUERY_PARAMETERS, SectionAPIResponse } from "../../../types/api.types";

export const callSectionsAPI = async (
  queryParameters: QUERY_PARAMETERS,
): Promise<SectionAPIResponse> => {
  const isBrowser = typeof window !== "undefined"; // Check if running on client
  const serverBaseUrl = isBrowser
    ? window.location.origin + "/" // Use the current domain dynamically
    : (process.env.NEXT_PUBLIC_SERVER_URL ?? ""); // Fallback for SSR

  const serverSectionsEndpoint =
    process.env.NEXT_PUBLIC_SERVER_SECTIONS_ENDPOINT ?? "";

  const callURL = new URL(serverBaseUrl + serverSectionsEndpoint);

  Object.entries(queryParameters).forEach(([paramKey, paramValue]) => {
    callURL.searchParams.set(paramKey, paramValue);
  });

  try {
    // Make the API call and parse the JSON response
    const response = await fetch(callURL.toString());

    //Response is not good
    if (!response.ok) {
      // Create and throw FetchError with detailed message
      const errorMessage = `${serverSectionsEndpoint} call failed with status: ${response.status} - ${response.statusText}`;
      throw new FetchError(errorMessage, response.status, response.statusText);
    }

    const data: SectionAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    if (error instanceof FetchError) {
      // Re-throw the FetchError if it's already an instance of FetchError
      throw error;
    } else {
      // Re-throw as a FetchError with additional context if it's a different type of error
      throw new FetchError(
        `An unexpected error occurred invoking fetch on endpoint: ${serverBaseUrl + serverSectionsEndpoint}`,
      );
    }
  }
};
