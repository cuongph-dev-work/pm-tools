import { Box } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "~/shared/components/atoms/Button";
import { FormFieldInput } from "~/shared/components/molecules/form-field";
import { useAuth } from "~/shared/hooks/useAuth";
import { useLoginForm } from "../../../application/hooks/useLoginForm";
import { useSignIn } from "../../../application/hooks/useSignIn";

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuth();
  const { signIn, loading, error } = useSignIn();

  const { form, isSubmitting, submitError } = useLoginForm({
    onSubmit: async ({ email, password }) => {
      const response = await signIn({ email, password });
      setTokens(response.access_token, response.refresh_token);

      // Set user info from token (in real app, decode JWT or fetch user profile)
      setUser({
        id: String(response.sub),
        name: "User",
        email: email,
      });

      // Redirect to home or dashboard
      navigate("/");
    },
    externalLoading: loading,
    externalError: error,
  });

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
          disabled={isSubmitting}
        >
          {isSubmitting ? t("common.loading") : t("auth.login")}
        </Button>
      </Box>
    </form>
  );
}
