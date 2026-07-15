import { describe, expect, it } from 'vitest';
import {
  createSvgFingerprint,
  createSvgShapeSignature,
  normalizeCurrentColorAttributes,
  normalizeSvgSource,
} from './icon-utils.mjs';

const createPathSvg = ({ body }) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`;
};

describe('icon-utils SVG normalization', () => {
  it('treats solid black and currentColor as the same fingerprint', () => {
    const blackIcon = createPathSvg({
      body: '<path fill="#000" d="M4 4h16v16H4z"/>',
    });
    const currentColorIcon = createPathSvg({
      body: '<path fill="currentColor" d="M4 4h16v16H4z"/>',
    });

    expect(createSvgFingerprint(blackIcon)).toBe(createSvgFingerprint(currentColorIcon));
    expect(normalizeSvgSource(blackIcon)).toContain('currentColor');
  });

  it('normalizes neutral icon colors in generated TSX attributes to currentColor', () => {
    const tsxIconSource = [
      '<path fill="var(--fill-0, #191F28)" />',
      "<path stroke='#1A1E27' />",
      '<path fill={"#000000"} />',
    ].join('\n');

    expect(normalizeCurrentColorAttributes(tsxIconSource)).toBe(
      [
        '<path fill="currentColor" />',
        "<path stroke='currentColor' />",
        '<path fill={"currentColor"} />',
      ].join('\n'),
    );
  });

  it('normalizes neutral icon colors in style declarations to currentColor', () => {
    const styledIconSource = [
      '<path style="fill:#191F28; stroke: var(--stroke-0, #1A1E27);" />',
      "const style = { fill: '#000', stroke: 'black' };",
    ].join('\n');

    expect(normalizeCurrentColorAttributes(styledIconSource)).toBe(
      [
        '<path style="fill: currentColor; stroke: currentColor;" />',
        "const style = { fill: 'currentColor', stroke: 'currentColor' };",
      ].join('\n'),
    );
  });

  it('preserves none and intentional non-neutral icon colors', () => {
    const coloredIconSource = [
      '<svg fill="none">',
      '<path fill="var(--fill-0, #15C47E)" stroke="#FF4242" />',
      '</svg>',
    ].join('\n');

    expect(normalizeCurrentColorAttributes(coloredIconSource)).toBe(coloredIconSource);
  });

  it('uses SVGO normalization before fingerprinting structurally equivalent paths', () => {
    const groupedIcon = createPathSvg({
      body: '<g id="figma-layer"><path fill="#000000" d="M4 4h16v16H4z"/></g>',
    });
    const flatIcon = createPathSvg({
      body: '<path d="M4 4H20V20H4z" fill="currentColor"/>',
    });

    expect(createSvgFingerprint(groupedIcon)).toBe(createSvgFingerprint(flatIcon));
  });

  it('returns null shape signature when the SVG has no path data', () => {
    const circleIcon = createPathSvg({
      body: '<circle cx="12" cy="12" r="8" fill="currentColor"/>',
    });

    expect(createSvgShapeSignature(circleIcon)).toBeNull();
  });

  it('can extract path shape signatures from TSX icon code snippets', () => {
    const tsxIconSource = [
      'const Icon = () => (',
      "  <svg viewBox='0 0 24 24'>",
      "    <path d='M4 4h16v16H4z' fill='currentColor' />",
      '  </svg>',
      ');',
    ].join('\n');

    expect(createSvgShapeSignature(tsxIconSource)).toBe(
      createSvgShapeSignature(
        createPathSvg({
          body: '<path d="M4 4h16v16H4z" fill="currentColor"/>',
        }),
      ),
    );
  });
});
