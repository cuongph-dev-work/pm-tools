import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, Flex, Text } from "@radix-ui/themes";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

export function Select({
  value,
  options,
  placeholder = "Select...",
  leftIcon,
  onChange,
  onBlur,
  disabled = false,
  "aria-invalid": ariaInvalid = false,
}: SelectProps) {
  const selectedOption: SelectOption | undefined = options.find(
    opt => opt.value === value
  );
  const displayText: string = selectedOption
    ? selectedOption.label
    : placeholder;

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          disabled={disabled}
          color="gray"
          onBlur={onBlur}
          radius="large"
          variant="soft"
          style={{ width: "100%" }}
          aria-invalid={ariaInvalid}
          className="!px-2"
        >
          <Flex
            direction="row"
            align="center"
            justify="between"
            gap="2"
            width="100%"
          >
            <Flex width="100%" gap="2" align="center">
              {leftIcon}
              <Text size="2">{displayText}</Text>
            </Flex>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </Flex>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
          align="start"
          sideOffset={5}
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          {options.map(option => {
            const isSelected = value === option.value;
            return (
              <DropdownMenu.Item
                key={option.value}
                className={cn(
                  "px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between",
                  isSelected && "bg-gray-50"
                )}
                onSelect={() => handleSelect(option.value)}
              >
                <div className="flex items-center gap-2 flex-1">
                  {option.icon && (
                    <Text as="span" className="text-gray-400">
                      {option.icon}
                    </Text>
                  )}
                  <Text as="span" size="2" className="text-sm text-gray-700">
                    {option.label}
                  </Text>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-gray-600 ml-2 flex-shrink-0" />
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default Select;
