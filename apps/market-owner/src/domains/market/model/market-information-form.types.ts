import { type z } from 'zod';

import { type OwnerApiTypes } from '@/shared/api';

import { type marketInformationRegistrationSchema } from './market-information-form.schema';

export type MarketInformationFormTypes = z.infer<typeof marketInformationRegistrationSchema>;

export type MarketInformationRegistrationRequestTypes = OwnerApiTypes.MarketRegisterRequest;
