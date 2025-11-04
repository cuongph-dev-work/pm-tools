import { Box, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function Kanban() {
  const { t } = useTranslation();

  return (
    <Box className="mx-auto" p="6">
      <Text as="h1" size="6" weight="bold" className="text-gray-900">
        Kanban Board
      </Text>
      <Text as="p" size="3" className="text-gray-600 mt-2">
        Coming soon...
      </Text>
    </Box>
  );
}
