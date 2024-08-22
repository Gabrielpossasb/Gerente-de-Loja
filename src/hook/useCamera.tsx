import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface listType {
	name: string;
	check: boolean;
	description: string;
	image: string | null;
}

interface workCheckedType {
    name: string,
    id: number
}

interface CameraProviderProps {
    children: ReactNode;
}

// Definindo o tipo para os dados do contexto
interface CameraContextData {
    cam: boolean;
    setCam: (val:boolean) => void;
    workChecked: {
        name: string,
        id: number
    };
    setWorkChecked: ({}: workCheckedType) => void;
    list: listType[];
    setList: React.Dispatch<React.SetStateAction<listType[]>>;
}

// Criando o contexto
export const CameraContext = createContext<CameraContextData>(
    {} as CameraContextData
);

// Criando um componente de provedor para encapsular outros componentes
export function CameraProvider({ children }: CameraProviderProps) {

    const [cam, setCam] = useState(false)
    const [workChecked, setWorkChecked] = useState({
        name: '',
        id: 0
    })
    const [list, setList] = useState<listType[]>([
          {
              name: 'Fachada da Loja',
              check: false,
              description: '',
              image: ''
          },
          {
              name: 'Vitrine',
              check: false,
              description: '',
              image: ''
          },
          {
              name: 'Calçado Masc',
              check: false,
              description: '',
              image: ''
          },
          {
              name: 'Calçado Fem',
              check: false,
              description: '',
              image: ''
          },
          {
              name: 'Calçado Inf',
              check: false,
              description: '',
              image: ''
          },
    ])

    return (
        <CameraContext.Provider value={{ cam, setCam, list, setList, workChecked, setWorkChecked }}>
            {children}
        </CameraContext.Provider>
    );
};