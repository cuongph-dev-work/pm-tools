import { Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "~/shared/components/atoms/Dialog";
import { useProjects } from "~/shared/hooks/useProjects";
import { useCreateTaskForm } from "../../application/hooks/useCreateTaskForm";
import { CreateTaskForm } from "../components/molecules/CreateTaskForm";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId: propProjectId,
}: CreateTaskDialogProps) {
  const { t } = useTranslation();
  const { currentProject } = useProjects();
  const projectId = propProjectId || currentProject?.id || "";

  const { form, isSubmitting } = useCreateTaskForm({
    projectId,
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  if (!projectId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t("backlog.createDialog.title", {
          defaultValue: "Thêm Task Mới",
        })}
        description={t("backlog.createDialog.description", {
          defaultValue: "Tạo task mới với loại và thông tin chi tiết",
        })}
        size="4"
        maxWidth="640px"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CreateTaskForm form={form} projectId={projectId} />

          <DialogFooter className="mt-6">
            <Flex justify="end" gap="2">
              <Button
                type="button"
                variant="soft"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" variant="solid" disabled={isSubmitting}>
                {isSubmitting
                  ? t("common.submitting", { defaultValue: "Đang tạo..." })
                  : t("backlog.createDialog.submitButton", {
                      defaultValue: "Thêm Task Mới",
                    })}
              </Button>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
