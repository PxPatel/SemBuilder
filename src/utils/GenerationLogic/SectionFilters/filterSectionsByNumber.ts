import { DEFAULT_MISC_SETTINGS } from "../../../lib/default/default";
import { CompiledCoursesData, SectionData } from "../../../types/data.types";
import { MiscSettings, SelectedSections } from "../../../types/options.types";
import { deepCloneObject } from "../GenerationAlgos/paginationGenerator";
import { filterSectionIfHonors } from "./filterSectionsIfHonors";

export function filterSectionsByNumber(
  courseSectionsMap: CompiledCoursesData | null,
  sectionFilters: SelectedSections | null,
  specialOptions: MiscSettings | null = {},
): CompiledCoursesData | null {
  if (courseSectionsMap === null) {
    return null;
  }

  if (sectionFilters === null) {
    sectionFilters = {};
  }

  const { filterAction, globallyAllowHonors, localDisallowHonorsList } = {
    ...DEFAULT_MISC_SETTINGS,
    ...(specialOptions ?? {}),
  };

  if (
    typeof filterAction !== "undefined" &&
    (filterAction === null || typeof filterAction !== "string")
  ) {
    throw new Error(
      `'filterAction' can only have values "POSITIVE" or "NEGATIVE", if parameter is inputted`,
    );
  }

  if (
    typeof globallyAllowHonors !== "undefined" &&
    (globallyAllowHonors === null || typeof globallyAllowHonors !== "boolean")
  ) {
    throw new Error(
      `'globallyAllowHonors' must be a boolean value if inputted`,
    );
  }

  if (
    typeof localDisallowHonorsList !== "undefined" &&
    !(
      (
        localDisallowHonorsList === null ||
        typeof localDisallowHonorsList === "object"
      ) //Do some testing with this to find out issues with error handling
    )
  ) {
    throw new Error(
      `'localDisallowHonorsList' must be an array or null in options object`,
    );
  }

  //SET DEFAULT VALUES for undefined
  const actionType =
    typeof filterAction !== "undefined"
      ? filterAction
      : DEFAULT_MISC_SETTINGS.filterAction;

  const allowHonorsOnFull =
    typeof globallyAllowHonors !== "undefined"
      ? globallyAllowHonors
      : DEFAULT_MISC_SETTINGS.globallyAllowHonors;

  const localBanHonorsList =
    typeof localDisallowHonorsList !== "undefined" &&
    localDisallowHonorsList !== null
      ? localDisallowHonorsList
      : (DEFAULT_MISC_SETTINGS.localDisallowHonorsList ?? {});

  if (Object.keys(sectionFilters).length === 0 && allowHonorsOnFull) {
    return courseSectionsMap;
  }

  // console.log(actionType, allowHonorsOnFull, localBanHonorsList);

  isArraySubsetOfOther(
    Object.keys(sectionFilters),
    Object.keys(courseSectionsMap),
    (item: string) => {
      throw new Error(`Course ${item} does not exist in the dataset.`);
    },
  );

  for (const courseTitle in sectionFilters) {
    const sectionsToFilter = sectionFilters[courseTitle];
    const sectionsMapKeys = Object.keys(courseSectionsMap[courseTitle]);

    isArraySubsetOfOther(sectionsToFilter, sectionsMapKeys, (item: string) => {
      throw new Error(
        `Section ${courseTitle}-${item} does not exist in the dataset.`,
      );
    });
  }

  const cloneCourseSectionsMap =
    actionType === "POSITIVE" ? deepCloneObject(courseSectionsMap) : {};

  const areFiltersEmpty = Object.keys(sectionFilters).every(
    (courseTitle) => sectionFilters[courseTitle].length === 0,
  );

  //If globallyHonors false removed then all get removed, no exception
  if (!allowHonorsOnFull) {
    filterSectionIfHonors(courseSectionsMap);
  }
  //Locally remove honors on particular courses
  else if (Object.keys(localBanHonorsList).length !== 0) {
    const coursesToFilterOutHonors = Object.keys(localBanHonorsList).filter(
      (courseTitle) => localBanHonorsList[courseTitle],
    );

    if (coursesToFilterOutHonors.length !== 0)
      filterSectionIfHonors(courseSectionsMap, coursesToFilterOutHonors);
  }

  if (areFiltersEmpty) {
    return courseSectionsMap;
  }

  for (const courseTitle in sectionFilters) {
    const sectionsToFilter = sectionFilters[courseTitle];
    if (sectionsToFilter.length === 0) continue;

    if (actionType === "POSITIVE") {
      //Clear the secitons and initialize the courseTitle key
      //in the CSM dictionary for the course.
      const newSectionsData: Record<string, SectionData> = {};

      //For each section in sectionsToFilter, lookup in clone, and add to CSM
      for (const sectionNumber of sectionsToFilter) {
        newSectionsData[sectionNumber] =
          cloneCourseSectionsMap[courseTitle][sectionNumber];
      }

      courseSectionsMap[courseTitle] = newSectionsData;
    }

    if (actionType === "NEGATIVE") {
      for (const sectionToPrune of sectionsToFilter) {
        //sectionToPrune if Honors do not exist. So verify
        if (courseSectionsMap[courseTitle][sectionToPrune]) {
          delete courseSectionsMap[courseTitle][sectionToPrune];
        }
      }
    }
  }
  return courseSectionsMap;
}

function isArraySubsetOfOther(
  child: string[],
  parent: string[],
  callback: (item: string) => void,
): void {
  child.forEach((item) => {
    if (!parent.includes(item)) {
      callback(item);
    }
  });
}

export function clearDictionary<T extends Record<string, unknown>>(obj: T): T {
  Object.keys(obj).forEach((key) => {
    delete obj[key];
  });

  return obj;
}
