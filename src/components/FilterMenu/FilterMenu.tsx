import React, { useEffect, useState } from "react";
import { Switch } from "../shadcn-ui/switch";
import { Checkbox } from "../shadcn-ui/checkbox";
import { Label } from "../shadcn-ui/label";
import { Input } from "../shadcn-ui/input";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { Day } from "../../types/data.types";

type TimeObjectType = {
  time: string;
  isPM: boolean;
  active: boolean;
};

const FilterMenu = () => {
  // const [selectedOption, setSelectedOption] = useState("Include");
  const { updateGenerationOptions } = useScheduler() as ISchedulerContextType;

  // State to track selected days
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  // Days of the week
  const days: Day[] = ["M", "T", "W", "R", "F", "S"]; // Represents "Monday" to "Saturday"
  // Effect to update the generation options whenever selectedDays changes
  useEffect(() => {
    updateGenerationOptions({ unwantedDays: selectedDays });
  }, [selectedDays, updateGenerationOptions]);
  // Handle checkbox change
  const handleCheckboxChange = (day: Day, isChecked: boolean) => {
    setSelectedDays((prev) =>
      isChecked ? [...prev, day] : prev.filter((d) => d !== day),
    );
  };

  const [beforeTime, setBeforeTime] = useState<TimeObjectType>({
    time: "08:00",
    isPM: false,
    active: false,
  });
  const [afterTime, setAfterTime] = useState<TimeObjectType>({
    time: "12:00",
    isPM: true,
    active: false,
  });

  useEffect(() => {
    // console.log("Something")
    updateGenerationOptions({
      timeFilters: {
        before: !beforeTime.active
          ? null
          : `${beforeTime.time} ${beforeTime.isPM ? "PM" : "AM"}`,
        after: !afterTime.active
          ? null
          : `${afterTime.time} ${afterTime.isPM ? "PM" : "AM"}`,
      },
    });
  }, [beforeTime, afterTime, updateGenerationOptions]);

  return (
    <div className="min-w-1/5 h-full min-h-full w-[19rem]">
      <div className="mx-2 flex h-44 min-h-fit flex-col items-center justify-between rounded-xl border border-stone-300 px-2 pb-7 pt-4 shadow-md">
        <h1 className="text-xl font-medium">Unwanted Days</h1>

        <div className="grid grid-cols-2 gap-4">
          {days.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={selectedDays.includes(day)}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  handleCheckboxChange(day, !!checked)
                }
              />
              <Label htmlFor={day}>
                {day === "M"
                  ? "Monday"
                  : day === "T"
                    ? "Tuesday"
                    : day === "W"
                      ? "Wednesday"
                      : day === "R"
                        ? "Thursday"
                        : day === "F"
                          ? "Friday"
                          : "Saturday"}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-2 mt-5 flex h-[11.5rem] min-h-fit flex-col items-center justify-start rounded-xl border border-stone-300 px-2 pt-4 shadow-md">
        <h1 className="text-xl font-medium">Earliest & Latest Time</h1>
        <div className="flex w-full flex-grow items-center justify-around">
          <TimeSelector
            label="Earlier"
            state={beforeTime}
            setState={setBeforeTime}
          />
          <TimeSelector
            label="Latest"
            state={afterTime}
            setState={setAfterTime}
          />
        </div>
      </div>

      {/* <div className="mx-2 mt-5 flex min-h-fit h-fit flex-col items-center justify-start rounded-xl border border-stone-300 px-2 pt-4 pb-2 shadow-lg">
        <h1 className="text-xl font-medium">Section Filters</h1>
      </div> */}
    </div>
  );
};

export default FilterMenu;

export const TimeSelector = ({
  label,
  state,
  setState,
}: {
  label: string;
  state: TimeObjectType;
  setState: React.Dispatch<React.SetStateAction<TimeObjectType>>;
}) => {
  const [inputValue, setInputValue] = useState(state.time);

  const handleTimeChange =
    (setter: React.Dispatch<React.SetStateAction<TimeObjectType>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Update the local input value immediately
      setInputValue(value);

      // // Validate the HH:MM format
      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        console.log("[Time Change] Valid time:", value);
        setter((prev) => ({ ...prev, time: value }));
      }
    };

  return (
    <div className="space-y-2">
      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`noTime${label}`}
          checked={state.active}
          onCheckedChange={(checked) => {
            setState((prev) => ({
              ...prev,
              active: checked ? (checked as boolean) : false,
            }));
            // if (!(checked as boolean)) setInputValue("HH:MM");
          }}
        />
        <Label htmlFor={`noTime${label}`}>{label}</Label>
      </div>
      {/* Time Input */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            id={`timeInput${label}`}
            type="text"
            value={inputValue}
            onChange={handleTimeChange(setState)}
            placeholder="HH:MM"
            className="w-20"
            disabled={!state.active}
          />
        </div>
        {/* AM/PM switch */}
        <div className="flex items-center space-x-2">
          <Switch
            id={`ampm${label}`}
            checked={state.isPM}
            onCheckedChange={(checked) =>
              setState((prev) => ({ ...prev, isPM: checked }))
            }
            disabled={!state.active}
          />
          <Label htmlFor={`ampm${label}`}>{state.isPM ? "PM" : "AM"}</Label>
        </div>
      </div>
    </div>
  );
};
