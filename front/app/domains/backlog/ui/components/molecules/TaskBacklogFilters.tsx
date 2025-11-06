import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TaskFilters } from "~/domains/backlog/application/hooks/useFilterTasks";
import Input from "~/shared/components/atoms/TеxtInput";
import { useDebounce } from "~/shared/hooks/useDebounce";

interface TaskBacklogFiltersProps {
  filters: TaskFilters;
  onFilterChange: (key: keyof TaskFilters, value: string | null) => void;
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  sprintOptions: Array<{ value: string; label: string }>;
  className?: string;
}

export function TaskBacklogFilters({
  filters,
  onFilterChange,
  statusOptions,
  priorityOptions,
  sprintOptions,
  className = "",
}: TaskBacklogFiltersProps) {
  const { t } = useTranslation();
  const [keywordInput, setKeywordInput] = useState(filters.keyword || "");
  const debouncedKeyword = useDebounce(keywordInput, 500);

  // Sync keywordInput với filters.keyword khi filters thay đổi từ bên ngoài (ví dụ: reset filters)
  useEffect(() => {
    setKeywordInput(filters.keyword || "");
  }, [filters.keyword]);

  // Gọi onFilterChange khi debouncedKeyword thay đổi
  useEffect(() => {
    onFilterChange("keyword", debouncedKeyword || null);
  }, [debouncedKeyword]); // eslint-disable-line react-hooks/exhaustive-deps

  const getSelectedLabel = (
    value: string | null,
    options: Array<{ value: string; label: string }>,
    allLabel: string
  ) => {
    if (!value) return allLabel;
    return options.find(opt => opt.value === value)?.label || allLabel;
  };

  return (
    <Box className={className}>
      <Flex direction="row" align="center" gap="4" wrap="wrap">
        <Box className="flex-1 min-w-[200px]">
          <Input
            placeholder={t("backlog.searchPlaceholder")}
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
            leftSlot={<Search className="w-4 h-4 text-gray-400" />}
          />
        </Box>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 min-w-[160px] text-left">
              <Text as="span" size="2" className="text-sm text-gray-700 flex-1">
                {getSelectedLabel(
                  filters.status,
                  statusOptions,
                  t("backlog.filters.allStatuses")
                )}
              </Text>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
              align="start"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                  !filters.status ? "bg-gray-50" : ""
                }`}
                onSelect={() => onFilterChange("status", null)}
              >
                <Text as="span" size="2" className="text-sm text-gray-700">
                  {t("backlog.filters.allStatuses")}
                </Text>
                {!filters.status && (
                  <Check className="w-4 h-4 text-gray-600 ml-2" />
                )}
              </DropdownMenu.Item>
              {statusOptions.map(option => {
                const isSelected = filters.status === option.value;
                return (
                  <DropdownMenu.Item
                    key={option.value}
                    className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                      isSelected ? "bg-gray-50" : ""
                    }`}
                    onSelect={() => onFilterChange("status", option.value)}
                  >
                    <Text as="span" size="2" className="text-sm text-gray-700">
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Check className="w-4 h-4 text-gray-600 ml-2" />
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 min-w-[160px] text-left">
              <Text as="span" size="2" className="text-sm text-gray-700 flex-1">
                {getSelectedLabel(
                  filters.priority,
                  priorityOptions,
                  t("backlog.filters.allPriorities")
                )}
              </Text>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
              align="start"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                  !filters.priority ? "bg-gray-50" : ""
                }`}
                onSelect={() => onFilterChange("priority", null)}
              >
                <Text as="span" size="2" className="text-sm text-gray-700">
                  {t("backlog.filters.allPriorities")}
                </Text>
                {!filters.priority && (
                  <Check className="w-4 h-4 text-gray-600 ml-2" />
                )}
              </DropdownMenu.Item>
              {priorityOptions.map(option => {
                const isSelected = filters.priority === option.value;
                return (
                  <DropdownMenu.Item
                    key={option.value}
                    className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                      isSelected ? "bg-gray-50" : ""
                    }`}
                    onSelect={() => onFilterChange("priority", option.value)}
                  >
                    <Text as="span" size="2" className="text-sm text-gray-700">
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Check className="w-4 h-4 text-gray-600 ml-2" />
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 min-w-[160px] text-left">
              <Text as="span" size="2" className="text-sm text-gray-700 flex-1">
                {getSelectedLabel(
                  filters.sprint,
                  sprintOptions,
                  t("backlog.filters.allSprints")
                )}
              </Text>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
              align="start"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                  !filters.sprint ? "bg-gray-50" : ""
                }`}
                onSelect={() => onFilterChange("sprint", null)}
              >
                <Text as="span" size="2" className="text-sm text-gray-700">
                  {t("backlog.filters.allSprints")}
                </Text>
                {!filters.sprint && (
                  <Check className="w-4 h-4 text-gray-600 ml-2" />
                )}
              </DropdownMenu.Item>
              {sprintOptions.map(option => {
                const isSelected = filters.sprint === option.value;
                return (
                  <DropdownMenu.Item
                    key={option.value}
                    className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                      isSelected ? "bg-gray-50" : ""
                    }`}
                    onSelect={() => onFilterChange("sprint", option.value)}
                  >
                    <Text as="span" size="2" className="text-sm text-gray-700">
                      {option.label}
                    </Text>
                    {isSelected && (
                      <Check className="w-4 h-4 text-gray-600 ml-2" />
                    )}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </Flex>
    </Box>
  );
}
