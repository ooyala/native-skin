'use strict';

jest.dontMock('../utils');

var Utils = require('../utils');

describe('utils test suite', function() {

  var localizableData = {
    defaultLanguage: 'en',
    en: {
      "Learn More": "Learn More",
      "CLOSED CAPTION PREVIEW": "CLOSED CAPTION PREVIEW",
      "Sample Text": "Sample Text",
      "Ad": "Ad",
      "Skip Ad": "Skip Ad",
      "LIVE": "LIVE",
      "GO LIVE": "GO LIVE",
      "CC Options": "CC Options",
      "On": "On",
      "Off": "Off",
    },
    es: {
      "Learn More" : "Más información",
      "CLOSED CAPTION PREVIEW": "VISTA PRELIMINAR DE SUBTÍTULOS",
      "Sample Text": "Texto de muestra",
      "Ad": "Anuncio",
      "Skip Ad": "Omitir anuncio",
      "LIVE": "EN VIVO",
      "GO LIVE": "TRANSMITIR EN VIVO",
      "CC Options": "Opciones de subtitulado",
      "On": "Sí",
      "Off": "No",
    },
  };

  it('tests localizedString() with edge cases', function() {
    var cases = [
      [null, null, null],
      [undefined, undefined, undefined],
      [[], undefined, undefined],
      [-12.12, null, {}],
      [{}, undefined, []],
    ];
    for (var i = 0; i < cases.length; i++) {
      var result = Utils.localizedString.apply(null, cases[i]);
      expect(result).toBeNull();
    }
  });

  it('tests localizedString() with not found preferredLocale', function() {
    var result = Utils.localizedString('not found', 'On', localizableData);
    expect(result).toBe('On');

    result = Utils.localizedString('not found', 'NotFound', localizableData);
    expect(result).toBe('NotFound');

    result = Utils.localizedString(null, 'NotFound', localizableData);
    expect(result).toBe('NotFound');

    result = Utils.localizedString(undefined, 'NotFound', localizableData);
    expect(result).toBe('NotFound');
  });

  it('tests localizedString() with not found stringId', function() {
    var result = Utils.localizedString('es', 'I do not have a key', localizableData);
    expect(result).toBe('I do not have a key');

    result = Utils.localizedString('es', null, localizableData);
    expect(result).toBeNull();

    result = Utils.localizedString('es', undefined, localizableData);
    expect(result).toBeNull();
  });

  it('tests localizedString() without localizableStrings', function() {
    var result = Utils.localizedString('es', 'LIVE', {});
    expect(result).toBe('LIVE');

    result = Utils.localizedString('es', 'LIVE', null);
    expect(result).toBe('LIVE');

    result = Utils.localizedString('es', 'LIVE', undefined);
    expect(result).toBe('LIVE');
  });

  it('tests localizedString() uses preferredLocale', function() {
    var result = Utils.localizedString('es', 'Sample Text', localizableData);
    expect(result).toBe('Texto de muestra');

    var result = Utils.localizedString('en', 'Sample Text', localizableData);
    expect(result).toBe('Sample Text');
  });

  it('tests localizedString() uses localizableData defaultLanguage', function() {
    var result = Utils.localizedString('fr', 'Ad', localizableData);
    expect(result).toBe('Ad');

    localizableData['defaultLanguage'] = 'es';
    var result = Utils.localizedString('kr', 'Ad', localizableData);
    expect(result).toBe('Anuncio');
  });

  it('tests shouldShowLandscape() with invalid arguments', function() {
    var cases = [
      [null, null],
      [undefined, undefined],
      [[], undefined],
      [-12.12, {}],
      ['number', ['x']],
    ];

    for (var i = 0; i < cases.length; i++) {
      var result = Utils.shouldShowLandscape.apply(null, cases[i]);
      expect(result).toBeNull();
    }
  });

  it('tests shouldShowLandscape() with valid arguments', function() {
    var result = Utils.shouldShowLandscape(-12,-14);
    expect(result).toBeNull();

    result = Utils.shouldShowLandscape(0, 0);
    expect(result).toBeFalsy();

    result = Utils.shouldShowLandscape(100, 101);
    expect(result).toBeFalsy();

    result = Utils.shouldShowLandscape(102, 101);
    expect(result).toBeTruthy();

    result = Utils.shouldShowLandscape(1280, 800);
    expect(result).toBeTruthy();

    result = Utils.shouldShowLandscape(800, 1280);
    expect(result).toBeFalsy();
  });
});