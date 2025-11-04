import { useEffect } from "react";
import { Outlet, useMatches, useNavigate } from "react-router";
import { useListProjects } from "~/domains/project/application/hooks/useListProjects";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppHeader } from "../components/layout/AppHeader";
import { AppSidebar } from "../components/layout/AppSidebar";
import { useProjects } from "../hooks/useProjects";

export default function DefaultLayout() {
  const { projects, isLoading } = useListProjects();
  const { currentProject, setCurrentProject } = useProjects();
  const matches = useMatches();
  const navigate = useNavigate();

  // Extract projectId from route params
  const routeMatch = matches.find(
    m => (m.params as { projectId?: string }).projectId
  );
  const routeProjectId = routeMatch?.params?.projectId as string | undefined;

  // Sync projectId from route with store
  useEffect(() => {
    if (!isLoading && routeProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === routeProjectId);
      if (project && currentProject?.id !== routeProjectId) {
        setCurrentProject({
          id: project.id,
          name: project.name,
        });
      } else if (!project && routeProjectId) {
        // Project not found, redirect to projects page
        navigate("/projects", { replace: true });
      }
    }
  }, [
    isLoading,
    routeProjectId,
    projects,
    currentProject,
    setCurrentProject,
    navigate,
  ]);

  // Auto-select first project if no project is selected and no route projectId
  useEffect(() => {
    if (
      !isLoading &&
      !currentProject &&
      !routeProjectId &&
      projects.length > 0
    ) {
      const firstProject = projects[0];
      setCurrentProject({
        id: firstProject.id,
        name: firstProject.name,
      });
    }
  }, [isLoading, currentProject, routeProjectId, projects, setCurrentProject]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Navigation Header */}
        <AppHeader />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
