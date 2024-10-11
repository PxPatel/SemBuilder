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

  return (
    <>
      <div className="flex h-1/2 items-center justify-center">
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
