import { Swap } from '../../types/context.js';

const swapToString = (swap: Swap) => {
  // the weird spacing is to display it nicely
  return (
    `Course id:       ${swap.courseId}\n` +
    `Lesson type:   ${swap.lessonType}\n` +
    `Current:           ${swap.current}\n` +
    `Request:          ${swap.request}`
  );
};

export default swapToString;
