// @flow

import * as Utils from './utils';
import localizableData from './__fixtures__/localizableData';

describe('localizedString', () => {
  it('tests localizedString() with edge cases', () => {
    const cases = [
      [null, null, null],
      [undefined, undefined, undefined],
      [[], undefined, undefined],
      [-12.12, null, {}],
      [{}, undefined, []],
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const result = Utils.localizedString(null, cases[i]);

      expect(result).toBeNull();
    }
  });

  it('tests localizedString() with not found preferredLocale', () => {
    let result = Utils.localizedString('not found', 'On', localizableData);
    expect(result).toBe('On');

    result = Utils.localizedString('not found', 'NotFound', localizableData);
    expect(result).toBe('NotFound');

    result = Utils.localizedString(null, 'NotFound', localizableData);
    expect(result).toBe('NotFound');

    result = Utils.localizedString(undefined, 'NotFound', localizableData);
    expect(result).toBe('NotFound');
  });

  it('tests localizedString() with not found stringId', () => {
    let result = Utils.localizedString('es', 'I do not have a key', localizableData);
    expect(result).toBe('I do not have a key');

    result = Utils.localizedString('es', null, localizableData);
    expect(result).toBeNull();

    result = Utils.localizedString('es', undefined, localizableData);
    expect(result).toBeNull();
  });

  it('tests localizedString() without localizableStrings', () => {
    let result = Utils.localizedString('es', 'LIVE', {});
    expect(result).toBe('LIVE');

    result = Utils.localizedString('es', 'LIVE', null);
    expect(result).toBe('LIVE');

    result = Utils.localizedString('es', 'LIVE', undefined);
    expect(result).toBe('LIVE');
  });

  it('tests localizedString() uses preferredLocale', () => {
    let result = Utils.localizedString('es', 'Sample Text', localizableData);
    expect(result).toBe('Texto de muestra');

    result = Utils.localizedString('en', 'Sample Text', localizableData);
    expect(result).toBe('Sample Text');
  });

  it('tests localizedString() uses localizableData defaultLanguage', () => {
    let result = Utils.localizedString('fr', 'Ad', localizableData);
    expect(result).toBe('Ad');

    localizableData.defaultLanguage = 'es';
    result = Utils.localizedString('kr', 'Ad', localizableData);
    expect(result).toBe('Anuncio');
  });
});

describe('shouldShowLandscape', () => {
  it('tests shouldShowLandscape() with invalid arguments', () => {
    const cases = [
      [null, null],
      [undefined, undefined],
      [[], undefined],
      [-12.12, {}],
      ['number', ['x']],
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const result = Utils.shouldShowLandscape(null, cases[i]);

      expect(result).toBeFalsy();
    }
  });

  it('tests shouldShowLandscape() with valid arguments', () => {
    let result = Utils.shouldShowLandscape(-12, -14);
    expect(result).toBeFalsy();

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
