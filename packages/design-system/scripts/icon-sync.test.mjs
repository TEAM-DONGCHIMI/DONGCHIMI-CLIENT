import { describe, expect, it } from 'vitest';
import { createIconIndexSource } from './icon-utils.mjs';
import { buildIconManifest, diffIconSync, serializeIconManifest } from './icon-sync.mjs';

const svgEntry = (fileName, fingerprint) => ({ fileName, fingerprint });

// A fully in-sync fixture: one source SVG with a matching component, barrel and
// manifest entry.
const syncedFixture = () => {
  const svgEntries = [svgEntry('ic-home.svg', 'fp-home')];
  return {
    svgEntries,
    generatedFiles: ['IcHome.tsx'],
    indexSource: createIconIndexSource(['ic-home.svg']),
    manifestSource: serializeIconManifest(buildIconManifest(svgEntries)),
  };
};

describe('buildIconManifest', () => {
  it('maps file names to fingerprints sorted by file name', () => {
    const manifest = buildIconManifest([
      svgEntry('ic-home.svg', 'fp-home'),
      svgEntry('ic-arrow.svg', 'fp-arrow'),
    ]);

    expect(Object.keys(manifest)).toEqual(['ic-arrow.svg', 'ic-home.svg']);
    expect(manifest['ic-home.svg']).toBe('fp-home');
  });
});

describe('diffIconSync', () => {
  it('returns no errors when svg, generated component, index and manifest agree', () => {
    expect(diffIconSync(syncedFixture())).toEqual([]);
  });

  it('flags a source SVG whose content changed since last generate', () => {
    const fixture = syncedFixture();
    // Manifest still holds the old fingerprint; the SVG now hashes differently.
    fixture.svgEntries = [svgEntry('ic-home.svg', 'fp-home-edited')];

    const errors = diffIconSync(fixture);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('outdated generated icon: ic-home.svg');
  });

  it('flags a missing generated component when an SVG has no Ic*.tsx', () => {
    const fixture = syncedFixture();
    fixture.generatedFiles = [];

    const errors = diffIconSync(fixture);

    expect(errors).toContain('missing generated icon component: src/icons/generated/IcHome.tsx');
  });

  it('flags a stale generated component that has no source SVG', () => {
    const fixture = syncedFixture();
    fixture.generatedFiles = ['IcHome.tsx', 'IcGhost.tsx'];

    const errors = diffIconSync(fixture);

    expect(errors).toContain('stale generated icon component: src/icons/generated/IcGhost.tsx');
  });

  it('flags a stale barrel export', () => {
    const fixture = syncedFixture();
    fixture.indexSource = createIconIndexSource(['ic-home.svg', 'ic-arrow.svg']);

    const errors = diffIconSync(fixture);

    expect(errors.some((error) => error.startsWith('stale icon index'))).toBe(true);
  });

  it('flags a missing manifest', () => {
    const fixture = syncedFixture();
    fixture.manifestSource = null;

    const errors = diffIconSync(fixture);

    expect(errors.some((error) => error.startsWith('missing icon manifest'))).toBe(true);
  });

  it('flags a stale manifest entry for a removed SVG', () => {
    const fixture = syncedFixture();
    fixture.manifestSource = serializeIconManifest(
      buildIconManifest([svgEntry('ic-home.svg', 'fp-home'), svgEntry('ic-old.svg', 'fp-old')]),
    );

    const errors = diffIconSync(fixture);

    expect(errors).toContain(
      'stale manifest entry: ic-old.svg (run `pnpm --filter @dongchimi/design-system icons:generate`)',
    );
  });
});
