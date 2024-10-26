import { TreinamentoStackRoutesParamsList } from "@/src/routes/trilha.stack.routes";
import { db } from "@/src/services/firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { doc, getDoc } from "firebase/firestore";
import { MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import Modal from "../Modal/Modal";
import CustomButton from "../MyComponents/CustomButton";
import { throttle } from 'lodash';
import ButtonGoBack from "../MyComponents/ButtonGoBack";
import { VideoInfoProps } from "@/src/types/customTypes";
import { useFocusEffect } from "expo-router";

export default function VideoComponent() {

   const videoRef = useRef<Video>(null);

   const navigation = useNavigation<NavigationProp<TreinamentoStackRoutesParamsList>>()
   const { params } = useRoute<RouteProp<TreinamentoStackRoutesParamsList, 'PlayerVideo'>>()

   const [goQuestions, setGoQuestions] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   const [isPlaying, setIsPlaying] = useState(true);
   const [progress, setProgress] = useState(0);
   const [duration, setDuration] = useState(0);
   const [controlsVisible, setControlsVisible] = useState(false);

   const [video, setVideo] = useState<VideoInfoProps>({} as VideoInfoProps);

   const showQuestions = async () => {
      navigation.navigate('Perguntas', { videoInfo: video, uniqueID: params.uniqueID })
      setProgress(0); // Reseta o progresso do vídeo
      await videoRef.current?.setPositionAsync(0); // Reposiciona o vídeo ao início
      setIsPlaying(false)
      setGoQuestions(false); // Fecha a modal
   }

   const handlePlayPause = () => {
      if (isPlaying) {
         videoRef.current?.pauseAsync();
      } else {
         videoRef.current?.playAsync();
      }
      setIsPlaying(!isPlaying);
   };

   const advance10Seconds = async () => {
      const status = await videoRef.current?.getStatusAsync();
      if (status && status.isLoaded) {
         const newPosition = status.positionMillis + 10000; // 10 segundos
         await videoRef.current?.setPositionAsync(newPosition);
      }
   };

   const rewind10Seconds = async () => {
      const status = await videoRef.current?.getStatusAsync();
      if (status && status.isLoaded) {
         const newPosition = Math.max(0, status.positionMillis - 10000); // 10 segundos
         await videoRef.current?.setPositionAsync(newPosition);
      }
   };

   const handleProgress = throttle((playbackStatus: any) => {
      if (playbackStatus.isLoaded) {
         setProgress(playbackStatus.positionMillis / playbackStatus.durationMillis);
         setDuration(playbackStatus.durationMillis);

         if (playbackStatus.didJustFinish) {
            setGoQuestions(true);
         }
      }
   }, 500); // Throttle to update every 500ms

   const repeatVideo = async () => {
      setGoQuestions(false); // Fecha a modal
      setProgress(0); // Reseta o progresso do vídeo
      await videoRef.current?.setPositionAsync(0); // Reposiciona o vídeo ao início
      setIsPlaying(true); // Define o estado como "playing"
      await videoRef.current?.playAsync(); // Inicia a reprodução do vídeo
   };

   const toggleControls = () => {
      setControlsVisible(!controlsVisible);
      startHideControlsTimer()
   };

   function formatTime(ms: number): string {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // Adiciona um zero à esquerda se os segundos forem menores que 10
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${minutes}:${formattedSeconds}`;
   }

   const startHideControlsTimer = () => {
      setTimeout(() => {
         setControlsVisible(false);
      }, 5000);
   };

   useEffect(() => {

      const fechVideo = async () => {
         const docRef = doc(db, "treinamento", params?.videoID as string);
         const docSnap = await getDoc(docRef);

         if (docSnap.exists()) {
            setVideo(docSnap.data() as VideoInfoProps)
         }
      }

      fechVideo()
      startHideControlsTimer()

   }, [params?.videoID])

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

      <View className="absolute top-0 right-0 bottom-0 left-0 bg-slate-900 z-20">
         {isLoading && (
            <View className="flex flex-1 items-center justify-end">
               <View className="flex items-center justify-center  p-4 animate-spin">
                  <MaterialCommunityIcons name="loading" size={48} color="#facc15" className="" />
               </View>
            </View>
         )}

         <Pressable onPress={toggleControls} className={`${isLoading ? 'opacity-0' : 'opacity-100'}`} style={{ flex: 1 }}>
            <Video
               ref={videoRef}
               source={{ uri: video.url }}
               style={{ flex: 1 }}
               useNativeControls={false}
               resizeMode={ResizeMode.CONTAIN}
               onPlaybackStatusUpdate={handleProgress}
               shouldPlay={isPlaying}
               onLoadStart={() => setIsLoading(true)}
               onReadyForDisplay={() => setIsLoading(false)}
               shouldRasterizeIOS={true}
               renderToHardwareTextureAndroid={true}
            />
         </Pressable>

         <MotiView
            animate={{ opacity: controlsVisible ? 1 : 0, translateX: controlsVisible ? 0 : 800 }}
            transition={{ opacity: {type: "timing", duration: 300}, translateX: {type: 'timing', duration: 0} }}
            className=" absolute left-0 top-0 right-0 bottom-0"
         >
            <Pressable className=" flex flex-1" onPress={toggleControls}>

               <View className="absolute p-4">
                  <ButtonGoBack />
               </View>

               <View
                  className="absolute flex flex-row gap-14 items-center justify-center self-center top-[45%]"
               >
                  <Pressable
                     onPress={rewind10Seconds}
                     className="bg-slate-200/40 rounded-full p-2 w-16 h-16 flex items-center justify-center"
                  >
                     <Ionicons name="play-back" size={32} color="white" />
                  </Pressable>

                  <Pressable
                     onPress={handlePlayPause}
                     className="bg-slate-200/40 rounded-full p-2 w-20 h-20 flex items-center justify-center"
                  >
                     <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="white" />
                  </Pressable>

                  <Pressable
                     onPress={advance10Seconds}
                     className="bg-slate-200/40 rounded-full p-2 w-16 h-16 flex items-center justify-center"
                  >
                     <Ionicons name="play-forward" size={32} color="white" />
                  </Pressable>
               </View>

               <View className="absolute bottom-4 rounded-full self-center px-6 p-2 gap-1 flex-row justify-between items-center bg-[rgba(0,0,0,0.5)]">

                  <Text className="text-yellow-400 text-xl font-bold">{formatTime(progress * duration)}</Text>
                  <Text className="text-white text-xl font-bold">/ {formatTime(duration)}</Text>

               </View>
               <Pressable className="absolute bottom-2 left-2 bg-white rounded-full p-2" onPress={() => setGoQuestions(true)}>
                  <Text>Ir para perguntas</Text>
               </Pressable>
            </Pressable>
         </MotiView>


         {goQuestions &&
            <Modal isOpen={goQuestions} >
               <View className="bg-white m-6 flex p-2 py-14 items-center gap-8 rounded-xl shadow-lg w-full border-2 border-yellow-500">

                  <Pressable onPress={() => setGoQuestions(false)} className="absolute left-0 top-0 p-2">
                     <MaterialCommunityIcons name="close" size={28} color={'#000'} />
                  </Pressable >

                  <View className="flex gap-8">
                     <Text className=" text-gray-800 font-bold text-4xl text-center ">Hora do desafio!</Text>
                     <Text className=" text-gray-600 font-bold text-xl text-center ">Está pronto para responder algumas perguntas? 🤔</Text>
                  </View>

                  <View className="flex gap-8">
                     <CustomButton color="yellow" submit={showQuestions} disable={false}>
                        <View className=" p-2 px-4 w-72 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                           <Text className="text-white text-xl font-bold">Responder Perguntas</Text>
                           <MaterialCommunityIcons name="pencil" size={28} color="#fff" />
                        </View>
                     </CustomButton>

                     <CustomButton color="yellow" submit={() => repeatVideo()} disable={false}>
                        <View className=" p-2 px-4 w-72 justify-between rounded-xl flex flex-row items-center gap-4 bg-white border-t border-l border-r border-yellow-500">
                           <Text className="text-yellow-400 text-lg font-bold">Assisitr Novamente</Text>
                           <MaterialCommunityIcons name="motion-play-outline" size={24} color="#facc15" />
                        </View>
                     </CustomButton>
                  </View>

               </View>
            </Modal>
         }

      </View>
   )
}
