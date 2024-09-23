import React from "react";
import { Day } from "../../types/data.types";
import { ScheduleClassTimeType } from "../../types/schedule.types";

export default function ScheduleBlock({
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
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
    S: 5,
    X: -1,
  };

  const {
    startHour,
    endHour,
    lineInterval,
    labelInterval,
    showLabels,
    doubleSidedColumnGap,
  } = settings;

  // Assuming the schedule is from 8 AM to 10 PM
  const startOfDay = startHour * 60 * 60 * 1000; // 8 AM in milliseconds
  const endOfDay = endHour * 60 * 60 * 1000; // 10 PM in milliseconds
  const dayDuration = endOfDay - startOfDay;

  // Function to convert time to a percentage of the day's duration
  const timeToPosition = (time: number) => {
    return ((time - startOfDay) / dayDuration) * 100;
  };

  const hours = Array.from(
    { length: Math.floor((endHour - startHour) / lineInterval) },
    (_, i) => startHour + i * lineInterval,
  ); // Generates hours from 8 AM to 9 PM

  return (
    <div
      className={`${className?.length ? className : null} border-box relative rounded border-2 border-stone-700`}
      // style={{ height: "25%" }}
    >
      {true &&
        Object.entries(schedule).map(
          ([sectionIdentity, { days, startTimes, endTimes }], index) =>
            days.map((day, i) => {
              if (day === "X") return null;
              if (!startTimes[i]) return null;
              if (!endTimes[i]) return null;

              const color = colorTheme[sectionIdentity.split("-")[0]]; //we have sectionidentity. we need coursetitle out of it
              const topPosition = timeToPosition(startTimes[i]);
              const height = timeToPosition(endTimes[i]) - topPosition;
              const columnSpace = 16.66;
              const leftPosition = dayToColumn[day] * columnSpace; // 16.66% per column for 6 days
              const blockWidth = columnSpace - doubleSidedColumnGap; // Slightly less than 16.66% to leave space on both sides
              const marginLeft = (columnSpace - blockWidth) / 2; // Center the block within the column

              return (
                <div
                  key={`${sectionIdentity}-${i}`}
                  className={`absolute rounded border border-slate-900`}
                  style={{
                    top: `${topPosition}%`,
                    left: `calc(${leftPosition}% + ${marginLeft}%)`, // Centered within the column
                    width: `${blockWidth}%`, // Adjusted width to leave space on both sides
                    height: `${height}%`,
                    backgroundColor: color,
                    boxSizing: "border-box",
                    zIndex: 1, // Ensure blocks are on top
                  }}
                >
                  <div className="flex h-full items-center justify-center text-center text-white">
                    {/* {section} */}
                  </div>
                </div>
              );
            }),
        )}

      {/* Vertical lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${(i + 1) * 16.66}%`, // Position the line at each column
            top: 0,
            bottom: 0,
            borderRight: "1px solid gray", // Use border instead of background color
            zIndex: 0,
            transform: "translateX(-0.4px)", // Adjust for subpixel rendering
          }}
        />
      ))}

      {/* Horizontal lines */}
      {hours.map((hour, i) => {
        if (i === 0) return null;

        return (
          <div
            key={hour}
            className="absolute"
            style={{
              top: `${i * (100 / hours.length)}%`, // Position the line at each hour
              left: 0,
              right: 0,
              borderTop: "1px solid gray", // Use border instead of background color
              zIndex: 0, // Ensure lines are behind the blocks
            }}
          >
            <div
              className="absolute left-0 text-[8px] text-black"
              style={
                {
                  // zIndex: 2, // Time text above blocks and lines
                }
              }
            >
              {showLabels && hour % labelInterval === 0 ? `${hour}:00` : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
