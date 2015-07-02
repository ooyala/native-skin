'use strict';

var React = require('react-native');

var ReportMeasureMixin = {
  propTypes: {
    onMeasure: React.PropTypes.func,
  },

  componentDidMount: function() {
    setTimeout( this._requestMeasure ); // per github issues & stackoverflow.
  },

  _requestMeasure: function() {
    console.log( "_requestMeasure" );
    this.refs.myself.measure( this._onMeasure );
  },

  _onMeasure: function( ox, oy, width, height, px, py ) {
    console.log( "_onMeasure " + this.props.onMeasure );
    this.props.onMeasure && this.props.onMeasure( ox, oy, width, height, px, py );
  },
};

module.exports = ReportMeasureMixin;