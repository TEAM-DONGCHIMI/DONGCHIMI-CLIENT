export type CursorPageTypes<ItemTypes> = Readonly<{
  items: readonly ItemTypes[];
  nextCursor: number | null;
}>;

export type PaginateByCursorParamsTypes = Readonly<{
  cursor?: number;
  pageSize: number;
}>;

export const paginateByCursor = <ItemTypes>(
  items: readonly ItemTypes[],
  { cursor, pageSize }: PaginateByCursorParamsTypes,
): CursorPageTypes<ItemTypes> => {
  const startIndex = cursor ?? 0;
  const endIndex = startIndex + pageSize;
  const pageItems = items.slice(startIndex, endIndex);
  const nextCursor = endIndex < items.length ? endIndex : null;

  return { items: pageItems, nextCursor };
};
