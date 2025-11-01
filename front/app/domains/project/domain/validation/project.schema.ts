import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { createValidationSchemas } from "~/shared/utils/validation/common";

type TFunction = ReturnType<typeof useTranslation>["t"];

export const createProjectSchema = (t: TFunction) => {
  const baseSchemas = createValidationSchemas(t);

  return v.object({
    name: baseSchemas.requiredString(
      t("project.createForm.nameLabel", { defaultValue: "Project Name" })
    ),
    description: baseSchemas.optionalString(),
    // startDate: v.optional(v.string()),
    // endDate: v.optional(v.string()),
    tags: v.optional(v.string()),
  });
  // Temporarily commented out date range validation
  // return v.pipe(
  //   v.object({...}),
  //   v.forward(
  //     v.partialCheck(
  //       [["startDate"], ["endDate"]],
  //       ({ startDate, endDate }) => {
  //         if (!startDate || !endDate) return true;
  //         return new Date(startDate) <= new Date(endDate);
  //       },
  //       t("validation.dateRangeInvalid", {
  //         defaultValue: "End date must be after start date",
  //       })
  //     ),
  //     ["endDate"]
  //   )
  // );
};

// Type definitions
export type ProjectFormData = v.InferInput<
  ReturnType<typeof createProjectSchema>
>;
