import { z, type ZodError, type ZodType } from 'zod';

export interface ValidateApiResponseOptions {
  endpoint?: string;
  schemaDescription?: string;
}

interface ApiResponseValidationErrorOptions extends ValidateApiResponseOptions {
  response: unknown;
  zodError: ZodError;
}

export class ApiResponseValidationError extends Error {
  readonly endpoint?: string;
  readonly issues: ZodError['issues'];
  readonly response: unknown;
  readonly schemaDescription?: string;
  readonly type = 'validation';

  constructor({
    endpoint,
    response,
    schemaDescription,
    zodError,
  }: ApiResponseValidationErrorOptions) {
    const endpointMessage = endpoint ? ` for ${endpoint}` : '';
    const schemaMessage = schemaDescription ? ` (${schemaDescription})` : '';

    super(`Invalid API response${endpointMessage}${schemaMessage}`, { cause: zodError });

    this.name = 'ApiResponseValidationError';
    this.endpoint = endpoint;
    this.issues = zodError.issues;
    this.response = response;
    this.schemaDescription = schemaDescription;
  }
}

export const isApiResponseValidationError = (
  error: unknown,
): error is ApiResponseValidationError => {
  return error instanceof ApiResponseValidationError;
};

export const validateApiResponse = <SchemaTypes extends ZodType>(
  schema: SchemaTypes,
  response: unknown,
  options: ValidateApiResponseOptions = {},
): z.infer<SchemaTypes> => {
  const result = schema.safeParse(response);

  if (!result.success) {
    throw new ApiResponseValidationError({
      ...options,
      response,
      zodError: result.error,
    });
  }

  return result.data;
};

export const createApiResponseValidator = <SchemaTypes extends ZodType>(
  schema: SchemaTypes,
  options: ValidateApiResponseOptions = {},
) => {
  return (response: unknown): z.infer<SchemaTypes> => {
    return validateApiResponse(schema, response, options);
  };
};

export { z };
export type { ZodError, ZodType };
