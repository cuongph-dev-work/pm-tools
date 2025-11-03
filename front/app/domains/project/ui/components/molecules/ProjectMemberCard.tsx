import { Box, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Avatar } from "~/shared/components/atoms/Avatar";
import { Card } from "~/shared/components/atoms/Card";

export interface ProjectMemberCardProps {
  name: string;
  email?: string;
  roleLabel?: string;
  isOwner?: boolean;
  joinedAt?: string;
  avatarUrl?: string;
}

export function ProjectMemberCard({
  name,
  email,
  roleLabel,
  isOwner,
  joinedAt,
  avatarUrl,
}: ProjectMemberCardProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <Flex align="center" gap="3">
        <Avatar name={name} src={avatarUrl} />
        <Box className="flex-1 min-w-0">
          <Flex align="center" gap="2">
            <Box className="text-sm font-medium text-gray-900 truncate">
              {name}
            </Box>
            {isOwner && (
              <Text as="span" size="1" className="text-yellow-600 text-xs">
                👑
              </Text>
            )}
          </Flex>
          {email && (
            <Box className="text-xs text-gray-500 truncate">{email}</Box>
          )}
          <Flex align="center" gap="2" mt="1">
            {roleLabel && (
              <Box className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-0.5">
                {roleLabel}
              </Box>
            )}
            {joinedAt && (
              <Box className="text-xs text-gray-500">
                {t("project.joinedLabel")}: {joinedAt}
              </Box>
            )}
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}
