import { DataUserContext } from "@/src/hook/useDataUser";
import { SelectTrilhaContext } from "@/src/hook/useSelectTrilha";
import { TreinamentoStackRoutesParamsList } from "@/src/routes/trilha.stack.routes";
import { stylesShadow } from "@/src/styles/styles";
import { trilhaFixedType, trilhaSemanaType } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { MotiView } from "moti";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { Alert, BackHandler, Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function Trilha() {
   const { width, height } = Dimensions.get('window');
   const navigation = useNavigation<NavigationProp<TreinamentoStackRoutesParamsList>>()
   const { params: { key } } = useRoute<RouteProp<TreinamentoStackRoutesParamsList, 'Trilha'>>()

   const { trilhaSemana, trilhaFixed, userData } = useContext(DataUserContext)
   const { selectTrilha, isVideosLoading, nextVideo, setSelectTrilhaData, manageTrack } = useContext(SelectTrilhaContext)

   const [isImageLoaded, setIsImageLoaded] = useState(false);

   const itemWidth = 60;
   var toRight = true;
   var cont = 2
   const marginInicial = 100
   var marginL = 0
   var marginT = 8

   const calculateMargins = () => {
      const marginCorner = 35;
      const marginCenter = 25;

      marginL = (cont == 0 ? marginInicial : ((0.90 * itemWidth) * cont)) + 50;

      if (cont == 4) {
         marginT = marginCorner;
         marginL -= 15;
      } else if (cont == 0) {
         marginT = marginCorner;
         marginL -= 85;
      } else if (cont == 1 && toRight === true) {
         marginT = marginCorner;
      } else if (cont == 3 && toRight === false) {
         marginT = marginCorner;
      } else {
         marginT = marginCenter;
      }

      if (toRight) {
         cont += 1;
         if (cont == 5) {
            toRight = false;
            cont -= 2;
         }
      } else {
         cont -= 1;
         if (cont == -1) {
            toRight = true;
            cont += 2;
         }
      }
   }

   const closeTrilha = () => {
      navigation.goBack();
   }

   const openVideo = (videoID: string, uniqueID: string) => {
      navigation.navigate('PlayerVideo', { videoID: videoID, uniqueID: uniqueID });
   }

   const flatListRef = useRef<FlatList>(null);

   useEffect(() => {
      if (!selectTrilha) return;

      let videoIndex;

      if (Array.isArray(selectTrilha)) {
         // Trilha semanal (array de trilhas)
         const semanaIndex = selectTrilha.findIndex((trilhaSemana) =>
            trilhaSemana.videos.some((video) => video.uniqueID === nextVideo)
         );

         if (semanaIndex !== -1 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: semanaIndex, animated: true });
         }
      } else if (selectTrilha?.videos) {
         // Trilha fixa (objeto com array de vídeos)
         videoIndex = selectTrilha.videos.findIndex((val) => val.uniqueID === nextVideo);

         if (videoIndex !== -1) {
            flatListRef.current?.scrollToIndex({ animated: true, index: videoIndex });
         }
      }
   }, [selectTrilha, nextVideo]);

   useEffect(() => {
      async function preloadImages() {
         await Asset.loadAsync(require('../../assets/images/videoCompleteTop.png'));
         await Asset.loadAsync(require('../../assets/images/videoLockTop.png'));
         await Asset.loadAsync(require('../../assets/images/videoNextTop.png'));
      }

      preloadImages();
   }, []);

   type videosFixedAssisidosTYPE = {
      videoID: string;
      watch: boolean;
      uniqueID: string;
      isLocked: boolean;
   }[]

   const [totalVideosSemana, setTotalVideosSemana] = useState(0)
   const [videosSemanaAssisidos, setVideosSemanaAssisidos] = useState(0)

   const [videosFixedAssisidos, setVideosFixedAssisidos] = useState(0)

   useFocusEffect(
      React.useCallback(() => {
         if (Array.isArray(selectTrilha)) {
            let totalVideosSemana = 0;
            let videosSemanaAssisidos = 0;
            selectTrilha.forEach((trilha) => {
               // Adiciona o número total de vídeos de cada trilha ao total geral
               totalVideosSemana += trilha.videos.length;

               // Filtra os vídeos assistidos para essa trilha
               const videosAssistidos = trilha.videos.filter((video) =>
                  userData.watchedVideos.some((watchedVideo) => watchedVideo.uniqueID === video.uniqueID)
               );

               // Adiciona o número de vídeos assistidos ao total geral de vídeos assistidos
               videosSemanaAssisidos += videosAssistidos.length;
            });

            setTotalVideosSemana(totalVideosSemana)
            setVideosSemanaAssisidos(videosSemanaAssisidos)
            setIsImageLoaded(true)


         } else {
            let videosFixedAssisidos = [];
            videosFixedAssisidos = selectTrilha.videos.filter((fixedVideo) =>
               userData.watchedVideos.some((watchedVideo) => watchedVideo.uniqueID === fixedVideo.uniqueID)
            );

            setVideosFixedAssisidos(videosFixedAssisidos.length)
            setIsImageLoaded(true)
         }
      }, [])
   );
   
   useFocusEffect(
      React.useCallback(() => {
         const onBackPress = () => {
            navigation.goBack();
            return true; // Retornar true impede o comportamento padrão de fechar o app
         };

         BackHandler.addEventListener('hardwareBackPress', onBackPress);

         return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [])
   );

   return (
      <View className="flex flex-1 bg-white items-center">

         <View style={stylesShadow.shadow} className="bg-white w-full gap-6 flex pb-6 items-center">
            <View className="justify-between items-center flex w-full flex-row px-4 mt-4">
               <Pressable
                  onPress={closeTrilha}
                  className="relative"
               >
                  {({ pressed }) => (
                     <>
                        <View className="absolute top-2 left-0 right-0 -bottom-[6px] rounded-xl bg-yellow-500" />

                        <MotiView
                           from={{ translateY: 0 }}
                           animate={{ translateY: pressed ? [6, 0] : 0 }}
                           transition={{ type: 'timing', duration: 200 }}
                           className="flex flex-row gap-1 items-center justify-center p-1 px-1 pr-3 rounded-xl bg-yellow-400"
                        >
                           <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} />

                           <View className="flex relative">
                              <Text className="font-bold text-white text-base">
                                 Voltar
                              </Text>
                           </View>
                        </MotiView>
                     </>
                  )}
               </Pressable>

               {/* <Text>{isImageLoaded ? 'true' : 'false'}</Text> */}

               {key == 'fixa' ? (
                  <Text className={` font-bold text-base text-neutral-600`}>{videosFixedAssisidos} / {(selectTrilha as trilhaFixedType).videos.length} Vídeos Assistidos</Text>
               ) : (
                  <Text className={` font-bold text-base text-neutral-600`}>{videosSemanaAssisidos} / {totalVideosSemana} Vídeos Assistidos</Text>
               )}
            </View>

            <View style={stylesShadow.shadow} className="bg-white rounded-full w-64 p-2 px-8 ">
               <Text className="text-2xl font-black text-center text-yellow-400">{key == 'semana' ? 'Trilha da Semana' : (selectTrilha as trilhaFixedType).name}</Text>
            </View>

         </View>

         {(isVideosLoading && isImageLoaded) ? (
            <View className="w-full  items-center justify-center bg-white p-10">
               <MaterialCommunityIcons name="loading" size={48} color={'#facc15'} />
            </View>
         ) : (
            <View className="flex flex-1 flex-col w-full">

               {key === 'semana' ? (
                  // Renderização para trilha da semana
                  <FlatList<trilhaSemanaType>
                     ref={flatListRef}
                     className="py-10"
                     data={selectTrilha as trilhaSemanaType[]}
                     keyExtractor={(trilha, trilhaId) => trilhaId.toString()}
                     getItemLayout={(data, index) => ({
                        length: 300, // Altura fixa para cada item (ajuste conforme necessário)
                        offset: 500 * index,
                        index,
                     })}
                     onScrollToIndexFailed={(info) => {
                        flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
                     }}

                     ListFooterComponent={() => (
                        <View className="h-16 w-full bg-white/0" />
                     )}
                     renderItem={({ item: trilha }) => (
                        <View className="flex flex-col pb-8">
                           {/* Cabeçalho da trilha semanal */}
                           <View className="relative mb-10 px-4 flex">
                              <View className="h-[3px] bg-yellow-300 rounded-full absolute top-[45%] left-10 right-10" />
                              <View className="flex flex-row justify-between w-full">
                                 <View className="flex pb-1 px-4 bg-white rounded-full border border-yellow-300" style={stylesShadow.shadow}>
                                    <Text className="text-lg ml-6 font-bold text-yellow-500">{`${trilha.name}`}</Text>
                                    <Text className="text-xs font-bold text-neutral-400">{`${trilha.start} - ${trilha.end}`}</Text>
                                 </View>

                                 <View className="flex w-48 items-start justify-center px-2 bg-yellow-300 rounded-lg border-2 border-yellow-400" style={stylesShadow.shadow}>
                                    <Text className="text-sm font-bold text-white">{`${trilha.description}`}</Text>
                                 </View>
                              </View>
                           </View>

                           {/* FlatList par a os vídeos da trilha da semana */}
                           {trilha.videos.map((val: { uniqueID: string; isLocked: boolean; videoID: string; }) => {

                              calculateMargins();

                              return (
                                 <View key={val.uniqueID} style={{ marginLeft: marginL, marginTop: marginT }} className="flex h-24 w-24 relative items-center justify-center">
                                    {/* Animações e botões */}
                                    {nextVideo == val.uniqueID && (
                                       <View className="absolute -top-4 -right-4 -left-5 -bottom-2 rounded-full bg-current border-4 border-neutral-300/50" />
                                    )}
                                    {nextVideo == val.uniqueID && (
                                       <MotiView
                                          from={{ translateY: 0 }}
                                          animate={{ translateY: -10 }}
                                          transition={{
                                             loop: true,
                                             type: "timing",
                                             duration: 500,
                                             repeatReverse: true,
                                          }}
                                          className="absolute -top-14 -left-4"
                                       >
                                          <Image className="w-32 h-14" source={require('../../assets/images/comecar.png')} />
                                       </MotiView>
                                    )}
                                    <Pressable disabled={val.isLocked} onPress={() => openVideo(val.videoID, val.uniqueID)}>
                                       {({ pressed }) => (
                                          <>
                                             <View className="flex">
                                                {val.isLocked ? (
                                                   <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLock.png')} />
                                                ) : val.uniqueID == nextVideo ? (
                                                   <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNext.png')} />
                                                ) : (
                                                   <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoComplete.png')} />
                                                )}
                                             </View>
                                             <MotiView animate={{ translateY: pressed ? [10, 0] : 0 }} transition={{ type: 'timing', duration: 200 }} className="absolute bottom-[10px]">
                                                {val.isLocked ? (
                                                   <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLockTop.png')} />
                                                ) : val.uniqueID == nextVideo ? (
                                                   <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNextTop.png')} />
                                                ) : (
                                                   <Image className="right-2 w-28 h-20" resizeMode="contain" source={require('../../assets/images/videoCompleteTop.png')} />
                                                )}
                                             </MotiView>
                                          </>
                                       )}
                                    </Pressable>
                                 </View>
                              );

                           })}
                        </View>
                     )}
                  />
               ) : (
                  <FlatList
                     className="py-10 flex "
                     ref={flatListRef}
                     data={(selectTrilha as trilhaFixedType).videos}
                     keyExtractor={(val) => val.uniqueID.toString()}
                     horizontal={false}
                     onScrollToIndexFailed={(info) => {
                        flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
                     }}
                     ListHeaderComponent={() => (
                        <View className="h-8 w-full bg-white" />
                     )}
                     ListFooterComponent={() => (
                        <View className="h-16 w-full bg-white/0" />
                     )}

                     renderItem={({ item: val }) => {
                        calculateMargins()
                        return (
                           <View style={{ marginLeft: marginL, marginTop: marginT }} className={`flex h-24 w-24 relative items-center justify-center`}>

                              {nextVideo == val.uniqueID && (
                                 <View className={`absolute -top-4 -right-4 -left-5 -bottom-2 rounded-full bg-current border-4 border-neutral-300/50`} />
                              )}

                              {nextVideo == val.uniqueID && (
                                 <MotiView
                                    from={{ translateY: 0 }}
                                    animate={{ translateY: -10 }}
                                    transition={{
                                       loop: true,
                                       type: "timing",
                                       duration: 500,
                                       repeatReverse: true,
                                    }}
                                    className="absolute -top-14 -left-4"
                                 >
                                    <Image className="w-32 h-14" source={require(`../../assets/images/comecar.png`)} />
                                 </MotiView>
                              )}

                              <Pressable
                                 disabled={val.isLocked}
                                 className="relative "
                                 onPress={() => openVideo(val.videoID, val.uniqueID)}
                              >
                                 {({ pressed }) => (
                                    <>
                                       <View className={`flex`}>
                                          {val.isLocked ? (
                                             <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLock.png')} />
                                          ) : val.uniqueID == nextVideo ? (
                                             <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNext.png')} />
                                          ) : (
                                             <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoComplete.png')} />
                                          )}
                                       </View>

                                       <MotiView
                                          animate={{ translateY: pressed ? [10, 0] : 0 }}
                                          transition={{ type: 'timing', duration: 200 }}
                                          className="absolute bottom-[10px]"
                                       >
                                          {val.isLocked ? (
                                             <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLockTop.png')} />
                                          ) : val.uniqueID == nextVideo ? (
                                             <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNextTop.png')} />
                                          ) : (
                                             <Image className="right-2 w-28 h-20" resizeMode="contain" source={require('../../assets/images/videoCompleteTop.png')} />
                                          )}
                                       </MotiView>
                                    </>
                                 )}
                              </Pressable>

                           </View>

                        )
                     }}
                  />
               )}

            </View>
         )}

      </View>
   )
}