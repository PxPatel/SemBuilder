import {
  DEFAULT_GENERATION_AMOUNT,
  DEFAULT_GENERATION_CONFIG,
} from "../../../lib/default/default";
import {
  CompiledCoursesData,
  SectionData,
  Day,
} from "../../../types/data.types";
import { GenerationConfig } from "../../../types/options.types";
import {
  LastPointDetails,
  ReportSchedules,
  Schedule,
  DeepClone,
} from "../../../types/schedule.types";

/**
 *
 * @param relevantCoursesData Organized data of courses and their sections
 * @param lastPointDetails [Optional] Sections in last generated schedule
 * @param generateAmount [Optional] Number of schedules to generate
 * @returns Array with generated schedules and new last point details
 */
export function paginationGenerator(
  courseSectionsMap: CompiledCoursesData | null,
  generationConfig: GenerationConfig | null = {},
): [ReportSchedules, LastPointDetails] {
  const { lastPointDetails, generateAmount, allowIncompleteSections } = {
    ...DEFAULT_GENERATION_CONFIG,
    ...(generationConfig ?? {}),
  };

  if (
    typeof generateAmount !== "undefined" &&
    typeof generateAmount !== "number"
  ) {
    throw new Error(
      `Value for 'generateAmount' parameter is not valid: ${generateAmount}`,
    );
  }

  if (
    typeof allowIncompleteSections !== "undefined" &&
    typeof allowIncompleteSections !== "boolean"
  ) {
    throw new Error(
      "'allowIncompleteSections' parameter must be a boolean value",
    );
  }

  if (lastPointDetails === null) {
    return [[], null];
  }

  if (
    typeof lastPointDetails !== "undefined" &&
    !(Array.isArray(lastPointDetails) && !areDuplicatesInLPD(lastPointDetails))
  ) {
    throw new Error(
      `Last Point Details must be an array without duplicate course but given: ${lastPointDetails}`,
    );
  }

  if (
    courseSectionsMap === null ||
    Object.keys(courseSectionsMap).length === 0
  ) {
    return [[], null];
  }

  //If undefined, give LPD default value
  const LPD = typeof lastPointDetails === "undefined" ? [] : lastPointDetails;

  //If undefined, give generateNum default value
  const generateNum = generateAmount
    ? generateAmount
    : DEFAULT_GENERATION_AMOUNT;

  //If undefined, give allowIncompleteSchedules default value
  const allowIncompleteSchedules = allowIncompleteSections
    ? allowIncompleteSections
    : DEFAULT_GENERATION_CONFIG.allowIncompleteSections;

  const generatedSchedules: ReportSchedules = [];
  const currentSchedule: Schedule = {
    M: [],
    T: [],
    W: [],
    R: [],
    F: [],
    S: [],
    X: [],
  };
  const courseTitleArray = sortCoursesByTitle(Object.keys(courseSectionsMap));
  const sortedSectionsMap = sortSectionsForCourses(courseSectionsMap);

  const [, newLDP] = auxPaginationGenerator(
    courseSectionsMap,
    courseTitleArray,
    0,
    currentSchedule,
    sortedSectionsMap,
    LPD,
    generateNum,
    generatedSchedules,
    allowIncompleteSchedules,
  );

  return [generatedSchedules, newLDP];
}

export function auxPaginationGenerator(
  courseSectionsMap: CompiledCoursesData,
  courseTitleArray: string[],
  keyIndex: number,
  currentSchedule: Schedule,
  sortedSectionsMap: { [key: string]: string[] },
  lastPointDetails: LastPointDetails,
  generateNum: number,
  generatedSchedules: ReportSchedules,
  allowIncompleteSections: boolean,
): [boolean, LastPointDetails] {
  //If no more courses to explore
  //Push the currentSchedule to the results
  //After pushing, if the results reach a limit, return true and the LPD
  if (courseTitleArray.length === keyIndex) {
    // generatedSchedules.push(deepCloneObject(currentSchedule));
    generatedSchedules.push(simplySchedule(currentSchedule));

    if (generatedSchedules.length === generateNum) {
      return [true, simplySchedule(currentSchedule)];
    }
    return [false, null];
  }

  const selectedCourseTitle = courseTitleArray[keyIndex];
  const sectionsOfSelectedCourse = sortedSectionsMap[selectedCourseTitle];
  const countOfSectionsOfSelectedCourse = sectionsOfSelectedCourse.length;

  //If a course has no sections to explore, end the
  if (countOfSectionsOfSelectedCourse === 0) {
    return [true, null];
  }

  const initialStartingPoint = getInitiatingIndexFromLPD(
    selectedCourseTitle,
    sectionsOfSelectedCourse,
    lastPointDetails,
    keyIndex === courseTitleArray.length - 1,
  );

  for (let i = initialStartingPoint; i < countOfSectionsOfSelectedCourse; i++) {
    const sectionNumber = sectionsOfSelectedCourse[i];

    //Can perhaps consider an inline filtering of sections

    if (
      !doesScheduleHaveConflict(
        courseSectionsMap[selectedCourseTitle][sectionNumber],
        currentSchedule,
        courseSectionsMap,
        allowIncompleteSections,
      )
    ) {
      const daysOfSection =
        courseSectionsMap[selectedCourseTitle][sectionNumber].days;
      const updatedSchedule = deepCloneObject(currentSchedule);
      for (const day of daysOfSection) {
        updatedSchedule[day].push(
          courseSectionsMap[selectedCourseTitle][sectionNumber].section_id,
        );
      }

      const [isFinished, newLDP] = auxPaginationGenerator(
        courseSectionsMap,
        courseTitleArray,
        keyIndex + 1,
        updatedSchedule,
        sortedSectionsMap,
        lastPointDetails,
        generateNum,
        generatedSchedules,
        allowIncompleteSections,
      );

      if (isFinished) {
        return [isFinished, newLDP];
      }
    }
  }

  return [false, null];
}

export function getInitiatingIndexFromLPD(
  selectedCourseTitle: string,
  sectionsOfSelectedCourse: string[],
  lastPointDetails: LastPointDetails,
  isLastCourse: boolean,
): number {
  let initialStartingPoint = 0;

  if (lastPointDetails === null) {
    return initialStartingPoint;
  }

  for (const sectionIdentity of lastPointDetails) {
    const [courseTitleLPD, sectionNumberLPD] = sectionIdentity.split("-");
    if (selectedCourseTitle === courseTitleLPD) {
      const indexInSortedArray =
        sectionsOfSelectedCourse.indexOf(sectionNumberLPD);

      //If section is valid and is found in the sortedArray
      //Set as the initiating point for for-loop
      if (indexInSortedArray !== -1) {
        initialStartingPoint = indexInSortedArray;

        //If exploring the last course, initiate for-loop
        //on the next section from the LPD
        if (isLastCourse) {
          initialStartingPoint++;
          lastPointDetails.length = 0;
        }
      }
    }
  }

  return initialStartingPoint;
}

export function sortSectionsForCourses(data: CompiledCoursesData): {
  [key: string]: string[];
} {
  const sortedResult: { [key: string]: string[] } = {};
  Object.keys(data).forEach((courseTitle) => {
    const sortedSectionsArray = Object.keys(data[courseTitle]).sort(
      compareSectionNumber,
    );

    sortedResult[courseTitle] = sortedSectionsArray;
  });

  return sortedResult;
}

export function compareSectionNumber(a: string, b: string): number {
  const isANumeric = /^\d+$/.test(a);
  const isBNumeric = /^\d+$/.test(b);

  // If both are purely numerical, compare them as numbers
  if (isANumeric && isBNumeric) {
    return parseInt(a) - parseInt(b);
  }

  // If both are hybrid or both are non-numeric, compare them as strings
  if (!isANumeric && !isBNumeric) {
    return a.localeCompare(b);
  }

  // Numeric strings come before hybrid strings
  return isANumeric ? -1 : 1;
}

export function areDuplicatesInLPD(LPD: string[]): boolean {
  const set = new Set<string>();

  for (const sectionIdentity of LPD) {
    const courseTitle = sectionIdentity.split("-")[0];

    if (set.has(courseTitle)) {
      return true;
    } else {
      set.add(courseTitle);
    }
  }

  return false;
}

//TODO: Make sure it considers duplicate departments
//And sorts by the courseNumber after that
export function sortCoursesByTitle(courseTitleArray: string[]): string[] {
  return courseTitleArray.sort((a, b) => a.localeCompare(b));
}

export function simplySchedule(currentSchedule: Schedule): string[] {
  const set = new Set<string>();

  for (const day of Object.keys(currentSchedule)) {
    const sectionsTakenOnDay = currentSchedule[<Day>day];
    sectionsTakenOnDay.forEach((sectionId) => {
      const sectionIdentity = sectionId.split("_")[1];
      if (!set.has(sectionIdentity)) {
        set.add(sectionIdentity);
      }
    });
  }

  return [...set.values()];
}

function doesScheduleHaveConflict(
  sectionDataInQ: SectionData,
  currentSchedule: Schedule,
  data: CompiledCoursesData,
  allowIncompleteSections: boolean,
): boolean {
  if (sectionDataInQ === null) {
    throw Error("No section data provided");
  }

  if (
    sectionDataInQ.days.length === 0 ||
    sectionDataInQ.status.toUpperCase() === "CANCELLED"
  ) {
    return true;
  }

  if (!allowIncompleteSections && sectionDataInQ.days.includes("X")) {
    return true;
  }

  for (const day of sectionDataInQ.days) {
    if (day === "X" && allowIncompleteSections) {
      continue;
    }

    //Iterate through the section_ids of the sections
    //currently in currSchedule for a particular day
    for (const section_id of currentSchedule[day]) {
      //Decompose the courseName, and sectionNumber from id
      const [, courseName, sectionNumber] =
        getSectionMetaDataFromSectionID(section_id);

      //Get the "dayIndex" of the selectedDay in the days array
      //of the traversing section
      const matchIndex = data[courseName][sectionNumber].days.indexOf(day);
      //With the matchingIndex, find the corresponding start and end time of the section
      //for the particular day
      const startTimeOfOne =
        data[courseName][sectionNumber].start_times[matchIndex];
      const endTimeOfOne =
        data[courseName][sectionNumber].end_times[matchIndex];

      const startTimeInQ =
        sectionDataInQ.start_times[sectionDataInQ.days.indexOf(day)];

      const endTimeInQ =
        sectionDataInQ.end_times[sectionDataInQ.days.indexOf(day)];

      // const foo = data[courseName][sectionNumber]

      if (
        startTimeInQ === null ||
        endTimeInQ === null ||
        startTimeOfOne === null ||
        endTimeOfOne === null
      ) {
        if (allowIncompleteSections) {
          continue;
        } else {
          return true;
        }
      }

      if (hasConflict(startTimeInQ, endTimeInQ, startTimeOfOne, endTimeOfOne)) {
        return true;
      }
    }
  }

  //If the selectedSection passes through all the traversings section
  //then there is no conflict and thus return false
  return false;
}

export function getSectionMetaDataFromSectionID(
  sectionId: string,
): [string, string, string] {
  const [semesterTitle, sectionIdentity] = sectionId.split("_");
  if (!sectionIdentity) {
    debugger;
  }

  const [courseTitle, sectionNumber] = sectionIdentity.split("-");

  return [semesterTitle, courseTitle, sectionNumber];
}

function isTimeInBetweenInterval(
  x: number,
  earlierBound: number,
  laterBound: number,
): boolean {
  if (x === null) {
    throw Error("Not a valid value for 'x'");
  }

  return x >= earlierBound && x <= laterBound;
}

function hasConflict(
  startTimeInQ: number,
  endTimeInQ: number,
  startTimeOfPlaced: number,
  endTimeOfPlaced: number,
) {
  // Condition 1: Section in Q starts after section already placed ends
  if (startTimeInQ >= endTimeOfPlaced) {
    return false; // No conflict
  }

  // Condition 2: Section in Q ends before section already placed starts
  if (endTimeInQ <= startTimeOfPlaced) {
    return false; // No conflict
  }

  // Otherwise, the sections overlap
  return true;
}

export function deepCloneObject<T>(obj: T): DeepClone<T> {
  return JSON.parse(JSON.stringify(obj));
}
