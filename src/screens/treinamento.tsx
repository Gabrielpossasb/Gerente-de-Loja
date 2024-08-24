import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import React, { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { DataUserContext } from "../hook/useDataUser";
import { SelectTrilhaContext } from "../hook/useSelectTrilha";
import { TabParamList } from "../routes/tab.routes";
import { stylesShadow } from "../styles/styles";
import { trilhaFixedType, trilhaSemanaType } from "../types/customTypes";

export default function Treinamento() {

   const navigation = useNavigation<NavigationProp<TabParamList>>()

   const { trilhaFixed, userData, trilhaSemana } = useContext(DataUserContext)
   const { setSelectTrilhaData } = useContext(SelectTrilhaContext)

   async function handleGoTrilha(val: trilhaFixedType | trilhaSemanaType) {
      const updatedVideos = val.videos.map((video) => {
         const watched = userData.watchedVideos.some((watchedVideo) => watchedVideo.videoID === video.videoID && watchedVideo.watch === true);
         return { ...video, watch: watched };
      });

      setSelectTrilhaData({ ...val, videos: updatedVideos });

      navigation.navigate('TreinamentoStack', { screen: 'Trilha' });
   }

   const videosFixedAssisidos = trilhaFixed.videos.filter((fixedVideo) =>
      userData.watchedVideos.some((watchedVideo) => watchedVideo.videoID === fixedVideo.videoID && watchedVideo.watch === true)
   );

   const videosSemanaAssisidos = trilhaSemana.videos.filter((weeklyVideo) =>
      userData.watchedVideos.some((watchedVideo) => watchedVideo.videoID === weeklyVideo.videoID && watchedVideo.watch === true)
   );

   return (
      <View className="flex flex-1 bg-white relative">
         <ScrollView className="flex flex-1">
            <View className="flex flex-1 justify-center p-10 gap-10">

               <Pressable
                  className=""
                  onPress={() => handleGoTrilha(trilhaSemana)}
               >
                  {({ pressed }) => (
                     <MotiView
                        animate={{ scale: pressed ? [0.9, 1] : 1 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={stylesShadow.shadow}
                        className="flex items-center bg-white justify-center gap-4 p-6 rounded-2xl"
                     >
                        <Text className="text-3xl font-bold text-yellow-400">{trilhaSemana.name}</Text>

                        <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                           <MaterialCommunityIcons name="play" size={48} color={'#facc15'} />
                        </View>

                        <Text className="text-zinc-700 font-bold text-xl">{videosSemanaAssisidos.length} / {trilhaSemana.videos.length} vídeos assistidos</Text>
                     </MotiView>
                  )}
               </Pressable>

               <Pressable
                  className=""
                  onPress={() => handleGoTrilha(trilhaFixed)}
               >
                  {({ pressed }) => (
                     <MotiView
                        animate={{ scale: pressed ? [0.9, 1] : 1 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={stylesShadow.shadow}
                        className="flex items-center bg-white justify-center gap-4 p-6 rounded-2xl"
                     >
                        <Text className="text-3xl font-bold text-yellow-400">{trilhaFixed.name}</Text>

                        <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                           <MaterialCommunityIcons name="play" size={48} color={'#facc15'} />
                        </View>

                        <Text className="text-zinc-700 font-bold text-xl">{videosFixedAssisidos.length} / {trilhaFixed.videos.length} vídeos assistidos</Text>
                     </MotiView>
                  )}
               </Pressable>


            </View>
         </ScrollView>

      </View>
   )
}