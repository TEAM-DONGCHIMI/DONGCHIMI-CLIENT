import { type z } from 'zod';

import { type marketInformationRegistrationSchema } from './market-information-form.schema';

export type MarketInformationFormTypes = z.infer<typeof marketInformationRegistrationSchema>;
