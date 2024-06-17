// Attach interceptors to axiosPrivate
import { useEffect } from 'react';
import { axiosPrivate } from '../util/api/axios';
import { useRefreshToken } from './useRefreshToken';
import { useAuthContext } from './useAuthContext';

const useAxiosPrivate = () => {
  const { refresh } = useRefreshToken();
  const { state } = useAuthContext();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${state.user?.token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response, // no errors
      async (err) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true; // prevent more than 1 refresh call
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [state, refresh]);

  return axiosPrivate;
};

export { useAxiosPrivate };
