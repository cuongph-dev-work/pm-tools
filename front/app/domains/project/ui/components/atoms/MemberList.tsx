import { Box } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { MemberDTO } from "~/domains/project/application/dto/MemberDTO";
import { formatDateByLocale } from "~/shared/utils/date";
import { ProjectMemberCard } from "~/domains/project/ui/components/molecules/ProjectMemberCard";

interface MemberListProps {
  members: MemberDTO[];
}

export function MemberList({ members }: MemberListProps) {
  const { i18n, t } = useTranslation();

  return (
    <Box className="space-y-3">
      {members.map(m => {
        const formattedJoinedAt = formatDateByLocale(m.joinedAt, i18n.language);
        const roleLabel =
          (t(`project.memberRoles.${m.role}` as any) as string) || m.role;

        return (
          <ProjectMemberCard
            key={m.id}
            name={m.name}
            email={m.email}
            roleLabel={roleLabel}
            role={m.role}
            isOwner={m.isOwner}
            joinedAt={formattedJoinedAt}
            avatarUrl={m.avatarUrl}
          />
        );
      })}
    </Box>
  );
}

export default MemberList;
