'use strict';

var CollapsingBarUtils = {

  // @param barWidth numeric.
  // @param orderedItems array of left to right ordered items. Each item meets the skin's "button" schema.
  // @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
  // Note: items which do not meet the item spec will be removed and not appear in the results.
  collapse: function( barWidth, orderedItems ) {
    if( isNaN( barWidth ) || barWidth === undefined ) { return orderedItems; }
    if( ! orderedItems ) { return []; }
    var self = this;
    var validItems = orderedItems.filter( function(item) { return self._isValid(item); } );
    var r = this._collapse( barWidth, validItems );
    return r;
  },

  _isValid: function( item ) {
    var valid = (
      item &&
      item.location == "moreOptions" ||
      (item.location == "controlBar" &&
        item.whenDoesNotFit &&
        item.minWidth !== undefined &&
        item.minWidth >= 0)
    );
    return valid;
  },

  _collapse: function( barWidth, orderedItems ) {
    var r = { fit : orderedItems.slice(), overflow : [] };
    var usedWidth = orderedItems.reduce( function(p,c,i,a) {
      if (c.minWidth) return p+c.minWidth;
      return p;
    }, 0 );
    for( var i = orderedItems.length-1; i >= 0; --i ) {
      var item = orderedItems[ i ];
      if( this._isOnlyInMoreOptions(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
      if( usedWidth > barWidth && this._isCollapsable(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
    }
    return r;
  },

  _isOnlyInMoreOptions: function( item ) {
    var must = item.location == "moreOptions";
    return must;
  },

  _isCollapsable: function( item ) {
    var collapsable = item.location == "controlBar" && item.whenDoesNotFit && item.whenDoesNotFit != "keep";
    return collapsable;
  },

  _collapseLastItemMatching: function( results, item, usedWidth ) {
    var i = results.fit.lastIndexOf( item );
    if( i > -1 ) {
      results.fit.splice( i, 1 );
      results.overflow.unshift( item );
      if( item.minWidth ) {
        usedWidth -= item.minWidth;
      }
    }
    return usedWidth;
  },

  _isOverflow: function( item ) {
    return item.whenDoesNotFit && item.whenDoesNotFit == "moveToMoreOptions";
  }
};

module.exports = CollapsingBarUtils;