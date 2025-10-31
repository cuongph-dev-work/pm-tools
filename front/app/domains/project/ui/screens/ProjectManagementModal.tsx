import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { Dialog, DialogContent } from "~/shared/components/atoms/Dialog";
import { Tabs } from "~/shared/components/atoms/Tabs";
import { useListProjects } from "../../application/hooks/useListProjects";
import { useProjectMembers } from "../../application/hooks/useProjectMembers";
import MemberList from "../components/atoms/MemberList";
import ProjectList from "../components/atoms/ProjectList";

interface ProjectManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Data is now provided via application hook/use-case, no local mocks

export function ProjectManagementModal({
  open,
  onOpenChange,
}: ProjectManagementModalProps) {
  const { t } = useTranslation();
  const { projects, currentProject, setSelectedProjectId } = useListProjects();
  const { members } = useProjectMembers(currentProject?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl p-0"
        title={t("header.manageProjects")}
        description={t("project.manageDescription")}
      >
        <div className="px-6 pt-6">
          <Tabs
            tabs={[
              { value: "projects", label: t("project.tabs.projects") },
              { value: "members", label: t("project.tabs.members") },
            ]}
          >
            {active => (
              <div>
                {active === "projects" && (
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-base font-semibold text-gray-900 mb-1">
                          {t("project.allProjects")}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("project.youHaveNProjects", {
                            count: projects.length,
                          })}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="w-4 h-4" />}
                      >
                        {t("project.createProject")}
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
                          {t("project.projectMembersTitle", {
                            name: currentProject.name,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("project.memberCount", {
                            count: currentProject.memberCount,
                          })}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        leftIcon={<PlusIcon className="w-4 h-4" />}
                      >
                        {t("project.inviteMember")}
                      </Button>
                    </div>
                    <MemberList members={members} />
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
