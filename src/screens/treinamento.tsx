import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import React, { useContext, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { DataUserContext } from "../hook/useDataUser";
import { SelectTrilhaContext } from "../hook/useSelectTrilha";
import { TabParamList } from "../routes/tab.routes";
import { stylesShadow } from "../styles/styles";
import { trilhaFixedType, trilhaSemanaType } from "../types/customTypes";

export default function Treinamento() {

   const navigation = useNavigation<NavigationProp<TabParamList>>()

   const { trilhaFixed, userData, trilhaSemana, trilhaBemVindo } = useContext(DataUserContext)
   const { setSelectTrilhaData, manageTrack } = useContext(SelectTrilhaContext)

   const [showCompletedTracks, setShowCompletedTracks] = useState(false)

   async function handleGoTrilha(val: trilhaFixedType | trilhaSemanaType[], key: 'semana' | 'fixa') {
      await manageTrack(val, key)

      navigation.navigate('TreinamentoStack', { screen: 'Trilha', params: { key: key } });
   }

   let totalVideosSemana = 0;
   let videosSemanaAssisidos = 0;

   // Percorre todas as trilhas da semana
   trilhaSemana.forEach((trilha) => {
      // Adiciona o número total de vídeos de cada trilha ao total geral
      totalVideosSemana += trilha.videos.length;

      // Filtra os vídeos assistidos para essa trilha
      const videosAssistidos = trilha.videos.filter((video) =>
         userData.watchedVideos.some((watchedVideo) => watchedVideo.uniqueID === video.uniqueID)
      );

      // Adiciona o número de vídeos assistidos ao total geral de vídeos assistidos
      videosSemanaAssisidos += videosAssistidos.length;
   });
   const semanaComplete = videosSemanaAssisidos === totalVideosSemana;


   const videosFixedAssisidos = trilhaFixed.videos.filter((fixedVideo) =>
      userData.watchedVideos.some((watchedVideo) => watchedVideo.uniqueID === fixedVideo.uniqueID)
   );
   const fixedComplete = videosFixedAssisidos.length == trilhaFixed.videos.length

   const videosBemVindoAssisidos = trilhaBemVindo.videos.filter((bemVindoVideo) =>
      userData.watchedVideos.some((watchedVideo) => watchedVideo.uniqueID === bemVindoVideo.uniqueID)
   );
   const bemVindoComplete = videosBemVindoAssisidos.length == trilhaBemVindo.videos.length

   return (
      <View className="flex flex-1 bg-white relative">
         <ScrollView className="flex flex-1 ">
            <View className="flex flex-1 justify-center px-10 pt-10 gap-10">

               <Pressable onPress={() => handleGoTrilha(trilhaSemana, 'semana')} className="items-center justify-center flex" >
                  {({ pressed }) => (
                     <MotiView
                        animate={{ scale: pressed ? [0.9, 1] : 1 }}
                        transition={{ type: "timing", duration: 300 }}
                        style={!semanaComplete && stylesShadow.shadow}
                        className={`flex w-full items-center bg-white justify-center gap-4 p-6 rounded-2xl relative`}
                     >
                        {semanaComplete &&
                           <View className="absolute top-0 right-0 bottom-0 left-0 ">
                              <Image
                                 source={require('../assets/images/trilhaComplete.png')}
                                 resizeMode="stretch"
                                 className="flex w-full h-full justify-center items-center"
                              />
                           </View>
                        }

                        <Text className={`text-3xl font-bold ${semanaComplete ? 'text-white' : 'text-yellow-400'}`}>{'Trilha da Semana'}</Text>

                        <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                           <MaterialCommunityIcons name={semanaComplete ? 'trophy' : 'play'} size={48} color={'#facc15'} />
                        </View>

                        <Text className={` font-bold text-xl ${semanaComplete ? 'text-white' : 'text-gray-700'}`}>{videosSemanaAssisidos} / {totalVideosSemana} vídeos assistidos</Text>

                     </MotiView>
                  )}
               </Pressable>

               {!userData.welcomeTrackCompleted && (
                  <Pressable onPress={() => handleGoTrilha(trilhaBemVindo, 'fixa')} className="items-center justify-center flex" >
                     {({ pressed }) => (
                        <MotiView
                           animate={{ scale: pressed ? [0.9, 1] : 1 }}
                           transition={{ type: "timing", duration: 300 }}
                           style={!bemVindoComplete && stylesShadow.shadow}
                           className={`flex w-full items-center bg-white justify-center gap-4 p-6 rounded-2xl relative`}
                        >
                           {bemVindoComplete &&
                              <View className="absolute top-0 right-0 bottom-0 left-0 ">
                                 <Image
                                    source={require('../assets/images/trilhaComplete.png')}
                                    resizeMode="stretch"
                                    className="flex w-full h-full justify-center items-center"
                                 />
                              </View>
                           }

                           <Text className={`text-3xl font-bold ${bemVindoComplete ? 'text-white' : 'text-yellow-400'}`}>{trilhaBemVindo.name}</Text>

                           <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                              <MaterialCommunityIcons name={bemVindoComplete ? 'trophy' : 'play'} size={48} color={'#facc15'} />
                           </View>

                           <Text className={` font-bold text-xl ${bemVindoComplete ? 'text-white' : 'text-gray-700'}`}>{videosBemVindoAssisidos.length} / {trilhaBemVindo.videos.length} vídeos assistidos</Text>

                        </MotiView>
                     )}
                  </Pressable>
               )}

               {videosFixedAssisidos.length != trilhaFixed.videos.length && (
                  <Pressable disabled={!userData.welcomeTrackCompleted} onPress={() => handleGoTrilha(trilhaFixed, 'fixa')} className="items-center justify-center flex" >
                     {({ pressed }) => (
                        <>
                           <MotiView
                              animate={{ scale: pressed ? [0.9, 1] : 1 }}
                              transition={{ type: "timing", duration: 300 }}
                              style={!fixedComplete && stylesShadow.shadow}
                              className={`flex w-full items-center bg-white justify-center gap-4 p-6 rounded-2xl relative`}
                           >
                              {fixedComplete &&
                                 <View className="absolute top-0 right-0 bottom-0 left-0 ">
                                    <Image
                                       source={require('../assets/images/trilhaComplete.png')}
                                       resizeMode="stretch"
                                       className="flex w-full h-full justify-center items-center"
                                    />
                                 </View>
                              }

                              <Text className={`text-3xl font-bold ${fixedComplete ? 'text-white' : 'text-yellow-400'}`}>{trilhaFixed.name}</Text>

                              <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                                 <MaterialCommunityIcons name={fixedComplete ? 'trophy' : 'play'} size={48} color={'#facc15'} />
                              </View>

                              <Text className={` font-bold text-xl ${fixedComplete ? 'text-white' : 'text-gray-700'}`}>{videosFixedAssisidos.length} / {trilhaFixed.videos.length} vídeos assistidos</Text>

                           </MotiView>

                           {!userData.welcomeTrackCompleted && (
                              <View className="absolute left-0 right-0 top-0 bottom-0 bg-neutral-50/80 items-center rounded-2xl justify-center gap-6 flex px-10">
                                 <Text className="text-neutral-500 text-xl font-bold text-center">Para desbloquear, complete a Trilha de Boas Vindas</Text>

                                 <MaterialCommunityIcons name='lock' size={48} color='#a3a3a3' />
                              </View>
                           )}
                        </>
                     )}
                  </Pressable>
               )}

            </View>

            <View className="h-[5px] bg-yellow-500 w-full mt-10" />

            <View className="flex px-10 py-8">
               <Pressable
                  onPress={() => setShowCompletedTracks(!showCompletedTracks)}
                  className="flex flex-row -ml-6 items-center justify-start"
               >
                  <Text className="text-yellow-500 font-bold text-2xl">CONCLUÍDAS</Text>

                  <MotiView
                     animate={{
                        rotate: showCompletedTracks ? '90deg' : '0deg',
                     }}
                     transition={{ type: "timing", duration: 200 }}
                  >
                     <MaterialCommunityIcons name="chevron-right" size={44} color={'#eab308'} />
                  </MotiView>
               </Pressable>

               <View className="flex overflow-hidden pt-8">
                  <MotiView
                     className="flex gap-10 "
                     animate={{
                        height: showCompletedTracks ? 'auto' : 4,
                        translateY: showCompletedTracks ? 0 : -800, // Animação para sair de baixo do Pressable
                        zIndex: showCompletedTracks ? 10 : -10,
                     }}
                     transition={{
                        type: 'timing',
                        duration: 300,
                        opacity: { delay: showCompletedTracks ? 200 : 0 }
                     }}
                     style={{ overflow: 'hidden' }} // Para garantir que o conteúdo seja escondido ao retrair
                  >

                     {userData.welcomeTrackCompleted && (
                        <Pressable onPress={() => handleGoTrilha(trilhaBemVindo, 'fixa')} disabled={!showCompletedTracks} className="items-center justify-center flex" >
                           {({ pressed }) => (
                              <MotiView
                                 animate={{ scale: pressed ? [0.9, 1] : 1 }}
                                 transition={{ type: "timing", duration: 300 }}
                                 style={!bemVindoComplete && stylesShadow.shadow}
                                 className={`flex w-full items-center bg-white justify-center gap-4 p-6 rounded-2xl relative`}
                              >
                                 {bemVindoComplete &&
                                    <View className="absolute top-0 right-0 bottom-0 left-0 ">
                                       <Image
                                          source={require('../assets/images/trilhaComplete.png')}
                                          resizeMode="stretch"
                                          className="flex w-full h-full justify-center items-center"
                                       />
                                    </View>
                                 }

                                 <Text className={`text-3xl font-bold ${bemVindoComplete ? 'text-white' : 'text-yellow-400'}`}>{trilhaBemVindo.name}</Text>

                                 <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                                    <MaterialCommunityIcons name={bemVindoComplete ? 'trophy' : 'play'} size={48} color={'#facc15'} />
                                 </View>

                                 <Text className={` font-bold text-xl ${bemVindoComplete ? 'text-white' : 'text-gray-700'}`}>{videosBemVindoAssisidos.length} / {trilhaBemVindo.videos.length} vídeos assistidos</Text>

                              </MotiView>
                           )}
                        </Pressable>
                     )}

                     {videosFixedAssisidos.length == trilhaFixed.videos.length && (
                        <Pressable disabled={!userData.welcomeTrackCompleted || !showCompletedTracks} onPress={() => handleGoTrilha(trilhaFixed, 'fixa')} className="items-center justify-center flex" >
                           {({ pressed }) => (
                              <>
                                 <MotiView
                                    animate={{ scale: pressed ? [0.9, 1] : 1 }}
                                    transition={{ type: "timing", duration: 300 }}
                                    style={!fixedComplete && stylesShadow.shadow}
                                    className={`flex w-full items-center bg-white justify-center gap-4 p-6 rounded-2xl relative`}
                                 >
                                    {fixedComplete &&
                                       <View className="absolute top-0 right-0 bottom-0 left-0 ">
                                          <Image
                                             source={require('../assets/images/trilhaComplete.png')}
                                             resizeMode="stretch"
                                             className="flex w-full h-full justify-center items-center"
                                          />
                                       </View>
                                    }

                                    <Text className={`text-3xl font-bold ${fixedComplete ? 'text-white' : 'text-yellow-400'}`}>{trilhaFixed.name}</Text>

                                    <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                                       <MaterialCommunityIcons name={fixedComplete ? 'trophy' : 'play'} size={48} color={'#facc15'} />
                                    </View>

                                    <Text className={` font-bold text-xl ${fixedComplete ? 'text-white' : 'text-gray-700'}`}>{videosFixedAssisidos.length} / {trilhaFixed.videos.length} vídeos assistidos</Text>

                                 </MotiView>

                                 {!userData.welcomeTrackCompleted && (
                                    <View className="absolute left-0 right-0 top-0 bottom-0 bg-neutral-50/80 items-center rounded-2xl justify-center gap-6 flex px-10">
                                       <Text className="text-neutral-500 text-xl font-bold text-center">Para desbloquear, complete a Trilha de Boas Vindas</Text>

                                       <MaterialCommunityIcons name='lock' size={48} color='#a3a3a3' />
                                    </View>
                                 )}
                              </>
                           )}
                        </Pressable>
                     )}

                     
                  </MotiView>
               </View>

            </View>
         </ScrollView>

      </View>
   )
}