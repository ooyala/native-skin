// @flow

import {
  calculateLeftPositions, createRootStyle, createTriangleStyle, restrainLeftPositionWithinContainer,
} from './commonMarker.style';

describe('createRootStyle', () => {
  it('returns object matching snapshot', () => {
    expect(createRootStyle()).toMatchSnapshot();
  });
});

describe('createTriangleStyle', () => {
  it('returns object matching snapshot', () => {
    expect(createTriangleStyle()).toMatchSnapshot();
  });
});

describe('restrainLeftPositionWithinContainer', () => {
  it('calculates left offset to place element in the center of container', () => {
    expect(restrainLeftPositionWithinContainer(20, 50, 100)).toEqual(40);
  });

  it('keeps the element within the container on the left side', () => {
    expect(restrainLeftPositionWithinContainer(20, 5, 100)).toEqual(0);
  });

  it('keeps the element within the container on the right side', () => {
    expect(restrainLeftPositionWithinContainer(20, 95, 100)).toEqual(80);
  });
});

describe('calculateLeftPositions', () => {
  it('calculates left offsets for marker and triangle within it', () => {
    expect(calculateLeftPositions(20, 50, 100)).toEqual({
      rootLeft: 40,
      triangleLeft: 4,
    });
  });

  it('balances marker and triangle on the left edge', () => {
    expect(calculateLeftPositions(20, 5, 100)).toEqual({
      rootLeft: -3,
      triangleLeft: 2,
    });
  });

  it('balances marker and triangle on the right edge', () => {
    expect(calculateLeftPositions(20, 95, 100)).toEqual({
      rootLeft: 83,
      triangleLeft: 6,
    });
  });
});
