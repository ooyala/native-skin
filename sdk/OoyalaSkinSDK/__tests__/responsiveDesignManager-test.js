jest.dontMock( '../responsiveDesignManager.js' );

describe( 'Responsive Design Manager', function() {
  var ResponsiveDesignManager;

  var data = {
    thresholds: [320, 860]
  };

  beforeEach(function() {
    ResponsiveDesignManager = require('../responsiveDesignManager.js');
  });

  it( 'Get Size should return 0  when below lowest threshold ', function() {
    expect( ResponsiveDesignManager.getSize(0, data.thresholds) ).toBe( 0 );
    expect( ResponsiveDesignManager.getSize(1, data.thresholds) ).toBe( 0 );
    expect( ResponsiveDesignManager.getSize(319, data.thresholds) ).toBe( 0 );
    expect( ResponsiveDesignManager.getSize(320, data.thresholds) ).toBe( 0 );
  });

  it( 'Get Size should return 1  when above lowest threshold ', function() {
    expect( ResponsiveDesignManager.getSize(321, data.thresholds) ).toBe( 1 );
    expect( ResponsiveDesignManager.getSize(859, data.thresholds) ).toBe( 1 );
    expect( ResponsiveDesignManager.getSize(860, data.thresholds) ).toBe( 1 );
  });

  it( 'Get Size should return 2  when above next threshold ', function() {
    expect( ResponsiveDesignManager.getSize(861, data.thresholds) ).toBe( 2 );
    expect( ResponsiveDesignManager.getSize(100000, data.thresholds) ).toBe( 2 );
  });
});
