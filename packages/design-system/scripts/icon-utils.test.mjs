import { describe, expect, it } from 'vitest';
import {
  createSvgFingerprint,
  createSvgShapeSignature,
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
