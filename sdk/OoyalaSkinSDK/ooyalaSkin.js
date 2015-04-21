/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  AppRegistry,
  DeviceEventEmitter,
  SliderIOS,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var eventBridge = require('NativeModules').OOReactBridge;

var OoyalaSkin = React.createClass({
  getInitialState() {
    return {title:"Bunny", playhead:0, duration:0, rate:0};
  },

  handlePress() { 
    eventBridge.onPress();
  }, 

  handleScrub: function(value) {
    eventBridge.onScrub(value);
  },

  update(e) {
    console.log("update received, new state is %o", e);
    this.setState({playhead:e.playhead, duration:e.duration, rate:e.rate, title:e.title});
  },

  getPercentage: function() {
    if (this.state.duration > 0) {
      return this.state.playhead / this.state.duration;
    } else {
      return 0;
    }   
  },

  componentWillMount: function() {
    console.log("componentWillMount");
    var subscription = DeviceEventEmitter.addListener(
      'playerState', 
      (reminder) => this.update(reminder)
    );
  },

  componentDidMount: function() {
    // Animation.startAnimation(this.refs['this'], 1000, 2000, 'linear', {opacity: 1});
  },

  componentWillUnmount: function() {
    subscription.remove;
  },

  render: function() {
    console.log("render gets called");
    var percent = this.getPercentage();
    var playIcon = '\uf04c';
    var pauseIcon = '\uf04b';
    var iconString = this.state.rate > 0 ? playIcon : pauseIcon;
    var isSpin = this.state.rate > 0 ? false : true;

    return (
      <View ref='this' style={styles.container}>
        
        <Text style={styles.title}>Title:{this.state.title}</Text>
        <Text style={styles.label}>{this.state.playhead}</Text>
        <ActivityIndicatorIOS
          animating={isSpin}
          size="large"
        />
        
        <View style={styles.bottomBar}>
          <TouchableHighlight
            onPress={this.handlePress}
            underlayColor="transparent"
            activeOpacity={0.5}>
            <Text style={styles.icon}>{iconString}</Text>
          </TouchableHighlight>
          <SliderIOS
            style={styles.slider}
            value={percent}
            onValueChange={(value) => this.handleScrub({value: value})} />
          <Text style={styles.label}>{this.state.duration}</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'rgba(128,128,0,255)',
    color: 'red',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 5,
    width: 20,
    height: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'AvenirNext-DemiBold',
  },
  slider: {
    width: 100,
    margin: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
     justifyContent: 'center',
    fontFamily: 'AvenirNext-DemiBold',
  },
  icon: {
    width: 80,
    height: 80,
    fontSize: 80,
    textAlign: 'center',
    color: 'green',
    fontFamily: 'fontawesome',
  },
});

AppRegistry.registerComponent('OoyalaSkin', () => OoyalaSkin);
