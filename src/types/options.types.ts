import { LastPointDetails } from "../types/schedule.types";
import { CompiledCoursesData, Day } from "./data.types";

//Init generate func call
export type ScheduleGenerationOptions = {
  relevantCoursesData: CompiledCoursesData | null;
  generationConfig: GenerationConfig | null;
  sectionFilters: SelectedSections | null;
  unwantedDays: Day[] | null;
  timeFilters: TimeOptions | null;
  customOptions?: MiscSettings | null;
};

//Generation options in Pagination
export type GenerationConfig = {
  lastPointDetails?: LastPointDetails;
  generateAmount?: number | null;
  allowIncompleteSections?: boolean | null;
};

//All misc options
export type MiscSettings = {
  //Number Filter
  filterAction?: "POSITIVE" | "NEGATIVE";
  globallyAllowHonors?: boolean;
  localDisallowHonorsList?: HonorsFilterList | null;
};

//Number filter
export interface SelectedSections {
  [courseTitle: string]: string[];
  // Array of section numbers
}

export type SectionFilterOptions = {
  filterAction?: "POSITIVE" | "NEGATIVE";
  globallyAllowHonors?: boolean;
  localDisallowHonorsList?: HonorsFilterList;
};

export type HonorsFilterList = {
  [courseTitle: string]: boolean;
};

//Time filter
export type TimeOptions =
  | {
      before?: number | null;
      after?: number | null;
    }
  | {
      before?: string | null;
      after?: string | null;
    };

export type PAGINATION_STATE = "";
