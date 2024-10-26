import React, { createContext, ReactNode, useState } from 'react';
import { trilhaFixedType, trilhaSemanaType } from '../types/customTypes';
import { Alert } from 'react-native';

interface SelectTrilhaProviderProps {
   children: ReactNode;
}

interface SelectTrilhaContextData {
   selectTrilha: trilhaFixedType | trilhaSemanaType[];
   setSelectTrilhaData: (a: trilhaFixedType | trilhaSemanaType[]) => void;
   manageTrack: (val: trilhaFixedType | trilhaSemanaType[], key: 'fixa' | 'semana') => void;
   nextVideo: string
   isVideosLoading: boolean
}

export const SelectTrilhaContext = createContext<SelectTrilhaContextData>(
   {} as SelectTrilhaContextData
);

export function SelectTrilhaProvider({ children }: SelectTrilhaProviderProps) {

   const [selectTrilha, setSelectTrilha] = useState<trilhaFixedType | trilhaSemanaType[]>({} as trilhaFixedType | trilhaSemanaType[]);

   const [nextVideo, setNextVideo] = useState('')
   const [isVideosLoading, setIsVideosLoading] = useState(true)

   const setSelectTrilhaData = async (val: trilhaFixedType | trilhaSemanaType[]) => {
      if (Array.isArray(val)) {
         console.log('trilha enviada para a função SELECT TRILHA', val[0].videos)
      }
      setSelectTrilha(val)
   }

   const manageTrack = (val: trilhaFixedType | trilhaSemanaType[], key: 'fixa' | 'semana') => {
      if (key === 'fixa' && !Array.isArray(val)) {
         console.log(val)
         // Verifica se selectTrilha.videos é um array válido
         if (Array.isArray(val.videos) && val.videos.length > 0) {
            // Encontra o próximo vídeo não assistido com base no uniqueID
            const nextVi = val.videos.find(video => !video.watch);

            if (nextVi !== undefined) {
               // Define o nextVideo baseado no uniqueID do primeiro vídeo com watch: false
               setNextVideo(nextVi.uniqueID);

               // Atualiza o estado dos vídeos com base no nextVideo encontrado
               const updatedVideos = val.videos.map((video, index) => {
                  const isBeforeNextVideo = index <= val.videos.findIndex(v => v.uniqueID === nextVi.uniqueID);

                  return {
                     ...video,
                     isLocked: !isBeforeNextVideo // Se o vídeo for depois do nextVideo, será bloqueado
                  };
               });

               // Atualiza o trilhaFixed com os vídeos modificados
               setSelectTrilhaData({
                  ...val,
                  videos: updatedVideos
               });
               console.log('Videos da trilha fixa atualizado',updatedVideos)
               setIsVideosLoading(false)
            } else {
               // Se todos os vídeos foram assistidos, marca o nextVideo como "val"
               setNextVideo('val');
               setSelectTrilhaData(val)
               setIsVideosLoading(false)
            }
         } else {
            Alert.alert('Ocorreu um erro. Esta trilha não possui nenhum vídeo :(');
         }
      } else if (key === 'semana' && Array.isArray(val)) {
         // Vídeos de todas as trilhas semanais em um único array
         const allWeeklyVideos = val.flatMap(val => val.videos);

         // Encontra o índice do primeiro vídeo não assistido (watch: false)
         const nextVideoIndex = allWeeklyVideos.findIndex(video => !video.watch);

         if (nextVideoIndex !== -1) { // Certifique-se de que o próximo vídeo não assistido foi encontrado
            // Pega o uniqueID do próximo vídeo não assistido
            const nextVideoUniqueID = allWeeklyVideos[nextVideoIndex].uniqueID;
            setNextVideo(nextVideoUniqueID); // Define o nextVideo com base no uniqueID

            // Atualiza o estado dos vídeos, aplicando a lógica de bloqueio para todas as trilhas
            const updatedTrilhas = val.map(val => ({
               ...val,
               videos: val.videos.map(video => {
                  // Encontra o índice global do vídeo atual com base no `uniqueID`
                  const globalIndex = allWeeklyVideos.findIndex(v => v.uniqueID === video.uniqueID);

                  // Verifica se o vídeo está antes ou igual ao `nextVideo`
                  const isBeforeNextVideo = globalIndex <= nextVideoIndex;

                  // Retorna o vídeo atualizado com o campo `isLocked`
                  return {
                     ...video,
                     isLocked: !isBeforeNextVideo, // Define `isLocked` como true se o vídeo estiver após o `nextVideo`
                  };
               })
            }));
            console.log('Fim do UseEffect da Trilha / SelectTrilha', updatedTrilhas[0].videos)
            // Atualiza o estado com as trilhas e vídeos bloqueados
            setSelectTrilhaData(updatedTrilhas);
            setIsVideosLoading(false)
            
         } else {
            Alert.alert('Nenhum vídeo encontrado para desbloquear :(');
         }
      }
   }

   return (
      <SelectTrilhaContext.Provider value={{ selectTrilha, setSelectTrilhaData, isVideosLoading, nextVideo, manageTrack }}>
         {children}
      </SelectTrilhaContext.Provider>
   );
};