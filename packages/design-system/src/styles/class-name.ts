import { clsx, type ClassValue } from 'clsx';

export type ClassValueTypes = ClassValue;

export const cn = (...values: ClassValueTypes[]) => clsx(...values);
