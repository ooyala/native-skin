// @flow

export type ControlBarButton = {
  name: string,
  location: 'controlBar' | 'mainView',
  whenDoesNotFit: 'keep' | 'drop' | 'moveToMoreOptions',
  minWidth: number,
};

type MoreOptionsButton = {
  name: string,
  location: 'moreOptions',
};

export type Button = ControlBarButton | MoreOptionsButton;
