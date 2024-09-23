import React, { useCallback, useEffect, useMemo } from "react";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { CompiledCoursesData } from "../../types/data.types";
import { ScheduleClassTimeType } from "../../types/schedule.types";
import ScheduleBlock from "../ScheduleBlock.tsx/ScheduleBlock";

const scheduleBlockSettings = {
  startHour: 8,
  endHour: 21,
  lineInterval: 1,
  labelInterval: 2,
  showLabels: true,
  doubleSidedColumnGap: 1,
};

export default function ScheduleGrid() {
  const { generatedSchedule, sectionsData, courseColors } =
    useScheduler() as ISchedulerContextType;

  const StripSchedule = useCallback(
    (scheduleData: string[], data: CompiledCoursesData) => {
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
          schedule={StripSchedule(schedule, sectionsData)}
          settings={scheduleBlockSettings}
          colorTheme={courseColors}
          className="h-44 w-64 border-2 border-slate-500 bg-gray-200 font-normal shadow-md hover:-top-1 hover:border-[3px] hover:border-pink-500 hover:drop-shadow-xl"
        />
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedSchedule, StripSchedule]);

  return (
    <div
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))", // Fit as many columns as possible based on the block width
        justifyItems: "start", // Align items to start within each column
      }}
    >
      {/* This is where your generated schedules will be displayed */}
      {ScheduleBlockCollection}
    </div>
  );
}
