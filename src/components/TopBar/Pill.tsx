import React from "react";

type PillProps = {
  course: string;
  onRemove: () => void;
  color: string;
};

const Pill = ({ course, onRemove, color }: PillProps) => {
  return (
    <div
      className={`border border-stone-400 bg-stone-900 text-black shadow-md`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "15px",
        padding: "5px 10px",
        margin: "5px",
        fontSize: "14px",
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

export default Pill;
