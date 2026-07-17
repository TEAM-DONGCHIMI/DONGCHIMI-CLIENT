import { NearbyMarketsClientProvider } from './NearbyMarketsClientProvider';
import { NearbyMarketsPageContent } from './NearbyMarketsPageContent';

export const NearbyMarketsPage = () => {
  return (
    <NearbyMarketsClientProvider>
      <NearbyMarketsPageContent />
    </NearbyMarketsClientProvider>
  );
};
