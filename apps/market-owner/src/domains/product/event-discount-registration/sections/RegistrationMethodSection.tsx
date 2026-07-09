import { Button, Flex, LineButton } from '@dongchimi/design-system/components';
import { IcDownload, IcUploadSizeSmallColor0 } from '@dongchimi/design-system/icons';

import type { registrationMethodFixture } from '../fixtures';
import * as S from './RegistrationMethodSection.css';

type RegistrationMethodFixtureTypes = typeof registrationMethodFixture;

export interface RegistrationMethodSectionProps {
  fixture: Pick<RegistrationMethodFixtureTypes, 'excel' | 'leaflet'>;
  onDownloadExcelTemplate: () => void;
  onOpenExcelUpload: () => void;
  onOpenPosGuide: () => void;
  onUploadLeaflet: () => void;
}

const registrationMethodTitleId = 'registration-method-title';
const registrationMethodExcelTitleId = 'registration-method-excel-title';
const registrationMethodLeafletTitleId = 'registration-method-leaflet-title';

const DescriptionLines = ({ lines }: { lines: readonly string[] }) => (
  <>
    {lines.map((line) => (
      <span className={S.descriptionLineClassName} key={line}>
        {line}
      </span>
    ))}
  </>
);

export const RegistrationMethodSection = ({
  fixture,
  onDownloadExcelTemplate,
  onOpenExcelUpload,
  onOpenPosGuide,
  onUploadLeaflet,
}: RegistrationMethodSectionProps) => {
  const { excel, leaflet } = fixture;

  return (
    <Flex
      as='section'
      aria-labelledby={registrationMethodTitleId}
      className={S.sectionClassName}
      direction='column'
    >
      <Flex align='center' as='header' className={S.headerClassName} direction='column'>
        <h1 className={S.titleClassName} id={registrationMethodTitleId}>
          상품 등록
        </h1>
        <p className={S.descriptionClassName}>상품을 등록할 방식을 선택해주세요.</p>
      </Flex>

      <Flex align='center' className={S.contentClassName} justify='center' wrap='wrap'>
        <Flex
          as='article'
          aria-labelledby={registrationMethodExcelTitleId}
          className={S.methodCardClassName}
          direction='column'
        >
          <span aria-hidden='true' className={S.imagePlaceholderClassName} />
          <Flex align='center' className={S.cardTextGroupClassName} direction='column'>
            <h2 className={S.cardTitleClassName} id={registrationMethodExcelTitleId}>
              {excel.title}
            </h2>
            <p className={S.cardDescriptionClassName}>
              <DescriptionLines lines={excel.descriptionLines} />
            </p>
          </Flex>

          <Flex className={S.actionSlotClassName} direction='column'>
            <Flex className={S.excelActionGroupClassName} direction='column'>
              <Button
                className={S.primaryActionButtonClassName}
                leftIcon={<IcUploadSizeSmallColor0 />}
                onClick={onOpenExcelUpload}
                size='small'
              >
                {excel.uploadButtonLabel}
              </Button>
              <Button
                className={S.secondaryActionButtonClassName}
                color='assistive'
                leftIcon={<IcDownload />}
                onClick={onDownloadExcelTemplate}
                size='small'
                variant='outlined'
              >
                {excel.downloadButtonLabel}
              </Button>
              <LineButton className={S.guideLineButtonClassName} onClick={onOpenPosGuide}>
                {excel.guideLinkLabel}
              </LineButton>
            </Flex>
          </Flex>

          <Flex align='center' className={S.supportGroupClassName} direction='column'>
            <span className={S.supportTextClassName}>{excel.supportedFormat}</span>
            <span className={S.helperTextClassName}>{excel.helperText}</span>
          </Flex>
        </Flex>

        <span className={S.dividerTextClassName}>또는</span>

        <Flex
          as='article'
          aria-labelledby={registrationMethodLeafletTitleId}
          className={S.methodCardClassName}
          direction='column'
        >
          <span aria-hidden='true' className={S.imagePlaceholderClassName} />
          <Flex align='center' className={S.cardTextGroupClassName} direction='column'>
            <h2 className={S.cardTitleClassName} id={registrationMethodLeafletTitleId}>
              {leaflet.title}
            </h2>
            <p className={S.cardDescriptionClassName}>
              <DescriptionLines lines={leaflet.descriptionLines} />
            </p>
          </Flex>

          <Flex className={S.actionSlotClassName} direction='column'>
            <Button
              className={S.primaryActionButtonClassName}
              leftIcon={<IcUploadSizeSmallColor0 />}
              onClick={onUploadLeaflet}
              size='small'
            >
              {leaflet.uploadButtonLabel}
            </Button>
          </Flex>

          <Flex align='center' className={S.supportGroupClassName} direction='column'>
            <span className={S.supportTextClassName}>{leaflet.supportedFormat}</span>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
