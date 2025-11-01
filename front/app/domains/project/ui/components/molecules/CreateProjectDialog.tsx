import { Box, Flex, Grid } from "@radix-ui/themes";
import { TagIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateProjectForm } from "~/domains/project/application/hooks/useCreateProjectForm";
import { Button } from "~/shared/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "~/shared/components/atoms/Dialog";
import {
  FormFieldDatePicker,
  FormFieldInput,
  FormFieldTextarea,
} from "~/shared/components/molecules/form-field";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    tags?: string;
  }) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  const { t } = useTranslation();

  const { form, isSubmitting, handleCancel } = useCreateProjectForm({
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
        title={t("project.createDialog.title")}
        description={t("project.createDialog.description")}
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
          <Box className="space-y-4 mt-4">
            <FormFieldInput
              name="name"
              form={form}
              label={t("project.createForm.nameLabel")}
              placeholder={t("project.createForm.namePlaceholder")}
              isRequired
            />

            <FormFieldTextarea
              name="description"
              form={form}
              label={t("project.createForm.descriptionLabel")}
              placeholder={t("project.createForm.descriptionPlaceholder")}
              rows={3}
            />

            <Grid columns="2" gap="4">
              <FormFieldDatePicker
                name="startDate"
                form={form}
                label={t("project.createForm.startDateLabel")}
              />

              {/* <FormFieldDatePicker
                name="endDate"
                form={form}
                label={t("project.createForm.endDateLabel")}
              /> */}
            </Grid>

            <Box>
              <FormFieldInput
                name="tags"
                form={form}
                label={t("project.createForm.tagsLabel")}
                placeholder={t("project.createForm.tagsPlaceholder")}
                leftSlot={<TagIcon className="w-4 h-4 text-gray-400" />}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("project.createForm.tagsDescription")}
              </p>
            </Box>
          </Box>

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
                {t("project.createDialog.submitButton")}
              </Button>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
