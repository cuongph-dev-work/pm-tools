import { useField } from "@tanstack/react-form";
import * as React from "react";
import type { AnyFormApi } from "./types";

import { useSearchTasks } from "~/domains/backlog/application/hooks/query/search.query";
import { TaskSearch, type TaskOption } from "../../atoms/TaskSearch";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";

export interface FormFieldTaskSearchProps {
  name: string;
  form: AnyFormApi;
  projectId: string | null | undefined;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
}

export function FormFieldTaskSearch({
  name,
  form,
  projectId,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  placeholder,
}: FormFieldTaskSearchProps) {
  const field = useField({ name, form });
  const errors = field.state.meta?.errors ?? [];
  const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const [searchKeyword, setSearchKeyword] = React.useState("");

  // Load tasks on mount and when keyword changes
  const { data: tasks = [], isLoading } = useSearchTasks(
    { keyword: searchKeyword },
    true
  );

  // Convert tasks to TaskOption format
  const taskOptions: TaskOption[] = React.useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      type: task.type,
    }));
  }, [tasks]);

  const handleSearch = React.useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  return (
    <BaseFormField
      name={name}
      label={label}
      description={description}
      isRequired={isRequired}
      className={className}
      labelClassName={labelClassName}
      errorClassName={errorClassName}
    >
      <TaskSearch
        value={String(field.state.value ?? "")}
        onChange={value => field.handleChange(value)}
        onBlur={field.handleBlur}
        onSearch={handleSearch}
        options={taskOptions}
        placeholder={placeholder}
        isLoading={isLoading}
        aria-invalid={hasError}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldTaskSearch;
