import { BoxPalettes } from "../../lib/default/default";
import Pill from "./Pill";

const PillContainer = ({
  selectedCourses,
  removeCourseFromSelection,
}: {
  selectedCourses: string[];
  removeCourseFromSelection: (index: number) => void;
}) => {
  return (
    <div className="flex h-1/2 flex-wrap items-center justify-center gap-1 pb-3">
      {selectedCourses.map((course, index) => (
        <Pill
          key={index}
          course={course}
          onRemove={() => removeCourseFromSelection(index)}
          color={BoxPalettes[index]}
        />
      ))}
    </div>
  );
};

export default PillContainer;
