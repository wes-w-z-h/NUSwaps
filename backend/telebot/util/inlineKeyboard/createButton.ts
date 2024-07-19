import { InlineKeyboard } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { Swap } from '../../types/context.js';
import { packageSwap } from '../swaps/swapParser.js';

// Function signatures for overloading
export function createButtons(
  data: Swap[]
): InlineKeyboardButton.CallbackButton[][];
export function createButtons(
  entries: string[]
): InlineKeyboardButton.CallbackButton[][];

// Single implementation of the overloaded function
// TODO: fix the create- maybe use a new tag like state-
export function createButtons(
  dataOrEntries: Swap[] | string[]
): InlineKeyboardButton.CallbackButton[][] {
  if (typeof dataOrEntries[0] === 'string') {
    const entries = dataOrEntries as string[];
    const btnsPerRow = entries.length % 2 ? 3 : 2;
    const btns = entries.map((s) => InlineKeyboard.text(s, `state-${s}`));
    const rows: InlineKeyboardButton.CallbackButton[][] = [];
    for (let i = 0; i < btns.length; i += btnsPerRow) {
      rows.push(btns.slice(i, i + btnsPerRow));
    }
    return rows;
  }
  const data = dataOrEntries as Swap[];
  const btnsPerRow = 1;
  const btns = data.map((s) => {
    return InlineKeyboard.text(
      packageSwap(s, false).replace(/\+/g, '-'),
      `update-${packageSwap(s, true)}`
    );
  });
  const rows: InlineKeyboardButton.CallbackButton[][] = [];
  for (let i = 0; i < btns.length; i += btnsPerRow) {
    rows.push(btns.slice(i, i + btnsPerRow));
  }
  return rows;
}
