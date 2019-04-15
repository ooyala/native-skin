// @flow

import responsiveMultiplier from './responsiveMultiplier';

describe('responsiveMultiplier', () => {
  it('small', () => {
    expect(responsiveMultiplier(100, 100, [1, 2, 3], [200, 800])).toBe(100);
  });

  it('small edge case', () => {
    expect(responsiveMultiplier(200, 100, [1, 2, 3], [200, 800])).toBe(100);
  });

  it('medium', () => {
    expect(responsiveMultiplier(500, 100, [1, 2, 3], [200, 800])).toBe(200);
  });

  it('medium default', () => {
    expect(responsiveMultiplier(500, 100)).toBe(100);
  });

  it('large edge case', () => {
    expect(responsiveMultiplier(800, 100, [1, 2, 3], [200, 800])).toBe(200);
  });

  it('large', () => {
    expect(responsiveMultiplier(900, 100, [1, 2, 3], [200, 800])).toBe(300);
  });

  it('overflow', () => {
    expect(responsiveMultiplier(900, 100, [1], [200, 800])).toBe(100);
  });
});
