import { Box } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { FormFieldInput } from "~/shared/components/molecules/form-field";
import { useLoginForm } from "../../../application/hooks/useLoginForm";

export function LoginForm() {
  const { t } = useTranslation();
  const { form, isSubmitting, submitError } = useLoginForm();

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Box className="space-y-4">
        <FormFieldInput
          name="email"
          form={form}
          type="email"
          label={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          isRequired
        />

        <FormFieldInput
          name="password"
          form={form}
          type="password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          isRequired
        />

        {submitError && (
          <Box className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {submitError}
          </Box>
        )}

        <Button
          type="submit"
          className="w-full"
          style={{ width: "100%" }}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {t("auth.login")}
        </Button>
      </Box>
    </form>
  );
}
