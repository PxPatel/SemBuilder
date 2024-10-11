import { CompiledCoursesData } from "../../../types/data.types";
import { TimeOptions } from "../../../types/options.types";

export function filterSectionByTime(
  courseSectionData: CompiledCoursesData | null,
  timeFilters: TimeOptions | null,
): CompiledCoursesData | null {
  if (courseSectionData === null) {
    return null;
  }

  if (timeFilters === null) {
    return courseSectionData;
  }

  const { before, after } = timeFilters;

  if (typeof before === "undefined" && typeof after === "undefined") {
    return courseSectionData;
  }

  // if (before === null || after === null) {
  //   throw new Error(
  //     "Invalid time filter: 'before' and 'after' must be numbers or undefined."
  //   );
  // }

  if (before === null && after === null) {
    return courseSectionData;
  }

  //Convert if string
  const earlyCap =
    before === null
      ? null
      : typeof before === "number"
        ? before
        : typeof before === "string"
          ? convertStringTimeToNumber(before)
          : null;

  const lateCap =
    after === null
      ? null
      : typeof after === "number"
        ? after
        : typeof after === "string"
          ? convertStringTimeToNumber(after)
          : null;

  console.log("RAW:", before, after);
  console.log("TIMES:", earlyCap, lateCap);

  if (earlyCap !== null && lateCap !== null && earlyCap >= lateCap) {
    throw new Error("'before' must be less than 'after'.");
  }
  for (const courseTitle in courseSectionData) {
    const sectionNumbers = Object.keys(courseSectionData[courseTitle]);

    for (const sectionNumber of sectionNumbers) {
      const { start_times, end_times } =
        courseSectionData[courseTitle][sectionNumber];

      let shouldDelete = false;

      for (let i = 0; i < start_times.length; i++) {
        const startTime = start_times[i];
        const endTime = end_times[i];

        //If the start and end time are not fully known for the section
        //Then skip it and leave it
        //Not used, read next comment block
        // if (startTime === null || endTime === null) {
        //   continue;
        // }

        //Since we're evaluating start and end individually,
        //might as well allow continuing to check in a situation of null and non-null together
        if (
          (earlyCap !== null && startTime !== null && startTime < earlyCap) ||
          (lateCap !== null && endTime !== null && endTime > lateCap)
        ) {
          shouldDelete = true;
          break;
        }
      }

      if (shouldDelete) {
        delete courseSectionData[courseTitle][sectionNumber];
      }
    }
  }
  return courseSectionData;
}

//FIXME: Check if time conversion is proper and if input is able to pipe through
function convertStringTimeToNumber(timeStr: string): number | null {
  try {
    if (typeof timeStr !== "string" || timeStr === "" || timeStr === "TBA") {
      return null;
    }

    const [time, meridiem] = timeStr.split(" ");
    if (!time || !meridiem) {
      throw new Error("Invalid time format");
    }

    let hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);

    // Validate hour range (1-12)
    if (isNaN(hours) || hours < 1 || hours > 12) {
      throw new Error("Invalid hour: should be between 1 and 12");
    }

    // Validate minutes range (0-59)
    if (isNaN(minutes) || minutes < 0 || minutes > 59) {
      throw new Error("Invalid minutes: should be between 0 and 59");
    }

    const period = meridiem.toUpperCase();
    if (period !== "AM" && period !== "PM") {
      throw new Error("Invalid meridiem: should be AM or PM");
    }

    // Convert to military time
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0; // Midnight case
    }

    // Calculate milliseconds from midnight
    const startMilliseconds = (hours * 60 + minutes) * 60 * 1000;

    return startMilliseconds;
  } catch (error) {
    console.log("ERROR IN TIME", (<Error>error).message);
    console.log(timeStr);
    throw Error;
  }
}
