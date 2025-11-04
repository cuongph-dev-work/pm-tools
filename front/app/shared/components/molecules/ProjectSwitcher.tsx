import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Text } from "@radix-ui/themes";
import { ChevronDown, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router";
import { useListProjects } from "~/domains/project/application/hooks/useListProjects";
import { useProjects } from "~/shared/hooks/useProjects";

export function ProjectSwitcher() {
  const { t } = useTranslation();
  const { currentProject, setCurrentProject } = useProjects();
  const { projects, isLoading } = useListProjects();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = currentProject?.name || projects[0]?.name || "";
  const truncatedName =
    displayName.length > 20
      ? `${displayName.substring(0, 17)}...`
      : displayName;

  const handleSelectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject({
        id: project.id,
        name: project.name,
      });
      // Navigate to backlog page with projectId if not already on a project route
      const currentPath = location.pathname;
      if (!currentPath.includes(`/${projectId}/`)) {
        navigate(`/${projectId}/backlog`);
      }
    }
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            <Text
              as="span"
              size="1"
              className="text-xs text-gray-900 font-medium"
            >
              {truncatedName}
            </Text>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[280px] bg-white rounded-md shadow-lg border border-gray-200 p-2 z-50"
            align="end"
            sideOffset={5}
          >
            <div className="px-3 py-2 text-sm font-semibold text-gray-900 mb-1">
              {t("header.myProjects")}
            </div>

            <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />

            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {t("common.loading")}
              </div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {t("project.noProjects")}
              </div>
            ) : (
              projects.map(project => {
                const isCurrent = currentProject?.id === project.id;
                const memberCount = project.memberCount || 0;

                return (
                  <DropdownMenu.Item
                    key={project.id}
                    className="px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50"
                    onSelect={() => handleSelectProject(project.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {t("project.memberCount", { count: memberCount })}
                        </div>
                      </div>
                      {isCurrent && (
                        <Text
                          as="span"
                          size="1"
                          className="ml-3 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {t("header.current")}
                        </Text>
                      )}
                    </div>
                  </DropdownMenu.Item>
                );
              })
            )}

            <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />

            <DropdownMenu.Item
              asChild
              className="px-3 py-2 rounded-md cursor-pointer outline-none hover:bg-gray-50 focus:bg-gray-50"
            >
              <Link to="/projects" className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <Text as="span" size="2" className="text-sm text-gray-700">
                  {t("header.manageProjects")}
                </Text>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
