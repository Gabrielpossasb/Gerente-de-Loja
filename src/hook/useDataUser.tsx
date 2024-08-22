import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { createContext, ReactNode, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { trilhaType, userDataType } from '../types/customTypes';



interface DataUserProviderProps {
    children: ReactNode;
}

// Definindo o tipo para os dados do contexto
interface DataUserContextData {
    userData: userDataType;
    getUserData: () => void;
    trilha: trilhaType[];
    loading: boolean
}

// Criando o contexto
export const DataUserContext = createContext<DataUserContextData>(
    {} as DataUserContextData
);

// Criando um componente de provedor para encapsular outros componentes
export function DataUserProvider({ children }: DataUserProviderProps) {

    const [userData, setUserData] = useState<userDataType>({} as userDataType);

    const [trilha, setTrilha] = useState<trilhaType[]>([]);

    const [loading, setLoading] = useState(true);

    const getUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, `users`, user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const items: any = docSnap.data()
                setUserData(items)
            }

            const trilhaCollection = collection(db, 'users', user.uid, 'trilhas');
            const trilhaSnapshot = await getDocs(trilhaCollection);
            const trilhaList: trilhaType[] = trilhaSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log(data)
                // Converta os dados para o tipo VideoInfoProps
                const trilhaInfo: trilhaType = {
                    name: data.name,
                    description: data.description,
                    videos: data.videos
                };
                return trilhaInfo;
            });

            setTrilha(trilhaList)
            setLoading(false)
        }
    }

    return (
        <DataUserContext.Provider value={{ userData, getUserData, trilha, loading }}>
            {children}
        </DataUserContext.Provider>
    );
};