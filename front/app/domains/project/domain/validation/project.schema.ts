import dayjs from "dayjs";
import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

// Create Project Schema
export const createProjectSchema = (t: I18nT) => {
  const baseSchemas = createValidationSchemas(t);

  return v.pipe(
    v.object({
      name: v.pipe(
        v.string(t("validation.required", { field: t("project.name") })),
        v.maxLength(255, t("validation.maxLength", { field: t("project.name"), max: 255 }))
      ),
      description: v.optional(
        v.pipe(
          v.string(),
          v.maxLength(3000, t("validation.maxLength", { field: t("project.description"), max: 3000 }))
        )
      ),
      tags: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
    }),
    v.forward(
      v.partialCheck(
        [["startDate"], ["endDate"]],
        ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
          // Only validate if both dates are provided
          if (!startDate || !endDate) return true;
          // endDate must be after or equal to startDate
          return (
            dayjs(startDate).isBefore(dayjs(endDate)) ||
            dayjs(startDate).isSame(dayjs(endDate))
          );
        },
        t("validation.dateRangeInvalid")
      ),
      ["endDate"]
    )
  );
};

// Update Project Schema
export const updateProjectSchema = (t: I18nT) => {
  return v.pipe(
    v.object({
      name: v.optional(
        v.pipe(
          v.string(),
          v.maxLength(255, t("validation.maxLength", { field: t("project.name"), max: 255 }))
        )
      ),
      description: v.optional(
        v.pipe(
          v.string(),
          v.maxLength(3000, t("validation.maxLength", { field: t("project.description"), max: 3000 }))
        )
      ),
      tags: v.optional(v.string()),
      status: v.optional(
        v.picklist(["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"])
      ),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
    }),
    v.forward(
      v.partialCheck(
        [["startDate"], ["endDate"]],
        ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
          // Only validate if both dates are provided
          if (!startDate || !endDate) return true;
          // endDate must be after or equal to startDate
          return (
            dayjs(startDate).isBefore(dayjs(endDate)) ||
            dayjs(startDate).isSame(dayjs(endDate))
          );
        },
        t("validation.dateRangeInvalid")
      ),
      ["endDate"]
    )
  );
};

// Type definitions
export type CreateProjectFormData = v.InferOutput<
  ReturnType<typeof createProjectSchema>
>;

export type UpdateProjectFormData = v.InferOutput<
  ReturnType<typeof updateProjectSchema>
>;

// Backward compatibility
export type ProjectFormData = CreateProjectFormData;
