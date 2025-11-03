import dayjs from "dayjs";
import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

export const createProjectSchema = (t: I18nT) => {
  const baseSchemas = createValidationSchemas(t);

  return v.pipe(
    v.object({
      name: baseSchemas.requiredString(
        t("project.createForm.nameLabel", { defaultValue: "Project Name" })
      ),
      description: baseSchemas.optionalString(),
      startDate: baseSchemas.requiredString(
        t("project.createForm.startDateLabel", { defaultValue: "Start Date" })
      ),
      endDate: v.optional(v.string()),
      tags: v.optional(v.string()),
    }),
    v.forward(
      v.partialCheck(
        [["startDate"], ["endDate"]],
        ({ startDate, endDate }: { startDate: string; endDate?: string }) => {
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
export type ProjectFormData = v.InferInput<
  ReturnType<typeof createProjectSchema>
>;
