import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { createValidationSchemas } from "../common";

type TFunction = ReturnType<typeof useTranslation>["t"];

export const createPostSchema = (t: TFunction) => {
  const baseSchemas = createValidationSchemas(t);

  return v.pipe(
    v.object({
      title: v.pipe(baseSchemas.requiredString("Title")),
      description: v.pipe(baseSchemas.requiredString("Description")),
      visibility: v.picklist(["private", "public"]),
      publicId: v.optional(v.string()),
    }),
    v.forward(
      v.partialCheck(
        [["visibility"], ["publicId"]],
        ({ visibility, publicId }) =>
          visibility === "public" && publicId !== undefined && publicId !== "",
        t("validation.required", { field: "Public ID" })
      ),
      ["publicId"]
    )
  );
};

// Type definitions
export type PostFormData = v.InferInput<ReturnType<typeof createPostSchema>>;
