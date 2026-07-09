import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Dropdown, ListCell } from '@dongchimi/design-system/components';
import {
  IcChevronDownSizeSmall,
  IcCircleExclamationFillSizeXsmallColorNegative,
  IcCircleExclamationSizeXsmallColor60,
  IcPlus,
} from '@dongchimi/design-system/icons';
import { overlay } from 'overlay-kit';

import {
  DesktopUploadHeader,
  PaginationFooter,
  type UploadSegmentTypes,
} from '@/shared/components';

import type { RegistrationResultProduct } from '../fixtures';
import * as S from './RegistrationResultSection.css';

interface RegistrationResultSummary {
  completedCount: number;
  needsEditCount: number;
  totalCount: number;
}

export interface RegistrationResultSectionProps {
  pageSize: number;
  products: readonly RegistrationResultProduct[];
  summary: RegistrationResultSummary;
  onPrevious: () => void;
  onRegister: () => void;
}

const SEGMENT_LABELS: Record<UploadSegmentTypes, string> = {
  completed: '등록 완료',
  needsEdit: '수정 필요',
  total: '총 상품',
};

const ALL_CATEGORY_OPTION = '전체';
const CATEGORY_OPTIONS = [
  '채소･과일',
  '정육･달걀',
  '수산',
  '유제품',
  '간편식',
  '가공식품',
  '음료･주류',
  '생활용품',
  '기타',
] as const;
const PRODUCT_CATEGORY_OPTIONS = [ALL_CATEGORY_OPTION, ...CATEGORY_OPTIONS] as const;
const SORT_DROPDOWN_ID = 'registration-result-category-filter-dropdown';
const SORT_DROPDOWN_OVERLAY_ID = 'registration-result-sort-dropdown-overlay';
const CATEGORY_DROPDOWN_WIDTH = 206;
const CATEGORY_DROPDOWN_GAP = 8;
const CATEGORY_DROPDOWN_SCREEN_MARGIN = 16;

type ProductCategoryOptionTypes = (typeof PRODUCT_CATEGORY_OPTIONS)[number];
type CategoryOptionTypes = (typeof CATEGORY_OPTIONS)[number];

interface AnchorRect {
  bottom: number;
  left: number;
  top: number;
}

interface ImagePreview {
  alt: string;
  src: string;
}

const productCategoryGroupMap: Record<string, CategoryOptionTypes> = {
  김치: '가공식품',
  '김치/반찬': '가공식품',
  수산: '수산',
  정육: '정육･달걀',
  채소: '채소･과일',
};

const getAnchorRect = (element: HTMLElement): AnchorRect => {
  const rect = element.getBoundingClientRect();

  return {
    bottom: rect.bottom,
    left: rect.left,
    top: rect.top,
  };
};

const getDropdownMaxLeft = (anchorRect: AnchorRect) => {
  if (typeof window === 'undefined') {
    return anchorRect.left;
  }

  return window.innerWidth - CATEGORY_DROPDOWN_WIDTH - CATEGORY_DROPDOWN_SCREEN_MARGIN;
};

const getDropdownTop = (anchorRect: AnchorRect, dropdownHeight: number) => {
  const defaultTop = anchorRect.bottom + CATEGORY_DROPDOWN_GAP;
  const shouldFlip =
    typeof window !== 'undefined' &&
    defaultTop + dropdownHeight > window.innerHeight - CATEGORY_DROPDOWN_SCREEN_MARGIN;

  if (!shouldFlip) {
    return defaultTop;
  }

  return Math.max(
    CATEGORY_DROPDOWN_SCREEN_MARGIN,
    anchorRect.top - dropdownHeight - CATEGORY_DROPDOWN_GAP,
  );
};

const getDropdownPositionStyle = (anchorRect: AnchorRect, dropdownHeight: number) => {
  const maxLeft = getDropdownMaxLeft(anchorRect);
  const left = Math.max(CATEGORY_DROPDOWN_SCREEN_MARGIN, Math.min(anchorRect.left, maxLeft));
  const top = getDropdownTop(anchorRect, dropdownHeight);

  return { left, top };
};

const getProductCategoryGroup = (category: string): CategoryOptionTypes => {
  return productCategoryGroupMap[category] ?? '기타';
};

const getProductMatchesCategoryFilter = (
  category: string,
  selectedCategories: ReadonlySet<CategoryOptionTypes>,
) => {
  if (selectedCategories.size === 0) {
    return true;
  }

  return selectedCategories.has(getProductCategoryGroup(category));
};

const readFileAsDataUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);

        return;
      }

      reject(new Error('이미지 파일을 읽지 못했습니다.'));
    });
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(file);
  });
};

const getProductMatchesSearch = (
  product: RegistrationResultProduct,
  searchValue: string,
  category = product.category,
) => {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (normalizedSearchValue.length === 0) {
    return true;
  }

  return [product.productName, category, product.promotionText].some((value) =>
    value.toLowerCase().includes(normalizedSearchValue),
  );
};

const getCategoryOptionSelected = (
  option: ProductCategoryOptionTypes,
  selectedCategories: ReadonlySet<CategoryOptionTypes>,
) => {
  if (option === ALL_CATEGORY_OPTION) {
    return selectedCategories.size === 0;
  }

  return selectedCategories.has(option);
};

const getProductMatchesSegment = (
  product: RegistrationResultProduct,
  selectedSegment: UploadSegmentTypes,
) => {
  if (selectedSegment === 'total') {
    return true;
  }

  if (selectedSegment === 'completed') {
    return product.status === 'completed';
  }

  return product.status === 'needsEdit';
};

const getVisibleTotalCount = ({
  completedCount,
  needsEditCount,
  selectedSegment,
  totalCount,
}: RegistrationResultSummary & { selectedSegment: UploadSegmentTypes }) => {
  if (selectedSegment === 'completed') {
    return completedCount;
  }

  if (selectedSegment === 'needsEdit') {
    return needsEditCount;
  }

  return totalCount;
};

const getPaginationPages = (totalCount: number, pageSize: number) => {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  return Array.from({ length: Math.min(pageCount, 2) }, (_, index) => index + 1);
};

const ProductPreview = ({ productName }: { productName: string }) => {
  return (
    <span aria-hidden='true' className={S.productPreviewClassName}>
      {productName.slice(0, 1)}
    </span>
  );
};

const RequiredMark = () => {
  return <span className={S.requiredMarkClassName}>*</span>;
};

const CategoryFilterDropdown = ({
  anchorRect,
  isOpen,
  selectedCategories,
  close,
  unmount,
  onDismiss,
  onSelectionChange,
}: {
  anchorRect: AnchorRect;
  isOpen: boolean;
  selectedCategories: ReadonlySet<CategoryOptionTypes>;
  close: () => void;
  unmount: () => void;
  onDismiss: () => void;
  onSelectionChange: (selectedCategories: ReadonlySet<CategoryOptionTypes>) => void;
}) => {
  const [currentSelectedCategories, setCurrentSelectedCategories] = useState(
    () => new Set(selectedCategories),
  );

  if (!isOpen) {
    return null;
  }

  const dismiss = () => {
    close();
    unmount();
    onDismiss();
  };

  const handleOptionClick = (option: ProductCategoryOptionTypes) => {
    setCurrentSelectedCategories((previousSelectedCategories) => {
      if (option === ALL_CATEGORY_OPTION) {
        const nextSelectedCategories = new Set<CategoryOptionTypes>();

        onSelectionChange(nextSelectedCategories);

        return nextSelectedCategories;
      }

      const nextSelectedCategories = new Set(previousSelectedCategories);

      if (nextSelectedCategories.has(option)) {
        nextSelectedCategories.delete(option);
      } else {
        nextSelectedCategories.add(option);
      }

      onSelectionChange(nextSelectedCategories);

      return nextSelectedCategories;
    });
  };

  const positionStyle = getDropdownPositionStyle(anchorRect, 452);

  return (
    <div className={S.dropdownBackdropClassName} onClick={dismiss} role='presentation'>
      <Dropdown
        aria-label='카테고리 정렬'
        className={S.dropdownPanelClassName}
        id={SORT_DROPDOWN_ID}
        onClick={(event) => event.stopPropagation()}
        role='group'
        style={positionStyle}
      >
        {PRODUCT_CATEGORY_OPTIONS.map((option) => {
          const selected = getCategoryOptionSelected(option, currentSelectedCategories);

          return (
            <Dropdown.Item
              checkbox
              key={option}
              onClick={() => handleOptionClick(option)}
              selected={selected}
            >
              {option}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

const ProductCategoryDropdown = ({
  anchorRect,
  isOpen,
  selectedCategory,
  close,
  unmount,
  onSelect,
}: {
  anchorRect: AnchorRect;
  isOpen: boolean;
  selectedCategory: string;
  close: () => void;
  unmount: () => void;
  onSelect: (category: CategoryOptionTypes) => void;
}) => {
  if (!isOpen) {
    return null;
  }

  const dismiss = () => {
    close();
    unmount();
  };
  const positionStyle = getDropdownPositionStyle(anchorRect, 408);

  return (
    <div className={S.dropdownBackdropClassName} onClick={dismiss} role='presentation'>
      <Dropdown
        aria-label='상품 카테고리'
        className={S.dropdownPanelClassName}
        onClick={(event) => event.stopPropagation()}
        role='menu'
        style={positionStyle}
      >
        {PRODUCT_CATEGORY_OPTIONS.map((option) => {
          if (option === ALL_CATEGORY_OPTION) {
            return null;
          }

          return (
            <Dropdown.Item
              color='primary'
              key={option}
              onClick={() => {
                onSelect(option);
                dismiss();
              }}
              selected={selectedCategory === option}
            >
              {option}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

const HeaderSelectionButton = ({
  checked,
  mixed,
  onClick,
}: {
  checked: boolean;
  mixed: boolean;
  onClick: () => void;
}) => {
  let ariaChecked: boolean | 'mixed' = checked;
  let selectionState: 'checked' | 'mixed' | 'unchecked' = 'unchecked';
  let mixedMark = null;

  if (mixed) {
    ariaChecked = 'mixed';
    selectionState = 'mixed';
    mixedMark = <span className={S.selectionMixedMarkClassName} />;
  } else if (checked) {
    selectionState = 'checked';
  }

  return (
    <button
      aria-checked={ariaChecked}
      aria-label='현재 페이지 상품 전체 선택'
      className={S.headerSelectionButtonClassName}
      onClick={onClick}
      role='checkbox'
      type='button'
    >
      <span className={S.selectionBoxRecipe({ state: selectionState })}>{mixedMark}</span>
    </button>
  );
};

const TableHeader = ({
  allVisibleSelected,
  hasVisibleSelection,
  onSelectAll,
}: {
  allVisibleSelected: boolean;
  hasVisibleSelection: boolean;
  onSelectAll: () => void;
}) => {
  return (
    <div className={S.tableHeaderClassName}>
      <div className={S.headerCellClassName}>
        <HeaderSelectionButton
          checked={allVisibleSelected}
          mixed={hasVisibleSelection && !allVisibleSelected}
          onClick={onSelectAll}
        />
      </div>
      <div className={S.headerCellClassName}>
        <span>상품 이미지</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>상품명</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>판매가격</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>
        <span>카테고리</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>홍보문구</div>
      <div className={S.headerCellClassName}>
        <span>할인 기간</span>
        <RequiredMark />
      </div>
      <div className={S.headerCellClassName}>상태</div>
    </div>
  );
};

const RegistrationProductRow = ({
  category,
  checked,
  imagePreview,
  product,
  onCheckedChange,
  onCategoryClick,
  onImageFileChange,
}: {
  category: string;
  checked: boolean;
  imagePreview?: ImagePreview;
  product: RegistrationResultProduct;
  onCheckedChange: (checked: boolean) => void;
  onCategoryClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onImageFileChange: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const needsEdit = product.status === 'needsEdit';
  const productLabel = product.productName || '상품';
  const productImage = imagePreview ?? product.imageUrl;
  let mediaActionLabel: string | undefined;
  let helperText: string | undefined;
  let media: ReactNode = undefined;
  let mediaStatus: 'default' | 'error' = 'default';
  let mediaActionIcon: ReactNode = undefined;
  let helperIcon: ReactNode = undefined;
  let statusLabel = '등록 완료';
  let statusTone: 'negative' | 'neutral' = 'neutral';
  let priceUnit: '원' | undefined;

  if (product.price.length > 0) {
    priceUnit = '원';
  }

  if (needsEdit) {
    helperText = product.statusReason;
    helperIcon = <IcCircleExclamationSizeXsmallColor60 />;
    statusLabel = '수정 필요';
    statusTone = 'negative';
  }

  if (needsEdit && productImage == null) {
    mediaActionLabel = '이미지 추가';
    mediaActionIcon = <IcPlus />;
    mediaStatus = 'error';
  }

  if (productImage == null && !needsEdit) {
    media = <ProductPreview productName={product.productName} />;
  }

  if (productImage != null) {
    let imageAlt = productLabel;
    let imageSrc: string;

    if (typeof productImage === 'string') {
      imageSrc = productImage;
    } else {
      imageSrc = productImage.src;
    }

    if (product.imageAlt != null) {
      imageAlt = product.imageAlt;
    }

    if (imagePreview != null) {
      imageAlt = imagePreview.alt;
    }

    media = (
      <button
        aria-label={`${productLabel} 이미지 변경`}
        className={S.uploadedImageButtonClassName}
        onClick={() => fileInputRef.current?.click()}
        type='button'
      >
        <img alt={imageAlt} className={S.uploadedProductImageClassName} src={imageSrc} />
      </button>
    );
  }

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (file != null) {
      onImageFileChange(file);
    }

    event.currentTarget.value = '';
  };

  return (
    <>
      <ListCell
        aria-label={`${productLabel} 등록 결과`}
        checked={checked}
        checkboxLabel={`${productLabel} 선택`}
        fields={[
          {
            id: `${product.id}-name`,
            placeholder: '제품명을 입력하세요.',
            value: product.productName || undefined,
            width: '16rem',
          },
          {
            id: `${product.id}-price`,
            inputMode: 'numeric',
            placeholder: '가격을 입력하세요.',
            unit: priceUnit,
            value: product.price || undefined,
            width: '11.2rem',
          },
          {
            'aria-label': `${productLabel} 카테고리 선택`,
            id: `${product.id}-category`,
            onClick: onCategoryClick,
            trailingIcon: <IcChevronDownSizeSmall />,
            value: category,
            width: '12.8rem',
          },
          {
            id: `${product.id}-promotion`,
            placeholder: '홍보문구를 입력하세요.',
            value: product.promotionText || undefined,
            width: '31.9rem',
          },
          {
            id: `${product.id}-discount-period`,
            placeholder: 'YYYY-MM-DD ~  YYYY-MM-DD',
            value: product.discountPeriod || undefined,
            width: '19.8rem',
          },
        ]}
        helperIcon={helperIcon}
        helperText={helperText}
        media={media}
        mediaActionAriaLabel={`${productLabel} 이미지 추가`}
        mediaActionIcon={mediaActionIcon}
        mediaActionLabel={mediaActionLabel}
        mediaStatus={mediaStatus}
        onCheckedChange={onCheckedChange}
        onMediaAction={() => fileInputRef.current?.click()}
        statusLabel={statusLabel}
        statusTone={statusTone}
      />
      <input
        ref={fileInputRef}
        accept='image/*'
        aria-label={`${productLabel} 이미지 파일 선택`}
        className={S.hiddenFileInputClassName}
        onChange={handleImageInputChange}
        type='file'
      />
    </>
  );
};

export const RegistrationResultSection = ({
  pageSize,
  products,
  summary,
  onPrevious,
  onRegister,
}: RegistrationResultSectionProps) => {
  const [removedIds, setRemovedIds] = useState<ReadonlySet<string>>(new Set());
  const [imagePreviews, setImagePreviews] = useState<ReadonlyMap<string, ImagePreview>>(new Map());
  const [productCategories, setProductCategories] = useState<ReadonlyMap<string, string>>(
    new Map(),
  );
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ReadonlySet<CategoryOptionTypes>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedSegment, setSelectedSegment] = useState<UploadSegmentTypes>('needsEdit');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const currentProducts = useMemo(() => {
    return products.filter((product) => !removedIds.has(product.id));
  }, [products, removedIds]);
  const completedSampleCount = products.filter((product) => product.status === 'completed').length;
  const currentCompletedSampleCount = currentProducts.filter(
    (product) => product.status === 'completed',
  ).length;
  const removedCompletedCount = completedSampleCount - currentCompletedSampleCount;
  const needsEditCount = currentProducts.filter((product) => product.status === 'needsEdit').length;
  const completedCount = Math.max(0, summary.completedCount - removedCompletedCount);
  const removedCount = products.length - currentProducts.length;
  const totalCount = Math.max(0, summary.totalCount - removedCount);
  const currentSummary = { completedCount, needsEditCount, totalCount };
  const visibleTotalCount = getVisibleTotalCount({ ...currentSummary, selectedSegment });
  const registerDisabled = needsEditCount > 0;

  const filteredProducts = useMemo(() => {
    return currentProducts.filter((product) => {
      const category = productCategories.get(product.id) ?? product.category;

      return (
        getProductMatchesSegment(product, selectedSegment) &&
        getProductMatchesSearch(product, searchValue, category) &&
        getProductMatchesCategoryFilter(category, selectedCategories)
      );
    });
  }, [currentProducts, productCategories, searchValue, selectedCategories, selectedSegment]);

  const pageProducts = filteredProducts.slice(0, pageSize);
  const selectedCount = pageProducts.filter((product) => selectedIds.has(product.id)).length;
  const allVisibleSelected = pageProducts.length > 0 && selectedCount === pageProducts.length;
  const hasVisibleSelection = selectedCount > 0;
  let footerTotalCount = visibleTotalCount;
  let rangeStart = 0;

  if (searchValue.trim().length > 0) {
    footerTotalCount = filteredProducts.length;
  }

  if (footerTotalCount > 0) {
    rangeStart = 1;
  }

  const rangeEnd = Math.min(pageSize, footerTotalCount);
  const pages = getPaginationPages(footerTotalCount, pageSize);

  const handleSegmentChange = (nextSegment: UploadSegmentTypes) => {
    setSelectedSegment(nextSegment);
    setSelectedIds(new Set());
  };

  const handleSortClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (sortDropdownOpen) {
      overlay.close(SORT_DROPDOWN_OVERLAY_ID);
      overlay.unmount(SORT_DROPDOWN_OVERLAY_ID);
      setSortDropdownOpen(false);

      return;
    }

    const anchorRect = getAnchorRect(event.currentTarget);

    setSortDropdownOpen(true);
    overlay.open(
      ({ isOpen, close, unmount }) => (
        <CategoryFilterDropdown
          anchorRect={anchorRect}
          close={close}
          isOpen={isOpen}
          selectedCategories={selectedCategories}
          unmount={unmount}
          onDismiss={() => setSortDropdownOpen(false)}
          onSelectionChange={(nextSelectedCategories) => {
            setSelectedCategories(nextSelectedCategories);
            setSelectedIds(new Set());
          }}
        />
      ),
      { overlayId: SORT_DROPDOWN_OVERLAY_ID },
    );
  };

  const handleProductCategoryClick =
    (product: RegistrationResultProduct) => (event: MouseEvent<HTMLButtonElement>) => {
      const anchorRect = getAnchorRect(event.currentTarget);
      const selectedCategory = productCategories.get(product.id) ?? product.category;

      overlay.open(
        ({ isOpen, close, unmount }) => (
          <ProductCategoryDropdown
            anchorRect={anchorRect}
            close={close}
            isOpen={isOpen}
            selectedCategory={selectedCategory}
            unmount={unmount}
            onSelect={(category) =>
              setProductCategories((previousProductCategories) => {
                const nextProductCategories = new Map(previousProductCategories);

                nextProductCategories.set(product.id, category);

                return nextProductCategories;
              })
            }
          />
        ),
        { overlayId: `registration-result-category-dropdown-${product.id}` },
      );
    };

  const handleImageFileChange = (productId: string) => {
    return (file: File) => {
      void readFileAsDataUrl(file).then((src) => {
        setImagePreviews((previousImagePreviews) => {
          const nextImagePreviews = new Map(previousImagePreviews);

          nextImagePreviews.set(productId, { alt: file.name, src });

          return nextImagePreviews;
        });
      });
    };
  };

  const handleDeleteSelected = () => {
    setRemovedIds((previousRemovedIds) => {
      const nextRemovedIds = new Set(previousRemovedIds);

      selectedIds.forEach((productId) => nextRemovedIds.add(productId));

      return nextRemovedIds;
    });
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((previousSelectedIds) => {
        const nextSelectedIds = new Set(previousSelectedIds);

        pageProducts.forEach((product) => nextSelectedIds.delete(product.id));

        return nextSelectedIds;
      });

      return;
    }

    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      pageProducts.forEach((product) => nextSelectedIds.add(product.id));

      return nextSelectedIds;
    });
  };

  const handleRowCheckedChange = (productId: string, checked: boolean) => {
    setSelectedIds((previousSelectedIds) => {
      const nextSelectedIds = new Set(previousSelectedIds);

      if (checked) {
        nextSelectedIds.add(productId);
      } else {
        nextSelectedIds.delete(productId);
      }

      return nextSelectedIds;
    });
  };

  const renderProductRows = () => {
    if (pageProducts.length === 0) {
      return <div className={S.emptyStateClassName}>표시할 상품이 없습니다.</div>;
    }

    return pageProducts.map((product) => (
      <RegistrationProductRow
        category={productCategories.get(product.id) ?? product.category}
        checked={selectedIds.has(product.id)}
        imagePreview={imagePreviews.get(product.id)}
        key={product.id}
        onCategoryClick={handleProductCategoryClick(product)}
        onCheckedChange={(checked) => handleRowCheckedChange(product.id, checked)}
        onImageFileChange={handleImageFileChange(product.id)}
        product={product}
      />
    ));
  };

  return (
    <section aria-labelledby='registration-result-title' className={S.sectionClassName}>
      <div className={S.headingContainerClassName}>
        <h1 className={S.titleClassName} id='registration-result-title'>
          상품 결과 등록 확인
        </h1>
        <p className={S.descriptionClassName}>
          AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (
          <span className={S.requiredMarkClassName}>*</span>) 표시는 필수 입력 사항입니다.
        </p>
      </div>

      <div className={S.tableContainerClassName}>
        <DesktopUploadHeader
          completedCount={completedCount}
          needsEditCount={needsEditCount}
          onDeleteSelected={handleDeleteSelected}
          onSearch={setSearchValue}
          onSearchValueChange={setSearchValue}
          onSegmentChange={handleSegmentChange}
          onSortClick={handleSortClick}
          searchValue={searchValue}
          selectedCount={selectedCount}
          selectedSegment={selectedSegment}
          sortDropdownId={SORT_DROPDOWN_ID}
          sortOpen={sortDropdownOpen}
          totalCount={totalCount}
        />

        <div className={S.tableScrollClassName}>
          <div className={S.tableClassName}>
            <TableHeader
              allVisibleSelected={allVisibleSelected}
              hasVisibleSelection={hasVisibleSelection}
              onSelectAll={handleSelectAll}
            />

            <div
              aria-label={`${SEGMENT_LABELS[selectedSegment]} 상품 목록`}
              className={S.listClassName}
            >
              {renderProductRows()}
            </div>

            <PaginationFooter
              currentPage={1}
              nextDisabled={pages.length <= 1}
              pages={pages}
              previousDisabled
              rangeEnd={rangeEnd}
              rangeStart={rangeStart}
              totalCount={footerTotalCount}
            />
          </div>
        </div>
      </div>

      <div className={S.bottomBarClassName}>
        <p aria-live='polite' className={S.statusNoticeRecipe({ visible: registerDisabled })}>
          <IcCircleExclamationFillSizeXsmallColorNegative aria-hidden='true' />
          <span>확인이 필요한 상품이 있어요 ({needsEditCount})</span>
        </p>

        <div className={S.actionGroupClassName}>
          <button className={S.previousButtonClassName} onClick={onPrevious} type='button'>
            이전
          </button>
          <button
            className={S.registerButtonClassName}
            disabled={registerDisabled}
            onClick={onRegister}
            type='button'
          >
            등록 완료
          </button>
        </div>
      </div>
    </section>
  );
};
