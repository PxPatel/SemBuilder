import { useState } from "react";
import { Input } from "../shadcn-ui/input";

const SearchBar = ({
  addCourseToSelection,
}: {
  addCourseToSelection: (course: string) => boolean;
}) => {
  const [searchBarValue, setSearchBarValue] = useState<string>("");

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value.toUpperCase());
  };

  // Handle Enter press to add the pill
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const success = addCourseToSelection(searchBarValue);
      if (success) setSearchBarValue("");
    }
  };

  // Format the semester value by replacing "_" with " "
  const formattedSemester =
    process.env.NEXT_PUBLIC_SEMESTER?.replace("_", " ") || "UNKNOWN";

  return (
    <>
      <div className="flex h-1/2 items-center justify-center">
        {/* Website name positioned absolutely on the left */}
        <div className="absolute left-5 top-10 flex items-center">
          <div className="text-5xl font-bold text-gray-700">SemBuilder</div>
        </div>

        {/* Semester div positioned absolutely */}
        <div className="absolute right-4 flex items-center">
          <div className="rounded-md bg-red-400 px-4 py-2 text-black shadow-md">
            NJIT: {formattedSemester}
          </div>
        </div>

        <Input
          className="text-md h-12 min-h-fit w-1/3 rounded-full border border-gray-300 bg-stone-100 pl-5 drop-shadow-lg placeholder:text-[#444947] focus-visible:border-none focus-visible:ring-gray-300 focus-visible:drop-shadow-xl"
          type="text"
          value={searchBarValue}
          placeholder="Type course (e.g., CS114)"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default SearchBar;
