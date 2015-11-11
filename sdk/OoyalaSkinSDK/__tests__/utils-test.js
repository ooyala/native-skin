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

  it('tests localizedString() - helloworld', function() {
    expect(localizableData['defaultLanguage']).toBe('en');
  });
});