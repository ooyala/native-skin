var React = require('react-native');
var {
	requireNativeComponent,
	NativeMethodsMixin,
  StyleSheet,
	View,
  TouchableHighlight,
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

  getInitialState: function() {
    return {
      canceled: false,
    };
  },

	_onTimerUpdate: function(event: Event) {
		this.props.onTimerUpdate && this.props.onTimerUpdate(event.nativeEvent);
	},

	_onTimerCompleted: function(event: Event) {
		this.props.onTimerCompleted && this.props.onTimerCompleted(event.nativeEvent);
	},

	_onPress: function() {
    if (this.props.tapCancel) {
      this.setState({canceled: true});
    }

		this.props.onPress && this.props.onPress();
	},

	renderCountdownView: function() {
		return <NativeCountdownView
			{...this.props}
      canceled={this.state.canceled}
      style={styles.countdown}
			onTimerUpdate={this._onTimerUpdate}
			onTimerCompleted={this._onTimerCompleted} />
	},

  renderClickableView: function() {
    return (<TouchableHighlight
      underlayColor='transparent'
      onPress={() => this._onPress()}>
      {this.renderCountdownView()}
    </TouchableHighlight>);
  },

  render: function() {
    if (this.props.onPress) {
      return this.renderClickableView();
    } else {
      return this.renderCountdownView();
    }
  },
});

var NativeCountdownView = requireNativeComponent('CountdownView', CountdownView, {
	nativeOnly: {
		onTimerUpdate: true,
		onTimerCompleted: true,
    canceled: true,
	},
});

var styles = StyleSheet.create({
  countdown: {
    height: 50,
    width: 50,
  }
});

module.exports = CountdownView;