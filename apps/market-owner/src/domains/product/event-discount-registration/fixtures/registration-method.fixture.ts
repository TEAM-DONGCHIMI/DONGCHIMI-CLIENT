export const registrationMethodFixture = {
  excel: {
    descriptionLines: ['엑셀 파일 업로드를 통해', '여러 상품을 한 번에 등록할 수 있어요.'],
    downloadButtonLabel: '엑셀 양식 다운로드',
    guideLinkLabel: 'POS에서 엑셀 파일 받는 방법 보기',
    helperText: '*아래 양식에 맞춘 순서대로 상품이 등록됩니다.',
    supportedFormat: '지원 형식: .xlsx, .csv',
    title: '엑셀 파일 업로드',
    uploadButtonLabel: '엑셀 업로드',
  },
  excelUploadModal: {
    defaultLabel: '상품이 등록된 엑셀 파일을 선택해주세요.\n업로드하면 상품이 자동으로 등록됩니다.',
    description: '선택한 파일',
    fileSelectTooltipLabel: '지원 파일은 .xlsx, .csv예요.',
    heading: '엑셀 파일 업로드',
    selectedFileFallback: '선택된 파일이 없습니다.',
  },
  leaflet: {
    descriptionLines: ['전단 이미지를 업로드하면', 'AI가 상품 정보를 자동으로 등록해드려요.'],
    supportedFormat: '지원 형식: jpg, jpeg, png',
    title: '전단지 업로드',
    uploadButtonLabel: '전단지 업로드',
  },
  posGuide: {
    steps: [
      {
        description: '상품관리 또는 판매관리 화면에서 엑셀/CSV 추출 메뉴를 선택해주세요.',
        title: 'POS에서 엑셀 파일 다운로드',
      },
      {
        description: '다운로드한 파일을 .xlsx 또는 .csv 형식으로 저장해주세요.',
        title: 'CSV 또는 엑셀 파일 저장',
      },
      {
        description: '저장한 파일을 행사 할인 상품 등록 홈에서 업로드해주세요.',
        title: '동치미에 파일 업로드',
      },
    ],
    title: 'POS에서 엑셀 파일을\n이렇게 다운 받으시면 돼요.',
  },
  toast: {
    downloadError: '엑셀 양식 다운로드를 실패했습니다.',
    downloadSuccess: '엑셀 양식 다운로드 완료',
    leafletUnavailable: '아직 준비중인 기능이에요.',
  },
} as const;
