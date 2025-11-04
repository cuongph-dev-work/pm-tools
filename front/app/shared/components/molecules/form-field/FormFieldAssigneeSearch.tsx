import { useField } from "@tanstack/react-form";
import * as React from "react";
import type { AnyFormApi } from "./types";

import { useSearchProjectMembers } from "~/domains/project/application/hooks/useSearchProjectMembers";
import { useProjects } from "~/shared/hooks/useProjects";
import {
  AssigneeSearch,
  type AssigneeOption,
} from "../../atoms/AssigneeSearch";
import BaseFormField from "./BaseFormField";
import { FormErrorMessage } from "./FormErrorMessage";

export interface FormFieldAssigneeSearchProps {
  name: string;
  form: AnyFormApi;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  placeholder?: string;
}

export function FormFieldAssigneeSearch({
  name,
  form,
  label,
  description,
  isRequired,
  className,
  labelClassName,
  errorClassName,
  placeholder,
}: FormFieldAssigneeSearchProps) {
  const field = useField({ name, form });
  const errors = field.state.meta?.errors ?? [];
  const hasError = Array.isArray(errors) ? errors.length > 0 : Boolean(errors);
  const { currentProject } = useProjects();
  const [searchKeyword, setSearchKeyword] = React.useState("");

  // Load members on mount and when keyword changes
  const { data: members = [], isLoading } = useSearchProjectMembers(
    currentProject?.id,
    searchKeyword,
    true
  );

  // Convert members to AssigneeOption format
  const assigneeOptions: AssigneeOption[] = React.useMemo(() => {
    return members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      avatarUrl: member.avatarUrl,
    }));
  }, [members]);

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
      <AssigneeSearch
        value={String(field.state.value ?? "")}
        onChange={value => field.handleChange(value)}
        onBlur={field.handleBlur}
        onSearch={handleSearch}
        options={assigneeOptions}
        placeholder={placeholder}
        isLoading={isLoading}
        aria-invalid={hasError}
      />
      <FormErrorMessage field={field} />
    </BaseFormField>
  );
}

export default FormFieldAssigneeSearch;
