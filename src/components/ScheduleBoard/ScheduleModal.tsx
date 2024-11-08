import React, { useEffect, useState } from "react";
import { ScheduleClassTimeType } from "../../types/schedule.types";
import ScheduleBlock from "./ScheduleBlock"; // reuse ScheduleBlock for the expanded view
import { getContrastColor } from "../../lib/hex/getContrastColor";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleClassTimeType | null;
  colorTheme: { [courseTitle: string]: string };
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  schedule,
  colorTheme,
}) => {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Attach the event listener only if modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener on component unmount or when modal closes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !schedule) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative flex h-3/4 w-3/4 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        style={{
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          opacity: isOpen ? 1 : 0,
          transition:
            "opacity 3000ms ease-in-out, transform 3000ms ease-in-out",
        }}
      >
        {/* Expanded Schedule View */}
        <div className="flex-1 overflow-auto">
          <ScheduleBlock
            schedule={schedule}
            settings={{
              startHour: 8,
              endHour: 24,
              lineInterval: 1,
              labelInterval: 1,
              showLabels: true,
              doubleSidedColumnGap: 1,
              showEventLabel: true,
            }}
            colorTheme={colorTheme}
            propStyles={{
              parentStyle:
                "h-full max-h-[600px] min-h-[200px] w-full min-w-[300px] max-w-full border-2 border-slate-500 bg-gray-50 font-normal shadow-md",
              labelStyle: "text-[12px]",
              eventBoxStyle: "rounded-lg",
              eventBoxLabelStyle: "font-sans",
            }}
          />
        </div>

        {/* Course-Section List with Color Legend */}
        <div className="box-border w-1/5">
          <h2 className="mb-4 text-center text-xl font-semibold">
            Schedule Details
          </h2>
          <ul className="space-y-2 pl-4">
            {Object.keys(schedule).map((sectionIdentity) => (
              <li key={sectionIdentity} className="flex items-center space-x-2">
                {/* Color Box */}
                <div
                  className="h-4 w-4 rounded"
                  style={{
                    backgroundColor:
                      colorTheme[sectionIdentity.split("-")[0]] || "gray",
                  }}
                />
                {/* Course-Section Name */}
                <span className="font-medium text-gray-800">
                  {sectionIdentity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[1%] top-[1%] text-gray-500 hover:text-pink-700"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
