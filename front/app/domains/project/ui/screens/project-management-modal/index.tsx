import { PlusIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "~/shared/components/atoms/Dialog";
import { Tabs } from "~/shared/components/atoms/Tabs";
import { ProjectList } from "../../widgets/ProjectList";
import { MemberList } from "../../widgets/MemberList";

interface ProjectManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DemoProject = {
  id: string;
  name: string;
  description: string;
  tags: Array<{ label: string; color?: string | undefined }>; // TODO: replace with VO
  memberCount: number;
  startDate: string;
  endDate?: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isOwner?: boolean;
    joinedAt?: string;
  }>;
};

export function ProjectManagementModal({
  open,
  onOpenChange,
}: ProjectManagementModalProps) {
  const { t } = useTranslation();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const projects: DemoProject[] = useMemo(
    () => [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Xây dựng nền tảng thương mại điện tử với...",
        tags: [
          { label: "React", color: "blue" },
          { label: "E-commerce", color: "red" },
          { label: "Frontend", color: "green" },
        ],
        memberCount: 2,
        startDate: "1/1/2024",
        endDate: "30/6/2024",
        members: [
          {
            id: "u1",
            name: "Admin User",
            email: "admin@pmtools.com",
            role: "Chủ sở hữu",
            isOwner: true,
            joinedAt: "1/1/2024",
          },
          {
            id: "u2",
            name: "Developer",
            email: "dev@pmtools.com",
            role: "Thành viên",
            joinedAt: "2/1/2024",
          },
        ],
      },
      {
        id: "2",
        name: "Mobile App",
        description: "Ứng dụng mobile React Native cho iOS và...",
        tags: [
          { label: "React Native", color: "yellow" },
          { label: "Mobile", color: "purple" },
        ],
        memberCount: 1,
        startDate: "10/1/2024",
        members: [
          {
            id: "u1",
            name: "Developer",
            email: "dev@pmtools.com",
            role: "Thành viên",
            joinedAt: "10/1/2024",
          },
        ],
      },
    ],
    []
  );

  const currentProject = useMemo(() => {
    const id = selectedProjectId || projects[0]?.id;
    return projects.find(p => p.id === id) || null;
  }, [projects, selectedProjectId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0">
        <div className="px-6">
          <DialogHeader
            title={t("header.manageProjects")}
            description="Tạo, chỉnh sửa và quản lý các dự án của bạn"
          />
        </div>
        <div className="px-6">
          <Tabs
            tabs={[
              { value: "projects", label: t("header.myProjects") },
              {
                value: "members",
                label: "thành viên",
              },
            ]}
          >
            {active => (
              <div>
                {active === "projects" && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900 mb-1">
                          Tất cả dự án
                        </div>
                        <div className="text-sm text-gray-600">
                          Bạn có {projects.length} dự án
                        </div>
                      </div>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="w-4 h-4" />}
                      >
                        Tạo dự án
                      </Button>
                    </div>
                    <ProjectList
                      projects={projects}
                      currentProjectId={currentProject?.id || null}
                      onSelect={setSelectedProjectId}
                    />
                  </div>
                )}

                {active === "members" && currentProject && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900 mb-1">
                          Thành viên dự án: {currentProject.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentProject.memberCount} thành viên
                        </div>
                      </div>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="w-4 h-4" />}
                      >
                        Mời thành viên
                      </Button>
                    </div>
                    <MemberList members={currentProject.members} />
                  </div>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectManagementModal;
