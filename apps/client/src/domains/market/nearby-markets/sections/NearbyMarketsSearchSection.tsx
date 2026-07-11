import { NearbyMarketsLocationSearchInput } from '../components/NearbyMarketsLocationSearchInput';
import * as S from '../NearbyMarketsPage.css';

export interface NearbyMarketsSearchSectionProps {
  keyword: string;
  onKeywordClick?: () => void;
  onKeywordChange: (keyword: string) => void;
  placeholder: string;
  readOnly?: boolean;
}

export const NearbyMarketsSearchSection = ({
  keyword,
  onKeywordClick,
  onKeywordChange,
  placeholder,
  readOnly = false,
}: NearbyMarketsSearchSectionProps) => {
  return (
    <section aria-labelledby='nearby-markets-title' className={S.searchSectionClassName}>
      <h1 className={S.titleClassName} id='nearby-markets-title'>
        현재 위치를 기준으로
        <br />
        가까운 마트를 보여드릴게요
      </h1>

      <NearbyMarketsLocationSearchInput
        onClick={onKeywordClick}
        onValueChange={onKeywordChange}
        placeholder={placeholder}
        readOnly={readOnly}
        value={keyword}
      />
    </section>
  );
};
