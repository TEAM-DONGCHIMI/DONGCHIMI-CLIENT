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

const useDisclosure = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((currentIsOpen) => !currentIsOpen);

  return { close, isOpen, open, toggle };
};

interface BusinessHoursProps<TFieldName extends 'businessTime' | 'additionalBusinessTime'> {
  day: string;
  time: string;
  errorMessage?: string;
  timeField: UseFormRegisterReturn<TFieldName>;
  onDayChange: (businessDay: string) => void;
  onTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface AdditionalBusinessHoursProps extends BusinessHoursProps<'additionalBusinessTime'> {
  onRemove: () => void;
}

interface HolidaySelectionProps {
  value: string;
  onChange: (holiday: string) => void;
}

export interface BusinessOperationSectionProps {
  additionalBusinessHours: AdditionalBusinessHoursProps;
  businessHours: BusinessHoursProps<'businessTime'>;
  holidaySelection: HolidaySelectionProps;
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
  additionalBusinessHours,
  businessHours,
  holidaySelection,
}: BusinessOperationSectionProps) => {
  const {
    day: businessDay,
    errorMessage: businessOperationErrorMessage,
    onDayChange: onBusinessDayChange,
    onTimeChange: onBusinessTimeChange,
    time: businessTime,
    timeField: businessTimeField,
  } = businessHours;
  const {
    day: additionalBusinessDay,
    errorMessage: additionalBusinessOperationErrorMessage,
    onDayChange: onAdditionalBusinessDayChange,
    onRemove: onAdditionalBusinessTimeRemove,
    onTimeChange: onAdditionalBusinessTimeChange,
    time: additionalBusinessTime,
    timeField: additionalBusinessTimeField,
  } = additionalBusinessHours;
  const { onChange: onHolidayChange, value: holiday } = holidaySelection;
  const businessDayMenu = useDisclosure();
  const holidayDropdown = useDisclosure();
  const additionalBusinessTimeDisclosure = useDisclosure();
  const additionalBusinessDayMenu = useDisclosure();
  const businessDayMenuId = useId();
  const additionalBusinessDayMenuId = useId();
  const holidayDropdownId = useId();
  const shouldShowAdditionalBusinessTime =
    additionalBusinessTimeDisclosure.isOpen ||
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
    holidayDropdown.close();
  };

  const handleAdditionalBusinessDayOptionClick = (businessDay: string) => {
    onAdditionalBusinessDayChange(businessDay);
    additionalBusinessDayMenu.close();
  };

  const handleRemoveAdditionalBusinessTime = () => {
    additionalBusinessTimeDisclosure.close();
    onAdditionalBusinessTimeRemove();
    additionalBusinessDayMenu.close();
  };

  return (
    <Stack gap='2xl'>
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          영업 시간
          <RequiredMark />
        </span>
        <div className={S.businessHourRowsClassName}>
          {/* 기본 영업 시간 */}
          <div className={S.businessHourControlClassName}>
            <div className={S.dropdownFieldClassName}>
              <button
                aria-controls={businessDayMenu.isOpen ? businessDayMenuId : undefined}
                aria-expanded={businessDayMenu.isOpen}
                aria-haspopup='true'
                className={S.dropdownTriggerClassName}
                type='button'
                onClick={businessDayMenu.toggle}
              >
                {businessDayTriggerLabel}
                {businessDayMenu.isOpen ? (
                  <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
                ) : (
                  <IcChevronDown aria-hidden='true' className={S.dropdownTriggerIconClassName} />
                )}
              </button>
              {businessDayMenu.isOpen && (
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
              onTrailingAction={additionalBusinessTimeDisclosure.open}
            />
          </div>
          {businessOperationErrorMessage && (
            <BusinessTimeErrorMessage message={businessOperationErrorMessage} />
          )}
          {shouldShowAdditionalBusinessTime && (
            <>
              {/* 추가 영업 시간 */}
              <div className={S.businessHourControlClassName}>
                <div className={S.dropdownFieldClassName}>
                  <button
                    aria-controls={
                      additionalBusinessDayMenu.isOpen ? additionalBusinessDayMenuId : undefined
                    }
                    aria-expanded={additionalBusinessDayMenu.isOpen}
                    aria-haspopup='true'
                    className={S.dropdownTriggerClassName}
                    type='button'
                    onClick={additionalBusinessDayMenu.toggle}
                  >
                    {additionalBusinessDayTriggerLabel}
                    {additionalBusinessDayMenu.isOpen ? (
                      <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
                    ) : (
                      <IcChevronDown
                        aria-hidden='true'
                        className={S.dropdownTriggerIconClassName}
                      />
                    )}
                  </button>
                  {additionalBusinessDayMenu.isOpen && (
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

      {/* 휴무일 선택 */}
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>휴무일</span>
        <div className={S.dropdownFieldClassName}>
          <button
            aria-controls={holidayDropdown.isOpen ? holidayDropdownId : undefined}
            aria-expanded={holidayDropdown.isOpen}
            aria-haspopup='true'
            className={S.dropdownTriggerClassName}
            type='button'
            onClick={holidayDropdown.toggle}
          >
            <span className={S.dropdownTriggerContentClassName}>
              <IcClockSizeSmallColor60 aria-hidden='true' />
              {holiday || '휴무일을 선택해주세요.'}
            </span>
            {holidayDropdown.isOpen ? (
              <IcChevronUp aria-hidden='true' className={S.dropdownTriggerIconClassName} />
            ) : (
              <IcChevronDown aria-hidden='true' className={S.dropdownTriggerIconClassName} />
            )}
          </button>
          {holidayDropdown.isOpen && (
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
