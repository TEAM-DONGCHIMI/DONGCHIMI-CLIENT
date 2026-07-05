import { recipe } from '@dongchimi/design-system/styles';
import { atomic, semantic, typography } from '@dongchimi/design-system/tokens';

export const cardText = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    width: '100%',
    padding: '1.4rem 1.8rem',
    borderRadius: 12,
    backgroundColor: semantic.primary.light,
  },
});

export const cardTextLabel = recipe({
  base: {
    ...typography['body-3-semibold'],
    color: atomic.neutral[60],
  },
});

export const cardTextMessage = recipe({
  base: {
    ...typography['body-2-medium'],
    color: atomic.neutral[90],
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});
