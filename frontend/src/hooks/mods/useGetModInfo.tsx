import axios from 'axios';
import { useState } from 'react';
import { Module } from '../../types/modules';
import { useModsContext } from './useModsContext';

const useGetModInfo = () => {
  const ACAD_YEAR = '2023-2024';
  const { modsDispatch } = useModsContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getModInfo = async (courseId: string) => {
    setLoading(true);
    setError(null);
    const getMod = async () => {
      try {
        const data = await axios.get<Module>(
          `https://api.nusmods.com/v2/${ACAD_YEAR}/modules/${courseId}.json`
        );
        const mod = data.data;
        modsDispatch({ type: 'SET_MOD_INFO', payload: mod });

        // to update localstorage
        const stored =
          JSON.parse(localStorage.getItem('modsInfo') as string) || [];
        localStorage.setItem(
          'modsInfo',
          JSON.stringify([...stored, data.data])
        );
        return mod;
      } catch (error) {
        if (error instanceof Error) {
          const message = error.message ? `, ${error.message}` : '';
          setError(error.name + message);
        }
      }
    };

    const modsInfo = localStorage.getItem('modsInfo');

    if (!modsInfo) {
      return await getMod();
    }
    const stored: Module[] = JSON.parse(modsInfo);
    const item = stored.find((mod) => mod.moduleCode === courseId);
    if (item) {
      modsDispatch({
        type: 'SET_MOD_INFO',
        payload: item,
      });
      return item;
    } else {
      return await getMod();
    }
  };

  return { error, getModInfo, loading };
};

export default useGetModInfo;
