var React = require('react-native');

var buttonMargin = 10;

var styles = React.StyleSheet.create({
  topRight: {  
    position: 'absolute',
    top: buttonMargin,
    right: buttonMargin,
  },

  topLeft: {
    position: 'absolute',  
    top: buttonMargin,
    left: buttonMargin,
  },

  bottomRight: { 
    position: 'absolute',
    bottom: buttonMargin,
    right: buttonMargin,
  },

  bottomLeft: {  
    position: 'absolute',
    bottom: buttonMargin,
    left: buttonMargin,
  },

  buttonArea: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  buttonTextStyle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
  }
});

module.exports = styles;