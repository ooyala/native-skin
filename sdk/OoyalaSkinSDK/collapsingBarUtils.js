'use strict';

var CollapsingBarUtils = {

  // /**
  //  * @param barWidth numeric.
  //  * @param orderedItems left to right ordered items
  //  * of type {name:string, width:numeric, collapsable:boolean}.
  //  */
  collapse: function( barWidth, orderedItems ) {
    var fit = [];
    if( barWidth > 0 && orderedItems ) {
      var orderedItemsCopy = orderedItems.slice();
      var fitRequired = this._fitItems( barWidth, orderedItemsCopy, true );
      var fitBonus = this._fitItems( fitRequired.remainingWidth, orderedItemsCopy, false );
      fit = this._reorderItems( fitRequired, fitBonus, orderedItems );
    }
    return fit;
  },

  _fitItems: function( availableWidth, orderedItems, required ) {
    var fit = [];
    if( availableWidth && orderedItems ) {
      fit = orderedItems.filter( function(e) {
        var keep = e.width <= availableWidth && e.collapsable != required;
        if( keep ) { availableWidth -= e.width; }
        return keep;
      } );
    }
    var r = { fit:fit, remainingWidth:availableWidth };
    return r;
  },

  _reorderItems: function( fitRequired, fitBonus, orderedItems ) {
    var ordered = [];
    var rz = this._toNamedMap( fitRequired.fit );
    var bz = this._toNamedMap( fitBonus.fit );
    var oz = this._toNamedMap( orderedItems );
    this._visit( oz, function(o, k, e) {
      if( rz[e.name] ) { ordered.push( rz[e.name] ); }
      else if( bz[e.name] ) { ordered.push( bz[e.name] ); }
    } );
    return ordered;
  },

  _toNamedMap: function( items ) {
    var namedMap = {}
    this._visit( items, function(o, k, e) {
      if( e.name ) { namedMap[ e.name ] = e; }
    });
    return namedMap;
  },

  _visit: function( obj, visitFn ) {
    var keys = Object.keys( obj );
    for( var i = 0; i < keys.length; ++i ) {
      visitFn( obj, keys[i], obj[keys[i]] );
    }
  },

  TestSuite: {
    Assert: function() {
      var b = arguments[0];
      if( ! b ) {
        console.log( 'assert', arguments );
        throw new Error( "ASSERTION FAILED" );
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
      this.Assert( fit.length == 3, fit );
      this.Assert( fit.toString() == oi.toString(), fit );
    },

    Test_revKeepFixed: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B1_F100] );
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B1_F100, fit );
    },

    Test_keepFixed: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B4_C100] );
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B1_F100, fit );
    },

    Test_revOneCollapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B5_C1, this.B4_C100] )
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B5_C1 );
    },

    Test_oneCollapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100, this.B5_C1] )
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B4_C100 );
    },

    Test_collapsableFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B4_C100] )
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B4_C100 );
    },

    Test_allFixedFit: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B3_F1] );
      this.Assert( fit.length == 2, fit );
      this.Assert( fit[0] === this.B2_F1, fit );
      this.Assert( fit[1] === this.B3_F1, fit );
    },

    Test_revOneFixedFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1, this.B1_F100] );
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B2_F1, fit );
    },

    Test_oneFixedFits: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B1_F100, this.B2_F1] );
      this.Assert( fit.length == 1, fit );
      this.Assert( fit[0] === this.B1_F100, fit );
    },

    Test_keepItemMeetingSpec: function() {
      var fit = CollapsingBarUtils.collapse( 100, [this.B2_F1] );
      this.Assert( fit.length == 1, fit );
    },

    Test_discardItemNotMeetingSpec: function() {
      var fit = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}] );
      this.Assert( fit.length == 0, fit );
    },

    Test_discardItemsInZeroSpace: function() {
      var fit = CollapsingBarUtils.collapse( 0, [this.B2_F1, {name:"b1", collapsable:false}] );
      this.Assert( fit.length == 0, fit );
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
