'use strict';

var CollapsingBarUtils = {

  // /**
  //  * @param barWidth numeric.
  //  * @param orderedItems left to right ordered items
  //  * of type {width:numeric, collapsable:boolean}.
  //  */
  collapse: function( barWidth, orderedItems ) {
    var fit = [];
    if( barWidth > 0 && orderedItems ) {
      var orderedItemsCopy = orderedItems.slice();
      var fitFixed = this._fitItems( barWidth, orderedItemsCopy, true );
      var fitBonus = this._fitItems( fitFixed.remainingWidth, orderedItemsCopy, false );
      fit = this._reorderItems( fitFixed, fitBonus, orderedItems );
    }
    return fit;
  },

  _fitItems: function( availableWidth, orderedItems, required ) {
    var fit = []
    if( availableWidth && orderedItems ) {
      this._visit( orderedItems, function( o, k, v ) {
        var keep = v.width <= availableWidth && v.collapsable != required;
        if( keep ) {
          availableWidth -= v.width;
          fit.push( v );
        }
      } );
    }
    var r = { fit:fit, remainingWidth:availableWidth };
    return r;
  },

  _reorderItems: function( fitFixed, fitBonus, orderedItems ) {
    var orderedFit = [];
    if( orderedItems ) {
      this._visit( orderedItems, function( o, k, v ) {
        if( fitFixed.fit.indexOf(v)>-1 || fitBonus.fit.indexOf(v)>-1 ) {
          orderedFit.push( v );
        }
      } );
    }
    return orderedFit;
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
        throw new Error( 'ASSERTION FAILED: ' + o1 + ' !== ' + o2 );
      }
    },

    // _F means 'fixed' or 'featured' (old terminology): not collapsible.
    // _C means 'collapsible'.
    B1_F100 : 	{name : "b1", collapsable : false,	width : 100},
    B2_F1 : 		{name : "b2", collapsable : false,	width : 1},
    B3_F1 : 		{name : "b3", collapsable : false,	width : 1},
    B4_C100 : 	{name : "b4", collapsable : true,	width : 100},
    B5_C1 : 		{name : "b5", collapsable : true,	width : 1},

    Test_merging: function() {
      var oi = [this.B2_F1, this.B5_C1, this.B3_F1 ];
      var fit = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( fit.length, 3 );
      this.AssertStrictEquals( fit.toString(), oi.toString() );
    },

    Test_revKeepFixed: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B1_F100] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B1_F100 );
    },

    Test_keepFixed: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B4_C100] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B1_F100 );
    },

    Test_revOneCollapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B5_C1, this.B4_C100] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B5_C1 );
    },

    Test_oneCollapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B5_C1] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B4_C100 );
    },

    Test_collapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B4_C100 );
    },

    Test_allFixedFit: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B3_F1] );
      this.AssertStrictEquals( fit.length, 2 );
      this.AssertStrictEquals( fit[0], this.B2_F1 );
      this.AssertStrictEquals( fit[1], this.B3_F1 );
    },

    Test_revOneFixedFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B1_F100] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B2_F1 );
    },

    Test_oneFixedFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B2_F1] );
      this.AssertStrictEquals( fit.length, 1 );
      this.AssertStrictEquals( fit[0], this.B1_F100 );
    },

    Test_keepItemMeetingSpec: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1] );
      this.AssertStrictEquals( fit.length, 1 );
    },

    Test_discardItemNotMeetingSpec: function() {
      var fit = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}] );
      this.AssertStrictEquals( fit.length, 0 );
    },

    Test_discardItemsInZeroSpace: function() {
      var fit = CollapsingBarUtils.collapse( 0, [this.B2_F1, {name:"b1", collapsable:false}] );
      this.AssertStrictEquals( fit.length, 0 );
    },

    Test_variousEdgeCasesDoNotExplode: function() {
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
