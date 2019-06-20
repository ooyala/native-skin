// @flow

import type { ControlBarButton, Button } from '../types/Buttons';

type CollapsedItems = {
  fit: Array<Button>,
  overflow: Array<Button>,
};

const constants = {
  moreOptions: 'moreOptions',
  moveToMoreOptions: 'moveToMoreOptions',
  controlBar: 'controlBar',
  keep: 'keep',
};

const isCollapsible = (item: Button): boolean => (
  item.location === constants.controlBar && item.whenDoesNotFit && item.whenDoesNotFit !== constants.keep
);

const isOnlyInMoreOptions = (item: Button): boolean => (item.location === constants.moreOptions);

const isValid = (item: Button): boolean => (
  (item && item.location === constants.moreOptions)
  || (item.location === constants.controlBar && item.whenDoesNotFit && item.minWidth !== undefined
    && item.minWidth >= 0)
);

const collapseLastItemMatching = (results: CollapsedItems, item: Button, usedWidth: number): number => {
  const index = results.fit.lastIndexOf(item);
  let width = usedWidth;

  if (index > -1) {
    results.fit.splice(index, 1);
    results.overflow.unshift(item);

    // `minWidth` property available only if the item of the ControlBarButton type.
    if (item.minWidth) {
      width -= ((item: any): ControlBarButton).minWidth;
    }
  }

  return width;
};

// @param barWidth numeric.
// @param orderedItems array of left to right ordered items. Each item meets the skin's 'button' schema.
// @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
// Note: items which do not meet the item spec will be removed and not appear in the results.
export const collapse = (barWidth: number, orderedItems: Array<Button>): CollapsedItems => {
  if (Number.isNaN(barWidth) || barWidth === undefined) {
    return {
      fit: orderedItems,
      overflow: [],
    };
  }

  if (!orderedItems) {
    return { fit: [], overflow: [] };
  }

  const validItems = orderedItems.filter(item => isValid(item));

  const result = {
    fit: validItems.slice(),
    overflow: [],
  };

  let usedWidth = validItems.reduce((p, c) => {
    // `minWidth` property available only if the item of the ControlBarButton type, `isVisible` property could be added
    // dynamically.
    if (c.minWidth && (c: any).isVisible) {
      return p + ((c: any): ControlBarButton).minWidth;
    }

    return p;
  }, 0);

  for (let i = validItems.length - 1; i >= 0; i -= 1) {
    const item = validItems[i];

    if (isOnlyInMoreOptions(item)) {
      usedWidth = collapseLastItemMatching(result, item, usedWidth);
    }
  }

  for (let i = validItems.length - 1; i >= 0; i -= 1) {
    const item = validItems[i];

    if (usedWidth > barWidth && isCollapsible(item)) {
      usedWidth = collapseLastItemMatching(result, item, usedWidth);
    }
  }

  return result;
};

export const collapseForAudioOnly = (orderedItems: Array<Button>): CollapsedItems => {
  if (!orderedItems) {
    return { fit: [], overflow: [] };
  }

  const filteredItems = orderedItems.filter(item => isValid(item));

  return {
    fit: [],
    overflow: filteredItems,
  };
};
