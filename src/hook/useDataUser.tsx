
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export interface userDataType {
    nome: string,
    loja: string,
    usuario: string
}

interface DataUserProviderProps {
    children: ReactNode;
 }

// Definindo o tipo para os dados do contexto
interface DataUserContextData {
  userData: userDataType;
}

// Criando o contexto
export const DataUserContext = createContext<DataUserContextData>(
    {} as DataUserContextData
);

// Criando um componente de provedor para encapsular outros componentes
export function DataUserProvider ({ children }: DataUserProviderProps) {
  
    const [userData, setUserData] = useState<userDataType>({} as userDataType);

    useEffect(() => {
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const docRef = doc(db, `${user.email?.slice(0,2)}`, "userData");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const items = docSnap.data().data
                    setUserData(items)
                }

            }
        });

        return () => unsubscribe();
    }, []); 

    return (
        <DataUserContext.Provider value={{userData}}>
            {children}
        </DataUserContext.Provider>
    );
};