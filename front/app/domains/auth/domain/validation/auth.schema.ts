import * as v from "valibot";
import type { I18nT } from "~/shared/types/i18n";
import { createValidationSchemas } from "~/shared/utils/validation/common";

export const createLoginSchema = (t: I18nT) => {
  const base = createValidationSchemas(t);

  return v.object({
    email: v.pipe(
      base.requiredString(t("auth.loginForm.emailLabel")),
      base.emailString()
    ),
    password: base.requiredString(t("auth.loginForm.passwordLabel")),
  });
};

export type LoginFormData = v.InferInput<ReturnType<typeof createLoginSchema>>;
