import * as Popover from "@radix-ui/react-popover";
import { Box, ScrollArea, Text } from "@radix-ui/themes";
import { Check, Search } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Z_INDEX } from "../../styles/zIndex";
import { cn } from "../../utils/cn";
import { Input } from "./TеxtInput";

export interface AssigneeOption {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AssigneeSearchProps {
  value?: string;
  options: AssigneeOption[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSearch?: (keyword: string) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  isLoading?: boolean;
}

export function AssigneeSearch({
  value = "",
  options,
  onChange,
  onBlur,
  onSearch,
  placeholder,
  disabled = false,
  "aria-invalid": ariaInvalid = false,
  isLoading = false,
}: AssigneeSearchProps) {
  const { t } = useTranslation();
  const defaultPlaceholder = t("backlog.form.assigneeSearchPlaceholder", {
    defaultValue: "Tìm kiếm người thực hiện...",
  });
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Find selected member by ID only (value is always ID from form)
  const selectedMember = React.useMemo(
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

    return options.filter(
      opt =>
        opt.name.toLowerCase().includes(trimmedInput) ||
        opt.email.toLowerCase().includes(trimmedInput)
    );
  }, [options, inputValue]);

  // Initialize input value with selected member email (value is always ID from form)
  React.useEffect(() => {
    if (selectedMember) {
      setInputValue(selectedMember.email);
    } else {
      // Clear input if no member is selected (value is empty or invalid ID)
      setInputValue("");
    }
  }, [selectedMember]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear selection if user is typing
    if (newValue !== selectedMember?.email) {
      onChange?.("");
    }

    // Open dropdown if there are filtered options
    if (newValue.trim().length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (memberId: string) => {
    const member = options.find(opt => opt.id === memberId);
    if (member) {
      setInputValue(member.email);
      onChange?.(memberId);
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
          // Restore selected member email if no selection
          if (selectedMember && inputValue !== selectedMember.email) {
            setInputValue(selectedMember.email);
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
            className={cn("cursor-text", selectedMember && "font-medium")}
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
                    {t("backlog.form.assigneeLoading", {
                      defaultValue: "Đang tải...",
                    })}
                  </Text>
                </Box>
              ) : filteredOptions.length === 0 ? (
                <Box className="px-3 py-2">
                  <Text size="2" className="text-gray-500">
                    {t("backlog.form.assigneeNoResults", {
                      defaultValue: "Không tìm thấy kết quả",
                    })}
                  </Text>
                </Box>
              ) : (
                filteredOptions.map(member => {
                  const isSelected = value === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelect(member.id)}
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
                          {member.name}
                        </Text>
                        <Text size="1" className="text-gray-500 block truncate">
                          {member.email}
                        </Text>
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

export default AssigneeSearch;
