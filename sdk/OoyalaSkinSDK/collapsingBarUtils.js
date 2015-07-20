'use strict';

var CollapsingBarUtils = {

  // /**
  //  * @param barWidth numeric.
  //  * @param orderedItems array of left to right ordered items.
  //  * Each item must have a collapsable:boolean property. It must
  //  * also have a minWidth value that is named @param minWidthPropertyName.
  //  * @param minWidthPropertyName string name of property use read for minWidth of item.
  //  * @return {fit:[items that fit in the barWidth], dropped:[items that did not fit]}.
  //  */
  collapse: function( barWidth, orderedItems, minWidthPropertyName ) {
    if( ! orderedItems ) { return []; }
    if( arguments.length != 3 ) { return orderedItems; }
    return this._collapse( barWidth, orderedItems, minWidthPropertyName );
  },

  _collapse: function( barWidth, orderedItems, minWidthPropertyName ) {
    var r = { fit : orderedItems.slice(), dropped : [] };
    var usedWidth = r.fit.reduce( function(p, b, i, a) { return p+b[minWidthPropertyName]||0; }, 0 );
    if( orderedItems ) {
      for( var i = orderedItems.length-1; i >= 0; i-- ) {
        var b = orderedItems[i];
        usedWidth = this._filterItem( barWidth, usedWidth, r.fit, r.dropped, b, minWidthPropertyName );
      }
    }
    return r;
  },

  _filterItem: function( barWidth, usedWidth, fit, dropped, item, minWidthPropertyName ) {
    if( ! item[minWidthPropertyName] ) {
      dropped.push( item );
      fit.splice( fit.indexOf(item), 1 );
    }
    if( usedWidth > barWidth && item.collapsable ) {
      dropped.push( item );
      fit.splice( fit.indexOf(item), 1 );
      usedWidth = usedWidth - dropped[minWidthPropertyName];
    }
    return usedWidth;
  },

  TestSuite: {
    Assert: function() {
      var b = arguments[0];
      if( ! b ) {
        throw new Error( 'ASSERTION FAILED: ' + JSON.stringify(arguments) );
      }
    },
    AssertStrictEquals: function() {
      var o1 = arguments[0];
      var o2 = arguments[1];
      if( o1 !== o2 ) {
        throw new Error( 'ASSERTION FAILED: ' + JSON.stringify(o1) + ' !== ' + JSON.stringify(o2) );
      }
    },

    // _F means 'fixed' or 'featured' (old terminology): not collapsible.
    // _C means 'collapsible'.
    B1_F100 : 	{name : "b1", collapsable : false,	minWidth : 100},
    B2_F1 : 		{name : "b2", collapsable : false,	minWidth : 1},
    B3_F1 : 		{name : "b3", collapsable : false,	minWidth : 1},
    B4_C100 : 	{name : "b4", collapsable : true,	minWidth : 100},
    B5_C1 : 		{name : "b5", collapsable : true,	minWidth : 1},

    TestDropped_dropFixedMixed: function() {
      var oi = [this.B1_F100, this.B5_C1];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 1 );
      this.AssertStrictEquals( results.dropped[0], this.B5_C1 );
    },

    TestDropped_dropCollapsableSingle: function() {
      var oi = [this.B4_C100];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 1 );
      this.AssertStrictEquals( results.dropped[0], oi[0] );
    },

    TestDropped_dropFixedSingle: function() {
      var oi = [this.B1_F100];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 0 );
    },

    TestFit_merging: function() {
      var oi = [this.B2_F1, this.B5_C1, this.B3_F1 ];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 3 );
      this.AssertStrictEquals( results.fit.toString(), oi.toString() );
    },

    TestFit_revKeepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B1_F100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B1_F100 );
    },

    TestFit_keepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B4_C100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B1_F100 );
    },

    TestFit_revOneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B5_C1, this.B4_C100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B5_C1 );
    },

    TestFit_oneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B5_C1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B4_C100 );
    },

    TestFit_collapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B4_C100 );
    },

    TestFit_allFixedFit: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B3_F1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2 );
      this.AssertStrictEquals( results.fit[0], this.B2_F1 );
      this.AssertStrictEquals( results.fit[1], this.B3_F1 );
    },

    TestFit_revOneFixedFits: function() {
      var oi = [this.B2_F1, this.B1_F100];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2 );
      this.AssertStrictEquals( results.fit.toString(), oi.toString() );
    },

    TestFit_oneFixedFits: function() {
      var oi = [this.B1_F100, this.B2_F1];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2 );
      this.AssertStrictEquals( results.fit.toString(), oi.toString() );
    },

    TestFit_keepItemMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_F1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
    },

    TestFit_discardItemNotMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 0 );
    },

    TestFit_discardItemsInZeroSpace_fixed: function() {
      var results = CollapsingBarUtils.collapse( 0, [this.B2_F1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B2_F1 );
    },

    TestFit_discardItemsInZeroSpace_collapsable: function() {
      var results = CollapsingBarUtils.collapse( 0, [this.B4_C100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 0 );
    },

    TestFit_variousEdgeCasesDoNotExplode: function() {
      var sizes = [undefined, null, -1, 0, -4096, 4096];
      var items = [undefined, null, [], ["foo"]];
      for( var si = 0; si < sizes.length; ++si ) {
        for( var ii = 0; ii < items.length; ++ii ) {
          // not saying it returns anything sane, just doesn't die.
          CollapsingBarUtils.collapse( sizes[si], items[ii], 'minWidth' );
        }
      }
    },

    Run: function() {
      var keys = Object.keys( this ).sort();
      for( var i = 0; i < keys.length; ++i ) {
        var k = keys[i];
        var isFunction = typeof(this[k]) == "function";
        var isTest = k.indexOf("Test") == 0;
        if( isFunction && isTest ) {
          console.log( "+++", k );
          this[k]();
          console.log( "---",  k, "PASS!" );
        }
      }
    },
  },
};

module.exports = CollapsingBarUtils;
