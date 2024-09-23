import React from "react";

type PillProps = {
  course: string;
  onRemove: () => void;
  color: string;
};

const Pill: React.FC<PillProps> = ({ course, onRemove, color }) => {
  return (
    <div
      className={`border border-stone-400 bg-slate-100 text-black shadow-md`}
      style={{
        ...styles.pill,
        backgroundColor: color.length > 0 ? color : "",
      }}
    >
      {course}
      <span
        className="ml-2.5 cursor-pointer hover:text-red-600"
        onClick={onRemove}
      >
        &times;
      </span>
    </div>
  );
};

// Inline styles for pill component
const styles = {
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "15px",
    padding: "5px 10px",
    margin: "5px",
    fontSize: "14px",
  },
};

export default Pill;
