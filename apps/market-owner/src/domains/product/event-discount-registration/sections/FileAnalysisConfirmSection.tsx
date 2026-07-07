import { Button, Flex } from '@dongchimi/design-system/components';

import * as S from './FileAnalysisConfirmSection.css';

export interface FileAnalysisConfirmSectionProps {
  analysisItems: readonly string[];
  fileName?: string;
  onCancel: () => void;
  onStartAnalysis: () => void;
}

const fileAnalysisConfirmTitleId = 'file-analysis-confirm-title';
const analysisItemLabelId = 'file-analysis-confirm-analysis-items';
const emptyFileNameText = '분석할 파일이 없습니다.';

export const FileAnalysisConfirmSection = ({
  analysisItems,
  fileName,
  onCancel,
  onStartAnalysis,
}: FileAnalysisConfirmSectionProps) => {
  const normalizedFileName = fileName?.trim();
  const isAnalysisFileAvailable = normalizedFileName != null && normalizedFileName.length > 0;

  return (
    <Flex
      as='section'
      aria-labelledby={fileAnalysisConfirmTitleId}
      className={S.cardClassName}
      direction='column'
    >
      <Flex align='center' as='header' className={S.headerClassName} direction='column'>
        <h1 className={S.titleClassName} id={fileAnalysisConfirmTitleId}>
          등록한 파일을 확인해주세요
        </h1>
        <p className={S.descriptionClassName}>등록한 내용을 AI가 분석합니다.</p>
      </Flex>

      <Flex className={S.analysisInfoClassName} direction='column'>
        <Flex align='center' className={S.fileNameBoxClassName} justify='center'>
          <span className={S.visuallyHiddenClassName}>등록 파일명</span>
          <span
            className={isAnalysisFileAvailable ? S.fileNameClassName : S.fileNameEmptyClassName}
          >
            {isAnalysisFileAvailable ? normalizedFileName : emptyFileNameText}
          </span>
        </Flex>

        <Flex align='center' className={S.analysisItemRowClassName} justify='center' wrap='wrap'>
          <span className={S.analysisItemLabelClassName} id={analysisItemLabelId}>
            AI 분석 항목
          </span>
          <Flex
            align='center'
            aria-labelledby={analysisItemLabelId}
            as='ul'
            className={S.analysisItemListClassName}
            justify='center'
            wrap='wrap'
          >
            {analysisItems.map((analysisItem) => (
              <li className={S.analysisItemClassName} key={analysisItem}>
                {analysisItem}
              </li>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex align='center' className={S.actionRowClassName} justify='center' wrap='wrap'>
        <Button
          className={S.actionButtonClassName}
          color='assistive'
          onClick={onCancel}
          size='small'
          variant='outlined'
        >
          취소
        </Button>
        <Button
          className={S.actionButtonClassName}
          disabled={!isAnalysisFileAvailable}
          onClick={onStartAnalysis}
          size='small'
        >
          분석 시작
        </Button>
      </Flex>
    </Flex>
  );
};
