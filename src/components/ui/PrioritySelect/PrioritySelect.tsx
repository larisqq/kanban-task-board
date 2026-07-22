import "./PrioritySelect.css";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import type { TaskPriority } from "../../../types/task";

interface PrioritySelectProps {
  value: TaskPriority;
  disabled?: boolean;
  onChange: (value: TaskPriority) => void;
}

const priorities: Array<{
  value: TaskPriority;
  label: string;
}> = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "high",
    label: "High",
  },
];

function PrioritySelect({
  value,
  disabled = false,
  onChange,
}: PrioritySelectProps) {
  return (
    <Select.Root
      value={value}
      disabled={disabled}
      onValueChange={(newValue) => onChange(newValue as TaskPriority)}
    >
      <Select.Trigger
        className="priority-select__trigger"
        aria-label="Task priority"
      >
        <div className="priority-select__value">
          <span
            className={`priority-select__dot priority-select__dot--${value}`}
          />

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
            {priorities.map((priority) => (
              <Select.Item
                key={priority.value}
                value={priority.value}
                className="priority-select__item"
              >
                <Select.ItemText>
                  <span className="priority-select__item-content">
                    <span
                      className={`priority-select__dot priority-select__dot--${priority.value}`}
                    />

                    {priority.label}
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

export default PrioritySelect;
