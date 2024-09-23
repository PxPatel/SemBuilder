import { CourseData, SectionData } from "./data.types";

export type PARAMS =
  | "semester"
  | "department"
  | "course"
  | "classLevel"
  | "courseNumber"
  | "days"
  | "DSO"
  | "credits"
  | "instructor"
  | "crn"
  | "status"
  | "limit";

export type QUERY_PARAMETERS = Partial<Record<PARAMS, string>>;

/**
 * Represents the return of a GET sections API Request
 * @interface SectionAPIResponse
 * @property {number} item_count - Number of sections.
 * @property {SectionData[]} data - Collection of section details.
 */
export interface SectionAPIResponse {
  item_count: number;
  data: SectionData[];
}

/**
 * Represents the return of a GET sections API Request
 * @interface CourseAPIResponse
 * @property {number} item_count - Number of Courses.
 * @property {CourseData[]} data - Collection of Course details.
 */
export interface CourseAPIResponse {
  item_count: number;
  data: CourseData[];
}

