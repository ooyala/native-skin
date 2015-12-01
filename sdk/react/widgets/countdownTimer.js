var React = require('react-native');
var {
	requireNativeComponent,
	NativeMethodsMixin,
	View,
} = React;

var CountdownView = React.createClass({
	mixins: [NativeMethodsMixin],

	propTypes: {
		...View.propTypes,

		time: React.PropTypes.number,
		radius: React.PropTypes.number,
		fillColor: React.PropTypes.string,
		fillAlpha: React.PropTypes.number,
		strokeColor: React.PropTypes.string,
		tapCancel: React.PropTypes.bool,

		onTimerUpdate: React.PropTypes.func,
		onTimerCompleted: React.PropTypes.func,
    onPress: React.PropTypes.func,
	},

	getDefaultProps: function() {
		return {
      time: 10,
      radius: 20,
      fillColor: '#000000',
      fillAlpha: 1.0,
      strokeColor: '#ffffff',
      tapCancel: false,
		};
	},

	_onTimerUpdate: function(event: Event) {
		this.props.onTimerUpdate && this.props.onTimerUpdate(event.nativeEvent);
	},

	_onTimerCompleted: function(event: Event) {
		this.props.onTimerCompleted && this.props.onTimerCompleted(event.nativeEvent);
	},

	_onPress: function(event: Event) {
		this.props.onPress && this.props.onPress(event.nativeEvent);
	},

	render: function() {
		return <NativeCountdownView
			{...this.props}
			onTimerUpdate={this._onTimerUpdate}
			onTimerCompleted={this._onTimerCompleted}
			onPress={this._onPress} />
	},
});

var NativeCountdownView = requireNativeComponent('CountdownView', CountdownView, {
	nativeOnly: {
		onTimerUpdate: true,
		onTimerCompleted: true,
		onPress: true,
	},
});

module.exports = CountdownView;