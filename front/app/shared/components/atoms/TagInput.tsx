import * as Popover from "@radix-ui/react-popover";
import { Badge, Box, Flex, Text, TextField } from "@radix-ui/themes";
import { IconPlus, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Z_INDEX } from "../../styles/zIndex";
import { cn } from "../../utils/cn";

export interface Tag {
  id: string;
  value: string;
}

export interface TagSuggestion {
  id: string;
  value: string;
}

export interface TagInputProps {
  value: Tag[];
  onChange?: (tags: Tag[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  suggestions?: TagSuggestion[];
}

export function TagInput({
  value = [],
  onChange,
  onBlur,
  placeholder = "Type and press Enter or comma to add tags...",
  disabled = false,
  "aria-invalid": ariaInvalid = false,
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter suggestions that haven't been added yet
  const availableSuggestions = React.useMemo(() => {
    return suggestions.filter(
      suggestion => !value.some(tag => tag.value === suggestion.value)
    );
  }, [suggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Remove comma if user types it, we'll handle it in keydown
    if (newValue.endsWith(",")) {
      const valueWithoutComma = newValue.slice(0, -1).trim();
      if (valueWithoutComma) {
        handleCreateTag(valueWithoutComma);
      }
      return;
    }
    setInputValue(newValue);
    setShowDropdown(newValue.trim().length > 0);
  };

  const handleCreateTag = (tagValue?: string) => {
    const trimmedValue = (tagValue || inputValue).trim();
    if (trimmedValue && !value.some(v => v.value === trimmedValue)) {
      const newTag: Tag = {
        id: uuidv4(),
        value: trimmedValue,
      };
      onChange?.([...value, newTag]);
    }
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    onChange?.(value.filter(tag => tag.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleCreateTag();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1].id);
    }
  };

  return (
    <Box className="space-y-2">
      {/* Main Input */}
      <Popover.Root open={showDropdown} onOpenChange={setShowDropdown}>
        <Popover.Anchor asChild>
          <TextField.Root
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full",
              ariaInvalid && "border-red-500 focus:ring-red-500"
            )}
          />
        </Popover.Anchor>

        {/* Dropdown Suggestions */}
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "bg-white rounded-lg shadow-lg border border-gray-200",
              "max-h-[240px] overflow-y-auto",
              "w-[var(--radix-popover-trigger-width)]"
            )}
            style={{ zIndex: Z_INDEX.modal }}
            align="start"
            sideOffset={5}
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <Box className="p-1">
              {/* First Item: Current Input Value */}
              <button
                type="button"
                onClick={() => handleCreateTag()}
                className={cn(
                  "w-full px-3 py-2 rounded-md text-left",
                  "hover:bg-blue-50 focus:bg-blue-50",
                  "outline-none cursor-pointer",
                  "flex items-center gap-2"
                )}
              >
                <IconPlus className="w-4 h-4 text-blue-600" />
                <Text size="2" className="text-blue-600 font-medium">
                  Add &quot;{inputValue.trim()}&quot;
                </Text>
              </button>

              {/* Separator if there are suggestions */}
              {availableSuggestions.length > 0 && (
                <Box className="h-px bg-gray-200 my-1" />
              )}

              {/* API Suggestions (will be populated later) */}
              {availableSuggestions.map(suggestion => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleCreateTag(suggestion.value)}
                  className={cn(
                    "w-full px-3 py-2 rounded-md text-left",
                    "hover:bg-gray-50 focus:bg-gray-100",
                    "outline-none cursor-pointer"
                  )}
                >
                  <Text size="2" className="text-gray-700">
                    {suggestion.value}
                  </Text>
                </button>
              ))}
            </Box>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Existing Tags */}
      {value.length > 0 && (
        <Flex gap="2" wrap="wrap">
          {value.map(tag => (
            <Badge
              key={tag.id}
              color="blue"
              variant="soft"
              className="flex items-center gap-1"
            >
              <Text size="2">{tag.value}</Text>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="hover:bg-blue-200 rounded-full p-0.5"
                disabled={disabled}
              >
                <IconX className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default TagInput;
