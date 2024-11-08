import React, { useCallback, useMemo, useState } from "react";
import { PaginationButtons } from "./PaginationButtons";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { CompiledCoursesData } from "../../types/data.types";
import { ScheduleClassTimeType } from "../../types/schedule.types";
import ScheduleBlock from "./ScheduleBlock";
import ScheduleModal from "./ScheduleModal";

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

  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleClassTimeType | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleScheduleBlockClick = (schedule: ScheduleClassTimeType) => {
    setSelectedSchedule(schedule);
    setModalOpen(true);
  };

  const ScheduleBlockCollection = useMemo(() => {
    if (generatedSchedule === null) return null;

    return generatedSchedule.map((schedule, index) => (
      <div
        key={index}
        onClick={() =>
          handleScheduleBlockClick(
            StripSchedule(
              schedule,
              scheduleGenerationOptions.current.relevantCoursesData ?? {},
            ),
          )
        }
      >
        <ScheduleBlock
          schedule={StripSchedule(
            schedule,
            scheduleGenerationOptions.current.relevantCoursesData ?? {},
          )}
          settings={scheduleBlockSettings}
          colorTheme={courseColors}
          propStyles={{
            parentStyle:
              "h-44 w-64 border-2 border-slate-500 bg-gray-50 font-normal shadow-md hover:cursor-pointer hover:-top-1 hover:border-[3px] hover:border-pink-500 hover:drop-shadow-xl",
          }}
        />
      </div>
    ));
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

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        schedule={selectedSchedule}
        colorTheme={courseColors}
      />
    </div>
  );
};

export default ScheduleBoard;
