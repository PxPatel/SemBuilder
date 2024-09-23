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
import {
  PAGINATION_STATE,
  ScheduleGenerationOptions,
} from "../types/options.types";
import { LastPointDetails, ReportSchedules } from "../types/schedule.types";
import { useErrorUI } from "./use-error-ui";
import DataError from "../lib/error/DataError";

export type ISchedulerContextType = {
  sectionsData: CompiledCoursesData;
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
  const [sectionsData, setSectionsData] = useState<CompiledCoursesData>({});
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

  const getSectionsData = useCallback(
    async (selectedCourses: string[]) => {
      if (selectedCourses.length > 0) {
        try {
          const sectionsData = await collectSectionsData(
            selectedCourses,
            SEMESTER,
          );

          setSectionsData(sectionsData);
          setNewColorMap(selectedCourses);
          updateGenerationOptions({
            relevantCoursesData: sectionsData,
          });
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            console.log("Setting error");
            setError(error);
          }
        }
      } else {
        setSectionsData({});
        updateGenerationOptions({
          relevantCoursesData: {},
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNewColorMap],
  );

  useEffect(() => {
    console.log("New:", haveAnyOptionsChanged.current);
  });

  const updateGenerationOptions = useCallback(
    (newOptions: Partial<ScheduleGenerationOptions>, callback?: () => any) => {
      SGO.current = { ...SGO.current, ...newOptions };
      console.log("After days update:", SGO.current.unwantedDays);

      haveAnyOptionsChanged.current = true;
      setBuildTrigger(true);
      setNavPage(1);

      console.log("Hello from update");

      callback ? callback() : undefined;
    },
    [],
  );

  const buildSchedules = useCallback(
    ({ overrideNewBuild = false }: { overrideNewBuild?: boolean } = {}) => {
      if (Object.keys(sectionsData).length === 0) {
        haveAnyOptionsChanged.current = true;
        setGeneratedSchedule([]);
        return;
      }

      console.log("new options:", haveAnyOptionsChanged.current);
      console.log("override:", overrideNewBuild);

      const buildResult = build(
        SGO.current,
        haveAnyOptionsChanged.current,
        overrideNewBuild,
        () => (haveAnyOptionsChanged.current = false),
      );

      if (!error) {
        buildResult && setGeneratedSchedule(buildResult[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionsData],
  );

  useEffect(() => {
    console.log("In nav change:", navPage);

    if (navPage > LPDMap.length + 1) {
      setError(new Error("Can not rollback to a page that is not generated"));
      return;
    }

    // Override build schedules for previously generated pages
    console.log("Inside the SGO update of LPD");

    SGO.current = {
      ...SGO.current,
      generationConfig: {
        ...SGO.current.generationConfig,
        lastPointDetails:
          navPage === 1 ? [] : JSON.parse(JSON.stringify(LPDMap[navPage - 2])),
      },
    };
    setBuildTrigger(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navPage]);

  //Reacting to option changes by auto building
  useEffect(() => {
    if (autoBuildTrigger && sectionsData) {
      console.log("Getting called to auto build:)");
      if (error instanceof DataError) {
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
    sectionsData,
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
