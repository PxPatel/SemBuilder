"use client";

import React, {
  createContext,
  useState,
  useRef,
  ReactNode,
  MutableRefObject,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { collectSectionsData } from "../utils/GenerationLogic/DataCollection/collectSectionsData";
import useGenerateSchedules from "./use-generate-schedules";
import {
  DEFAULT_SCHEDULE_GENERATION_OPTIONS,
  SEMESTER,
  BoxPalettes,
} from "../lib/default/default";
import { CompiledCoursesData } from "../types/data.types";
import { ScheduleGenerationOptions } from "../types/options.types";
import { LastPointDetails, ReportSchedules } from "../types/schedule.types";
import { useErrorUI } from "./use-error-ui";
import DataError from "../lib/error/DataError";

export type ISchedulerContextType = {
  // sectionsData: CompiledCoursesData;
  scheduleGenerationOptions: React.MutableRefObject<ScheduleGenerationOptions>;
  generatedSchedule: ReportSchedules | null;
  updateGenerationOptions: (
    newOptions: Partial<ScheduleGenerationOptions>,
  ) => void;
  buildSchedules: () => void;
  LPDMap: LastPointDetails[];
  courseColors: { [courseTitle: string]: string };
  getSectionsData: (selectedCourses: string[]) => Promise<void>;
  navPage: number;
  setNavPage: React.Dispatch<React.SetStateAction<number>>;
};

export const SchedulerContext = createContext<ISchedulerContextType | null>(
  null,
);

export const useScheduler = () => useContext(SchedulerContext);

export function SchedulerProvider({ children }: { children: ReactNode }) {
  // const [sectionsData, setSectionsData] = useState<CompiledCoursesData>({});
  const SGO = useRef<ScheduleGenerationOptions>(
    DEFAULT_SCHEDULE_GENERATION_OPTIONS,
  );
  const [generatedSchedule, setGeneratedSchedule] =
    useState<ReportSchedules | null>(null);
  const [build, LPDMap] = useGenerateSchedules();
  const [courseColors, setCourseColors] = useState<{
    [courseTitle: string]: string;
  }>({});
  //Fresh options indictator
  const haveAnyOptionsChanged: MutableRefObject<boolean> = useRef(true);
  //Page navigation
  const [navPage, setNavPage] = useState<number>(1);
  //Error handling
  const { error, setError } = useErrorUI();
  //Indicator for auto build
  const [autoBuildTrigger, setBuildTrigger] = useState<boolean>(false);

  const setNewColorMap = useCallback((selectedCourses: string[]) => {
    const newColorMap: { [courseTitle: string]: string } = {};
    selectedCourses.forEach((sectionTitle, index) => {
      newColorMap[sectionTitle] = BoxPalettes[index];
    });
    setCourseColors(newColorMap);
  }, []);

  const updateGenerationOptions = useCallback(
    (newOptions: Partial<ScheduleGenerationOptions>, callback?: () => any) => {
      console.log("[updateGenerationOptions Starting]");
      SGO.current = { ...SGO.current, ...newOptions };

      haveAnyOptionsChanged.current = true;
      setBuildTrigger(true);
      setNavPage(1);
      setError(null);

      callback ? callback() : undefined;
      console.log("[updateGenerationOptions Ending]");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const getSectionsData = useCallback(
    async (selectedCourses: string[]) => {
      console.log("[Data Fetch Starting]");
      if (selectedCourses.length > 0) {
        // Convert knownCourses to a Set for O(1) lookups
        const knownCoursesSet = new Set(
          Object.keys(SGO.current.relevantCoursesData ?? {}),
        );
        console.log("knownCoursesSet", knownCoursesSet);

        // Filter out the courses that we don't already have data for
        const newCoursesToFetch = selectedCourses.filter(
          (course) => !knownCoursesSet.has(course),
        );

        console.log("newCoursesToFetch", newCoursesToFetch);

        // Remove any sections that are no longer selected
        const updatedSectionsData = {
          ...(SGO.current.relevantCoursesData ?? {}),
        };
        const selectedCoursesSet = new Set(selectedCourses);

        console.log("selectedCoursesSet", selectedCoursesSet);
        Object.keys(SGO.current.relevantCoursesData ?? {}).forEach(
          (section) => {
            if (!selectedCoursesSet.has(section)) {
              delete updatedSectionsData[section];
            }
          },
        );

        console.log("updatedSectionsData", Object.keys(updatedSectionsData));

        try {
          const collectedSectionsData = await collectSectionsData(
            newCoursesToFetch,
            SEMESTER,
          );

          // setSectionsData({
          //   ...updatedSectionsData,
          //   ...collectedSectionsData,
          // });
          setNewColorMap(selectedCourses);
          updateGenerationOptions({
            relevantCoursesData: {
              ...updatedSectionsData,
              ...collectedSectionsData,
            },
          });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            console.log("Caught error in getSectionsData");
            setError(error);
          }
        }
      } else {
        console.log("No selected courses");
        // setSectionsData({});
        updateGenerationOptions({
          relevantCoursesData: {},
        });
      }

      console.log("[Data Fetch Ending]");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNewColorMap, updateGenerationOptions],
  );

  const buildSchedules = useCallback(
    ({ overrideNewBuild = false }: { overrideNewBuild?: boolean } = {}) => {
      console.log("[BuildSchedules Starting]");
      if (Object.keys(SGO.current.relevantCoursesData ?? {}).length === 0) {
        haveAnyOptionsChanged.current = true;
        setGeneratedSchedule([]);
        return;
      }

      console.log("haveAnyOptionsChanged:", haveAnyOptionsChanged.current);
      console.log("overrideNewBuild:", overrideNewBuild);

      const buildResult = build(
        SGO.current,
        haveAnyOptionsChanged.current,
        overrideNewBuild,
        () => (haveAnyOptionsChanged.current = false),
      );

      if (!error) {
        buildResult && setGeneratedSchedule(buildResult[0]);
      }
      console.log("[BuildSchedules Ending]");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [autoBuildTrigger],
    //[sectionsData]
  );

  useEffect(() => {
    console.log("[Nav Page Effect]:", navPage);

    if (navPage > LPDMap.length + 1) {
      setError(new Error("Can not rollback to a page that is not generated"));
      return;
    }

    // Override build schedules for previously generated pages
    SGO.current = {
      ...SGO.current,
      generationConfig: {
        ...SGO.current.generationConfig,
        lastPointDetails: navPage === 1 ? [] : LPDMap[navPage - 2],
      },
    };
    setBuildTrigger(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navPage]);

  //Reacting to option changes by auto building
  useEffect(() => {
    if (autoBuildTrigger) {
      console.log("[Handling auto building]: Valid triggers");
      if (error instanceof DataError) {
        console.log("Ending early cause of error");
        return; // Prevent buildSchedule from running if there's an error
      }

      if (haveAnyOptionsChanged.current || navPage === LPDMap.length + 1) {
        console.log("Building new page");
        buildSchedules(); // Run the schedule builder when sectionsData updates
      }
      //
      else if (navPage <= LPDMap.length) {
        console.log("Building previous pages again", navPage, LPDMap.length);
        buildSchedules({ overrideNewBuild: true });
      }

      setBuildTrigger(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoBuildTrigger]);

  const value: ISchedulerContextType = {
    // sectionsData,
    getSectionsData,
    scheduleGenerationOptions: SGO,
    generatedSchedule,
    updateGenerationOptions,
    buildSchedules,
    LPDMap,
    courseColors,
    navPage,
    setNavPage,
  };

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
}
