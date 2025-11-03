import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Text } from "@radix-ui/themes";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: "vi", label: t("common.vietnamese") },
    // { code: "en", label: t("common.english") },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`p-1.5 text-gray-900 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${className}`}
          title={t("common.language")}
        >
          <Text as="span" size="2" className="text-sm font-semibold">
            文A
          </Text>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
          align="end"
          sideOffset={5}
        >
          {languages.map(lang => {
            const isSelected = i18n.language === lang.code;

            return (
              <DropdownMenu.Item
                key={lang.code}
                className={`px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50 flex items-center justify-between ${
                  isSelected ? "bg-gray-50" : ""
                }`}
                onSelect={() => {
                  i18n.changeLanguage(lang.code);
                }}
              >
                <Text as="span" size="2" className="text-sm text-gray-700">
                  {lang.label}
                </Text>
                {isSelected && <Check className="w-4 h-4 text-gray-600 ml-2" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default LanguageSwitcher;
