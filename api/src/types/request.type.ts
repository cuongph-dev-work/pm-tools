declare module 'express' {
  interface Request {
    _queryStats?: Array<{ query: string; params: unknown[]; time: number }>;
    _startTime?: number;
    _memoryStart?: number;
  }
}

/**
 * Wrapper type used to circumvent ESM modules circular dependency issue
 * caused by reflection metadata saving the type of the property.
 */
export type WrapperType<T> = T; // WrapperType === Relation
