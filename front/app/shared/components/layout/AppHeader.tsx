import { Box, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../molecules/LanguageSwitcher";
import { ProjectSwitcher } from "../molecules/ProjectSwitcher";

export function AppHeader() {
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Dark Bar */}
      <div className="bg-gray-800 h-1 w-full" />

      {/* Main Header */}
      <div className="max-w-full px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Side - Title */}
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900">
              {t("header.appName")}
            </h1>
            <Box mt="0.5">
              <Text as="p" size="1" className="text-xs text-gray-500">
                {t("header.appDescription")}
              </Text>
            </Box>
          </div>

          {/* Right Side - Project Switcher and Language Switcher */}
          <div className="flex items-center gap-2">
            <ProjectSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
