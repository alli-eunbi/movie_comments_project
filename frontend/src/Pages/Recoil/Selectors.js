import { selector } from 'recoil';
import { loginState, logoutState } from '../../Pages/Recoil/Atoms';

export const logSelector = selector({
  key: 'loginselector',

  get: ({ get }) => {

    const loginResult = get(loginState);
    const logoutResult = get(logoutState);

    const token = localStorage.getItem('logState');

      if (loginResult === true && logoutResult === false) {
        return `로그아웃`;
      } else if (loginResult === false && logoutResult === true) {
        return `로그인`;
      } else {
        return `로그인`;
      }
  }
});
