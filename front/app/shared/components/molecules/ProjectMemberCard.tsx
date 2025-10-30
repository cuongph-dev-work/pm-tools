import React from "react";
import { Card } from "~/shared/components/atoms/Card";
import { Avatar } from "~/shared/components/atoms/Avatar";

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
  return (
    <Card className="flex items-center gap-3">
      <Avatar name={name} src={avatarUrl} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-900 truncate">
            {name}
          </div>
          {isOwner && <span className="text-yellow-600 text-xs">👑</span>}
        </div>
        {email && <div className="text-xs text-gray-500 truncate">{email}</div>}
        <div className="flex items-center gap-2 mt-1">
          {roleLabel && (
            <span className="text-xs bg-gray-100 text-gray-700 rounded-md px-2 py-0.5">
              {roleLabel}
            </span>
          )}
          {joinedAt && (
            <span className="text-xs text-gray-500">Tham gia: {joinedAt}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
