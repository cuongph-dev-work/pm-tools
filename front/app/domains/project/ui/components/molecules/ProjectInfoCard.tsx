import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { Calendar, Pencil, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "~/shared/components/atoms/Card";
import { Tag } from "~/shared/components/atoms/Tag";
import ConfirmDeleteButton from "../../../../../shared/components/molecules/ConfirmDeleteButton";

type TagVariant =
  | "default"
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "orange";

const isValidTagVariant = (color?: string): color is TagVariant => {
  return (
    color !== undefined &&
    ["default", "blue", "red", "green", "yellow", "purple", "orange"].includes(
      color
    )
  );
};

export interface ProjectInfoCardProps {
  name: string;
  description?: string;
  tags?: Array<{
    label: string;
    color?: string;
  }>;
  memberCount?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ProjectInfoCard({
  name,
  description,
  tags = [],
  memberCount,
  startDate,
  endDate,
  onEdit,
  onDelete,
  onClick,
  className = "",
}: ProjectInfoCardProps) {
  const { t } = useTranslation();
  return (
    <Card
      className={`space-y-3 h-full relative ${className}`}
      onClick={onClick}
    >
      {(onEdit || onDelete) && (
        <Box className="absolute top-3 right-3">
          <Flex align="center" gap="2">
            {onEdit && (
              <IconButton
                variant="soft"
                onClick={e => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="w-4 h-4 text-gray-700" />
              </IconButton>
            )}
            {onDelete && (
              <ConfirmDeleteButton
                title={t("project.deleteProjectTitle")}
                description={t("project.deleteProjectDescription")}
                onConfirm={() => {}}
                onCancel={() => {}}
              >
                <IconButton variant="soft" color="red">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </IconButton>
              </ConfirmDeleteButton>
            )}
          </Flex>
        </Box>
      )}
      <Box className="text-base font-semibold text-gray-900 pr-16">{name}</Box>
      {description && (
        <Text as="p" size="2" className="text-sm text-gray-600 leading-6 line-clamp-2">
          {description}
        </Text>
      )}

      {tags.length > 0 && (
        <Flex wrap="wrap" gap="2">
          {tags.map((t, idx) => (
            <Tag
              key={`${t.label}-${idx}`}
              label={t.label}
              variant={isValidTagVariant(t.color) ? t.color : "default"}
            />
          ))}
        </Flex>
      )}

      <Flex align="center" gap="2" className="text-xs text-gray-700">
        {typeof memberCount === "number" && (
          <Flex gap="1" className=" bg-gray-100 rounded-md px-2 py-1">
            <Users className="w-3.5 h-3.5" />
            <Text as="span">{memberCount}</Text>
          </Flex>
        )}
        {startDate && (
          <Flex gap="1" className=" bg-gray-100 rounded-md px-2 py-1">
            <Calendar className="w-3.5 h-3.5" />
            <Text as="span">{startDate}</Text>
          </Flex>
        )}
      </Flex>

      {startDate && endDate && (
        <Flex gap="1" className="text-xs text-gray-600">
          {t("project.startLabel")}: {startDate} - {t("project.endLabel")}:{" "}
          {endDate}
        </Flex>
      )}
    </Card>
  );
}
