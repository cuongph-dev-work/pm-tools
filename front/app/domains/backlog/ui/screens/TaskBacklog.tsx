import { Box, Flex, Text } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useListSprints } from "~/domains/sprint/application/hooks/query/list.query";
import { Button } from "~/shared/components/atoms/Button";
import {
  getTaskPriorityOptions,
  getTaskStatusOptions,
} from "~/shared/constants/taskOptions";
import { useSearchTasks } from "../../application/hooks/query/search.query";
import type { TaskFilters } from "../../application/hooks/useFilterTasks";
import { TaskBacklogFilters } from "../components/molecules/TaskBacklogFilters";
import { TaskList } from "../components/molecules/TaskList";
import { CreateTaskDialog } from "./CreateTaskDialog";

export default function TaskBacklog() {
  const { t } = useTranslation();
  const [openCreate, setOpenCreate] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    keyword: "",
    status: null,
    priority: null,
    sprint: null,
  });

  const queryParams = useMemo(
    () => ({
      keyword: filters.keyword || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      sprint: filters.sprint || undefined,
    }),
    [filters]
  );

  const { data: tasks = [], isLoading: loading } = useSearchTasks(queryParams);

  const updateFilter = (key: keyof TaskFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  // Status options - using constants
  const statusOptions = useMemo(() => getTaskStatusOptions(t), [t]);

  // Priority options - using constants
  const priorityOptions = useMemo(() => getTaskPriorityOptions(t), [t]);

  // Sprint options - Get from API
  const { data: sprints } = useListSprints();
  const sprintOptions = useMemo(
    () =>
      Array.isArray(sprints)
        ? sprints.map(sprint => ({
            value: sprint.id,
            label: sprint.name,
          }))
        : [],
    [sprints]
  );

  return (
    <Box className="mx-auto" p="6">
      <Flex
        direction="row"
        align="center"
        justify="between"
        mb="4"
        gap="4"
        wrap="wrap"
      >
        <Box>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("backlog.title")}
          </h1>
          <Text as="p" size="2" className="text-sm text-gray-600">
            {t("backlog.subtitle")}
          </Text>
        </Box>
        <Button
          leftIcon={<PlusIcon className="w-4 h-4" />}
          onClick={() => setOpenCreate(true)}
        >
          {t("backlog.addTask")}
        </Button>
      </Flex>

      <Box mb="6">
        <TaskBacklogFilters
          filters={filters}
          onFilterChange={updateFilter}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          sprintOptions={sprintOptions}
        />
      </Box>

      <TaskList
        tasks={tasks}
        loading={loading}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        sprintOptions={sprintOptions}
      />

      <CreateTaskDialog open={openCreate} onOpenChange={setOpenCreate} />
    </Box>
  );
}
