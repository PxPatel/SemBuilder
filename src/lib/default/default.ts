import {
  HonorsFilterList,
  ScheduleGenerationOptions,
} from "../../types/options.types";
import { LastPointDetails } from "../../types/schedule.types";

//Defaults and constant values
export const SEMESTER = "Fall_2024";

export const BoxPalettes = [
  "#758173",
  "#D7CF07",
  "#1B998B",
  "#2E0014",
  "#E70E02",
  "#442220",
  "#809848",
  "#758173",
  "#2E294E",
];

export const DEFAULT_SCHEDULE_GENERATION_OPTIONS: ScheduleGenerationOptions = {
  relevantCoursesData: null,
  generationConfig: null,
  sectionFilters: null,
  unwantedDays: null,
  timeFilters: null,
  customOptions: null,
};

export const DEFAULT_MISC_SETTINGS: {
  filterAction: "POSITIVE" | "NEGATIVE";
  globallyAllowHonors: boolean;
  localDisallowHonorsList: HonorsFilterList;
} = {
  filterAction: "POSITIVE",
  globallyAllowHonors: true,
  localDisallowHonorsList: {},
};

export const DEFAULT_GENERATION_AMOUNT: number = 24;

export const DEFAULT_GENERATION_CONFIG: {
  lastPointDetails: LastPointDetails;
  generateAmount: number;
  allowIncompleteSections: boolean;
} = {
  lastPointDetails: [],
  generateAmount: DEFAULT_GENERATION_AMOUNT,
  allowIncompleteSections: false,
};
