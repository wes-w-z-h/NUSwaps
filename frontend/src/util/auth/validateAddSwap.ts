const validateAddSwap = (
  courseId: string,
  lessonType: string,
  current: string,
  request: string
) => {
  // Initialise object to track errors
  const inputErrors = {
    courseId: '',
    lessonType: '',
    current: '',
    request: '',
  };

  // Check empty email or password
  if (!courseId) {
    inputErrors.courseId = 'CourseId should not be empty';
  }
  if (!lessonType) {
    inputErrors.lessonType = 'LessonType should not be empty';
  }
  if (!current) {
    inputErrors.current = 'Current should not be empty';
  }

  if (!request) {
    inputErrors.request = 'Request should not be empty';
  }

  return inputErrors;
};

export default validateAddSwap;
