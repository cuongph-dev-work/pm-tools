import dayjs from "dayjs";
import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

// Create Project Schema
export const createProjectSchema = (t: I18nT) => {
  const base = createValidationSchemas(t);

  return v.pipe(
    v.object({
      name: v.pipe(
        base.requiredString(t("project.name")),
        base.maxLengthString(t("project.name"), 255)
      ),
      description: v.optional(
        base.maxLengthString(t("project.description"), 3000)
      ),
      tags: base.optionalString(),
      startDate: base.optionalString(),
      endDate: base.optionalString(),
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
  const base = createValidationSchemas(t);

  return v.pipe(
    v.object({
      name: v.optional(base.maxLengthString(t("project.name"), 255)),
      description: v.optional(
        base.maxLengthString(t("project.description"), 3000)
      ),
      tags: base.optionalString(),
      status: v.optional(
        v.picklist(["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"])
      ),
      startDate: base.optionalString(),
      endDate: base.optionalString(),
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
