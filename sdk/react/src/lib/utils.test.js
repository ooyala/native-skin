// @flow

import * as Utils from './utils';
import localizationFixture from './__fixtures__/localization';

describe('getTimerLabel', () => {
  it('returns correct string representation of the seconds left', () => {
    expect(Utils.getTimerLabel(0)).toBe('00:00');
    expect(Utils.getTimerLabel(5)).toBe('00:05');
    expect(Utils.getTimerLabel(6.66)).toBe('00:06');
    expect(Utils.getTimerLabel(10)).toBe('00:10');
    expect(Utils.getTimerLabel(12)).toBe('00:12');
    expect(Utils.getTimerLabel(33.3333)).toBe('00:33');
    expect(Utils.getTimerLabel(60)).toBe('01:00');
    expect(Utils.getTimerLabel(61)).toBe('01:01');
    expect(Utils.getTimerLabel(77)).toBe('01:17');
    expect(Utils.getTimerLabel(600)).toBe('10:00');
    expect(Utils.getTimerLabel(601)).toBe('10:01');
    expect(Utils.getTimerLabel(616)).toBe('10:16');
    expect(Utils.getTimerLabel(660)).toBe('11:00');
    expect(Utils.getTimerLabel(666)).toBe('11:06');
    expect(Utils.getTimerLabel(777.777)).toBe('12:57');
  });
});

describe('localizedString', () => {
  it('tests localizedString() with edge cases', () => {
    const cases = [
      // $FlowFixMe
      [null, null, null],
      // $FlowFixMe
      [undefined, undefined, undefined],
      // $FlowFixMe
      [[], undefined, undefined],
      // $FlowFixMe
      [-12.12, null, {}],
      // $FlowFixMe
      [{}, undefined, []],
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const result = Utils.localizedString.apply(null, cases[i]);

      expect(result).toBe('');
    }
  });

  it('tests localizedString() with not found preferredLocale', () => {
    let result = Utils.localizedString('not found', 'On', localizationFixture);
    expect(result).toBe('On');

    result = Utils.localizedString('not found', 'NotFound', localizationFixture);
    expect(result).toBe('NotFound');

    // $FlowFixMe
    result = Utils.localizedString(null, 'NotFound', localizationFixture);
    expect(result).toBe('NotFound');

    // $FlowFixMe
    result = Utils.localizedString(undefined, 'NotFound', localizationFixture);
    expect(result).toBe('NotFound');
  });

  it('tests localizedString() with not found stringId', () => {
    let result = Utils.localizedString('es', 'I do not have a key', localizationFixture);
    expect(result).toBe('I do not have a key');

    // $FlowFixMe
    result = Utils.localizedString('es', null, localizationFixture);
    expect(result).toBe('');

    // $FlowFixMe
    result = Utils.localizedString('es', undefined, localizationFixture);
    expect(result).toBe('');
  });

  it('tests localizedString() without localizableStrings', () => {
    // $FlowFixMe
    let result = Utils.localizedString('es', 'LIVE', {});
    expect(result).toBe('LIVE');

    // $FlowFixMe
    result = Utils.localizedString('es', 'LIVE', null);
    expect(result).toBe('LIVE');

    // $FlowFixMe
    result = Utils.localizedString('es', 'LIVE', undefined);
    expect(result).toBe('LIVE');
  });

  it('tests localizedString() uses preferredLocale', () => {
    let result = Utils.localizedString('es', 'Sample Text', localizationFixture);
    expect(result).toBe('Texto de muestra');

    result = Utils.localizedString('en', 'Sample Text', localizationFixture);
    expect(result).toBe('Sample Text');
  });

  it('tests localizedString() uses localizationFixture defaultLanguage', () => {
    let result = Utils.localizedString('fr', 'Ad', localizationFixture);
    expect(result).toBe('Ad');

    localizationFixture.defaultLanguage = 'es';
    result = Utils.localizedString('kr', 'Ad', localizationFixture);
    expect(result).toBe('Anuncio');
  });
});

describe('shouldShowLandscape', () => {
  it('tests shouldShowLandscape() with invalid arguments', () => {
    const cases = [
      // $FlowFixMe
      [null, null],
      // $FlowFixMe
      [undefined, undefined],
      // $FlowFixMe
      [[], undefined],
      // $FlowFixMe
      [-12.12, {}],
      // $FlowFixMe
      ['number', ['x']],
    ];

    for (let i = 0; i < cases.length; i += 1) {
      const result = Utils.shouldShowLandscape.apply(null, cases[i]);

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
