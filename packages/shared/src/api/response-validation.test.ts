import { describe, expect, it } from 'vitest';

import {
  ApiResponseValidationError,
  createApiResponseValidator,
  isApiResponseValidationError,
  validateApiResponse,
  z,
} from './response-validation';

const responseSchema = z.object({
  code: z.string(),
  data: z.object({
    accessToken: z.string(),
  }),
  message: z.string(),
  success: z.boolean(),
});

describe('validateApiResponse', () => {
  it('returns parsed response when the schema matches', () => {
    const result = validateApiResponse(responseSchema, {
      code: 'OK',
      data: {
        accessToken: 'access-token',
      },
      message: 'success',
      success: true,
    });

    expect(result.data.accessToken).toBe('access-token');
  });

  it('throws validation error with endpoint context when the schema does not match', () => {
    const endpoint = '/v1/owners/auth/login';

    expect(() =>
      validateApiResponse(
        responseSchema,
        {
          code: 'OK',
          data: {},
          message: 'success',
          success: true,
        },
        {
          endpoint,
          schemaDescription: 'owner login response',
        },
      ),
    ).toThrow(ApiResponseValidationError);

    try {
      validateApiResponse(responseSchema, { success: true }, { endpoint });
    } catch (error) {
      expect(isApiResponseValidationError(error)).toBe(true);

      if (isApiResponseValidationError(error)) {
        expect(error.type).toBe('validation');
        expect(error.endpoint).toBe(endpoint);
        expect(error.issues.length).toBeGreaterThan(0);
        expect(error.response).toEqual({ success: true });
      }
    }
  });
});

describe('createApiResponseValidator', () => {
  it('creates a reusable validator with default options', () => {
    const validateOwnerLoginResponse = createApiResponseValidator(responseSchema, {
      endpoint: '/v1/owners/auth/login',
    });

    expect(
      validateOwnerLoginResponse({
        code: 'OK',
        data: {
          accessToken: 'access-token',
        },
        message: 'success',
        success: true,
      }),
    ).toMatchObject({
      code: 'OK',
      data: {
        accessToken: 'access-token',
      },
    });
  });
});
