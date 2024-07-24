const validateFormInput = (
  email: string,
  password: string,
  cfmPassword?: string,
  teleHandle?: string
) => {
  // Initialise object to track errors
  const inputErrors = {
    email: '',
    password: '',
    confirmPassword: '',
    teleHandle: '',
  };

  // Check empty email or password
  if (!email) {
    inputErrors.email = 'Email should not be empty';
  }
  if (!password) {
    inputErrors.password = 'Password should not be empty';
  }
  // Check valid email domain (@u.nus.edu)
  if (!email.endsWith('@u.nus.edu')) {
    inputErrors.email = 'Email should end with @u.nus.edu';
  }
  // Check matching passwords
  if (cfmPassword && password !== cfmPassword) {
    inputErrors.confirmPassword =
      'Password and Confirm Password should be the same';
  }
  // check whether got @
  if (teleHandle && !teleHandle.startsWith('@')) {
    inputErrors.teleHandle = "Telegram handle should start with '@'";
  }

  return inputErrors;
};

export default validateFormInput;
