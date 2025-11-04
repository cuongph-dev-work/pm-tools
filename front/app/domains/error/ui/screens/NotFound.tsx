import { Box, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "~/shared/components/atoms/Button";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen px-4"
    >
      <Box className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("errors.notFound")}
        </h2>
        <Text
          as="p"
          size="4"
          mb="8"
          className="text-lg text-gray-600 max-w-md mx-auto"
        >
          {t("errors.notFoundDescription")}
        </Text>
        <Flex
          direction="row"
          align="center"
          justify="center"
          gap="4"
          wrap="wrap"
        >
          <Link to="/">
            <Button>{t("nav.home")}</Button>
          </Link>
          <Button variant="soft" onClick={() => window.history.back()}>
            {t("common.back")}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
