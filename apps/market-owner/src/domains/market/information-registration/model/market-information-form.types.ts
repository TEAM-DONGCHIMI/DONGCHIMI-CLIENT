import { type z } from 'zod';

import { type marketInformationRegistrationSchema } from './market-information-form.schema';

export type MarketInformationFormState = z.infer<typeof marketInformationRegistrationSchema>;
