import { Box, Flex, Text } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { Tabs } from "~/shared/components/atoms/Tabs";
import { useDeleteProject } from "../../application/hooks/useDeleteProject";
import { useListProjects } from "../../application/hooks/useListProjects";
import { useProjectMembers } from "../../application/hooks/useProjectMembers";
import MemberList from "../components/atoms/MemberList";
import ProjectList from "../components/atoms/ProjectList";
import { CreateProjectDialog } from "../components/molecules/CreateProjectDialog";
import { EditProjectDialog } from "../components/molecules/EditProjectDialog";

export default function ProjectManagement() {
  const { t } = useTranslation();
  const { deleteProject } = useDeleteProject();
  const { projects, currentProject, setSelectedProjectId } = useListProjects();
  const [activeTab, setActiveTab] = useState("projects");
  const { members } = useProjectMembers(
    currentProject?.id,
    activeTab === "members"
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  return (
    <Box className="mx-auto" p="6">
      <Box mb="6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("header.manageProjects")}
        </h1>
        <Text as="p" size="2" className="text-sm text-gray-600">
          {t("project.manageDescription")}
        </Text>
      </Box>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { value: "projects", label: t("project.tabs.projects") },
          { value: "members", label: t("project.tabs.members") },
        ]}
      >
        {active => (
          <Box>
            {active === "projects" && (
              <Box pt="4">
                <Flex
                  direction="row"
                  align="center"
                  justify="between"
                  mb="4"
                  gap="4"
                >
                  <Box>
                    <Box className="text-base font-semibold text-gray-900 mb-1">
                      {t("project.allProjects")}
                    </Box>
                    <Box className="text-sm text-gray-600">
                      {t("project.youHaveNProjects", {
                        count: projects.length,
                      })}
                    </Box>
                  </Box>
                  <Button
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    {t("project.createProject")}
                  </Button>
                </Flex>
                <ProjectList
                  projects={projects}
                  currentProjectId={currentProject?.id || null}
                  onSelect={setSelectedProjectId}
                  onEdit={setEditingProjectId}
                  onDelete={deleteProject}
                />
              </Box>
            )}

            {active === "members" && currentProject && (
              <Box pt="4">
                <Flex
                  direction="row"
                  align="center"
                  justify="between"
                  mb="4"
                  gap="4"
                >
                  <Box>
                    <Box className="text-base font-semibold text-gray-900 mb-1">
                      {t("project.projectMembersTitle", {
                        name: currentProject.name,
                      })}
                    </Box>
                    <Box className="text-sm text-gray-600">
                      {t("project.memberCount", {
                        count: members.length,
                      })}
                    </Box>
                  </Box>
                  <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
                    {t("project.inviteMember")}
                  </Button>
                </Flex>
                <MemberList members={members} />
              </Box>
            )}
          </Box>
        )}
      </Tabs>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingProjectId &&
        (() => {
          const project = projects.find(p => p.id === editingProjectId);
          if (!project) return null;
          return (
            <EditProjectDialog
              open={!!editingProjectId}
              onOpenChange={open => !open && setEditingProjectId(null)}
              projectId={editingProjectId}
              project={{
                name: project.name,
                description: project.description,
                startDate: project.startDate ?? undefined,
                endDate: project.endDate ?? undefined,
                tags: project.tags,
                status: project.status,
              }}
            />
          );
        })()}
    </Box>
  );
}
