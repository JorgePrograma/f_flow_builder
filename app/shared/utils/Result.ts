/**
 * Represents the result of an operation that can succeed (T) or fail (E).
 * This pattern avoids using try-catch for expected business errors.
 */
export type Result<T, E = Error> = 
  | { ok: true; value: T; error?: never } 
  | { ok: false; error: E; value?: never };

/**
 * Creates a successful Result.
 */
export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

/**
 * Creates a failed Result.
 */
export const fail = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
