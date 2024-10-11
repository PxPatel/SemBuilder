import React from "react";
import { Day } from "../../types/data.types";
import { ScheduleClassTimeType } from "../../types/schedule.types";

export default function ScheduleBlockV2({
  schedule,
  settings,
  className,
  colorTheme,
}: {
  schedule: ScheduleClassTimeType;
  settings: {
    startHour: number;
    endHour: number;
    lineInterval: number;
    labelInterval: number;
    showLabels: boolean;
    doubleSidedColumnGap: number;
  };
  colorTheme: { [courseTitle: string]: string };
  className?: string;
}) {
  const dayToColumn: Record<Day, number> = {
    M: 1,
    T: 2,
    W: 3,
    R: 4,
    F: 5,
    S: 6,
    X: -1,
  };

  const dayLabels: Record<Day, string> = {
    M: "Monday",
    T: "Tuesday",
    W: "Wednesday",
    R: "Thursday",
    F: "Friday",
    S: "Saturday",
    X: "",
  };

  const {
    startHour,
    endHour,
    lineInterval,
    labelInterval,
    showLabels,
    doubleSidedColumnGap,
  } = settings;

  const startOfDay = startHour * 60 * 60 * 1000;
  const endOfDay = endHour * 60 * 60 * 1000;
  const dayDuration = endOfDay - startOfDay;

  const timeToPosition = (time: number) => {
    return ((time - startOfDay) / dayDuration) * 100;
  };

  const hours = Array.from(
    { length: Math.floor((endHour - startHour) / lineInterval) },
    (_, i) => startHour + i * lineInterval,
  );

  const labelColumnWidth = 10; // Width of the label column in percentage
  const dayColumnWidth = (100 - labelColumnWidth) / 6; // Width of each day column

  return (
    <div
      className={`${className || ""} border-box relative rounded-lg border-2 border-stone-700`}
    >
      {Object.entries(schedule).map(
        ([sectionIdentity, { days, startTimes, endTimes }]) =>
          days.map((day, i) => {
            if (day === "X" || !startTimes[i] || !endTimes[i]) return null;

            const color = colorTheme[sectionIdentity.split("-")[0]];
            const topPosition = timeToPosition(startTimes[i]);
            const height = timeToPosition(endTimes[i]) - topPosition;
            const leftPosition = (dayToColumn[day] - 1) * dayColumnWidth;
            const blockWidth = dayColumnWidth - doubleSidedColumnGap;
            const marginLeft = (dayColumnWidth - blockWidth) / 2;

            return (
              <div
                key={`${sectionIdentity}-${i}`}
                className="absolute rounded border border-slate-900"
                style={{
                  top: `${topPosition}%`,
                  left: `calc(${labelColumnWidth}% + ${leftPosition}% + ${marginLeft}%)`,
                  width: `${blockWidth}%`,
                  height: `${height}%`,
                  backgroundColor: color,
                  boxSizing: "border-box",
                  zIndex: 1,
                }}
              >
                <div className="flex h-full items-center justify-center text-center text-white"></div>
              </div>
            );
          }),
      )}

      {/* Vertical lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${labelColumnWidth + i * dayColumnWidth}%`,
            top: 0,
            bottom: 0,
            borderRight: "1px solid gray",
            zIndex: 0,
            transform: "translateX(-0.4px)",
          }}
        />
      ))}

      {/* Horizontal lines and time labels */}
      {hours.map((hour, i) => (
        <React.Fragment key={hour}>
          <div
            className="absolute"
            style={{
              top: `${i * (100 / hours.length)}%`,
              left: 0,
              right: 0,
              borderTop: "1px solid gray",
              zIndex: 0,
            }}
          />
          {showLabels && hour % labelInterval === 0 && (
            <div
              className="absolute left-0 text-[8px] text-black"
              style={{
                top: `${i * (100 / hours.length)}%`,
                width: `${labelColumnWidth}%`,
                paddingRight: "4px",
                textAlign: "right",
                zIndex: 2,
              }}
            >
              {`${hour}:00`}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
