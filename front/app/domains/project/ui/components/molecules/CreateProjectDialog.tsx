import { Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { useCreateProjectForm } from "~/domains/project/application/hooks/useCreateProjectForm";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "~/shared/components/atoms/Dialog";
import { ProjectFormFields } from "./ProjectFormFields";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
}: CreateProjectDialogProps) {
  const { t } = useTranslation();

  const { form, isSubmitting, startDateParsed, endDateParsed } =
    useCreateProjectForm({
      onSuccess: () => onOpenChange(false),
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
        title={t("project.createDialog.title")}
        description={t("project.createDialog.description")}
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
                {t("project.createDialog.submitButton")}
              </Button>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
