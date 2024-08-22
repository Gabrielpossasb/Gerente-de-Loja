import { db } from "@/src/services/firebaseConfig";
import { VideoInfoProps } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Videos() {

   const [videos, setVideos] = useState<VideoInfoProps[]>([])

   async function getVideos() {
      const videosCollection = collection(db, 'treinamento');
      const videosSnapshot = await getDocs(videosCollection);
      const videosList: VideoInfoProps[] = videosSnapshot.docs.map(doc => {
         const data = doc.data();
         // Converta os dados para o tipo VideoInfoProps
         const videoInfo: VideoInfoProps = {
            name: data.name,
            categoria: data.categoria,
            colecao: data.colecao,
            cargo: data.cargo,
            url: data.url,
            videoID: data.videoID,
            createdAt: data.createdAt,
            questions: data.questions,
            tutor: data.tutor
         };
         return videoInfo;
      });

      setVideos(videosList)
   }

   useEffect(() => {
      getVideos()
   }, [])

   return (
      <View className="flex flex-wrap flex-row p-8 justify-center gap-8">
         {videos.map((val, id) => (
            <View
               className="rounded-lg flex w-32 items-center justify-center gap-4 border-2 border-neutral-300"
               key={id}
            >
               <MaterialCommunityIcons name="video" size={48} color={'#535'} />

               <Text className="text-center">{val.name}</Text>
            </View>
         ))}
      </View>
   )
}