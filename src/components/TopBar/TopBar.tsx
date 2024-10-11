import React, { useCallback, useState } from "react";
import { ToastAction } from "../shadcn-ui/toast";
import { toast } from "../../hooks/shadcn-hooks/use-toast";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import SearchBar from "./SearchBar";
import PillContainer from "./PillContainer";

const TopBar = () => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { getSectionsData } = useScheduler() as ISchedulerContextType;

  const addCourseToSelection = useCallback(
    (course: string) => {
      if (selectedCourses.length >= 9) {
        toast({
          variant: "destructive",
          title: "Course limit reached!",
          description: "Only 9 courses may be selected",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
          duration: 5000,
        });
        return false;
      }
      if (course.trim() === "") {
        toast({
          variant: "destructive",
          title: "No empty strings!",
          description: "Course string must have atleast one character",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
          duration: 5000,
        });
        return false;
      }
      if (course.trim().length > 8) {
        toast({
          variant: "destructive",
          title: "String length limit reached!",
          description: "Course string length can only be up to 8 characters",
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
          duration: 5000,
        });
        return false;
      }

      const newSelected = [...selectedCourses, course.trim().toUpperCase()];
      setSelectedCourses(newSelected);
      getSectionsData(newSelected);

      return true;
    },
    [getSectionsData, selectedCourses],
  );

  // Handle removing a course (pill)
  const removeCourseFromSelection = (index: number) => {
    const newSelected = [
      ...selectedCourses.slice(0, index),
      ...selectedCourses.slice(index + 1),
    ];
    setSelectedCourses(newSelected);
    getSectionsData(newSelected);
  };

  return (
    <>
      <SearchBar addCourseToSelection={addCourseToSelection} />
      <PillContainer
        selectedCourses={selectedCourses}
        removeCourseFromSelection={removeCourseFromSelection}
      />
    </>
  );
};

export default TopBar;
