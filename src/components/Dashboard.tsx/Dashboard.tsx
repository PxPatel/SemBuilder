import { useEffect, useState } from "react";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import FilterForm from "./FilterForm";
import ScheduleGrid from "./ScheduleGrid";
import { PaginationButtons } from "../shadcn-ui/pagination-buttons";

const Dashboard = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // useEffect(() => {
  //   console.log(LPDMap);
  // });

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <div id="Dashboard" className="relative flex flex-grow">
      <div id="filter-space" className="mr-1 rounded-md">
        {isFilterVisible ? (
          // Open space
          <div className="mr-2 h-[550px] w-full rounded-md border border-gray-400 bg-gray-300 p-4 shadow-lg">
            {/* Collapse button */}
            <div className="flex justify-end">
              <button
                onClick={toggleFilterVisibility}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <DoubleArrowLeftIcon className="h-5 w-5 text-black" />{" "}
              </button>
            </div>
            {/* Form inputs */}
            <div>
              <FilterForm />
            </div>
          </div>
        ) : (
          // Closed space
          <div className="mr-2 flex h-[550px] w-12 items-center justify-center rounded-md border border-gray-400 bg-gray-300 pt-4 shadow-lg">
            {/* Expand button */}
            <button
              onClick={toggleFilterVisibility}
              className="flex h-full w-full items-center justify-center"
            >
              <DoubleArrowRightIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />{" "}
            </button>
          </div>
        )}
      </div>
      <div
        id="schedule-display"
        className={`ml-1 flex-grow rounded-md border border-gray-400 bg-gray-300 p-4`}
      >
        <ScheduleGrid />
        <PaginationButtons />
      </div>
    </div>
  );
};

export default Dashboard;
