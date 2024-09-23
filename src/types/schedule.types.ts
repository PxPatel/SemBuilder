import { Day } from "./data.types";

export type SectionsInDay = string[];

export type Schedule = Record<Day, SectionsInDay>;

// export type ReportSchedules = Schedule[];
export type ReportSchedules = string[][];

export type LastPointDetails = string[] | null;

export type DeepClone<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T]: DeepClone<T[K]>;
      }
    : T;

export interface ScheduleClassTimeType {
  [sectionIdentity: string]: {
    days: Day[];
    startTimes: (number | null)[];
    endTimes: (number | null)[];
  };
}
