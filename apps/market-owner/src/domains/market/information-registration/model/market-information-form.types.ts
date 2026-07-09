import { type z } from 'zod';

import { type marketInformationRegistrationSchema } from './market-information-form.schema';

export type MarketInformationFormTypes = z.infer<typeof marketInformationRegistrationSchema>;

export type BusinessHourDayTypes = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type BusinessHourValueTypes = {
  open: string;
  close: string;
} | null;

export type BusinessHoursTypes = Record<BusinessHourDayTypes, BusinessHourValueTypes>;

export interface MarketInformationRegistrationRequest {
  address: string;
  brn: string | null;
  businessHours: BusinessHoursTypes | null;
  detailAddress: string | null;
  latitude: number;
  longitude: number;
  marketPhone1: string;
  marketPhone2: string | null;
  marketPhonePrimary: 1 | 2;
  name: string;
  ownerPhone: string;
  thumbnailUrl: string | null;
}
