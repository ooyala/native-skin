// @flow

import { parseInputArray } from './markers';

describe('parseInputArray', () => {
  it('parses array of serialized JSON strings', () => {
    const parsed = parseInputArray([
      '{"start": "start", "type": "text", "text": "Hello, world!"}',
      '{"start": "start", "type": "icon", "iconUrl": "http://example.com/icon.png"}',
    ]);

    expect(parsed)
      .toHaveLength(2);

    expect(parsed[0])
      .toEqual({
        start: 'start',
        type: 'text',
        text: 'Hello, world!',
      });

    expect(parsed[1])
      .toEqual({
        start: 'start',
        type: 'icon',
        iconUrl: 'http://example.com/icon.png',
      });
  });

  it('skips wrong strings', () => {
    const parsed = parseInputArray([
      '{"start": "start", "type": "text", "text": "Hello, world!"}',
      'ERROR{"start": "start", "type": "icon", "iconUrl": "http://example.com/icon.png"}',
    ]);

    expect(parsed)
      .toHaveLength(1);

    expect(parsed[0])
      .toEqual({
        start: 'start',
        type: 'text',
        text: 'Hello, world!',
      });
  });

  it('returns empty array if the parameter is falsy', () => {
    const parsed = parseInputArray();

    expect(Array.isArray(parsed))
      .toBe(true);
    expect(parsed)
      .toHaveLength(0);
  });
});
