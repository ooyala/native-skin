'use strict';

import React, { Component } from 'react';
var Log = require('./log');

var ReportMeasureMixin = {
  propTypes: {
    onMeasure: React.PropTypes.func,
  },

  componentDidMount: function() {
    setTimeout( this._requestMeasure ); // per github issues & stackoverflow.
  },

  _requestMeasure: function() {
    Log.verbose( "_requestMeasure" );
    this.refs.myself.measure( this._onMeasure );
  },

  _onMeasure: function( ox, oy, width, height, px, py ) {
    Log.verbose( "_onMeasure " + this.props.onMeasure );
    this.props.onMeasure && this.props.onMeasure( ox, oy, width, height, px, py );
  },
};

module.exports = ReportMeasureMixin;