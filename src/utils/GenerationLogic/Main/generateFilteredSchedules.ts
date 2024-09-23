import { filterSectionsByNumber } from "../SectionFilters/filterSectionsByNumber";
import { filterSectionByDays } from "../SectionFilters/filterSectionsByDays";
import { paginationGenerator } from "../GenerationAlgos/paginationGenerator";
import { filterSectionByTime } from "../SectionFilters/filterSectionsByTime";
import { ScheduleGenerationOptions } from "../../../types/options.types";
import {
  LastPointDetails,
  ReportSchedules,
} from "../../../types/schedule.types";

export function generateFilteredSchedules({
  relevantCoursesData,
  generationConfig,
  sectionFilters,
  unwantedDays,
  timeFilters,
  customOptions = {},
}: ScheduleGenerationOptions): [ReportSchedules, LastPointDetails] {
  if (relevantCoursesData === null) {
    return [[], null];
  }

  filterSectionsByNumber(relevantCoursesData, sectionFilters, customOptions);
  filterSectionByDays(relevantCoursesData, unwantedDays);
  filterSectionByTime(relevantCoursesData, timeFilters);

  const response = paginationGenerator(relevantCoursesData, generationConfig);

  console.log("Number of schedules generated:", response[0].length);
  return response;
}
