import { Flex } from "@radix-ui/themes";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useEditProjectForm } from "~/domains/project/application/hooks/useEditProjectForm";
import type { ProjectId } from "~/domains/project/domain/entities/Project";
import type { UpdateProjectFormData } from "~/domains/project/domain/validation/project.schema";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "~/shared/components/atoms/Dialog";
import type { Tag } from "~/shared/components/atoms/TagInput";
import { ProjectFormFields } from "./ProjectFormFields";

export interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: ProjectId;
  project: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tags?: string[];
    status?: string;
  };
}

export function EditProjectDialog({
  open,
  onOpenChange,
  projectId,
  project,
}: EditProjectDialogProps) {
  const { t } = useTranslation();

  // Convert string[] tags to Tag[] objects
  const tagsArray: Tag[] =
    project.tags?.map(tag => ({
      id: uuidv4(),
      value: tag,
    })) || [];

  // Convert project data to form format (dates need to be in YYYY-MM-DD format)
  const initialValues: Partial<UpdateProjectFormData> = {
    name: project.name,
    description: project.description || "",
    startDate: project.startDate
      ? dayjs(project.startDate).format("YYYY-MM-DD")
      : "",
    endDate: project.endDate ? dayjs(project.endDate).format("YYYY-MM-DD") : "",
    tags: tagsArray,
    status:
      (project.status as "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED") ||
      "ACTIVE",
  };

  const { form, isSubmitting, startDateParsed, endDateParsed } =
    useEditProjectForm({
      projectId,
      initialValues,
      onSuccess: () => {
        onOpenChange(false);
      },
    });

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={t("project.editDialog.title")}
        description={t("project.editDialog.description")}
        size="4"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
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
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="solid">
                {t("project.editDialog.submitButton")}
              </Button>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
