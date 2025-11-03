import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

export const createTaskSchema = (t: I18nT) => {
  const base = createValidationSchemas(t);
  return v.object({
    type: base.requiredString(t("backlog.form.type")),
    title: base.requiredString(t("backlog.form.title")),
    description: v.string(),
    priority: v.picklist(
      ["high", "medium", "low"],
      t("validation.required", { field: t("backlog.form.priority") })
    ),
    estimateHours: v.number(),
    assignee: base.requiredString(t("backlog.form.assignee")),
    dueDate: v.optional(v.string()),
    tags: v.optional(v.string()),
  });
};

export type CreateTaskSchemaInput = v.InferInput<
  ReturnType<typeof createTaskSchema>
>;
