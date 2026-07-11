import { useCallback, useEffect, useId, useRef, type ChangeEvent, type FocusEvent } from 'react';

import { overlay, useOverlayData } from 'overlay-kit';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { AddableField, Dropdown, RequiredMark, Stack } from '@dongchimi/design-system/components';
import {
  IcChevronDown,
  IcChevronUp,
  IcCircleExclamationSizeSmallColorNegative,
  IcClockSizeSmallColor60,
  IcLineHorizontalSizeSmall,
  IcPlusSizeSmallColor60,
} from '@dongchimi/design-system/icons';

import { holidayOptions, marketInformationRegistrationFixture } from '../fixtures';
import * as S from './BusinessOperationSection.css';

const businessDayOptions = marketInformationRegistrationFixture.businessDays;

const getBusinessDayDisplayLabel = (businessDay: string) => {
  return businessDay.replace('요일', '');
};

const getBusinessDaysDisplayLabel = (businessDays: string[]) => {
  return businessDays.map(getBusinessDayDisplayLabel).join(', ');
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
  onBlur: () => void;
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
  onBlur,
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
  const businessDayDropdownRef = useRef<HTMLDivElement>(null);
  const additionalBusinessDayDropdownRef = useRef<HTMLDivElement>(null);
  const holidayDropdownRef = useRef<HTMLDivElement>(null);
  const businessDayMenuId = useId();
  const additionalBusinessDayMenuId = useId();
  const holidayDropdownId = useId();
  const additionalBusinessTimeId = useId();
  const overlayData = useOverlayData();
  const isBusinessDayMenuOpen = Boolean(overlayData[businessDayMenuId]?.isOpen);
  const isAdditionalBusinessDayMenuOpen = Boolean(overlayData[additionalBusinessDayMenuId]?.isOpen);
  const isHolidayDropdownOpen = Boolean(overlayData[holidayDropdownId]?.isOpen);
  const isAdditionalBusinessTimeVisible = Boolean(overlayData[additionalBusinessTimeId]?.isOpen);
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

  const openOverlay = useCallback((overlayId: string) => {
    overlay.open(() => null, { overlayId });
  }, []);

  const closeOverlay = useCallback((overlayId: string) => {
    overlay.close(overlayId);
    overlay.unmount(overlayId);
  }, []);

  const closeAllDropdownOverlays = useCallback(() => {
    closeOverlay(businessDayMenuId);
    closeOverlay(additionalBusinessDayMenuId);
    closeOverlay(holidayDropdownId);
  }, [additionalBusinessDayMenuId, businessDayMenuId, closeOverlay, holidayDropdownId]);

  const toggleOverlay = useCallback(
    (overlayId: string, isOpen: boolean) => {
      if (isOpen) {
        closeOverlay(overlayId);

        return;
      }

      openOverlay(overlayId);
    },
    [closeOverlay, openOverlay],
  );

  useEffect(() => {
    const hasOpenDropdown =
      isBusinessDayMenuOpen || isAdditionalBusinessDayMenuOpen || isHolidayDropdownOpen;

    if (!hasOpenDropdown) {
      return;
    }

    const dropdownRefs = [
      businessDayDropdownRef,
      additionalBusinessDayDropdownRef,
      holidayDropdownRef,
    ];

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const isInsideDropdown = dropdownRefs.some((dropdownRef) =>
        dropdownRef.current?.contains(target),
      );

      if (!isInsideDropdown) {
        closeAllDropdownOverlays();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllDropdownOverlays();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    closeAllDropdownOverlays,
    isAdditionalBusinessDayMenuOpen,
    isBusinessDayMenuOpen,
    isHolidayDropdownOpen,
  ]);

  const handleBusinessDayOptionClick = (businessDay: string) => {
    if (selectedBusinessDays.includes(businessDay)) {
      const nextSelectedBusinessDays = selectedBusinessDays.filter(
        (selectedDay) => selectedDay !== businessDay,
      );

      onBusinessDayChange(nextSelectedBusinessDays.join(', '));

      return;
    }

    const nextSelectedBusinessDays = [...selectedBusinessDays, businessDay];

    onBusinessDayChange(nextSelectedBusinessDays.join(', '));
  };

  const handleHolidayOptionClick = (holiday: string) => {
    onHolidayChange(holiday);
    closeOverlay(holidayDropdownId);
  };

  const handleAdditionalBusinessDayOptionClick = (businessDay: string) => {
    onAdditionalBusinessDayChange(businessDay);
    closeOverlay(additionalBusinessDayMenuId);
  };

  const handleRemoveAdditionalBusinessTime = () => {
    closeOverlay(additionalBusinessTimeId);
    onAdditionalBusinessTimeRemove();
    closeOverlay(additionalBusinessDayMenuId);
  };

  const handleBusinessHoursBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    onBlur();
  };

  return (
    <Stack gap='2xl'>
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>
          영업 시간
          <RequiredMark />
        </span>
        <div className={S.businessHourRowsClassName} onBlur={handleBusinessHoursBlur}>
          <div className={S.businessHourRowGroupClassName}>
            {/* 기본 영업 시간 */}
            <div className={S.businessHourControlClassName}>
              <div ref={businessDayDropdownRef} className={S.dropdownFieldClassName}>
                <button
                  aria-controls={isBusinessDayMenuOpen ? businessDayMenuId : undefined}
                  aria-expanded={isBusinessDayMenuOpen}
                  aria-haspopup='true'
                  className={S.dropdownTriggerClassName}
                  type='button'
                  onClick={() => toggleOverlay(businessDayMenuId, isBusinessDayMenuOpen)}
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
                onTrailingAction={() => openOverlay(additionalBusinessTimeId)}
              />
            </div>
            {businessOperationErrorMessage && (
              <BusinessTimeErrorMessage message={businessOperationErrorMessage} />
            )}
          </div>
          {shouldShowAdditionalBusinessTime && (
            <div className={S.businessHourRowGroupClassName}>
              {/* 추가 영업 시간 */}
              <div className={S.businessHourControlClassName}>
                <div ref={additionalBusinessDayDropdownRef} className={S.dropdownFieldClassName}>
                  <button
                    aria-controls={
                      isAdditionalBusinessDayMenuOpen ? additionalBusinessDayMenuId : undefined
                    }
                    aria-expanded={isAdditionalBusinessDayMenuOpen}
                    aria-haspopup='true'
                    className={S.dropdownTriggerClassName}
                    type='button'
                    onClick={() =>
                      toggleOverlay(additionalBusinessDayMenuId, isAdditionalBusinessDayMenuOpen)
                    }
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
            </div>
          )}
        </div>
      </div>

      {/* 휴무일 선택 */}
      <div className={S.inlineFieldClassName}>
        <span className={S.inlineLabelClassName}>휴무일</span>
        <div ref={holidayDropdownRef} className={S.dropdownFieldClassName}>
          <button
            aria-controls={isHolidayDropdownOpen ? holidayDropdownId : undefined}
            aria-expanded={isHolidayDropdownOpen}
            aria-haspopup='true'
            className={S.dropdownTriggerClassName}
            type='button'
            onClick={() => toggleOverlay(holidayDropdownId, isHolidayDropdownOpen)}
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
