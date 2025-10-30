import * as React from "react";
import type { FieldApi } from "@tanstack/react-form";

export interface FormErrorMessageProps {
  field: FieldApi<any, any, any, any>;
  className?: string;
}

/**
 * Hiển thị danh sách lỗi từ tanstack form cho một field.
 * Không xử lý i18n tại đây vì message đã được tạo ở layer validation utils.
 */
export function FormErrorMessage({
  field,
  className = "text-sm text-red-600 mt-1",
}: FormErrorMessageProps) {
  const messages = (field.state.meta.errors ?? []).filter(Boolean) as string[];

  if (!messages.length) return null;

  return (
    <div className={className} aria-live="polite">
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul className="list-disc pl-5">
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FormErrorMessage;
