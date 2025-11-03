import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

// Tag schema
export const tagSchema = v.object({
  id: v.optional(v.string()),
  name: v.pipe(v.string(), v.minLength(1)),
});

// Create Task schema
export const createTaskSchema = (t: I18nT) => {
  const base = createValidationSchemas(t);
  return v.object({
    title: v.pipe(
      v.string(),
      v.minLength(
        1,
        t("validation.required", { field: t("backlog.form.title") })
      ),
      v.maxLength(
        255,
        t("validation.maxLength", { field: t("backlog.form.title"), max: 255 })
      )
    ),
    description: v.optional(
      v.pipe(
        v.string(),
        v.maxLength(
          3000,
          t("validation.maxLength", {
            field: t("backlog.form.description"),
            max: 3000,
          })
        )
      )
    ),
    type: v.picklist(
      ["task", "bug", "story", "epic"],
      t("validation.required", { field: t("backlog.form.type") })
    ),
    status: v.optional(v.picklist(["todo", "in-progress", "done", "blocked"])),
    priority: v.optional(v.picklist(["high", "medium", "low"])),
    estimate: v.optional(v.pipe(v.number(), v.minValue(0))),
    due_date: v.pipe(
      v.string(),
      v.minLength(
        1,
        t("validation.required", { field: t("backlog.form.dueDate") })
      )
    ),
    assignee_id: v.optional(v.string()),
    parent_task_id: v.optional(v.string()),
    sprint_ids: v.optional(v.array(v.string())),
    tags: v.array(tagSchema),
  });
};

export type CreateTaskSchemaInput = v.InferInput<
  ReturnType<typeof createTaskSchema>
>;
