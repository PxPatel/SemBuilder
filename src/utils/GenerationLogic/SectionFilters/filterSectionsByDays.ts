import { CompiledCoursesData, Day } from "../../../types/data.types";

export function filterSectionByDays(
  courseSectionsMap: CompiledCoursesData | null,
  unwantedDays: Day[] | null
): CompiledCoursesData | null {
  if (unwantedDays === null || unwantedDays.length === 0) {
    return courseSectionsMap;
  }

  //Defensively check the days array
  const possibleDayValues = ["M", "T", "W", "R", "F", "S", "X"];
  for (const day of unwantedDays) {
    if (day.length != 1 || !possibleDayValues.includes(day)) {
      throw new Error("Invalid day element in 'unwantedDays' array parameter");
    }
  }

  if (hasDuplicates(unwantedDays)) {
    throw new Error(
      "The 'unwantedDays' parameter can not have duplicate values"
    );
  }

  for (const courseTitle in courseSectionsMap) {
    for (const sectionNumber in courseSectionsMap[courseTitle]) {
      if (
        unwantedDays.some((unwantedDay) =>
          courseSectionsMap[courseTitle][sectionNumber].days.includes(
            unwantedDay
          )
        )
      ) {
        delete courseSectionsMap[courseTitle][sectionNumber];
      }
    }
  }

  return courseSectionsMap;
}

function hasDuplicates(a: string[]) {
  const uniqueValues = new Set();

  // Iterate through the array
  for (let i = 0; i < a.length; i++) {
    // If the value already exists in the Set, return true
    if (uniqueValues.has(a[i])) {
      return true;
    }
    // Otherwise, add the value to the Set
    uniqueValues.add(a[i]);
  }

  return false;
}
