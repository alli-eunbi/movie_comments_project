import { atom } from 'recoil';

export const userState = atom({
  key: 'userstate', // unique ID (with respect to other atoms/selectors)
  default: {} // default value (aka initial value)
});

export const responseState = atom({
  key: 'responsestate', // unique ID (with respect to other atoms/selectors)
  default: ''// default value (aka initial value)
});
