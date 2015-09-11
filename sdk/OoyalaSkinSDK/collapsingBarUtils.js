/* @flow */

'use strict';

var CollapsingBarUtils = {

  // @param barWidth numeric.
  // @param orderedItems array of left to right ordered items. Each item meets the skin's "button" schema.
  // @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
  // Note: items which do not meet the item spec will be removed and not appear in the results.
  collapse: function( barWidth:number, orderedItems:Array<Object> ):Array<Object> {
    if( isNaN( barWidth ) || barWidth === undefined ) { return orderedItems; }
    if( ! orderedItems ) { return []; }
    var self = this;
    var validItems = orderedItems.filter( function(item) { return self._isValid(item); } );
    var r = this._collapse( barWidth, validItems );
    return r;
  },

  _isValid: function( item:Object ):boolean {
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

  _collapse: function( barWidth:number, orderedItems:Array<Object> ):Object {
    var r = { fit : orderedItems.slice(), overflow : [] };
    var usedWidth = orderedItems.reduce( function(p,c,i,a) { return p+c.minWidth; }, 0 );
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

  _isOnlyInMoreOptions: function( item:Object ):boolean {
    var must = item.location == "moreOptions";
    return must;
  },

  _isCollapsable: function( item:Object ):boolean {
    var collapsable = item.location == "controlBar" && item.whenDoesNotFit && item.whenDoesNotFit != "keep";
    return collapsable;
  },

  _collapseLastItemMatching: function( results:Object, item:Object, usedWidth:number ):number {
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

  _isOverflow: function( item:Object ):boolean {
    return item.whenDoesNotFit && item.whenDoesNotFit == "moveToMoreOptions";
  }

};

module.exports = CollapsingBarUtils;
