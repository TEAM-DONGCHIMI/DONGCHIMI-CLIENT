export type CursorPageTypes<ItemTypes> = Readonly<{
  items: readonly ItemTypes[];
  nextCursor: string | null;
}>;

export type PaginateByCursorParamsTypes = Readonly<{
  cursor?: string;
  pageSize: number;
}>;

export const paginateByCursor = <ItemTypes>(
  items: readonly ItemTypes[],
  { cursor, pageSize }: PaginateByCursorParamsTypes,
): CursorPageTypes<ItemTypes> => {
  const startIndex = cursor ? Number(cursor) : 0;
  const endIndex = startIndex + pageSize;
  const pageItems = items.slice(startIndex, endIndex);
  const nextCursor = endIndex < items.length ? String(endIndex) : null;

  return { items: pageItems, nextCursor };
};
