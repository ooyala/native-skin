// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    width: 120,
    height: 34,
    padding: 6,
    marginBottom: 10,
    borderRadius: 4,
    borderColor: '#B3B3B3',
    borderWidth: 1,
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 130,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  containerAudio: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#000000',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapperAudio: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'GillSans-Bold',
    color: '#FFFFFF',
    textAlign: 'left',
    marginHorizontal: 10,
  },
  titleAudio: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Bold',
    color: '#3eb5f7',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 24,
    fontFamily: 'GillSans',
    color: '#FFFFFF',
    textAlign: 'left',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  descriptionAudio: {
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 5,
    marginBottom: 10,
  },
});
