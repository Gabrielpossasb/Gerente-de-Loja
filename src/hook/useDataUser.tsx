import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { trilhaFixedType, trilhaSemanaType, userDataType } from '../types/customTypes';

interface DataUserProviderProps {
   children: ReactNode;
}

interface DataUserContextData {
   userData: userDataType;
   getUserData: () => void;
   trilhaFixed: trilhaFixedType;
   trilhaSemana: trilhaSemanaType;
   loading: boolean
}

export const DataUserContext = createContext<DataUserContextData>(
   {} as DataUserContextData
);

export function DataUserProvider({ children }: DataUserProviderProps) {

   const [userData, setUserData] = useState<userDataType>({} as userDataType);

   const [trilhaFixed, setTrilhaFixed] = useState<trilhaFixedType>({} as trilhaFixedType);
   const [trilhaSemana, setTrilhaSemana] = useState<trilhaSemanaType>({} as trilhaSemanaType);

   const [loading, setLoading] = useState(true);

   const getUserData = async () => {
      const user = auth.currentUser;
      if (user) {
         const docRef = doc(db, `users`, user.uid);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            const items: any = docSnap.data();
            const itemsTrilha: userDataType = items;
            setUserData(itemsTrilha);

            // Passo 1: Obtenha as trilhas fixas e semanais
            const docRefTrilha = doc(db, 'trilhas', itemsTrilha.fixedTrackID);
            const docSnapTrilha = await getDoc(docRefTrilha);
            let fixedTrackVideos = [];
            if (docSnapTrilha.exists()) {
               const items: any = docSnapTrilha.data();
               setTrilhaFixed(items);
               fixedTrackVideos = items.videos || [];
               console.log('Trilha Fixa:', items);
            }

            const docRefTrilhaSemana = doc(db, 'trilhas', itemsTrilha.weeklyTrackID);
            const docSnapTrilhaSemana = await getDoc(docRefTrilhaSemana);
            let weeklyTrackVideos = [];
            if (docSnapTrilhaSemana.exists()) {
               const items: any = docSnapTrilhaSemana.data();
               setTrilhaSemana(items);
               weeklyTrackVideos = items.videos || [];
               console.log('Trilha Semana:', items);
            }

            // Passo 2: Combine vídeos das trilhas fixas e semanais
            const allTrackVideos = [...fixedTrackVideos, ...weeklyTrackVideos];

            // Passo 3: Verifique vídeos novos
            const watchedVideos = itemsTrilha.watchedVideos || [];

            // Encontrar vídeos novos que estão nas trilhas mas não no progresso do usuário
            const newVideos = allTrackVideos.filter(
               (trackVideo) => !watchedVideos.some((watchedVideo) => watchedVideo.videoID === trackVideo.videoID)
            );

            // Passo 4: Atualize o progresso do usuário se necessário
            if (newVideos.length > 0) {
               const updatedWatchedVideos = watchedVideos.concat(
                  newVideos.map((newVideo) => ({ videoID: newVideo.videoID, watch: false }))
               );

               if (updatedWatchedVideos.length > 0) {
                  await updateDoc(docRef, {
                    watchedVideos: updatedWatchedVideos,
                  });
                  console.log('Progresso do usuário atualizado com novos vídeos.');
                }
            }
         }
      }
   }

   return (
      <DataUserContext.Provider value={{ userData, getUserData, trilhaFixed, trilhaSemana, loading }}>
         {children}
      </DataUserContext.Provider>
   );
};