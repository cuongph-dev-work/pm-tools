import { Calendar, Users } from "lucide-react";
import { Card } from "~/shared/components/atoms/Card";
import { Tag } from "~/shared/components/atoms/Tag";

export interface ProjectInfoCardProps {
  name: string;
  description?: string;
  tags?: Array<{
    label: string;
    color?: "blue" | "red" | "green" | "yellow" | "purple" | "orange";
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
  onClick,
  className = "",
}: ProjectInfoCardProps) {
  return (
    <Card className={`space-y-3 h-full ${className}`} onClick={onClick}>
      <div className="text-base font-semibold text-gray-900">{name}</div>
      {description && (
        <p className="text-sm text-gray-600 leading-6 line-clamp-2">
          {description}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t, idx) => (
            <Tag
              key={`${t.label}-${idx}`}
              label={t.label}
              variant={t.color || "default"}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-700">
        {typeof memberCount === "number" && (
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
            <Users className="w-3.5 h-3.5" />
            <span>{memberCount}</span>
          </div>
        )}
        {startDate && (
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{startDate}</span>
          </div>
        )}
      </div>

      {startDate && endDate && (
        <div className="text-xs text-gray-600">
          Bắt đầu: {startDate} - Kết thúc: {endDate}
        </div>
      )}
    </Card>
  );
}
