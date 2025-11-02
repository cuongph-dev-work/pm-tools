import { Box } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "~/shared/components/atoms/Button";
import Input from "~/shared/components/atoms/TеxtInput";
import { useAuth } from "~/shared/hooks/useAuth";
import { useSignIn } from "../../../application/hooks/useSignIn";

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuth();
  const { signIn, loading, error } = useSignIn();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
    } catch {
      // Error is handled by useSignIn hook and displayed to user
    }
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

        {error && (
          <Box className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </Box>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("common.loading") : t("auth.login")}
        </Button>
      </Box>
    </form>
  );
}
