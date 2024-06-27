const validateSwap = (
  courseId: string,
  lessonType: string,
  current: string,
  request: string
) => {
  // Initialise object to track errors
  const inputErrors = {
    courseId: ' ',
    lessonType: ' ',
    current: ' ',
    request: ' ',
  };

  // Check empty email or password
  if (!courseId || courseId === '-') {
    inputErrors.courseId = 'CourseId is required';
  }
  if (!lessonType || lessonType === '-') {
    inputErrors.lessonType = 'LessonType is required';
  }
  if (!current || current === '-') {
    inputErrors.current = 'Current is required';
  }
  if (!request || request === '-') {
    inputErrors.request = 'Request is required';
  }

  return inputErrors;
};

export default validateSwap;
