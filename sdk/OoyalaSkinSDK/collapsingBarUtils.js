'use strict';

var CollapsingBarUtils = {

  // /**
  //  * @param barWidth numeric.
  //  * @param orderedItems array of left to right ordered items,
  //  * each having at least properies minWidth:numeric, collapsable:boolean.
  //  * @return {fit:[items that fit in the barWidth], dropped:[items that did not fit]}.
  //  */
  collapse: function( barWidth, orderedItems ) {
    var fit = [];
    var dropped = [];
    if( barWidth > 0 && orderedItems ) {
      var nonCollapsableItems = orderedItems.filter( function(e) { return ! e.collapsable; } );
      var collapsableItems = orderedItems.filter( function(e) { return e.collapsable; } );
      var fitFixed = this._fitItems( barWidth, nonCollapsableItems );
      var fitBonus = this._fitItems( fitFixed.remainingWidth, collapsableItems );
      fit = this._reorderItems( fitFixed.items, fitBonus.items, orderedItems );
      dropped = fitFixed.remainingItems.concat( fitBonus.remainingItems );
    }
    return {fit:fit, dropped:dropped};
  },

  // /**
  //  * @param remainingWidth numeric.
  //  * @param orderedItems array of left to right ordered items,
  //  * each having at least properies minWidth:numeric, collapsable:boolean.
  //  * @return {items:[items that fit in the original remainingWidth],
  //  * remainingWidth:final remaining width,
  //  * remainingItems:[items that did not fit in original remainingWidth]}
  //  */
  _fitItems: function( remainingWidth, orderedItems ) {
    var fitItems = []
    var remainingItems = orderedItems.slice();
    if( remainingWidth && orderedItems ) {
      this._visit( orderedItems, function( o, k, v ) {
        if( v.minWidth <= remainingWidth ) {
          remainingWidth -= v.minWidth;
          fitItems.push( v );
          remainingItems.splice( remainingItems.indexOf(v), 1 );
        }
      } );
    }
    var r = { items:fitItems, remainingWidth:remainingWidth, remainingItems:remainingItems };
    return r;
  },

  _reorderItems: function( fixedItems, bonusItems, orderedItems ) {
    var fitItems = [];
    if( orderedItems ) {
      this._visit( orderedItems, function( o, k, v ) {
        if( fixedItems.indexOf(v)>-1 || bonusItems.indexOf(v)>-1 ) {
          fitItems.push( v );
        }
      } );
    }
    return fitItems;
  },

  _visit: function( obj, visitFn ) {
    if( obj ) {
      var keys = Object.keys( obj );
      for( var i = 0; i < keys.length; ++i ) {
        visitFn( obj, keys[i], obj[keys[i]] );
      }
    }
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
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.dropped.length, 1 );
      this.AssertStrictEquals( results.dropped[0], this.B1_F100 );
    },

    TestDropped_dropFixedSingle: function() {
      var oi = [this.B1_F100];
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.dropped.length, 1 );
      this.AssertStrictEquals( results.dropped.toString(), oi.toString() );
    },

    TestFit_merging: function() {
      var oi = [this.B2_F1, this.B5_C1, this.B3_F1 ];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.fit.length, 3 );
      this.AssertStrictEquals( results.fit.toString(), oi.toString() );
    },

    TestFit_revKeepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B1_F100] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B1_F100 );
    },

    TestFit_keepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B4_C100] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B1_F100 );
    },

    TestFit_revOneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B5_C1, this.B4_C100] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B5_C1 );
    },

    TestFit_oneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B5_C1] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B4_C100 );
    },

    TestFit_collapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_C100] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B4_C100 );
    },

    TestFit_allFixedFit: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B3_F1] );
      this.AssertStrictEquals( results.fit.length, 2 );
      this.AssertStrictEquals( results.fit[0], this.B2_F1 );
      this.AssertStrictEquals( results.fit[1], this.B3_F1 );
    },

    TestFit_revOneFixedFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B1_F100] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B2_F1 );
    },

    TestFit_oneFixedFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B2_F1] );
      this.AssertStrictEquals( results.fit.length, 1 );
      this.AssertStrictEquals( results.fit[0], this.B1_F100 );
    },

    TestFit_keepItemMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_F1] );
      this.AssertStrictEquals( results.fit.length, 1 );
    },

    TestFit_discardItemNotMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}] );
      this.AssertStrictEquals( results.fit.length, 0 );
    },

    TestFit_discardItemsInZeroSpace: function() {
      var results = CollapsingBarUtils.collapse( 0, [this.B2_F1, {name:"b1", collapsable:false}] );
      this.AssertStrictEquals( results.fit.length, 0 );
    },

    TestFit_variousEdgeCasesDoNotExplode: function() {
      var sizes = [undefined, null, -1, 0, -4096, 4096];
      var items = [undefined, null, [], ["foo"]];
      for( var si = 0; si < sizes.length; ++si ) {
        for( var ii = 0; ii < items.length; ++ii ) {
          // not saying it returns anything sane, just doesn't die.
          CollapsingBarUtils.collapse( sizes[si], items[ii] );
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
      console.log( "ran", keys.length, "tests." );
    },
  },
};

module.exports = CollapsingBarUtils;
