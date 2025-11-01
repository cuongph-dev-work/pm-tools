import { AlertDialog, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";

export interface ConfirmDeleteButtonProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export function ConfirmDeleteButton({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  children,
}: ConfirmDeleteButtonProps) {
  const { t } = useTranslation();

  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const defaultConfirmText = confirmText || t("common.delete");
  const defaultCancelText = cancelText || t("common.cancel");

  return (
    <AlertDialog.Root>
      {children && <AlertDialog.Trigger>{children}</AlertDialog.Trigger>}
      <AlertDialog.Content>
        <AlertDialog.Title className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="text-sm text-gray-600">
          {description}
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" onClick={handleCancel}>
              {defaultCancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={handleConfirm}>
              {defaultConfirmText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default ConfirmDeleteButton;
