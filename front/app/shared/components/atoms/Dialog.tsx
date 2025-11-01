import { Dialog as RDialog } from "@radix-ui/themes";
import { X } from "lucide-react";
import React from "react";

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface DialogContentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  size?: "1" | "2" | "3" | "4";
  maxWidth?: string;
}

interface DialogHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ children, open, onOpenChange, trigger }: DialogProps) => {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RDialog.Trigger>{trigger}</RDialog.Trigger>}
      {children}
    </RDialog.Root>
  );
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RDialog.Content>,
  DialogContentProps & React.ComponentPropsWithoutRef<typeof RDialog.Content>
>(
  (
    {
      title,
      description,
      children,
      className = "",
      closeOnOverlayClick = true,
      size = "3",
      maxWidth,
      ...props
    },
    ref
  ) => {
    return (
      <RDialog.Content
        ref={ref}
        size={size}
        className={className}
        maxWidth={maxWidth}
        onInteractOutside={
          closeOnOverlayClick
            ? props.onInteractOutside
            : e => e.preventDefault()
        }
        {...props}
      >
        {(title || description) && (
          <DialogHeader title={title} description={description} />
        )}
        {children}
        <RDialog.Close
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </RDialog.Close>
      </RDialog.Content>
    );
  }
);
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ title, description }: DialogHeaderProps) => {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
      {title && (
        <RDialog.Title className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </RDialog.Title>
      )}
      {description && (
        <RDialog.Description className="text-sm text-gray-600">
          {description}
        </RDialog.Description>
      )}
    </div>
  );
};

const DialogFooter = ({ children, className = "" }: DialogFooterProps) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};

const DialogTitle = RDialog.Title;
const DialogDescription = RDialog.Description;
const DialogClose = RDialog.Close;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};
