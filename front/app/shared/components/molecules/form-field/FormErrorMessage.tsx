/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldApi } from "@tanstack/react-form";

type AnyFieldApi = FieldApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export interface FormErrorMessageProps {
  field: AnyFieldApi;
  className?: string;
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    // Valibot issue object có property 'message'
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
    // Fallback: try to stringify if it's an object
    return JSON.stringify(error);
  }
  return String(error ?? "");
}

export function FormErrorMessage({
  field,
  className = "text-sm text-red-600 mt-1",
}: FormErrorMessageProps) {
  // Access errors from field.state.meta.errors in TanStack Form
  const errors = field.state.meta?.errors ?? [];

  // Extract messages from errors (can be Valibot issue objects or strings)
  const messages = Array.isArray(errors)
    ? errors.map(extractErrorMessage).filter(Boolean)
    : errors
      ? [extractErrorMessage(errors)]
      : [];

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
