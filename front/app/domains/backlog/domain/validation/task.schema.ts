import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";
import { TASK_PRIORITY, TASK_TYPE } from "../../application/dto/TaskDTO";

// Tag schema
export const tagSchema = v.object({
  id: v.string(), // UUID
  value: v.pipe(v.string(), v.minLength(1)),
});

// Create Task Form schema (for form validation)
export const createTaskFormSchema = (t: I18nT) => {
  const base = createValidationSchemas(t);
  return v.object({
    title: v.pipe(
      base.requiredString(t("backlog.form.title")),
      v.maxLength(
        255,
        t("validation.maxLength", { field: t("backlog.form.title"), max: 255 })
      )
    ),
    description: v.optional(
      base.maxLengthString(t("backlog.form.description"), 3000)
    ),
    type: v.picklist(
      [
        TASK_TYPE.TASK,
        TASK_TYPE.CHANGE_REQUEST,
        TASK_TYPE.FEEDBACK,
        TASK_TYPE.NEW_FEATURE,
        TASK_TYPE.SUB_TASK,
        TASK_TYPE.IMPROVEMENT,
        TASK_TYPE.BUG,
        TASK_TYPE.BUG_CUSTOMER,
        TASK_TYPE.LEAKAGE,
      ],
      t("validation.required", { field: t("backlog.form.type") })
    ),
    priority: v.optional(
      v.picklist([TASK_PRIORITY.HIGH, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.LOW])
    ),
    estimateHours: v.optional(
      v.union([v.string(), v.pipe(v.number(), v.minValue(0))])
    ),
    dueDate: base.requiredString(t("backlog.form.dueDate")),
    assignee: base.requiredString(t("backlog.form.assignee")),
    tags: v.array(tagSchema),
  });
};

export type CreateTaskFormData = v.InferOutput<
  ReturnType<typeof createTaskFormSchema>
>;
