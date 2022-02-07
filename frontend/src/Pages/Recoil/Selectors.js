import { selector } from 'recoil';
import { loginState } from '../../Pages/Recoil/Atoms';

export const logSelector = selector({
  key: 'loginselector',

  get: ({ get }) => {

    const loginResult = get(loginState);
    // const logoutResult = get(logoutState);

      if (loginResult === true) {
        return `로그아웃`;
      } else if (loginResult === false) {
        return `로그인`;
      } else {
        return `로그인`;
      }
  }
});
