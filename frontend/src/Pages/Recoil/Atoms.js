import { atom } from 'recoil';

export const userState = atom({
  key: 'userstate', // unique ID (with respect to other atoms/selectors)
  default: {} // default value (aka initial value)
});

export const loginState = atom({
  key: 'loginstate', // unique ID (with respect to other atoms/selectors)
  default: false// default value (aka initial value)
});

export const logoutState = atom({
  key: 'logoutstate', // unique ID (with respect to other atoms/selectors)
  default: false// default value (aka initial value)
});