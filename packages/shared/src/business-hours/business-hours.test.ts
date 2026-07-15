import { describe, expect, it } from 'vitest';

import {
  formatBusinessDays,
  formatBusinessHour,
  getCurrentBusinessCloseTime,
} from './business-hours';

describe('business-hours', () => {
  it('formats sorted continuous business day groups', () => {
    expect(formatBusinessDays(['FRIDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'])).toBe('화-금');
    expect(formatBusinessDays(['MONDAY', 'SUNDAY'])).toBe('월요일, 일요일');
  });

  it('formats open and closed business hours', () => {
    expect(
      formatBusinessHour({
        close: '20:00',
        days: ['TUESDAY', 'WEDNESDAY'],
        isOpen: true,
        open: '10:00',
      }),
    ).toEqual({
      dayText: '화-수',
      isClosed: false,
      timeText: '10:00 - 20:00',
    });
    expect(formatBusinessHour({ days: ['MONDAY'], isOpen: false })).toEqual({
      dayText: '월요일',
      isClosed: true,
    });
  });

  it('finds the current close time from open business hours', () => {
    expect(
      getCurrentBusinessCloseTime(
        [
          { close: '20:00', days: ['MONDAY', 'TUESDAY'], isOpen: true, open: '10:00' },
          { days: ['WEDNESDAY'], isOpen: false },
        ],
        new Date('2026-07-14T12:00:00+09:00'),
      ),
    ).toBe('20:00');
  });
});
