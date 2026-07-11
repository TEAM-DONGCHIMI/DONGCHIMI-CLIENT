import { Button, Flex, LineButton } from '@dongchimi/design-system/components';
import { IcDownload, IcUploadSizeSmallColor0 } from '@dongchimi/design-system/icons';

import * as S from './RegistrationMethodSection.css';

export interface RegistrationMethodSectionProps {
  onDownloadExcelTemplate: () => void;
  onOpenExcelUpload: () => void;
  onOpenPosGuide: () => void;
  onUploadLeaflet: () => void;
}

const registrationMethodTitleId = 'registration-method-title';
const registrationMethodExcelTitleId = 'registration-method-excel-title';
const registrationMethodLeafletTitleId = 'registration-method-leaflet-title';

export const RegistrationMethodSection = ({
  onDownloadExcelTemplate,
  onOpenExcelUpload,
  onOpenPosGuide,
  onUploadLeaflet,
}: RegistrationMethodSectionProps) => {
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
              엑셀 파일 업로드
            </h2>
            <p className={S.cardDescriptionClassName}>
              <span className={S.descriptionLineClassName}>엑셀 파일 업로드를 통해</span>
              <span className={S.descriptionLineClassName}>
                여러 상품을 한 번에 등록할 수 있어요.
              </span>
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
                엑셀 업로드
              </Button>
              <Button
                className={S.secondaryActionButtonClassName}
                color='assistive'
                leftIcon={<IcDownload />}
                onClick={onDownloadExcelTemplate}
                size='small'
                variant='outlined'
              >
                엑셀 양식 다운로드
              </Button>
              <LineButton className={S.guideLineButtonClassName} onClick={onOpenPosGuide}>
                POS에서 엑셀 파일 받는 방법 보기
              </LineButton>
            </Flex>
          </Flex>

          <Flex align='center' className={S.supportGroupClassName} direction='column'>
            <span className={S.supportTextClassName}>지원 형식: .xlsx, .csv</span>
            <span className={S.helperTextClassName}>
              *아래 양식에 맞춘 순서대로 상품이 등록됩니다.
            </span>
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
              전단지 업로드
            </h2>
            <p className={S.cardDescriptionClassName}>
              <span className={S.descriptionLineClassName}>전단 이미지를 업로드하면</span>
              <span className={S.descriptionLineClassName}>
                AI가 상품 정보를 자동으로 등록해드려요.
              </span>
            </p>
          </Flex>

          <Flex className={S.actionSlotClassName} direction='column'>
            <Button
              className={S.primaryActionButtonClassName}
              leftIcon={<IcUploadSizeSmallColor0 />}
              onClick={onUploadLeaflet}
              size='small'
            >
              전단지 업로드
            </Button>
          </Flex>

          <Flex align='center' className={S.supportGroupClassName} direction='column'>
            <span className={S.supportTextClassName}>지원 형식: jpg, jpeg, png</span>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
