var React = require('react-native');

var styles = React.StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  sharePanelNW: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  sharePanelTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Arial-BoldMT',
    color: 'white',
    margin: 20
  },

  sharePanelButtonRow: {
    flexDirection:'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    margin: 20
  },

  socialButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = styles;

