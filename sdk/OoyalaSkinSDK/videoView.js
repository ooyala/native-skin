/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  Text,
  View,
  StyleSheet
} = React;

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var ProgressBar = require('./progressBar');
var ControlBar = require('./controlBar');
var ClosedCaptionsView = require('./closedCaptionsView');
var AnimationExperimental = require('AnimationExperimental');
var DiscoveryPanel = require('./discoveryPanel');
var SharePanel = require('./sharePanel');
var AdBar = require('./adBar');
var Constants = require('./constants');

var {
  ICONS,
  BUTTON_NAMES,
  IMG_URLS,
} = Constants;

var VideoView = React.createClass({
  getInitialState: function() {
    return {
      showControls: true,
      showSharePanel: false,
      showDiscoveryPanel: false, 
    };
  },

  propTypes: {
    rate: React.PropTypes.number,
    showPlay: React.PropTypes.bool,
    playhead: React.PropTypes.number,
    buffered: React.PropTypes.number,
    duration: React.PropTypes.number,
    discovery: React.PropTypes.array,
    ad: React.PropTypes.object,
    width: React.PropTypes.number,
    fullscreen: React.PropTypes.bool,
    onPress: React.PropTypes.func,
    onScrub: React.PropTypes.func,
    closedCaptionsLanguage: React.PropTypes.string,
    availableClosedCaptionsLanguages: React.PropTypes.array,
    captionJSON: React.PropTypes.object,
    onDiscoveryRow: React.PropTypes.func,
    onSocialButtonPress: React.PropTypes.func,
  },

  shouldShowDiscovery: function() {
    return this.state.showDiscoveryPanel && this.props.discovery;
  },

  onSocialButtonPress: function(socialType){
    this.props.onSocialButtonPress(socialType);
  },

  handlePress: function(name) {
    switch (name) {
      case BUTTON_NAMES.SOCIAL_SHARE: this._handleSocialShare(); break;
      case BUTTON_NAMES.PLAY_PAUSE:   this._handlePlayPause();   break;
      case BUTTON_NAMES.LEARNMORE: this.props.onPress(BUTTON_NAMES.LEARNMORE); break;
      default:                     this._handleGeneralPress();   break;
    }
    this.props.onPress(name);
  },

  _renderProgressBar: function() {
    if (this.props.ad) {
      return null;
    }
    return (<ProgressBar ref='progressBar' 
      playhead={this.props.playhead} 
      duration={this.props.duration}
      width={this.props.width}
      onScrub={(value)=>this.handleScrub(value)} />);
  },

  _renderControlBar: function() {
    if (this.props.ad) {
      return null;
    }

    var shouldShowClosedCaptionsButton =
      this.props.availableClosedCaptionsLanguages &&
      this.props.availableClosedCaptionsLanguages.length > 0;

    return (<ControlBar
      ref='controlBar' 
      showPlay={this.props.showPlay} 
      playhead={this.props.playhead} 
      duration={this.props.duration}
      primaryActionButton = {this.props.showPlay? ICONS.PLAY: ICONS.PAUSE}
      fullscreenButton = {this.props.fullscreen ? ICONS.COMPRESS : ICONS.EXPAND}
      onPress={(name) => this.handlePress(name)}
      showClosedCaptionsButton={shouldShowClosedCaptionsButton}
      isShow = {this.state.showControls}/>);
  },

  _renderAdBar: function() {
    if (this.props.ad) {
      var adTitle = this.props.ad.title ? this.props.ad.title : "";
      var count = this.props.ad.count ? this.props.ad.count : 1;
      var unplayed = this.props.ad.unplayedCount ? this.props.ad.unplayedCount : 0;
      var showLearnMore = this.props.ad.clickUrl && this.props.ad.clickUrl.length > 0;
      console.log("adbar title" + adTitle + "clickUrl " + this.props.ad.clickUrl);
      return (<AdBar
        title={adTitle}
        playhead={this.props.playhead} 
        duration={this.props.duration}
        count={count}
        index={count - unplayed}
        onPress={this.handlePress}
        showLearnMore={showLearnMore} />
      );
    }
    return null;
  },

  _handleSocialShare: function() {
    this.setState({showSharePanel:!this.state.showSharePanel});
    this.setState({showDiscoveryPanel:false});
  },

  _handlePlayPause: function() {
    if( this.props.rate > 0 ) { // were playing, now go to pause.
      this.setState({showSharePanel:false});
      this.setState({showDiscoveryPanel: true});
    }
    else {
      this.setState({showSharePanel:false});
      this.setState({showDiscoveryPanel: false});
    }
  },

  _handleGeneralPress: function() {
    this.setState({showSharePanel:false});
    this.setState({showDiscoveryPanel: false});
  },

  handleScrub: function(value) {
    this.props.onScrub(value);
  },

  getDefaultProps: function() {
    return {showPlay: true, playhead: 0, buffered: 0, duration: 1};
  },

  toggleControlBar: function() {
    for (var ref in this.refs) {
      console.log("ref is",ref);
      AnimationExperimental.startAnimation({
        node: this.refs[ref],
        duration: 500,
        property: 'opacity',
        easing: 'easingInOutExpo',
        toValue: this.state.showControls ? 0 : 1,
      });
    }
    this.setState({showControls:!this.state.showControls});
  },

  handleTouchEnd: function(event) {
    this.toggleControlBar();
  },

  render: function() {
    var adBar = this._renderAdBar();
    var placeholder;
    var socialButtonsArray = [{buttonName: BUTTON_NAMES.TWITTER, imgUrl: IMG_URLS.TWITTER},
                              {buttonName: BUTTON_NAMES.FACEBOOK, imgUrl: IMG_URLS.FACEBOOK}];

    if(this.state.showSharePanel){
      placeholder = (
        <View 
          style={styles.fullscreenContainer}>
          <SharePanel 
            isShow= {this.state.showSharePanel}
            socialButtons={socialButtonsArray}
            onSocialButtonPress={(socialType) => this.onSocialButtonPress(socialType)} />
        </View>
      );
    } else if (this.shouldShowDiscovery()) {
      placeholder = (
        <DiscoveryPanel
          isShow={this.state.showDiscoveryPanel}
          dataSource={this.props.discovery}
          onRowAction={(info) => this.props.onDiscoveryRow(info)}>
        </DiscoveryPanel>);
    } else {
      placeholder = (
        <View 
          style={styles.placeholder}
          onTouchEnd={(event) => this.handleTouchEnd(event)}>  
        </View>);
    }
    
    var progressBar = this._renderProgressBar();
    var controlBar = this._renderControlBar();  

    var ccOverlayHeight = windowSize.height - 60;
    var ccOpacity = this.props.closedCaptionsLanguage ? 1 : 0;
    var ccOverlay = this.shouldShowDiscovery() ?
      null :
      <ClosedCaptionsView
      style={[{position:'absolute', left:0, top:0, width:windowSize.width, height:ccOverlayHeight, opacity:ccOpacity, backgroundColor:'transparent'}]}
      captionJSON={this.props.captionJSON}
      onTouchEnd={(event) => this.handleTouchEnd(event)} />;

    return (
      <View style={styles.container}>
        {adBar}
        {placeholder}
        {progressBar}
        {controlBar}
        {ccOverlay}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  placeholder : {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
});

module.exports = VideoView