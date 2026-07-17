import { describe, expect, it } from 'vitest';

import { metadata, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './layout';

describe('root metadata', () => {
  it('defines canonical search and social sharing metadata', () => {
    expect(metadata).toMatchObject({
      metadataBase: new URL(SITE_URL),
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      alternates: {
        canonical: '/',
      },
      openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: '/',
        siteName: SITE_TITLE,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [
          {
            url: '/images/og-image.png',
            width: 3200,
            height: 1600,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [
          {
            url: '/images/og-image.png',
            width: 3200,
            height: 1600,
          },
        ],
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  });

  it('preserves the existing PWA and icon metadata', () => {
    expect(metadata).toMatchObject({
      applicationName: SITE_TITLE,
      manifest: '/manifest.webmanifest',
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: SITE_TITLE,
      },
      icons: {
        icon: '/favicon.svg',
        apple: [
          {
            url: '/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      },
    });
  });
});
