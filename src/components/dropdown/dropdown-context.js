/* eslint-disable no-unused-vars */
import { createContext } from 'react';

const noop = (...args) => { };

export const DropdownContext = createContext({
  anchorEl: null,
  onMenuEnter: noop,
  onMenuLeave: noop,
  onTriggerEnter: noop,
  onTriggerLeave: noop,
  open: false
});
