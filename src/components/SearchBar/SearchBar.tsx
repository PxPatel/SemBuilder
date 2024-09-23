import React, { useEffect, useState } from "react";
import Pill from "./Pill";
import { toast } from "../../hooks/shadcn-hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { BoxPalettes } from "../../lib/default/default";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const { getSectionsData } = useScheduler() as ISchedulerContextType;

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  // Handle Enter press to add the pill
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addCourseToSelection();
    }
  };

  const addCourseToSelection = () => {
    if (selectedCourses.length >= 9) {
      toast({
        variant: "destructive",
        title: "Course limit reached!",
        description: "Only 9 courses may be selected",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        duration: 5000,
      });
      return;
    }
    if (inputValue.trim() === "") {
      toast({
        variant: "destructive",
        title: "No empty strings!",
        description: "Course string must have atleast one character",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        duration: 5000,
      });
      return;
    }

    if (inputValue.trim().length > 8) {
      toast({
        variant: "destructive",
        title: "String length limit reached!",
        description: "Course string length can only be up to 8 characters",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        duration: 5000,
      });
      return;
    }

    setSelectedCourses([...selectedCourses, inputValue.trim().toUpperCase()]);
    setInputValue("");
  };

  // Handle removing a course (pill)
  const removeCourseFromSelection = (index: number) => {
    setSelectedCourses([
      ...selectedCourses.slice(0, index),
      ...selectedCourses.slice(index + 1),
    ]);
  };

  useEffect(() => {
    getSectionsData(selectedCourses);
    console.log("In Search Bar useEffect");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourses, getSectionsData]);

  return (
    <div className="mt-[10px] flex flex-col items-center">
      {/* Search Bar + Button*/}
      <div className="flex">
        <Input
          className="text-md w-[400px] rounded-[6px] border border-solid border-[#ccc] p-2.5 text-slate-900 shadow-lg placeholder:text-sm placeholder:text-slate-500 focus-visible:ring-teal-700"
          type="text"
          value={inputValue}
          placeholder="Type course (e.g., CS114)"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <Button
          className="ml-2 shadow-lg"
          type="button"
          onClick={(e) => {
            addCourseToSelection();
          }}
        >
          Add Course
        </Button>
      </div>

      {/* Pill container */}
      <div className="mt-[10px] flex max-w-[1100px] flex-wrap justify-start gap-1">
        {selectedCourses.map((course, index) => (
          <Pill
            key={index}
            course={course}
            onRemove={() => removeCourseFromSelection(index)}
            color={BoxPalettes[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

{
  /* <Button
          className="ml-2 bg-blue-800 shadow-lg"
          type="button"
          disabled={
            selectedCourses.length === 0 || // Disable if no courses selected
            (LPDMap.at(-1) === null && !haveAnyOptionsChanged.current) // Disable if end of pagination and no changes to options
          }
          onClick={(e) => {
            if (error instanceof DataError) {
              toast({
                variant: "destructive",
                title: "Did you not see the Error!",
                description:
                  "New page can not generate because DataError has thrown and not fixed",
                action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
                duration: 3000,
              });

              return;
            }

            buildSchedule();
          }}
        >
          Generate
        </Button> */
}
