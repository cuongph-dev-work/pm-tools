import { Box, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "~/shared/components/atoms/Button";

export default function Forbidden() {
  const { t } = useTranslation();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen px-4"
    >
      <Box className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">403</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("errors.forbidden")}
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {t("errors.forbiddenDescription")}
        </p>
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
