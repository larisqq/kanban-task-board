import "./DatePicker.css";
import "react-day-picker/style.css";

import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { DayPicker } from "react-day-picker";

interface DatePickerProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function parseDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function formatDateForStorage(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return "Select a date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DatePicker({ value, disabled = false, onChange }: DatePickerProps) {
  const selectedDate = parseDate(value);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="date-picker__trigger"
          disabled={disabled}
          aria-label="Select due date"
        >
          <span className="date-picker__value">
            <CalendarDays size={17} />

            <span className={value ? "" : "date-picker__placeholder"}>
              {formatDisplayDate(value)}
            </span>
          </span>

          <ChevronDown className="date-picker__chevron" size={17} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="date-picker__popover"
          align="start"
          sideOffset={7}
          collisionPadding={12}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange(formatDateForStorage(date));
            }}
            autoFocus
          />

          <div className="date-picker__footer">
            <button
              type="button"
              className="date-picker__clear"
              disabled={!value}
              onClick={() => onChange("")}
            >
              <X size={15} />
              Clear date
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default DatePicker;
