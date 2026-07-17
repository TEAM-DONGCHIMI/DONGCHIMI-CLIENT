import { describe, expect, it } from 'vitest';

import {
  getProfileAvatarImageSrc,
  getSidebarProfileSource,
  profileAvatarImageSrc,
} from './SidebarLayout';

describe('getProfileAvatarImageSrc', () => {
  it('keeps displayable image URLs', () => {
    expect(getProfileAvatarImageSrc('https://static.dongchimi.kr/market.png')).toBe(
      'https://static.dongchimi.kr/market.png',
    );
    expect(getProfileAvatarImageSrc('/images/product-replace.svg')).toBe(
      '/images/product-replace.svg',
    );
  });

  it('falls back when a storage object key is passed to the sidebar avatar', () => {
    expect(getProfileAvatarImageSrc('tmp/MARKET_THUMBNAIL/market.png')).toBe(profileAvatarImageSrc);
  });
});

describe('getSidebarProfileSource', () => {
  it('uses the latest market detail over the persisted auth account snapshot', () => {
    expect(
      getSidebarProfileSource({
        account: {
          email: 'owner@example.com',
          marketName: 'Old Market',
          marketThumbnailUrl: 'tmp/MARKET_THUMBNAIL/old.png',
        },
        market: {
          address: 'Seoul',
          brn: null,
          businessHours: [],
          isHolidayClosed: false,
          latitude: 37.5665,
          longitude: 126.978,
          marketId: 24,
          marketPhone1: '02-1234-5678',
          marketPhone2: null,
          marketPhonePrimary: 1,
          name: 'Fresh Market',
          ownerPhone: '010-1234-5678',
          thumbnailUrl: 'https://static.dongchimi.kr/market.png',
        },
      }),
    ).toEqual({
      description: 'owner@example.com',
      name: 'Fresh Market',
      thumbnailUrl: 'https://static.dongchimi.kr/market.png',
    });
  });
});
