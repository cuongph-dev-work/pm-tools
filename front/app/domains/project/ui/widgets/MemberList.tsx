import React from "react";
import { ProjectMemberCard } from "~/shared/components/molecules/ProjectMemberCard";

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  isOwner?: boolean;
  joinedAt?: string;
};

interface MemberListProps {
  members: Member[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="space-y-3">
      {members.map(m => (
        <ProjectMemberCard
          key={m.id}
          name={m.name}
          email={m.email}
          roleLabel={m.role}
          isOwner={m.isOwner}
          joinedAt={m.joinedAt}
        />
      ))}
    </div>
  );
}

export default MemberList;
