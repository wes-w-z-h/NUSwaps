import axios from 'axios';
import { useState, useEffect } from 'react';
import { ModuleCondensed } from '../../types/modules';
import { useModsContext } from './useModsContext';

const useGetMods = () => {
  const ACAD_YEAR = '2023-2024';
  const { modsDispatch } = useModsContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMods = async () => {
      await axios
        .get<ModuleCondensed[]>(
          `https://api.nusmods.com/v2/${ACAD_YEAR}/moduleList.json`
        )
        .then((data) => {
          const payload = data.data.map((x) => x.moduleCode);
          localStorage.setItem('moduleCodes', JSON.stringify(payload));
          modsDispatch({
            type: 'SET_MODS',
            payload: payload,
          });
        })
        .catch((error) => {
          console.log(error);
          if (error instanceof Error) {
            const message = error.message ? `, ${error.message}` : '';
            setError(error.name + message);
          }
        });
    };
    const moduleCodes = localStorage.getItem('moduleCodes');

    if (!moduleCodes) {
      getMods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { error };
};

export default useGetMods;
