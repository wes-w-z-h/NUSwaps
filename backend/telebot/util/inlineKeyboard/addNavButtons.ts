import { InlineKeyboardButton } from 'grammy/types';
import { InlineKeyboard } from 'grammy';
import { SessionData } from '../../types/context.js';

const addNavButtons = (
  totalPages: number,
  session: SessionData,
  rows: InlineKeyboardButton.CallbackButton[][]
) => {
  if (totalPages > 1) {
    if (session.page > 0 && session.page < totalPages - 1) {
      rows.push([
        InlineKeyboard.text('<<', `prev-${session.page}`),
        InlineKeyboard.text('>>', `next-${session.page}`),
      ]);
    } else if (session.page === totalPages - 1) {
      rows.push([InlineKeyboard.text('<<', `prev-${session.page}`)]);
    } else {
      // if (session.page === 0) {
      rows.push([InlineKeyboard.text('>>', `next-${session.page}`)]);
    }
  }

  if (session.state === 0 && session.type === 'update') {
    rows.push([InlineKeyboard.text('Delete', 'update-delete')]);
  }

  if (
    session.state > 0 ||
    (session.type === 'update' && session.state !== -1)
  ) {
    rows.push([
      InlineKeyboard.text('Back', 'back'),
      InlineKeyboard.text('Cancel', 'cancel'),
    ]);
  } else {
    rows.push([InlineKeyboard.text('Cancel', 'cancel')]);
  }
};

export default addNavButtons;
