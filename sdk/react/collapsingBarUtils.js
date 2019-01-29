'use strict';

// MARK: - Constants

const constants = {
  moreOptions: 'moreOptions',
  moveToMoreOptions: 'moveToMoreOptions',
  controlBar: 'controlBar',
  keep: 'keep'
};

const CollapsingBarUtils = {

  // @param barWidth numeric.
  // @param orderedItems array of left to right ordered items. Each item meets the skin's "button" schema.
  // @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
  // Note: items which do not meet the item spec will be removed and not appear in the results.
  collapse: function(barWidth, orderedItems) {
    if (isNaN(barWidth) || barWidth === undefined) {
      return {fit: orderedItems, overflow: []};
    }
    if (!orderedItems) {
       return [];
    }
    const validItems = orderedItems.filter(item => this._isValid(item));
    const result = this._collapse(barWidth, validItems);
    return result;
  },

  collapseForAudioOnly: function(orderedItems) {
    if (!orderedItems) {
      return [];
    }
    const filteredItems = orderedItems.filter(item => this._isValid(item));
    const result = {fit: [], overflow: filteredItems};
    return result;
  },

  _isValid: function(item) {
    const valid = (
      item &&
      item.location == constants.moreOptions ||
      (item.location == constants.controlBar &&
        item.whenDoesNotFit &&
        item.minWidth !== undefined &&
        item.minWidth >= 0)
    );
    return valid;
  },

  _collapse: function(barWidth, orderedItems) {
    const result = {fit: orderedItems.slice(), overflow: []};
    let usedWidth = orderedItems.reduce(function(p, c, i, a) {
      if (c.minWidth && c.isVisible) return p+c.minWidth;
      return p;
    }, 0);

    for (let i = orderedItems.length - 1; i >= 0; --i) {
      const item = orderedItems[i];
      if (this._isOnlyInMoreOptions(item)) {
        usedWidth = this._collapseLastItemMatching(result, item, usedWidth);
      }
    }

    for (let i = orderedItems.length - 1; i >= 0; --i) {
      const item = orderedItems[i];
      if (usedWidth > barWidth && this._isCollapsable(item)) {
        usedWidth = this._collapseLastItemMatching(result, item, usedWidth);
      }
    }
    return result;
  },

  _isOnlyInMoreOptions: function(item) {
    return item.location == constants.moreOptions;
  },

  _isCollapsable: function(item) {
    const collapsable = item.location == constants.controlBar &&
                        item.whenDoesNotFit &&
                        item.whenDoesNotFit != constants.keep;
    return collapsable;
  },

  _collapseLastItemMatching: function(results, item, usedWidth) {
    const index = results.fit.lastIndexOf(item);
    if (index > -1) {
      results.fit.splice(index, 1);
      results.overflow.unshift(item);
      if (item.minWidth) {
        usedWidth -= item.minWidth;
      }
    }
    return usedWidth;
  },

  _isOverflow: function(item) {
    return item.whenDoesNotFit && item.whenDoesNotFit == constants.moveToMoreOptions;
  }
};

export default CollapsingBarUtils;
