import { useState } from 'react';
import axios, { AxiosError } from 'axios';

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const data = {
      email: email,
      password: password,
    };

    await axios
      .post('http://localhost:4000/api/auth/signup', data)
      .catch((error: AxiosError<{ error: string }>) => {
        console.log(error);
        const message = error.response?.data
          ? `, ${error.response.data.error}`
          : '';
        setError(error.message + message);
      });

    setLoading(false);
  };

  return { signup, loading, error };
};
