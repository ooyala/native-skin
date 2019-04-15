// @flow

import { collapse } from './collapser';

const data = {
  B1_Fixed100: {
    name: 'b1',
    location: 'controlBar',
    whenDoesNotFit: 'keep',
    minWidth: 100,
  },
  B2_Fixed1: {
    name: 'b2',
    location: 'controlBar',
    whenDoesNotFit: 'keep',
    minWidth: 1,
  },
  B3_Fixed1: {
    name: 'b3',
    location: 'controlBar',
    whenDoesNotFit: 'keep',
    minWidth: 1,
  },
  B4_Collapsing100: {
    name: 'b4',
    location: 'controlBar',
    whenDoesNotFit: 'moveToMoreOptions',
    minWidth: 100,
  },
  B5_Collapsing1: {
    name: 'b5',
    location: 'controlBar',
    whenDoesNotFit: 'moveToMoreOptions',
    minWidth: 1,
  },
  B6_Collapsing1: {
    name: 'b6',
    location: 'controlBar',
    whenDoesNotFit: 'moveToMoreOptions',
    minWidth: 1,
  },
  B7_MoreOptions100: {
    name: 'b7',
    location: 'moreOptions',
    minWidth: 100,
  },
  B8_None100: {
    name: 'b7',
    location: '',
    minWidth: 100,
  },
};

describe('collapse', () => {
  it('TestOverflow_overflowMoreOptionsDoesntCount', () => {
    const oi = [data.B5_Collapsing1, data.B7_MoreOptions100];
    const results = collapse(100, oi);

    expect(results.overflow.length).toBe(1);
    expect(results.overflow[0]).toBe(data.B7_MoreOptions100);
  });

  it('TestOverflow_overflowMoreOptionsFits', () => {
    const oi = [data.B7_MoreOptions100];
    const results = collapse(100, oi);

    expect(results.overflow.toString()).toBe(oi.toString());
  });

  it('TestOverflow_overflowMoreOptionsDoesNotFit', () => {
    const oi = [data.B7_MoreOptions100];
    const results = collapse(1, oi);

    expect(results.overflow.toString()).toBe(oi.toString());
  });

  it('TestOverflow_overflowAppearanceNoneFits', () => {
    const oi = [data.B8_None100];
    const results = collapse(100, oi);

    expect(results.overflow.length).toBe(0);
  });

  it('TestOverflow_overflowAppearanceNoneDoesNotFit', () => {
    const oi = [data.B8_None100];
    const results = collapse(1, oi);

    expect(results.overflow.length).toBe(0);
  });

  it('TestOverflow_overflowAliasOnlyOnce', () => {
    const oi = [data.B5_Collapsing1, data.B6_Collapsing1, data.B5_Collapsing1];
    const results = collapse(2, oi);

    expect(results.overflow.length).toBe(1);
    expect(results.overflow[0]).toBe(data.B5_Collapsing1);
  });

  it('TestOverflow_overflowFixedMixed', () => {
    const oi = [data.B1_Fixed100, data.B5_Collapsing1];
    const results = collapse(1, oi);

    expect(results.overflow.length).toBe(1);
    expect(results.overflow[0]).toBe(data.B5_Collapsing1);
  });

  it('TestOverflow_overflowFixedSingle', () => {
    const oi = [data.B1_Fixed100];
    const results = collapse(1, oi);

    expect(results.overflow.length).toBe(0);
  });

  it('TestFit_fixedPreferred', () => {
    const oi = [data.B2_Fixed1, data.B5_Collapsing1, data.B3_Fixed1];
    const results = collapse(2, oi);

    expect(results.fit.length).toBe(2);
    expect(results.fit.indexOf(data.B5_Collapsing1)).toBe(-1);
  });

  it('TestFit_merging', () => {
    const oi = [data.B2_Fixed1, data.B5_Collapsing1, data.B3_Fixed1];
    const results = collapse(100, oi);

    expect(results.fit.length).toBe(3);
    expect(results.fit.toString()).toBe(oi.toString());
  });

  it('TestFit_revKeepFixed', () => {
    const results = collapse(100, [data.B4_Collapsing100, data.B1_Fixed100]);

    expect(results.fit.length).toBe(1);
    expect(results.fit[0]).toBe(data.B1_Fixed100);
  });

  it('TestFit_keepFixed', () => {
    const results = collapse(100, [data.B1_Fixed100, data.B4_Collapsing100]);

    expect(results.fit.length).toBe(1);
    expect(results.fit[0]).toBe(data.B1_Fixed100);
  });

  it('TestFit_revOneCollapsableFits', () => {
    const results = collapse(100, [data.B5_Collapsing1, data.B4_Collapsing100]);

    expect(results.fit.length).toBe(1);
    expect(results.fit[0]).toBe(data.B5_Collapsing1);
  });

  it('TestFit_oneCollapsableFits', () => {
    const results = collapse(100, [data.B4_Collapsing100, data.B5_Collapsing1]);

    expect(results.fit.length).toBe(1);
    expect(results.fit[0]).toBe(data.B4_Collapsing100);
  });

  it('TestFit_collapsableFits', () => {
    const results = collapse(100, [data.B4_Collapsing100]);

    expect(results.fit.length).toBe(1);
    expect(results.fit[0]).toBe(data.B4_Collapsing100);
  });

  it('TestFit_allFixedFit', () => {
    const results = collapse(100, [data.B2_Fixed1, data.B3_Fixed1]);

    expect(results.fit.length).toBe(2);
    expect(results.fit[0]).toBe(data.B2_Fixed1);
    expect(results.fit[1]).toBe(data.B3_Fixed1);
  });

  it('TestFit_revOneFixedFits_twoFixed', () => {
    const oi = [data.B2_Fixed1, data.B1_Fixed100];
    const results = collapse(100, oi);

    expect(results.fit.length).toBe(2);
    expect(results.fit.toString()).toBe(oi.toString());
  });

  it('TestFit_oneFixedFits_twoFixed', () => {
    const oi = [data.B1_Fixed100, data.B2_Fixed1];
    const results = collapse(100, oi);

    expect(results.fit.length).toBe(2);
    expect(results.fit.toString()).toBe(oi.toString());
  });

  it('TestFit_keepItemMeetingSpec', () => {
    const results = collapse(100, [data.B2_Fixed1]);

    expect(results.fit.length).toBe(1);
  });

  it('TestFit_discardInvalidItem_overflow', () => {
    const results = collapse(100, [
      {
        name: 'b1',
        appearance: 'controlBar',
      },
    ]);

    expect(results.overflow.length).toBe(0);
  });

  it('TestFit_discardInvalidItem_fit', () => {
    const results = collapse(100, [
      {
        name: 'b1',
        appearance: 'controlBar',
      },
    ]);

    expect(results.fit.length).toBe(0);
  });

  it('TestFit_discardInvalidItemsInZeroSpace', () => {
    const results = collapse(0, [
      data.B2_Fixed1,
      {
        name: 'b1',
        appearance: 'controlBar',
      },
    ]);

    expect(results.fit.length).toBe(1);
  });

  it('TestFit_constiousEdgeCasesDoNotExplode', () => {
    const sizes = [undefined, null, -1, 0, -4096, 4096];
    const items = [undefined, null, [], ['foo']];

    for (let si = 0; si < sizes.length; si += 1) {
      for (let ii = 0; ii < items.length; ii += 1) {
        // Not saying it returns anything sane, just doesn't die.
        collapse(sizes[si], items[ii]);
      }
    }
  });
});
