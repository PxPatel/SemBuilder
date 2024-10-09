import React, { useEffect, useState } from "react";
import { Switch } from "../shadcn-ui/switch";
import { Checkbox } from "../shadcn-ui/checkbox";
import { Label } from "../shadcn-ui/label";
import { Input } from "../shadcn-ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";
import { Button } from "../shadcn-ui/button";
import { ClockIcon } from "@radix-ui/react-icons";
import { ISchedulerContextType, useScheduler } from "../../hooks/use-scheduler";
import { Day } from "../../types/data.types";

const FilterForm = () => {
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

  const [beforeTime, setBeforeTime] = useState({
    time: "8:00",
    isPM: false,
    noTimePreference: true,
  });
  const [afterTime, setAfterTime] = useState({
    time: "24:00",
    isPM: false,
    noTimePreference: true,
  });

  type TimeObjectSetterType = React.Dispatch<
    React.SetStateAction<{
      time: string;
      isPM: boolean;
      noTimePreference: boolean;
    }>
  >;

  useEffect(() => {
    // console.log("Something")
    updateGenerationOptions({
      timeFilters: {
        before: beforeTime.noTimePreference
          ? null
          : `${beforeTime.time} ${beforeTime.isPM ? "PM" : "AM"}`,
        after: afterTime.noTimePreference
          ? null
          : `${afterTime.time} ${afterTime.isPM ? "PM" : "AM"}`,
      },
    });
  }, [beforeTime, afterTime, updateGenerationOptions]);

  const handleTimeChange =
    (setter: TimeObjectSetterType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        setter((prev) => ({ ...prev, time: value }));
      }
    };

  const handleHourChange = (setter: TimeObjectSetterType) => (hour: number) => {
    setter((prev) => {
      const [, minute] = prev.time.split(":");
      return { ...prev, time: `${hour.toString().padStart(2, "0")}:${minute}` };
    });
  };

  const handleMinuteChange =
    (setter: TimeObjectSetterType) => (minute: number) => {
      setter((prev) => {
        const [hour] = prev.time.split(":");
        return {
          ...prev,
          time: `${hour}:${minute.toString().padStart(2, "0")}`,
        };
      });
    };

  const TimeSelector = ({
    label,
    state,
    setState,
  }: {
    label: string;
    state: {
      time: string;
      isPM: boolean;
      noTimePreference: boolean;
    };
    setState: TimeObjectSetterType;
  }) => (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">{label}</h3>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`noTime${label}`}
          checked={state.noTimePreference}
          onCheckedChange={(checked) =>
            setState((prev) => ({
              ...prev,
              noTimePreference: checked ? (checked as boolean) : false,
            }))
          }
        />
        <Label htmlFor={`noTime${label}`}>No Time Preference</Label>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor={`timeInput${label}`} className="sr-only">
            Time
          </Label>
          <Input
            id={`timeInput${label}`}
            type="text"
            value={state.time}
            onChange={handleTimeChange(setState)}
            placeholder="HH:MM"
            className="w-24"
            disabled={state.noTimePreference}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={state.noTimePreference}
              >
                <ClockIcon className="h-4 w-4" />
                <span className="sr-only">Open time picker</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid gap-2">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => handleHourChange(setState)(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 15, 30, 45].map((minute) => (
                    <Button
                      key={minute}
                      variant="outline"
                      size="sm"
                      onClick={() => handleMinuteChange(setState)(minute)}
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`ampm${label}`}
            checked={state.isPM}
            onCheckedChange={(checked) =>
              setState((prev) => ({ ...prev, isPM: checked }))
            }
            disabled={state.noTimePreference}
          />
          <Label htmlFor={`ampm${label}`}>{state.isPM ? "PM" : "AM"}</Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <form className="mx-auto w-64 max-w-md space-y-6">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-lg font-semibold">Unwanted Days</h2>
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

        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Select Time</h2>
          <TimeSelector
            label="Before"
            state={beforeTime}
            setState={setBeforeTime}
          />
          <TimeSelector
            label="After"
            state={afterTime}
            setState={setAfterTime}
          />
        </div>
      </form>{" "}
    </>
  );
};

export default FilterForm;

{
  /* <div className="space-y-4">
          <h2 className="text-md font-semibold">Include or Exclude Days</h2>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              className={`rounded-md px-4 py-2 ${
                selectedOption === "Include"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setSelectedOption("Include")}
            >
              Include
            </button>
            <Switch
              checked={selectedOption === "Exclude"}
              onCheckedChange={() =>
                setSelectedOption(
                  selectedOption === "Include" ? "Exclude" : "Include",
                )
              }
            />
            <button
              type="button"
              className={`rounded-md px-4 py-2 ${
                selectedOption === "Exclude"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setSelectedOption("Exclude")}
            >
              Exclude
            </button>
          </div>
        </div> */
}
