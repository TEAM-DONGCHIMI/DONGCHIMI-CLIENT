import { useId, useState, type ChangeEvent } from 'react';

import { AddableField, Chip, Dropdown } from '@dongchimi/design-system/components';
import {
  IcChevronDown,
  IcChevronUp,
  IcClockSizeSmallColor60,
  IcPhoneSizeSmallColor60,
  IcPlusSizeSmallColor60,
} from '@dongchimi/design-system/icons';

import { RequiredMark } from '../components/RequiredMark';
import { marketInformationRegistrationFixture } from '../fixtures';
import { type MarketInformationFormState } from '../model';
import * as S from './BusinessContactRowSection.css';

const businessDayOptions = ['전체', ...marketInformationRegistrationFixture.businessDays];

export interface BusinessContactRowSectionProps {
  form: MarketInformationFormState;
  onAddBusinessTime: () => void;
  onAddMarketPhone: () => void;
  onBusinessDayChange: (businessDay: string) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const BusinessContactRowSection = ({
  form,
  onAddBusinessTime,
  onAddMarketPhone,
  onBusinessDayChange,
  onInputChange,
}: BusinessContactRowSectionProps) => {
  const [isBusinessDayMenuOpen, setIsBusinessDayMenuOpen] = useState(false);
  const businessDayMenuId = useId();

  const handleBusinessDayOptionClick = (businessDay: string) => {
    onBusinessDayChange(businessDay);
    setIsBusinessDayMenuOpen(false);
  };

  return (
    <div className={S.businessContactRowClassName}>
      <div className={S.businessTimeFieldWrapperClassName}>
        <span className={S.inlineLabelClassName}>
          영업 시간
          <RequiredMark />
        </span>
        <div className={S.businessHourControlClassName}>
          <div className={S.dropdownFieldClassName}>
            <button
              aria-controls={isBusinessDayMenuOpen ? businessDayMenuId : undefined}
              aria-expanded={isBusinessDayMenuOpen}
              aria-haspopup='true'
              className={S.dropdownTriggerClassName}
              type='button'
              onClick={() => setIsBusinessDayMenuOpen((isOpen) => !isOpen)}
            >
              {form.businessDay || '요일'}
              {isBusinessDayMenuOpen ? (
                <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
              ) : (
                <IcChevronDown aria-hidden='true' className={S.dropdownTriggerIconClassName} />
              )}
            </button>
            {isBusinessDayMenuOpen && (
              <div className={S.dropdownPopoverClassName}>
                <Dropdown aria-label='영업 요일' id={businessDayMenuId} role='group'>
                  {businessDayOptions.map((businessDay) => (
                    <Dropdown.Item
                      checkbox
                      key={businessDay}
                      selected={form.businessDay === businessDay}
                      onClick={() => handleBusinessDayOptionClick(businessDay)}
                    >
                      {businessDay}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
            )}
          </div>
          <AddableField
            aria-label='영업 시간'
            leadingIcon={<IcClockSizeSmallColor60 />}
            name='businessTime'
            placeholder='00:00 - 00:00'
            required
            trailingActionLabel='영업 시간 추가'
            trailingIcon={<IcPlusSizeSmallColor60 />}
            value={form.businessTime}
            onChange={onInputChange}
            onTrailingAction={onAddBusinessTime}
          />
        </div>
      </div>

      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          <span className={S.marketPhoneLabelClassName}>
            마트 번호
            <RequiredMark />
            <Chip color='dark' size='mobile'>
              대표
            </Chip>
          </span>
        </span>
        <AddableField
          aria-label='마트 대표 번호'
          className={S.addableFieldClassName}
          leadingIcon={<IcPhoneSizeSmallColor60 />}
          name='marketPhone'
          placeholder='번호를 입력하세요.'
          required
          trailingActionLabel='마트 번호 추가'
          trailingIcon={<IcPlusSizeSmallColor60 />}
          type='tel'
          value={form.marketPhone}
          onChange={onInputChange}
          onTrailingAction={onAddMarketPhone}
        />
      </div>
    </div>
  );
};
