import { overlay } from 'overlay-kit';

import { MarketInformationLeaveDialog } from './MarketInformationLeaveDialog';

export const confirmMarketInformationLeave = () => {
  return overlay.openAsync<boolean>(({ close, isOpen, unmount }) => {
    const finish = (shouldLeave: boolean) => {
      close(shouldLeave);
      unmount();
    };

    return (
      <MarketInformationLeaveDialog
        open={isOpen}
        onCancel={() => finish(false)}
        onLeave={() => finish(true)}
      />
    );
  });
};
