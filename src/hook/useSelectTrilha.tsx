import React, { createContext, ReactNode, useState } from 'react';
import { trilhaType } from '../types/customTypes';

interface SelectTrilhaProviderProps {
   children: ReactNode;
}

interface SelectTrilhaContextData {
   selectTrilha: trilhaType;
   setSelectTrilhaData: (a: trilhaType) => void;
}

export const SelectTrilhaContext = createContext<SelectTrilhaContextData>(
   {} as SelectTrilhaContextData
);

export function SelectTrilhaProvider({ children }: SelectTrilhaProviderProps) {

   const [selectTrilha, setSelectTrilha] = useState<trilhaType>({} as trilhaType);

   const setSelectTrilhaData = async (val: trilhaType) => {
      setSelectTrilha(val)
   }

   return (
      <SelectTrilhaContext.Provider value={{ selectTrilha, setSelectTrilhaData }}>
         {children}
      </SelectTrilhaContext.Provider>
   );
};