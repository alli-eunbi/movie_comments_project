import { selector } from 'recoil';
import {responseState} from '../../Pages/Recoil/Atoms';

export const successSelector = selector({
  key: 'success',

  get: ({ get }) => {
    const result = get(responseState);
      if (result === true) {
        return result;
      }
      else if (result === false) {
        return result;
      }
  },
});
