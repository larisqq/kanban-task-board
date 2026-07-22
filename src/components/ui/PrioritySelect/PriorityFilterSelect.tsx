import "./PrioritySelect.css";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import type { PriorityFilter } from "../../board/BoardToolbar/BoardToolbar";

interface PriorityFilterSelectProps {
  value: PriorityFilter;
  onChange: (value: PriorityFilter) => void;
}

const options: Array<{
  value: PriorityFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "All priorities",
  },
  {
    value: "high",
    label: "High priority",
  },
  {
    value: "normal",
    label: "Normal priority",
  },
  {
    value: "low",
    label: "Low priority",
  },
];

function PriorityFilterSelect({ value, onChange }: PriorityFilterSelectProps) {
  return (
    <Select.Root
      value={value}
      onValueChange={(newValue) => onChange(newValue as PriorityFilter)}
    >
      <Select.Trigger
        className="priority-select__trigger priority-filter-select__trigger"
        aria-label="Filter tasks by priority"
      >
        <div className="priority-select__value">
          {value !== "all" && (
            <span
              className={`priority-select__dot priority-select__dot--${value}`}
            />
          )}

          <Select.Value />
        </div>

        <Select.Icon className="priority-select__icon">
          <ChevronDown size={17} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="priority-select__content"
          position="popper"
          sideOffset={6}
        >
          <Select.ScrollUpButton className="priority-select__scroll-button">
            <ChevronUp size={16} />
          </Select.ScrollUpButton>

          <Select.Viewport className="priority-select__viewport">
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="priority-select__item"
              >
                <Select.ItemText>
                  <span className="priority-select__item-content">
                    {option.value !== "all" && (
                      <span
                        className={`priority-select__dot priority-select__dot--${option.value}`}
                      />
                    )}

                    {option.label}
                  </span>
                </Select.ItemText>

                <Select.ItemIndicator className="priority-select__indicator">
                  <Check size={15} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="priority-select__scroll-button">
            <ChevronDown size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default PriorityFilterSelect;
