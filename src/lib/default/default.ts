import {
  HonorsFilterList,
  ScheduleGenerationOptions,
} from "../../types/options.types";
import { LastPointDetails } from "../../types/schedule.types";

//Defaults and constant values
// export const SEMESTER = "Fall_2025";
export const SEMESTER = process.env.NEXT_PUBLIC_SEMESTER || "";

export const BoxPalettes = [
  "#978365",
  "#BDEE63",
  "#1B998B",
  "#B658C4",
  "#D6409F",
  "#5B5BD6",
  "#7CE2FE",
  "#F76B15",
  "#6E6E6E",
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
