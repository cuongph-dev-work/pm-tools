import * as Popover from "@radix-ui/react-popover";
import { Box, ScrollArea, Text } from "@radix-ui/themes";
import { Check, Search } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Z_INDEX } from "../../styles/zIndex";
import { cn } from "../../utils/cn";
import { Input } from "./TеxtInput";

export interface TaskOption {
  id: string;
  title: string;
  type?: string;
}

export interface TaskSearchProps {
  value?: string;
  options: TaskOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSearch?: (keyword: string) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  isLoading?: boolean;
}

export function TaskSearch({
  value = "",
  options,
  onChange,
  onBlur,
  onSearch,
  placeholder,
  disabled = false,
  "aria-invalid": ariaInvalid = false,
  isLoading = false,
}: TaskSearchProps) {
  const { t } = useTranslation();
  const defaultPlaceholder = t("backlog.form.parentTaskPlaceholder", {
    defaultValue: "Chọn task cha",
  });
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Find selected task by ID only (value is always ID from form)
  const selectedTask = React.useMemo(
    () => options.find(opt => opt.id === value),
    [options, value]
  );

  // Call API search on component mount
  React.useEffect(() => {
    onSearch?.("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter options based on input value (local search like)
  const filteredOptions = React.useMemo(() => {
    const trimmedInput = inputValue.trim().toLowerCase();

    if (!trimmedInput) {
      return options;
    }

    return options.filter(opt =>
      opt.title.toLowerCase().includes(trimmedInput)
    );
  }, [options, inputValue]);

  // Initialize input value with selected task title (value is always ID from form)
  React.useEffect(() => {
    if (selectedTask) {
      setInputValue(selectedTask.title);
    } else {
      // Clear input if no task is selected (value is empty or invalid ID)
      setInputValue("");
    }
  }, [selectedTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear selection if user is typing
    if (newValue !== selectedTask?.title) {
      onChange?.("");
    }

    // Trigger search when user types
    onSearch?.(newValue);

    // Open dropdown if there are filtered options
    if (newValue.trim().length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (taskId: string) => {
    const task = options.find(opt => opt.id === taskId);
    if (task) {
      setInputValue(task.title);
      onChange?.(taskId);
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    // Always open dropdown on focus if there are options
    if (options.length > 0) {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay blur to allow click on dropdown item
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        if (!inputRef.current?.contains(document.activeElement)) {
          setOpen(false);
          // Restore selected task title if no selection
          if (selectedTask && inputValue !== selectedTask.title) {
            setInputValue(selectedTask.title);
          }
          onBlur?.();
        }
      }, 200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleSelect(filteredOptions[0].id);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || defaultPlaceholder}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            leftSlot={<Search className="w-4 h-4 text-gray-400" />}
            className={cn("cursor-text", selectedTask && "font-medium")}
          />
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          className={cn(
            "bg-white rounded-lg shadow-lg border border-gray-200",
            "max-h-[240px] overflow-hidden",
            "w-[var(--radix-popover-trigger-width)]"
          )}
          style={{ zIndex: Z_INDEX.modal }}
          align="start"
          sideOffset={5}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <ScrollArea
            type="always"
            scrollbars="vertical"
            style={{ maxHeight: "240px" }}
          >
            <Box className="p-1">
              {isLoading ? (
                <Box className="px-3 py-2">
                  <Text size="2" className="text-gray-500">
                    {t("backlog.form.taskLoading", {
                      defaultValue: "Đang tải...",
                    })}
                  </Text>
                </Box>
              ) : filteredOptions.length === 0 ? (
                <Box className="px-3 py-2">
                  <Text size="2" className="text-gray-500">
                    {t("backlog.form.taskNoResults", {
                      defaultValue: "Không tìm thấy kết quả",
                    })}
                  </Text>
                </Box>
              ) : (
                filteredOptions.map(task => {
                  const isSelected = value === task.id;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleSelect(task.id)}
                      className={cn(
                        "w-full px-3 py-2 rounded-md text-left",
                        "hover:bg-gray-50 focus:bg-gray-100",
                        "outline-none cursor-pointer",
                        "flex items-center justify-between gap-2",
                        isSelected && "bg-blue-50"
                      )}
                    >
                      <Box className="flex-1 min-w-0">
                        <Text
                          size="2"
                          className={cn(
                            "text-gray-700 block truncate",
                            isSelected && "font-medium text-blue-700"
                          )}
                        >
                          {task.title}
                        </Text>
                        {task.type && (
                          <Text
                            size="1"
                            className="text-gray-500 block truncate"
                          >
                            {task.type}
                          </Text>
                        )}
                      </Box>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </Box>
          </ScrollArea>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default TaskSearch;
