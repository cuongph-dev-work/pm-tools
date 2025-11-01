import { Box, Flex } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import { Tabs } from "~/shared/components/atoms/Tabs";
import { useListProjects } from "../../application/hooks/useListProjects";
import { useProjectMembers } from "../../application/hooks/useProjectMembers";
import MemberList from "../components/atoms/MemberList";
import ProjectList from "../components/atoms/ProjectList";
import { CreateProjectDialog } from "../components/molecules/CreateProjectDialog";

export default function ProjectManagement() {
  const { t } = useTranslation();
  const { projects, currentProject, setSelectedProjectId } = useListProjects();
  const { members } = useProjectMembers(currentProject?.id);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Box className="mx-auto" p="6">
      <Box mb="6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("header.manageProjects")}
        </h1>
        <p className="text-sm text-gray-600">
          {t("project.manageDescription")}
        </p>
      </Box>

      <Tabs
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
                  onEdit={() => {}}
                  onDelete={(_: string) => {}}
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
                        count: currentProject.memberCount,
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
    </Box>
  );
}
