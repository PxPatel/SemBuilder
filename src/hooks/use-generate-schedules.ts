//hooks/useGenerateSchedules.ts

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScheduleGenerationOptions } from "../types/options.types";
import { LastPointDetails, ReportSchedules } from "../types/schedule.types";
import { generateFilteredSchedules } from "../utils/GenerationLogic/Main/generateFilteredSchedules";
import { useErrorUI } from "./use-error-ui";

type GenerateSchedulesHook = [
  (
    settings: ScheduleGenerationOptions,
    haveAnyOptionsChanged: boolean,
    overrideNewBuild: boolean,
    callback?: () => void,
  ) => [ReportSchedules, LastPointDetails] | null,
  LastPointDetails[],
];

const useGenerateSchedules = (): GenerateSchedulesHook => {
  const [LPDMap, setLPDMap] = useState<LastPointDetails[]>([]);
  const { setError } = useErrorUI();

  const build = useCallback(
    (
      settings: ScheduleGenerationOptions,
      haveAnyOptionsChanged: boolean = false,
      overrideNewBuild: boolean = false,
      callback?: () => void,
    ): [ReportSchedules, LastPointDetails] | null => {
      try {
        console.log("[Generation Starting]");
        console.log("Provided settings", settings);

        const response = generateFilteredSchedules(
          JSON.parse(JSON.stringify(settings)),
        );

        setLPDMap((prev) => {
          console.log("Current LDPMap", JSON.parse(JSON.stringify(prev)));

          let newLPDMap = prev;

          if (haveAnyOptionsChanged) {
            newLPDMap = []; // Clear LPDMap
          }

          if (!overrideNewBuild) {
            newLPDMap = [...newLPDMap, response[1]]; // Append to LPDMap
          }

          return newLPDMap; // No changes if neither condition is met
        });

        callback ? callback() : undefined;

        console.log("[Generation Ending]");
        return response;
      } catch (error: unknown) {
        console.log("Caught an Error during generation", error);
        if (error instanceof Error) {
          setError(error);
        } else {
          // Handle non-Error types if necessary
          setError(new Error("An unknown error occurred"));
        }
        console.log("[Generation Ending]");
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [LPDMap],
  );

  return [build, LPDMap];
};

export default useGenerateSchedules;
