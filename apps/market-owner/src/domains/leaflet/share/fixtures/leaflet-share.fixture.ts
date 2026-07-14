export interface LeafletSummaryFixture {
  eventDiscountProductCount: number;
  todaySpecialProductCount: number;
}

export const leafletShareFixture = {
  qrImageLabel: '매장 고유 QR코드',
  summary: {
    eventDiscountProductCount: 8,
    todaySpecialProductCount: 2,
  },
} as const satisfies {
  qrImageLabel: string;
  summary: LeafletSummaryFixture;
};
