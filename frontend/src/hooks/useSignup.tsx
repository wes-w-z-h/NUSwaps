import { useState } from 'react';
import axios, { AxiosError } from 'axios';

export const useSignup = () => {
  const [error, setError] = useState<AxiosError>({} as AxiosError);
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError({} as AxiosError);

    const data = {
      email: email,
      password: password,
    };

    await axios
      .post('http://localhost:4000/api/users/signup', data)
      .catch((err) => {
        console.error(err);
        setError(err);
      });

    setLoading(false);
  };

  return { signup, loading, error };
};
