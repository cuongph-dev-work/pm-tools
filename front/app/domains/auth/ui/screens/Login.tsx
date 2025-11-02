import { Box, Container, Flex } from "@radix-ui/themes";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Tabs } from "~/shared/components/atoms/Tabs";
import { STORAGE_KEYS } from "~/shared/constants/storage";
import { LoginForm } from "../components/molecules/LoginForm";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen bg-gray-50"
      p="6"
      position="relative"
    >
      <Container size="2" className="w-full max-w-md mx-auto">
        <Box className="bg-white rounded-lg shadow-lg p-8">
          <Box mb="6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("auth.welcomeBack")}
            </h1>
            <p className="text-sm text-gray-600">
              {t("auth.loginOrCreateAccount")}
            </p>
          </Box>

          <Tabs
            defaultValue="login"
            tabs={[{ value: "login", label: t("auth.login") }]}
          >
            {active => <Box>{active === "login" && <LoginForm />}</Box>}
          </Tabs>
        </Box>
      </Container>

      <Box className="fixed bottom-6 right-6">
        <button
          className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label={t("common.help")}
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </Box>
    </Flex>
  );
}
