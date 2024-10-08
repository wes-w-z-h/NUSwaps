import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAxiosPrivate } from '../api/useAxiosPrivate';
import { useLogout } from '../auth/useLogout';
import { PartnerDetail } from '../../types/User';

const useGetMatchPartners = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { logout } = useLogout();
  const axiosPrivate = useAxiosPrivate();

  const getMatchPartners = async (swapIds: string[]) => {
    setLoading(true);
    setError(null);

    let details: PartnerDetail[] = [];

    await axiosPrivate
      .post<PartnerDetail[]>(`/matches/partners`, { swapIds })
      .then((res) => {
        details = res.data;
      })
      .catch((error: AxiosError<{ error: string }>) => {
        console.log(error);
        if (error.response?.status === 403) {
          logout();
        }
        const message = error.response?.data
          ? `, ${error.response.data.error}`
          : '';
        setError(error.message + message);
      });
    setLoading(false);
    return details;
  };

  return { getMatchPartners, loading, error };
};

export default useGetMatchPartners;
