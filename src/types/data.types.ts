/**
 * Represents a modified wrapper on AltSection type
 */
export interface SectionData extends Omit<AltSection, "co_sem_id"> {
  course_semester_info: CourseSemester;
}

/**
 * Supabase columns for sections table
 * @interface  AltSection
 */
interface AltSection {
  co_sem_id: string;
  credits: number;
  crn: number;
  days: Day[];
  end_times: (number | null)[];
  info: string | null;
  instructor: string | null;
  location: (number | null)[];
  section_id: string;
  section_number: string;
  start_times: (number | null)[];
  status: string;
}

/**
 * Supabase columns for CourseSemester table
 * @interface CourseSemester
 */
interface CourseSemester {
  course_semester_id: string;
  course_id: number;
  semester_id: string;
}

/**
 * Interface representing compiled course data.
 *
 * @interface CompiledCoursesData
 * @property {Object.<string, Record<string, SectionData>>} [courseTitle] - An object where the key is the course title (string) and the value is a record containing section data.
 */
export interface CompiledCoursesData {
  [courseTitle: string]: Record<string, SectionData>;
}

/**
 * Represents a day of the week.
 *
 * "M" for Monday, "T" for Tuesday, "W" for Wednesday,
 * "R" for Thursday, "F" for Friday, and "S" for Saturday.
 *
 * @typedef {("M" | "T" | "W" | "R" | "F" | "S")} ValidDay
 */
export type ValidDay = "M" | "T" | "W" | "R" | "F" | "S";

/**
 * Represents a void day, indicated by "X".
 *
 * @typedef {"X"} VoidDay
 */
export type VoidDay = "X";

/**
 * Represents a day (either valid or void day)
 */
export type Day = ValidDay | VoidDay;

export interface CourseData {
  course_semester_id: string;
  semester_id: string;
  course_info: AltCourseType;
}

export interface AltCourseType {
  course_id: number;
  course_name: string;
  course_number: string;
  credits: number;
  department: string;
}
