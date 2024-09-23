import { SEMESTER } from "../../../lib/default/default";
import DataError from "../../../lib/error/DataError";
import { SectionAPIResponse } from "../../../types/api.types";
import { CompiledCoursesData } from "../../../types/data.types";
import { callSectionsAPI } from "./callSectionsAPI";

//TODO:Currently hard-coded, but intending to create a more comprehensive mechanism
//to change semester automatically based on latest semester available via API

const getSectionsForAllCourses = async (
  courseTitleArray: string[],
  semesterTitle: string,
) => {
  const promises = [];

  for (let i = 0; i < courseTitleArray.length; ++i) {
    promises.push(
      callSectionsAPI({
        semester: semesterTitle ?? SEMESTER,
        course: courseTitleArray[i],
      }),
    );
  }

  const res = await Promise.all(promises);
  return res;
};

const mapCoursesToSections = (sectionsForAllCourses: SectionAPIResponse[]) => {
  const courseSectionsMap: CompiledCoursesData = {};

  for (const sectionsForCourse of sectionsForAllCourses) {
    if (sectionsForCourse.item_count !== 0) {
      const courseTitle =
        sectionsForCourse.data[0].course_semester_info.course_semester_id.split(
          "_",
        )[1];

      courseSectionsMap[courseTitle] = {};
      for (const sectionData of sectionsForCourse.data) {
        courseSectionsMap[courseTitle][sectionData.section_number] =
          sectionData;
      }
    }
  }
  return courseSectionsMap;
};

export const collectSectionsData = async (
  courseTitleArray: string[],
  semesterTitle: string,
): Promise<CompiledCoursesData> => {
  //Defensive argument check
  if (courseTitleArray.length === 0 || courseTitleArray === null) {
    return {};
  }

  //Error if any duplicates courseTitles
  const uniqueCourses = new Set(courseTitleArray);
  if (uniqueCourses.size !== courseTitleArray.length) {
    throw new DataError("Duplicate course titles found in the input array.");
  }

  //Get API responses in array
  const sectionsForAllCourses = await getSectionsForAllCourses(
    courseTitleArray,
    semesterTitle,
  );

  //Organize responses to map course to its data from API
  const collectedSections: CompiledCoursesData = mapCoursesToSections(
    sectionsForAllCourses,
  );

  //Validate if all courses exist, otherwise throw error
  const keysOfCollectedSections = Object.keys(collectedSections);
  if (keysOfCollectedSections.length != courseTitleArray.length) {
    const invalidCourses = courseTitleArray
      .filter(
        (courseTitle) =>
          !keysOfCollectedSections.includes(courseTitle.toUpperCase()),
      )
      .join(", ");
    throw new DataError(
      `The following courses do not exist in the semester catalog: ${invalidCourses}`,
    );
  }

  //Return map
  return collectedSections;
};
