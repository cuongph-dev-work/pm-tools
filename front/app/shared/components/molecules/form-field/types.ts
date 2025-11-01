import { useForm } from "@tanstack/react-form";

/**
 * Helper type để tránh lỗi "requires between 11 and 12 type arguments"
 * Sử dụng ReturnType của useForm để có đầy đủ methods như useField
 * ReturnType của useForm sẽ là ReactFormApi có useField method
 */
export type AnyFormApi = ReturnType<typeof useForm>;
