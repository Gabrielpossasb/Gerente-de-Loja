import { SelectTrilhaContext } from "@/src/hook/useSelectTrilha";
import { TreinamentoStackRoutesParamsList } from "@/src/routes/trilha.stack.routes";
import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import React, { useContext, useState } from "react";
import { Alert, BackHandler, Image, Pressable, ScrollView, Text, View } from "react-native";

export default function Trilha() {

   const navigation = useNavigation<NavigationProp<TreinamentoStackRoutesParamsList>>()

   const { selectTrilha } = useContext(SelectTrilhaContext)

   const [nextVideo, setNextVideo] = useState('')

   const itemWidth = 60;
   var toRight = true;
   var cont = 2
   const marginInicial = 100
   var marginL = 0
   var marginT = 8

   // const buscarTodosVideos = async () => {
   //    const videosCollection = collection(db, 'treinamento');
   //    const videosSnapshot = await getDocs(videosCollection);
   //    const videosList: VideoInfoProps[] = videosSnapshot.docs.map(doc => {
   //       const data = doc.data();
   //       // Converta os dados para o tipo VideoInfoProps
   //       const videoInfo: VideoInfoProps = {
   //          name: data.name,
   //          categoria: data.categoria,
   //          colecao: data.colecao,
   //          cargo: data.cargo, 
   //          url: data.url,
   //          videoID: data.videoID,
   //       };
   //       return videoInfo;
   //    });

   //    const docRef = doc(db, "users", userData.uid);
   //    const docSnap = await getDoc(docRef);

   //    if (docSnap.exists()) {

   //    }
   // };

   const closeTrilha = () => {
      navigation.goBack();
   }

   const openVideo = (videoID: string) => {
      navigation.navigate('PlayerVideo', { videoID: videoID });
   }

   useFocusEffect(
      React.useCallback(() => {

         if (Array.isArray(selectTrilha.videos) && selectTrilha.videos.length > 0) {
            const nextVi = selectTrilha.videos.find(video => !video.watch);
            console.log(nextVi?.videoID)
            if (nextVi != undefined) {
               setNextVideo(nextVi.videoID)
            } else if (selectTrilha.videos.length > 0) {
               setNextVideo('val')
            } else {
               Alert.alert('Ocorreu um erro. Esta trilha não possui nenhum vídeo :(')
            }
         }
      }, [selectTrilha])
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
      <ScrollView className="flex flex-1 bg-white">
         <View className="flex flex-1  items-center justify-center pb-10 gap-8">

            <View className="self-start ml-4 mt-4">
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
            </View>

            <View style={stylesShadow.shadow} className="bg-white rounded-2xl w-64 p-2 px-8 ">
               <Text className="text-2xl font-black text-center text-yellow-400">{selectTrilha.name}</Text>
            </View>

            {/* Aba 1 */}



            {/* Aba 2 */}

            <View className="flex flex-col mt-6 w-[280px]">

               {Array.isArray(selectTrilha.videos) && selectTrilha.videos.length > 0 && nextVideo != '' ? (
                  selectTrilha.videos.map((val, id) => {

                     const marginCorner = 35
                     const marginCenter = 25

                     marginL = cont == 0 ? marginInicial : ((0.90 * itemWidth) * cont)

                     if (cont == 4) {
                        marginT = marginCorner
                        marginL -= 15
                     } else if (cont == 0) {
                        marginT = marginCorner
                        marginL -= 85
                     } else if (cont == 1 && toRight == true) {
                        marginT = marginCorner
                     } else if (cont == 3 && toRight == false) {
                        marginT = marginCorner
                     } else {
                        marginT = marginCenter
                     }

                     if (toRight) {
                        cont += 1
                        if (cont == 5) {
                           toRight = false
                           cont -= 2
                        }
                     } else {
                        cont -= 1
                        if (cont == -1) {
                           toRight = true
                           cont += 2
                        }
                     }

                     return (
                        <View key={id} style={{ marginLeft: marginL, marginTop: marginT }}
                           className={`flex h-24 w-24 relative items-center justify-center`}>

                           {nextVideo == val.videoID && (
                              <View
                                 className={`absolute -top-4 -right-4 -left-5 -bottom-2 rounded-full bg-current border-4 border-neutral-300/50`}
                              />
                           )}

                           {nextVideo == val.videoID && (
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
                                 <Image
                                    className="w-32 h-14"
                                    source={require(`../../assets/images/comecar.png`)}
                                 />
                              </MotiView>
                           )}

                           <Pressable
                              disabled={(!val.watch && nextVideo != val.videoID) && true}
                              className="relative "

                              onPress={() => openVideo(val.videoID)}
                           >
                              {({ pressed }) => (

                                 <>
                                    <View
                                       className={`flex`}
                                    > 
                                       { val.watch ? 
                                          <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoComplete.png')} />
                                       : val.videoID == nextVideo ? 
                                          <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNext.png')} /> 
                                       : 
                                          <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLock.png')} />
                                       }
                                    </View>

                                    <MotiView
                                       animate={{ translateY: pressed ? [10, 0] : 0 }}
                                       transition={{ type: 'timing', duration: 200 }}

                                       className="absolute bottom-[10px]"
                                    >  
                                       { val.watch ? 
                                          <Image className="right-2 w-28 h-20" resizeMode="contain" source={require('../../assets/images/videoCompleteTop.png')} />
                                       : val.videoID == nextVideo ? 
                                          <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoNextTop.png')} /> 
                                       : 
                                          <Image className="w-24 h-20" resizeMode="contain" source={require('../../assets/images/videoLockTop.png')} />
                                       }
                                       

                                    </MotiView>
                                 </>
                              )}

                           </Pressable>

                        </View>
                     )
                  })
               ) : (
                  <View className="flex flex-1 ">
                     <View className="flex items-center justify-center p-4 animate-spin">
                        <MaterialCommunityIcons name="loading" size={48} color="#facc15" className="" />
                     </View>
                  </View>
               )}
            </View>

            {/* Aba 3 */}


         </View>
      </ScrollView>


   )
}