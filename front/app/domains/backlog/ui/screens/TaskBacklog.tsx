import { Box, Flex, Text } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { useFilterTasks } from "../../application/hooks/useFilterTasks";
import { useListTasksQuery } from "../../application/hooks/useListTasksQuery";
import { TaskBacklogFilters } from "../components/molecules/TaskBacklogFilters";
import { TaskList } from "../components/molecules/TaskList";
import { CreateTaskDialog } from "./CreateTaskDialog";
export default function TaskBacklog() {
  const { t } = useTranslation();
  const [openCreate, setOpenCreate] = useState(false);
  const { data: tasks = [], isLoading: loading } = useListTasksQuery();
  const { filters, filteredTasks, updateFilter } = useFilterTasks(tasks);

  // Status options
  const statusOptions = useMemo(
    () => [
      { value: "todo", label: t("backlog.status.todo") },
      { value: "in-progress", label: t("backlog.status.inProgress") },
      { value: "done", label: t("backlog.status.done") },
    ],
    [t]
  );

  // Priority options
  const priorityOptions = useMemo(
    () => [
      { value: "high", label: t("backlog.priority.high") },
      { value: "medium", label: t("backlog.priority.medium") },
      { value: "low", label: t("backlog.priority.low") },
    ],
    [t]
  );

  // Sprint options - TODO: Get from project context or API
  const sprintOptions = useMemo(
    () => [
      { value: "sprint-1", label: "Sprint 1 - Authentication" },
      { value: "sprint-2", label: "Sprint 2 - Features" },
    ],
    []
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
        tasks={filteredTasks}
        loading={loading}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        sprintOptions={sprintOptions}
      />

      <CreateTaskDialog open={openCreate} onOpenChange={setOpenCreate} />
    </Box>
  );
}
