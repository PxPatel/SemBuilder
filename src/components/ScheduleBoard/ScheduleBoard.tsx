import React, { useCallback, useMemo } from "react";
import { PaginationButtons } from "./PaginationButtons";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { CompiledCoursesData } from "../../types/data.types";
import { ScheduleClassTimeType } from "../../types/schedule.types";
import ScheduleBlock from "./ScheduleBlock";

const scheduleBlockSettings = {
  startHour: 8,
  endHour: 24,
  lineInterval: 2,
  labelInterval: 2,
  showLabels: true,
  doubleSidedColumnGap: 1,
};

const ScheduleBoard = () => {
  const { generatedSchedule, scheduleGenerationOptions, courseColors } =
    useScheduler() as ISchedulerContextType;

  const StripSchedule = useCallback(
    (scheduleData: string[], data: CompiledCoursesData) => {
      if (data === null) {
        return {};
      }

      const TimeRepresentedSchedules: ScheduleClassTimeType = {};

      scheduleData.forEach((sectionIdentity) => {
        const [courseTitle, sectionNumber] = sectionIdentity.split("-");
        TimeRepresentedSchedules[sectionIdentity] = {
          days: data[courseTitle][sectionNumber].days,
          startTimes: data[courseTitle][sectionNumber].start_times,
          endTimes: data[courseTitle][sectionNumber].end_times,
        };
      });

      return TimeRepresentedSchedules;
    },
    [],
  );

  const ScheduleBlockCollection = useMemo(() => {
    if (generatedSchedule === null) {
      return null;
    }

    return generatedSchedule.map((schedule, index) => {
      return (
        <ScheduleBlock
          key={index}
          schedule={StripSchedule(
            schedule,
            scheduleGenerationOptions.current.relevantCoursesData ?? {},
          )}
          settings={scheduleBlockSettings}
          colorTheme={courseColors}
          className="h-44 w-64 border-2 border-slate-500 bg-gray-50 font-normal shadow-md hover:-top-1 hover:border-[3px] hover:border-pink-500 hover:drop-shadow-xl"
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedSchedule, StripSchedule]);

  return (
    <div className="h-full flex-grow">
      <div
        className="grid gap-4 px-4 pb-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))", // Fit as many columns as possible based on the block width
          justifyItems: "start", // Align items to start within each column
        }}
      >
        {ScheduleBlockCollection}
      </div>
      <PaginationButtons />
    </div>
  );
};

export default ScheduleBoard;
