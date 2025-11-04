import { Box, Flex, IconButton, Text } from "@radix-ui/themes";
import { Calendar, Pencil, Trash2, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "~/shared/components/atoms/Card";
import { Tag } from "~/shared/components/atoms/Tag";
import { ConfirmDeleteButton } from "~/shared/components/molecules/ConfirmDeleteButton";
import { formatDateByLocale } from "~/shared/utils/date";
import { useDeleteProject } from "../../../application/hooks/useDeleteProject";

type TagVariant =
  | "default"
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "orange";

const TAG_VARIANTS: TagVariant[] = [
  "default",
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "orange",
];

const isValidTagVariant = (color?: string): color is TagVariant =>
  color !== undefined && TAG_VARIANTS.includes(color as TagVariant);

export interface ProjectInfoCardProps {
  name: string;
  description?: string;
  tags?: Array<{ label: string; color?: string }>;
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
  const { t, i18n } = useTranslation();
  const { isDeleting } = useDeleteProject();
  const formattedStartDate = useMemo(
    () => formatDateByLocale(startDate, i18n.language),
    [startDate, i18n.language]
  );
  const formattedEndDate = useMemo(
    () => formatDateByLocale(endDate, i18n.language),
    [endDate, i18n.language]
  );

  const hasActions = onEdit || onDelete;

  return (
    <Card
      className={`space-y-3 h-full relative ${className}`}
      onClick={onClick}
    >
      {hasActions && (
        <Box className="absolute top-3 right-3 z-10">
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
                onConfirm={onDelete}
                isLoading={isDeleting}
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

      <Box mb="2">
        <Text
          as="p"
          size="2"
          className={`text-sm leading-6 line-clamp-2 ${
            description ? "text-gray-600" : "text-gray-400 italic"
          }`}
        >
          {description || t("project.noDescription")}
        </Text>
      </Box>

      {tags.length > 0 && (
        <Flex wrap="wrap" gap="2">
          {tags.map((tag, idx) => (
            <Tag
              key={`${tag.label}-${idx}`}
              label={tag.label}
              variant={isValidTagVariant(tag.color) ? tag.color : "default"}
            />
          ))}
        </Flex>
      )}

      <Flex align="center" gap="2" className="text-xs text-gray-700">
        {typeof memberCount === "number" && (
          <Flex
            gap="1"
            align="center"
            className="bg-gray-100 rounded-md px-2 py-1"
          >
            <Users className="w-3.5 h-3.5" />
            <Text as="span">{memberCount}</Text>
          </Flex>
        )}
        {(formattedStartDate || formattedEndDate) && (
          <Flex
            gap="1"
            align="center"
            className="bg-gray-100 rounded-md px-2 py-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <Text as="span">
              {formattedStartDate && formattedEndDate
                ? `${formattedStartDate} ~ ${formattedEndDate}`
                : formattedStartDate || formattedEndDate}
            </Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
