// @flow

const constants = {
  moreOptions: 'moreOptions',
  moveToMoreOptions: 'moveToMoreOptions',
  controlBar: 'controlBar',
  keep: 'keep',
};

const isCollapsible = item => (
  item.location === constants.controlBar && item.whenDoesNotFit && item.whenDoesNotFit !== constants.keep
);

const isOnlyInMoreOptions = item => (item.location === constants.moreOptions);

const isValid = item => (
  (item && item.location === constants.moreOptions)
  || (item.location === constants.controlBar && item.whenDoesNotFit && item.minWidth !== undefined
    && item.minWidth >= 0)
);

const collapseLastItemMatching = (results, item, usedWidth) => {
  const index = results.fit.lastIndexOf(item);
  let width = usedWidth;

  if (index > -1) {
    results.fit.splice(index, 1);
    results.overflow.unshift(item);

    if (item.minWidth) {
      width -= item.minWidth;
    }
  }

  return width;
};

// @param barWidth numeric.
// @param orderedItems array of left to right ordered items. Each item meets the skin's 'button' schema.
// @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
// Note: items which do not meet the item spec will be removed and not appear in the results.
export const collapse = (barWidth, orderedItems) => {
  if (Number.isNaN(barWidth) || barWidth === undefined) {
    return {
      fit: orderedItems,
      overflow: [],
    };
  }

  if (!orderedItems) {
    return [];
  }

  const validItems = orderedItems.filter(item => isValid(item));

  const result = {
    fit: validItems.slice(),
    overflow: [],
  };

  let usedWidth = validItems.reduce((p, c) => {
    if (c.minWidth && c.isVisible) {
      return p + c.minWidth;
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

export const collapseForAudioOnly = (orderedItems) => {
  if (!orderedItems) {
    return [];
  }

  const filteredItems = orderedItems.filter(item => isValid(item));

  return {
    fit: [],
    overflow: filteredItems,
  };
};
