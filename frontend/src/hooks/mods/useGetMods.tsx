import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useLogout } from '../auth/useLogout';
import { ModuleCondensed } from '../../types/modules';
import { useModsContext } from './useModsContext';

const useGetMods = () => {
  const ACAD_YEAR = '2023-2024';
  const { modsDispatch } = useModsContext();
  const [error, setError] = useState<string | null>(null);
  const { logout } = useLogout();

  useEffect(() => {
    const getMods = async () => {
      await axios
        .get<ModuleCondensed[]>(
          `https://api.nusmods.com/v2/${ACAD_YEAR}/moduleList.json`
        )
        .then((data) => {
          console.log('api called');
          localStorage.setItem('moduleCodes', JSON.stringify(data.data));
          modsDispatch({
            type: 'SET_MODS',
            payload: data.data.map((x) => x.moduleCode),
          });
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
    };
    const moduleCodes = localStorage.getItem('moduleCodes');

    if (!moduleCodes) {
      getMods();
    } else {
      modsDispatch({
        type: 'SET_MODS',
        payload: JSON.parse(moduleCodes),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { error };
};

export default useGetMods;
