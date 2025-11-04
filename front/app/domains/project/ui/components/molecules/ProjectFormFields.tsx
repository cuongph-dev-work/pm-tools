import { Box, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import {
  FormFieldDatePicker,
  FormFieldInput,
  FormFieldTagInput,
  FormFieldTextarea,
} from "~/shared/components/molecules/form-field";
import type { AnyFormApi } from "~/shared/components/molecules/form-field/types";

export interface ProjectFormFieldsProps {
  form: AnyFormApi;
  startDateParsed?: Date;
  endDateParsed?: Date;
}

export function ProjectFormFields({
  form,
  startDateParsed,
  endDateParsed,
}: ProjectFormFieldsProps) {
  const { t } = useTranslation();

  return (
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

      <Flex gap="2">
        <FormFieldDatePicker
          name="startDate"
          form={form}
          label={t("project.createForm.startDateLabel")}
          maxDate={endDateParsed}
          isRequired
        />
        <FormFieldDatePicker
          name="endDate"
          form={form}
          label={t("project.createForm.endDateLabel")}
          minDate={startDateParsed}
        />
      </Flex>

      <FormFieldTagInput
        name="tags"
        form={form}
        label={t("project.createForm.tagsLabel")}
        placeholder={t("project.createForm.tagsPlaceholder")}
        description={t("project.createForm.tagsDescription")}
      />
    </Box>
  );
}
