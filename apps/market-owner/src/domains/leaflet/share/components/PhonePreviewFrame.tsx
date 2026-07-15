import { Box, PointChip } from '@dongchimi/design-system/components';
import { IcCalendar, IcChevronDown, IcLocation, IcPhone } from '@dongchimi/design-system/icons';

import type { PhonePreviewViewModel } from '../model/leaflet-preview-view-model';
import phoneFrameUrl from '../assets/phone-frame.svg';
import phoneStatusBarUrl from '../assets/phone-status-bar.svg';
import * as S from './PhonePreviewFrame.css';

interface PhonePreviewFrameProps {
  preview: PhonePreviewViewModel;
}

const ProductImage = ({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src?: string | null;
}) => {
  if (!src) {
    return <span aria-hidden='true' className={className ?? S.imageFallbackClassName} />;
  }

  return <img alt={alt} className={className ?? S.imageClassName} src={src} />;
};

export const PhonePreviewFrame = ({ preview }: PhonePreviewFrameProps) => {
  const marketStatusLabel = preview.isOpenNow ? '영업중' : '영업종료';

  return (
    <Box aria-label='모바일 전단 미리보기' as='section' className={S.previewClassName}>
      <Box className={S.previewContentClassName}>
        <div aria-hidden='true' className={S.marketPreviewClassName}>
          <div className={S.marketPreviewScaleClassName}>
            <header className={S.mobileHeaderClassName}>
              <span className={S.backIconClassName}>‹</span>
              <strong className={S.mobileHeaderTitleClassName}>전단보기</strong>
            </header>

            <div className={S.contentClassName}>
              <section className={S.overviewClassName}>
                <div className={S.marketTitleRowClassName}>
                  <h2 className={S.marketTitleClassName}>{preview.marketName}</h2>
                  <span className={S.marketStatusChipClassName}>{marketStatusLabel}</span>
                </div>

                <div className={S.marketInfoClassName}>
                  <div className={S.marketImageFrameClassName}>
                    <ProductImage
                      alt={`${preview.marketName} 마트 이미지`}
                      src={preview.marketThumbnailUrl}
                    />
                  </div>
                  <dl className={S.marketMetaListClassName}>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcLocation aria-hidden='true' />
                      </dt>
                      <dd className={S.marketMetaTextClassName}>{preview.address}</dd>
                    </div>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcPhone aria-hidden='true' />
                      </dt>
                      <dd className={S.marketMetaTextClassName}>{preview.marketPhone}</dd>
                    </div>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcCalendar aria-hidden='true' />
                      </dt>
                      <dd className={S.businessHourLinesClassName}>
                        {preview.businessHourLines.map((businessHourLine) => (
                          <span key={businessHourLine}>{businessHourLine}</span>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className={S.actionRowClassName}>
                  <span className={S.shareActionClassName}>공유하기</span>
                  <span className={S.callActionClassName}>전화걸기</span>
                </div>
              </section>

              <div className={S.productSectionsFrameClassName}>
                <section className={S.sectionClassName}>
                  <h3 className={S.sectionTitleClassName}>지금 가장 인기 있는 상품 TOP 3</h3>
                  <div className={S.popularListClassName}>
                    {preview.topProducts.map((product) => (
                      <article key={product.id} className={S.topProductCardClassName}>
                        <ProductImage
                          alt={`${product.name} 상품 이미지`}
                          className={S.topProductImageClassName}
                          src={product.thumbnailUrl}
                        />
                        <span className={S.topProductScrimClassName} />
                        <PointChip className={S.discountBadgeClassName} size='mobile'>
                          {product.discountRate}%
                        </PointChip>
                        <span className={S.topProductContentClassName}>
                          <span className={S.topProductNameClassName}>{product.name}</span>
                          <strong className={S.topProductPriceClassName}>{product.price}원</strong>
                        </span>
                      </article>
                    ))}
                  </div>
                </section>

                <section className={S.todaySpecialCardClassName}>
                  <div className={S.sectionHeaderClassName}>
                    <h3 className={S.sectionTitleClassName}>오늘의 특가 상품</h3>
                    <span className={S.sectionCountClassName}>{preview.dailyTotalCount}건</span>
                  </div>
                  <div className={S.todayProductListClassName}>
                    {preview.dailyProducts.map((product) => (
                      <article key={product.id} className={S.todayProductCardClassName}>
                        <span className={S.todayProductImageClassName}>
                          <ProductImage
                            alt={`${product.name} 상품 이미지`}
                            src={product.thumbnailUrl}
                          />
                        </span>
                        <span className={S.todayProductContentClassName}>
                          <span className={S.todayProductNameClassName}>{product.name}</span>
                          <span className={S.todayProductPriceRowClassName}>
                            <strong className={S.todayProductDiscountedPriceClassName}>
                              {product.price}원
                            </strong>
                            <span className={S.todayProductOriginalPriceClassName}>
                              {product.originalPrice}원
                            </span>
                          </span>
                        </span>
                        <PointChip className={S.todayDiscountChipClassName} size='desktop'>
                          {product.discountRate}%
                        </PointChip>
                      </article>
                    ))}
                  </div>
                  <span className={S.inlineToggleClassName}>
                    등록한 상품 전체보기
                    <IcChevronDown aria-hidden='true' />
                  </span>
                </section>

                <section className={S.cardSectionClassName}>
                  <div className={S.sectionHeaderClassName}>
                    <h3 className={S.sectionTitleClassName}>행사 할인 상품</h3>
                    <span className={S.sectionCountClassName}>
                      {preview.eventProducts.length}건
                    </span>
                  </div>
                  <div className={S.eventProductGridClassName}>
                    {preview.eventProducts.map((product) => (
                      <article key={product.id} className={S.eventProductCardClassName}>
                        <span className={S.eventProductImageFrameClassName}>
                          <ProductImage
                            alt={`${product.name} 상품 이미지`}
                            src={product.thumbnailUrl}
                          />
                        </span>
                        <span className={S.eventProductNameClassName}>{product.name}</span>
                        <strong className={S.eventProductPriceClassName}>{product.price}원</strong>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <img alt='' aria-hidden='true' className={S.statusBarClassName} src={phoneStatusBarUrl} />
      <img alt='' aria-hidden='true' className={S.phoneFrameClassName} src={phoneFrameUrl} />
    </Box>
  );
};
