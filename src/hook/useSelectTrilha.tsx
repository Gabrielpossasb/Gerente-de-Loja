import React, { createContext, ReactNode, useState } from 'react';
import { trilhaFixedType, trilhaSemanaType } from '../types/customTypes';

interface SelectTrilhaProviderProps {
   children: ReactNode;
}

interface SelectTrilhaContextData {
   selectTrilha: trilhaFixedType | trilhaSemanaType;
   setSelectTrilhaData: (a: trilhaFixedType | trilhaSemanaType) => void;
}

export const SelectTrilhaContext = createContext<SelectTrilhaContextData>(
   {} as SelectTrilhaContextData
);

export function SelectTrilhaProvider({ children }: SelectTrilhaProviderProps) {

   const [selectTrilha, setSelectTrilha] = useState<trilhaFixedType | trilhaSemanaType>({} as trilhaFixedType | trilhaSemanaType);

   const setSelectTrilhaData = async (val: trilhaFixedType | trilhaSemanaType) => {
      setSelectTrilha(val)
   }

   return (
      <SelectTrilhaContext.Provider value={{ selectTrilha, setSelectTrilhaData }}>
         {children}
      </SelectTrilhaContext.Provider>
   );
};