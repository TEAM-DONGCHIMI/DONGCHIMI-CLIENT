import { useId, useState, type ChangeEvent } from 'react';

import { type UseFormRegisterReturn } from 'react-hook-form';

import { AddableField, Dropdown, Stack } from '@dongchimi/design-system/components';
import {
  IcChevronDown,
  IcChevronUp,
  IcCircleExclamationSizeSmallColorNegative,
  IcClockSizeSmallColor60,
  IcLineHorizontalSizeSmall,
  IcPlusSizeSmallColor60,
} from '@dongchimi/design-system/icons';

import { RequiredMark } from '../components/RequiredMark';
import { holidayOptions, marketInformationRegistrationFixture } from '../fixtures';
import * as S from './BusinessOperationSection.css';

const businessDayOptions = marketInformationRegistrationFixture.businessDays;
const maxSelectedBusinessDayCount = 2;

const getBusinessDayDisplayLabel = (businessDay: string) => {
  return businessDay.replace('요일', '');
};

const getBusinessDaysDisplayLabel = (businessDays: string[]) => {
  return businessDays.map(getBusinessDayDisplayLabel).join(', ');
};

export interface BusinessOperationSectionProps {
  additionalBusinessDay: string;
  additionalBusinessTime: string;
  additionalBusinessOperationErrorMessage?: string;
  additionalBusinessTimeField: UseFormRegisterReturn<'additionalBusinessTime'>;
  businessDay: string;
  businessTime: string;
  businessOperationErrorMessage?: string;
  businessTimeField: UseFormRegisterReturn<'businessTime'>;
  holiday: string;
  onAdditionalBusinessDayChange: (businessDay: string) => void;
  onAdditionalBusinessTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdditionalBusinessTimeRemove: () => void;
  onBusinessDayChange: (businessDay: string) => void;
  onHolidayChange: (holiday: string) => void;
  onBusinessTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface BusinessTimeErrorMessageProps {
  message: string;
}

const BusinessTimeErrorMessage = ({ message }: BusinessTimeErrorMessageProps) => (
  <div className={S.businessTimeErrorMessageClassName}>
    <IcCircleExclamationSizeSmallColorNegative
      aria-hidden='true'
      className={S.errorIconClassName}
    />
    <span>{message}</span>
  </div>
);

export const BusinessOperationSection = ({
  additionalBusinessDay,
  additionalBusinessTime,
  additionalBusinessOperationErrorMessage,
  additionalBusinessTimeField,
  businessDay,
  businessTime,
  businessOperationErrorMessage,
  businessTimeField,
  holiday,
  onAdditionalBusinessDayChange,
  onAdditionalBusinessTimeChange,
  onAdditionalBusinessTimeRemove,
  onBusinessDayChange,
  onHolidayChange,
  onBusinessTimeChange,
}: BusinessOperationSectionProps) => {
  const [isBusinessDayMenuOpen, setIsBusinessDayMenuOpen] = useState(false);
  const [isHolidayDropdownOpen, setIsHolidayDropdownOpen] = useState(false);
  const [isAdditionalBusinessTimeVisible, setIsAdditionalBusinessTimeVisible] = useState(false);
  const [isAdditionalBusinessDayMenuOpen, setIsAdditionalBusinessDayMenuOpen] = useState(false);
  const businessDayMenuId = useId();
  const additionalBusinessDayMenuId = useId();
  const holidayDropdownId = useId();
  const shouldShowAdditionalBusinessTime =
    isAdditionalBusinessTimeVisible ||
    additionalBusinessDay.length > 0 ||
    additionalBusinessTime.length > 0;
  const selectedBusinessDays = businessDay.length > 0 ? businessDay.split(', ') : [];
  const businessDayTriggerLabel =
    selectedBusinessDays.length > 0 ? getBusinessDaysDisplayLabel(selectedBusinessDays) : '요일';
  const additionalBusinessDayTriggerLabel = additionalBusinessDay
    ? getBusinessDayDisplayLabel(additionalBusinessDay)
    : '요일';

  const handleBusinessDayOptionClick = (businessDay: string) => {
    if (selectedBusinessDays.includes(businessDay)) {
      const nextSelectedBusinessDays = selectedBusinessDays.filter(
        (selectedDay) => selectedDay !== businessDay,
      );

      onBusinessDayChange(nextSelectedBusinessDays.join(', '));

      return;
    }

    const nextSelectedBusinessDays = [...selectedBusinessDays, businessDay].slice(
      0,
      maxSelectedBusinessDayCount,
    );

    onBusinessDayChange(nextSelectedBusinessDays.join(', '));
  };

  const handleHolidayOptionClick = (holiday: string) => {
    onHolidayChange(holiday);
    setIsHolidayDropdownOpen(false);
  };

  const handleAdditionalBusinessDayOptionClick = (businessDay: string) => {
    onAdditionalBusinessDayChange(businessDay);
    setIsAdditionalBusinessDayMenuOpen(false);
  };

  const handleRemoveAdditionalBusinessTime = () => {
    setIsAdditionalBusinessTimeVisible(false);
    onAdditionalBusinessTimeRemove();
    setIsAdditionalBusinessDayMenuOpen(false);
  };

  return (
    <Stack gap='2xl'>
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          영업 시간
          <RequiredMark />
        </span>
        <div className={S.businessHourRowsClassName}>
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
                {businessDayTriggerLabel}
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
                        selected={selectedBusinessDays.includes(businessDay)}
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
              inputMode='numeric'
              leadingIcon={<IcClockSizeSmallColor60 />}
              placeholder='00:00 - 00:00'
              required
              type='tel'
              trailingActionLabel='영업 시간 추가'
              trailingIcon={<IcPlusSizeSmallColor60 />}
              {...businessTimeField}
              value={businessTime}
              onChange={onBusinessTimeChange}
              onTrailingAction={() => setIsAdditionalBusinessTimeVisible(true)}
            />
          </div>
          {businessOperationErrorMessage && (
            <BusinessTimeErrorMessage message={businessOperationErrorMessage} />
          )}
          {shouldShowAdditionalBusinessTime && (
            <>
              <div className={S.businessHourControlClassName}>
                <div className={S.dropdownFieldClassName}>
                  <button
                    aria-controls={
                      isAdditionalBusinessDayMenuOpen ? additionalBusinessDayMenuId : undefined
                    }
                    aria-expanded={isAdditionalBusinessDayMenuOpen}
                    aria-haspopup='true'
                    className={S.dropdownTriggerClassName}
                    type='button'
                    onClick={() => setIsAdditionalBusinessDayMenuOpen((isOpen) => !isOpen)}
                  >
                    {additionalBusinessDayTriggerLabel}
                    {isAdditionalBusinessDayMenuOpen ? (
                      <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
                    ) : (
                      <IcChevronDown
                        aria-hidden='true'
                        className={S.dropdownTriggerIconClassName}
                      />
                    )}
                  </button>
                  {isAdditionalBusinessDayMenuOpen && (
                    <div className={S.dropdownPopoverClassName}>
                      <Dropdown
                        aria-label='추가 영업 요일'
                        id={additionalBusinessDayMenuId}
                        role='group'
                      >
                        {businessDayOptions.map((businessDay) => (
                          <Dropdown.Item
                            checkbox
                            key={businessDay}
                            selected={additionalBusinessDay === businessDay}
                            onClick={() => handleAdditionalBusinessDayOptionClick(businessDay)}
                          >
                            {businessDay}
                          </Dropdown.Item>
                        ))}
                      </Dropdown>
                    </div>
                  )}
                </div>
                <AddableField
                  aria-label='추가 영업 시간'
                  inputMode='numeric'
                  leadingIcon={<IcClockSizeSmallColor60 />}
                  placeholder='00:00 - 00:00'
                  type='tel'
                  trailingActionLabel='추가 영업 시간 제거'
                  trailingIcon={<IcLineHorizontalSizeSmall />}
                  {...additionalBusinessTimeField}
                  value={additionalBusinessTime}
                  onChange={onAdditionalBusinessTimeChange}
                  onTrailingAction={handleRemoveAdditionalBusinessTime}
                />
              </div>
              {additionalBusinessOperationErrorMessage && (
                <BusinessTimeErrorMessage message={additionalBusinessOperationErrorMessage} />
              )}
            </>
          )}
        </div>
      </div>

      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>휴무일</span>
        <div className={S.dropdownFieldClassName}>
          <button
            aria-controls={isHolidayDropdownOpen ? holidayDropdownId : undefined}
            aria-expanded={isHolidayDropdownOpen}
            aria-haspopup='true'
            className={S.dropdownTriggerClassName}
            type='button'
            onClick={() => setIsHolidayDropdownOpen((isOpen) => !isOpen)}
          >
            <span className={S.dropdownTriggerContentClassName}>
              <IcClockSizeSmallColor60 aria-hidden='true' />
              {holiday || '휴무일을 선택해주세요.'}
            </span>
            {isHolidayDropdownOpen ? (
              <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
            ) : (
              <IcChevronDown aria-hidden='true' className={S.dropdownTriggerIconClassName} />
            )}
          </button>
          {isHolidayDropdownOpen && (
            <div className={S.dropdownPopoverClassName}>
              <Dropdown aria-label='휴무일' id={holidayDropdownId} role='group'>
                {holidayOptions.map((holidayOption) => (
                  <Dropdown.Item
                    checkbox
                    key={holidayOption}
                    selected={holiday === holidayOption}
                    onClick={() => handleHolidayOptionClick(holidayOption)}
                  >
                    {holidayOption}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    </Stack>
  );
};
