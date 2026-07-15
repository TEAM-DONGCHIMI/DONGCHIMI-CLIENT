import { Box, PointChip } from '@dongchimi/design-system/components';
import { IcCalendar, IcChevronDown, IcLocation, IcPhone } from '@dongchimi/design-system/icons';

import phoneFrameUrl from '../assets/phone-frame.svg';
import phoneStatusBarUrl from '../assets/phone-status-bar.svg';
import * as S from './PhonePreviewFrame.css';

const topProducts = [
  { discountRate: 10, name: '일계란 500g', price: '6,900' },
  { discountRate: 10, name: '제주 감귤 1kg', price: '6,900' },
  { discountRate: 10, name: '대파 1단', price: '6,900' },
] as const;

const todaySpecialProducts = [
  { discountRate: 10, name: '국산 콩나물 500g', originalPrice: '5,000', price: '4,500' },
  { discountRate: 10, name: '찰토마토 500g', originalPrice: '5,000', price: '4,500' },
] as const;

const eventDiscountCategories = ['전체', '채소·과일', '정육·계란', '수산', '유제품'] as const;
const visibleEventDiscountCategories = eventDiscountCategories.slice(0, 3);

const eventDiscountProducts = [
  { name: '일계란 500g', price: '4,900' },
  { name: '찰토마토 500g', price: '4,900' },
  { name: '제주 감귤 1kg', price: '4,900' },
  { name: '국산 콩나물', price: '3,900' },
  { name: '대파 1단', price: '5,900' },
  { name: '우유 900ml', price: '2,800' },
] as const;

const ProductImageFallback = ({ className }: { className?: string }) => (
  <span aria-hidden='true' className={className ?? S.imageFallbackClassName} />
);

export const PhonePreviewFrame = () => {
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
                  <h2 className={S.marketTitleClassName}>망원 신선마트</h2>
                  <span className={S.marketStatusChipClassName}>영업중</span>
                </div>

                <div className={S.marketInfoClassName}>
                  <div className={S.marketImageFrameClassName}>
                    <ProductImageFallback />
                  </div>
                  <dl className={S.marketMetaListClassName}>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcLocation aria-hidden='true' />
                      </dt>
                      <dd className={S.marketMetaTextClassName}>서울 마포구 망원동</dd>
                    </div>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcPhone aria-hidden='true' />
                      </dt>
                      <dd className={S.marketMetaTextClassName}>02-123-4567</dd>
                    </div>
                    <div className={S.marketMetaItemClassName}>
                      <dt className={S.marketMetaIconClassName}>
                        <IcCalendar aria-hidden='true' />
                      </dt>
                      <dd className={S.businessHourLinesClassName}>
                        <span>화-금 10:00 - 20:00</span>
                        <span>토-일 12:00 - 20:00</span>
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
                    {topProducts.map((product) => (
                      <article key={product.name} className={S.topProductCardClassName}>
                        <ProductImageFallback className={S.topProductImageFallbackClassName} />
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
                    <span className={S.sectionCountClassName}>9건</span>
                  </div>
                  <div className={S.todayProductListClassName}>
                    {todaySpecialProducts.map((product) => (
                      <article key={product.name} className={S.todayProductCardClassName}>
                        <span className={S.todayProductImageClassName}>
                          <ProductImageFallback />
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
                    등록된 상품 전체보기
                    <IcChevronDown aria-hidden='true' />
                  </span>
                </section>

                <section className={S.cardSectionClassName}>
                  <h3 className={S.sectionTitleClassName}>행사 할인 상품</h3>
                  <div className={S.categoryListClassName}>
                    {visibleEventDiscountCategories.map((category, index) => (
                      <span
                        key={category}
                        className={
                          index === 0 ? S.categoryChipSelectedClassName : S.categoryChipClassName
                        }
                      >
                        {category}
                      </span>
                    ))}
                    <span className={S.categoryChipClassName}>
                      더보기
                      <IcChevronDown aria-hidden='true' />
                    </span>
                  </div>
                  <div className={S.eventProductGridClassName}>
                    {eventDiscountProducts.map((product) => (
                      <article key={product.name} className={S.eventProductCardClassName}>
                        <span className={S.eventProductImageFrameClassName}>
                          <ProductImageFallback />
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
