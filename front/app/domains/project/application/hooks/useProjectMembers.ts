import { useEffect, useState } from "react";
import { FakeProjectRepository } from "../../infrastructure/repositories/FakeProjectRepository";
import type { MemberDTO } from "../dto/MemberDTO";
import { GetProjectMembersUseCase } from "../use-cases/GetProjectMembers";

export function useProjectMembers(projectId: string | null | undefined) {
  const [members, setMembers] = useState<MemberDTO[]>([]);

  useEffect(() => {
    if (!projectId) {
      setMembers([]);
      return;
    }
    const repo = new FakeProjectRepository();
    const usecase = new GetProjectMembersUseCase(repo);
    usecase.execute(projectId).then(setMembers);
  }, [projectId]);

  return { members } as const;
}
