import { lazy, type ComponentType } from 'react';
import type { RouteObject } from 'react-router';

import { AsyncBoundary } from '@/app/boundaries';

export const createLazyRoute = <ModuleTypes, ExportNameTypes extends keyof ModuleTypes>(
  importer: () => Promise<ModuleTypes>,
  exportName: ExportNameTypes,
): Pick<RouteObject, 'Component'> => {
  const LazyRouteComponent = lazy(async () => {
    const routeModule = await importer();

    return {
      default: routeModule[exportName] as ComponentType,
    };
  });

  const BoundariedLazyRouteComponent = () => {
    return (
      <AsyncBoundary>
        <LazyRouteComponent />
      </AsyncBoundary>
    );
  };

  return {
    Component: BoundariedLazyRouteComponent,
  };
};
