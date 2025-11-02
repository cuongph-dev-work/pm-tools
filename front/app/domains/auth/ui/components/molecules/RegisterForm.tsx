import { Box } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import Input from "~/shared/components/atoms/TеxtInput";

export function RegisterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement register logic
    // Register functionality will be implemented later
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="space-y-4">
        <Box>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("auth.email")}
          </label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
          />
        </Box>

        <Box>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("auth.password")}
          </label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
          />
        </Box>

        <Box>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("auth.confirmPassword")}
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder={t("auth.confirmPasswordPlaceholder")}
          />
        </Box>

        <Button type="submit" className="w-full">
          {t("auth.register")}
        </Button>
      </Box>
    </form>
  );
}
