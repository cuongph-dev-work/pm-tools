import { Box } from "@radix-ui/themes";
import { ProjectMemberCard } from "~/domains/project/ui/components/molecules/ProjectMemberCard";

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
    <Box className="space-y-3">
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
    </Box>
  );
}

export default MemberList;
