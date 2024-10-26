import { collection, doc, getDoc, getDocs, query, updateDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { trilhaFixedType, trilhaFixedTypeCadastro, trilhaSemanaType, trilhaSemanaTypeCadastro, userDataType } from '../types/customTypes';

interface DataUserProviderProps {
   children: ReactNode;
}

interface DataUserContextData {
   userData: userDataType;
   getUserData: () => void;
   trilhaFixed: trilhaFixedType;
   trilhaSemana: trilhaSemanaType[];
   trilhaBemVindo: trilhaFixedType;
   loading: boolean
}

export const DataUserContext = createContext<DataUserContextData>(
   {} as DataUserContextData
);

export function DataUserProvider({ children }: DataUserProviderProps) {

   const [userData, setUserData] = useState<userDataType>({} as userDataType);

   const [trilhaBemVindo, setTrilhaBemVindo] = useState<trilhaFixedType>({} as trilhaFixedType);
   const [trilhaFixed, setTrilhaFixed] = useState<trilhaFixedType>({} as trilhaFixedType);
   const [trilhaSemana, setTrilhaSemana] = useState<trilhaSemanaType[]>([]);

   const [loading, setLoading] = useState(true);

   const getUserData = async () => {
      const user = auth.currentUser;
      if (user) {
         const docRef = doc(db, `users`, user.uid);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            const items: any = docSnap.data();
            const userInfo: userDataType = items;
            setUserData(userInfo);

            const watchedVideos = userInfo.watchedVideos || [];

            // Passo 1: Obtenha as trilhas fixas e semanais
            const docRefTrilhaFixa = doc(db, 'trilhas', 'fixa', userInfo.lojaID, userInfo.fixedTrackID);
            const docSnapTrilhaFixa = await getDoc(docRefTrilhaFixa);

            let fixedTrackVideos: {
               videoID: string;
               watch: boolean; // Adicionando a variável watch
               uniqueID: string;
               isLocked: boolean;
            }[] = [];

            if (docSnapTrilhaFixa.exists()) {
               const items = docSnapTrilhaFixa.data() as trilhaFixedTypeCadastro;

               fixedTrackVideos = (items.videos || []).map((video) => ({
                  videoID: video.videoID,
                  watch: watchedVideos.some(watchedVideo => watchedVideo.uniqueID === video.uniqueID), // Se o uniqueID estiver em watchedVideos, watch será true
                  uniqueID: video.uniqueID,
                  isLocked: false,
               }));

               setTrilhaFixed({ ...items, videos: fixedTrackVideos });
            }

            const docRefTrilhaBemVindo = doc(db, 'trilhas', 'bemVindo', userInfo.lojaID, 'bemVindo');
            const docSnapTrilhaBemVindo = await getDoc(docRefTrilhaBemVindo);

            let welcomeTrackVideos: {
               videoID: string;
               watch: boolean; // Adicionando a variável watch
               uniqueID: string;
               isLocked: boolean;
            }[] = [];

            if (docSnapTrilhaBemVindo.exists()) {
               const items = docSnapTrilhaBemVindo.data() as trilhaFixedTypeCadastro;

               welcomeTrackVideos = (items.videos || []).map((video) => ({
                  videoID: video.videoID,
                  watch: watchedVideos.some(watchedVideo => watchedVideo.uniqueID === video.uniqueID), // Se o uniqueID estiver em watchedVideos, watch será true
                  uniqueID: video.uniqueID,
                  isLocked: false,
               }));

               setTrilhaBemVindo({ ...items, videos: welcomeTrackVideos });
            }

            const docRefTrilhaSemana = collection(db, "trilhas", 'semana', userInfo.lojaID);
            const q = query(docRefTrilhaSemana);
            const docSnapTrilhaSemana = await getDocs(q);
            const weeklyTrack = docSnapTrilhaSemana.docs.map(doc => {
               const data = doc.data() as trilhaSemanaTypeCadastro
               let weeklyTrackVideos = [];

               weeklyTrackVideos = (data.videos || []).map((video) => ({
                  videoID: video.videoID,
                  watch: watchedVideos.some(watchedVideo => watchedVideo.uniqueID === video.uniqueID),  // Adicionando a variável watch e definindo como false
                  uniqueID: video.uniqueID,
                  isLocked: false
               }));

               const video: trilhaSemanaType = {
                  id: data.id,
                  name: data.name,
                  description: data.description,
                  end: data.end,
                  start: data.start,
                  videos: weeklyTrackVideos,
               }
               return video
            });
            setTrilhaSemana(weeklyTrack)

         }
      }
   }

   return (
      <DataUserContext.Provider value={{ userData, getUserData, trilhaFixed, trilhaSemana, loading, trilhaBemVindo }}>
         {children}
      </DataUserContext.Provider>
   );
};


{/*
Passo 4: Tornar a operação mais performática
Como você terá várias trilhas semanais ao longo do tempo, é importante garantir que você esteja buscando e processando os dados da forma mais eficiente possível. Aqui estão algumas dicas:

Paginação ou Limitação de Dados: Se você espera que as trilhas semanais cresçam muito, considere implementar um sistema de paginação ou buscar apenas as trilhas mais recentes que o usuário ainda não viu.

Isso pode ser feito ao ajustar sua consulta no Firestore para limitar o número de trilhas semanais retornadas:

   const q = query(docRefTrilhaSemana, orderBy("start", "desc"), limit(10)); // Puxa as 10 trilhas semanais mais recentes
   const docSnapTrilhaSemana = await getDocs(q);

Armazenamento Local: Considere armazenar localmente as trilhas fixas e semanais no dispositivo do usuário usando algo como AsyncStorage, para evitar consultas repetidas ao Firestore toda vez que o usuário abre o app. Atualize esses dados apenas quando houver novas trilhas.

Buscas Condicionais: Você pode melhorar a performance ao buscar apenas trilhas semanais que ainda não foram visualizadas, em vez de buscar todas as trilhas. Isso pode ser feito ao guardar a última semana visualizada no progresso do usuário e buscar trilhas semanais criadas após essa semana.


Se você armazenar a data da última trilha semanal visualizada no userInfo, pode otimizar a consulta para trazer apenas trilhas novas:

const lastViewedWeekDate = userInfo.lastViewedWeekDate || new Date(0); // Caso o usuário nunca tenha assistido uma trilha semanal

const q = query(
  docRefTrilhaSemana,
  where("start", ">", lastViewedWeekDate),
  orderBy("start", "desc")
);
const docSnapTrilhaSemana = await getDocs(q);
*/}