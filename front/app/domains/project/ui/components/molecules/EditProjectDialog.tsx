import { Flex } from "@radix-ui/themes";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useEditProjectForm } from "~/domains/project/application/hooks/useEditProjectForm";
import type { ProjectFormSubmitData } from "~/domains/project/application/hooks/useProjectForm";
import type { ProjectFormData } from "~/domains/project/domain/validation/project.schema";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "~/shared/components/atoms/Dialog";
import { ProjectFormFields } from "./ProjectFormFields";

export interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tags?: string;
  };
  onSubmit?: (data: ProjectFormSubmitData) => void;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
}: EditProjectDialogProps) {
  const { t } = useTranslation();

  // Convert project data to form format (dates need to be in YYYY-MM-DD format)
  const initialValues: Partial<ProjectFormData> = {
    name: project.name,
    description: project.description || "",
    startDate: project.startDate
      ? dayjs(project.startDate).format("YYYY-MM-DD")
      : "",
    endDate: project.endDate ? dayjs(project.endDate).format("YYYY-MM-DD") : "",
    tags: project.tags || "",
  };

  const { form, isSubmitting, handleCancel, startDateParsed, endDateParsed } =
    useEditProjectForm({
      initialValues,
      onSubmit,
      onSuccess: () => {
        onOpenChange(false);
      },
    });

  const handleCancelClick = () => {
    handleCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t("project.editDialog.title", {
          defaultValue: "Chỉnh sửa dự án",
        })}
        description={t("project.editDialog.description", {
          defaultValue: "Cập nhật thông tin dự án",
        })}
        size="4"
        maxWidth="600px"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <ProjectFormFields
            form={form}
            startDateParsed={startDateParsed}
            endDateParsed={endDateParsed}
          />

          <DialogFooter className="mt-6">
            <Flex justify="end" gap="2">
              <Button
                type="button"
                variant="soft"
                onClick={handleCancelClick}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="solid">
                {t("project.editDialog.submitButton", {
                  defaultValue: "Lưu",
                })}
              </Button>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
