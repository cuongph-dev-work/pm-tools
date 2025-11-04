import { Box, Flex, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Avatar } from "~/shared/components/atoms/Avatar";
import { Card } from "~/shared/components/atoms/Card";
import { Tag } from "~/shared/components/atoms/Tag";

export interface ProjectMemberCardProps {
  name: string;
  email?: string;
  roleLabel?: string;
  role?: string;
  isOwner?: boolean;
  joinedAt?: string;
  avatarUrl?: string;
}

// Role to color mapping based on hierarchy/importance
const ROLE_COLOR_MAP: Record<
  string,
  "purple" | "blue" | "green" | "yellow" | "orange" | "red" | "default"
> = {
  PROJECT_MANAGER: "purple", // Highest level - purple
  DEVELOPER: "blue", // Core role - blue
  DESIGNER: "green", // Design role - green
  TESTER: "yellow", // Testing role - yellow
  VIEWER: "default", // Read-only - gray
};

const getRoleColor = (
  role?: string,
  isOwner?: boolean
): "purple" | "blue" | "green" | "yellow" | "orange" | "red" | "default" => {
  // If user is both PROJECT_MANAGER and owner, use red color
  if (isOwner && role === "PROJECT_MANAGER") {
    return "red";
  }
  if (!role) return "default";
  return ROLE_COLOR_MAP[role] || "default";
};

export function ProjectMemberCard({
  name,
  email,
  roleLabel,
  role,
  isOwner,
  joinedAt,
  avatarUrl,
}: ProjectMemberCardProps) {
  const { t } = useTranslation();
  const roleColor = getRoleColor(role, isOwner);

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
              <Tag label={roleLabel} variant={roleColor} className="text-xs" />
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
