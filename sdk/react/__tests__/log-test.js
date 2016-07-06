jest.dontMock( '../log.js' );

describe( 'Log Tests', function() {

  var Log;
  var Constants = require('../constants');
  var {
    LOG_LEVEL,
  } = Constants;

  beforeEach(function() {
    Log = require('../log.js');
  });

  it( 'Default Log is everything but verbose', function() {
    expect(Log.verbose("hello log")).toBe(false);
    expect(Log.log("hello log")).toBe(true);
    expect(Log.info("hello log")).toBe(true);
    expect(Log.warn("hello log")).toBe(true);
    expect(Log.error("hello log")).toBe(true);
  });

  it( 'VERBOSE Log is everything but verbose', function() {
    Log.setLogLevel(LOG_LEVEL.VERBOSE)
    expect(Log.verbose("hello log")).toBe(true);
    expect(Log.log("hello log")).toBe(true);
    expect(Log.info("hello log")).toBe(true);
    expect(Log.warn("hello log")).toBe(true);
    expect(Log.error("hello log")).toBe(true);
  });

  it( 'ERROR Log is everything but verbose', function() {
    Log.setLogLevel(LOG_LEVEL.ERROR)
    expect(Log.verbose("hello log")).toBe(false);
    expect(Log.log("hello log")).toBe(false);
    expect(Log.info("hello log")).toBe(false);
    expect(Log.warn("hello log")).toBe(false);
    expect(Log.error("hello log")).toBe(true);
  });

  it( 'NONE Log is everything but verbose', function() {
    Log.setLogLevel(LOG_LEVEL.NONE)
    expect(Log.verbose("hello log")).toBe(false);
    expect(Log.log("hello log")).toBe(false);
    expect(Log.info("hello log")).toBe(false);
    expect(Log.warn("hello log")).toBe(false);
    expect(Log.error("hello log")).toBe(false);
  });

});
