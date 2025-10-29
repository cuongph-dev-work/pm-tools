// 1. React imports
import React from "react";

// 2. Third-party libraries
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  Calendar,
  LayoutDashboard,
  List,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// 3. Internal utilities (using path alias)
import { Button } from "~/shared/components/atoms/Button";
import { useNavigation } from "~/shared/hooks/useNavigation";
import { useProjects } from "~/shared/hooks/useProjects";
import { useSidebar } from "~/shared/hooks/useSidebar";

type NavigationItem = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresProject: boolean;
};

export function AppSidebar() {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage } = useNavigation();
  const { currentProject } = useProjects();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navigationItems: NavigationItem[] = [
    {
      id: "backlog",
      title: t("sidebar.navigation.backlog"),
      icon: List,
      requiresProject: true,
    },
    {
      id: "kanban",
      title: t("sidebar.navigation.kanban"),
      icon: LayoutDashboard,
      requiresProject: true,
    },
    {
      id: "sprint",
      title: t("sidebar.navigation.sprint"),
      icon: Calendar,
      requiresProject: true,
    },
  ];

  // const featureItems = [
  //   {
  //     id: "projects",
  //     title: "Quản lý Project",
  //     icon: FolderOpen,
  //     requiresProject: false,
  //   },
  //   {
  //     id: "logwork",
  //     title: "LogWork & Reports",
  //     icon: Clock,
  //     requiresProject: true,
  //   },
  //   {
  //     id: "git-alerts",
  //     title: "Git Alerts",
  //     icon: AlertTriangle,
  //     requiresProject: false,
  //     badge: unreadAlerts > 0 ? unreadAlerts : null,
  //   },
  //   {
  //     id: "settings",
  //     title: "Cài đặt",
  //     icon: Settings,
  //     requiresProject: false,
  //   },
  // ];

  const handleNavigation = (id: string) => {
    setCurrentPage(id as Parameters<typeof setCurrentPage>[0]);
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <div
      className={`${sidebarWidth} h-full bg-white border-r border-gray-200 flex flex-col relative z-10 transition-all duration-300`}
    >
      {/* Toggle Button - Float */}
      <div className="absolute -right-12 bottom-2 z-[100]">
        <Button
          onClick={toggleSidebar}
          variant="solid"
          color="gray"
          size="sm"
          className="w-8 h-8 min-w-8 p-0 shadow-md"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ArrowBigRightDash className="w-4 h-4" />
          ) : (
            <ArrowBigLeftDash className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Main Section */}
        <div className={`p-4 ${isCollapsed ? "p-2" : ""}`}>
          {!isCollapsed && (
            <div className="text-xs text-gray-500 mb-3">
              {t("sidebar.main")}
            </div>
          )}
          <div className="space-y-1">
            {navigationItems.map(item => {
              const isDisabled = item.requiresProject && !currentProject;
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      handleNavigation(item.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 rounded text-sm transition-colors select-none
                    ${isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}
                    ${isActive ? "bg-gray-100 text-gray-900" : ""}
                    ${isDisabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}
                  `}
                  style={{
                    pointerEvents: isDisabled ? "none" : "auto",
                    userSelect: "none",
                  }}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        {/* <div className="p-4">
          <div className="text-xs text-gray-500 mb-3">Tính năng khác</div>
          <div className="space-y-1">
            {featureItems.map(item => {
              const isDisabled = item.requiresProject && !currentProject;
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      handleNavigation(item.id);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors select-none relative
                    ${isActive ? "bg-gray-100 text-gray-900" : ""}
                    ${isDisabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}
                  `}
                  style={{
                    pointerEvents: isDisabled ? "none" : "auto",
                    userSelect: "none",
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 p-0 flex items-center justify-center text-xs ml-auto"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div> */}

        {/* Statistics Section */}
        {/* <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-3">Thống kê</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng công việc</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Hoàn thành</span>
              </div>
              <span className="font-medium">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Đang thực hiện</span>
              </div>
              <span className="font-medium">{inProgressTasks}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Cần làm</span>
              </div>
              <span className="font-medium">{pendingTasks}</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
