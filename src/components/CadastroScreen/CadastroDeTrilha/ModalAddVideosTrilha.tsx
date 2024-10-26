import { stylesShadow } from "@/src/styles/styles";
import { videoTrilha } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import { FlatList, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

type ModalAddVideosTrilhaPROPS = {
   closeModal: () => void;
   modalVisible: boolean;
   availableVideos: videoTrilha[];
   handleAddVideoToTrilha: (item: videoTrilha) => void;
   trilhaVideos: videoTrilha[]
}

export default function ModalAddVideosTrilha({ closeModal, modalVisible, availableVideos, handleAddVideoToTrilha, trilhaVideos }: ModalAddVideosTrilhaPROPS) {

   const [filters, setFilters] = useState(['categoria', 'sub-categoria', 'cargo', 'tutor(a)'])
   const [selectFilter, setSelectFilter] = useState('categoria')
   const [selectVideo, setSelectVideo] = useState('')
   const [videoSearch, setVideoSearch] = useState('')
   const scrollViewRef = useRef<ScrollView>(null);

   function getArticle(word: string): string {
      const feminineWords = ['categoria', 'sub-categoria'];
      return feminineWords.includes(word.toLowerCase()) ? 'a' : 'o';
   }

   const handleSelectFilter = (val: string) => {
      setSelectFilter(val);

      if (scrollViewRef.current) {
         scrollViewRef.current.scrollTo({ x: 0, animated: true });
      }
   };

   useEffect(() => {
      setSelectVideo('')
   }, [modalVisible])

   return (
      <Modal
         animationType="slide"
         transparent={true}
         visible={modalVisible}
         onRequestClose={closeModal}
      >
         <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white pb-4 gap-6 rounded-3xl w-[90%] flex items-center justify-center" style={stylesShadow.shadow}>

               <View className="flex  gap-6 p-4 items-center justify-center">
                  <View className="flex w-full px-4 flex-row gap-4 items-start justify-center">
                     <Text className="text-xl mt-2 font-bold">Procure um vídeo para adicionar a Trilha:</Text>

                     <Pressable onPress={closeModal} style={stylesShadow.shadow} className="bg-white rounded-full p-1 ">
                        <MaterialCommunityIcons name="close" color={'#000'} size={20} />
                     </Pressable>
                  </View>

                  <View className="flex w-full px-10">
                     <View style={stylesShadow.shadow} className="flex flex-row w-full items-center bg-white border-2 border-yellow-400 rounded-lg focus-within:border-yellow-500">
                        <MaterialCommunityIcons
                           name="magnify"
                           size={24}
                           color="#facc15"
                           className="ml-2"
                        />
                        <TextInput
                           value={videoSearch}
                           onChangeText={setVideoSearch}
                           placeholder={`Digite ${getArticle(selectFilter)} ${selectFilter}`}
                           className="text-gray-900 font-semibold text-lg p-1 outline-none flex-1"
                        />
                     </View>
                  </View>

                  <View className="flex  gap-2 self-start ">
                     <Text className="text-gray-700 font-bold text-xl">Filtrar por:</Text>

                     <ScrollView ref={scrollViewRef} showsHorizontalScrollIndicator={false} horizontal style={{ maxHeight: 40 }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 5, paddingHorizontal: 8 }}>
                        <View className="flex flex-row gap-2" style={stylesShadow.shadow}>
                           {filters
                              .slice() // Faz uma cópia do array para evitar mutações diretas
                              .sort((a, b) => (a === selectFilter ? -1 : b === selectFilter ? 1 : 0)) // Ordena para manter o item selecionado no topo
                              .map((val) => (
                                 <Pressable
                                    style={stylesShadow.shadow}
                                    key={val}
                                    onPress={() => handleSelectFilter(val)}
                                    className={`p-1 px-3 items-center justify-center rounded-full border border-yellow-400 flex ${val === selectFilter ? 'bg-yellow-400' : 'bg-white'
                                       }`}
                                 >
                                    <Text className={`font-semibold ${val === selectFilter ? 'text-white' : 'text-gray-600'}`}>
                                       {val.charAt(0).toUpperCase() + val.slice(1)}
                                    </Text>
                                 </Pressable>
                              ))}
                        </View>
                     </ScrollView>
                  </View>
               </View>

               <ScrollView className="h-[50%]" showsVerticalScrollIndicator={false}>
                  <View className="flex p-2 flex-wrap flex-row justify-between">
                     {availableVideos.map((item) => {

                        const isAddIndex = trilhaVideos.findIndex((val) => val.id === item.id);

                        return (
                           <Pressable key={item.id} onPress={() => setSelectVideo(item.id)} style={stylesShadow.shadow}
                              className={`flex w-[100px] mb-4 bg-white max-w-[100px] items-center justify-between border rounded-md ${selectVideo == item.id ? 'border-yellow-400' : 'border-gray-200'}`}
                           >

                              {isAddIndex != -1 && (
                                 <View className="bg-yellow-400 z-10 w-7 h-7 rounded-full absolute -left-1 -top-1 flex items-center justify-center border-2 border-yellow-600">
                                    <Text className="text-white text-sm font-semibold">{isAddIndex + 1}</Text>
                                 </View>
                              )}

                              <View className="bg-gray-600 overflow-hidden rounded-md w-full items-center justify-center relative">
                                 <Image
                                    className=""
                                    resizeMode="contain"
                                    src={item.thumbnail}
                                    style={{ width: 80, height: 120 }}
                                 />

                                 <MotiView
                                    animate={{ translateX: selectVideo == item.id && isAddIndex == -1 ? 0 : 200 }}
                                    transition={{ duration: 200, type: 'timing' }}
                                    className="absolute -top-1 -right-1 -left-1 bottom-0 z-10 -m-[4px]"
                                 >
                                    <Pressable onPress={() => handleAddVideoToTrilha(item)} className="bg-yellow-400 flex-1 items-center justify-center">
                                       <Text className="font-bold text-white">ADICIONAR</Text>
                                    </Pressable>
                                 </MotiView>
                              </View>
                              <View className="flex items-center min-h-10 bg-white flex-1 justify-center">
                                 <Text className="text-xs font-semibold text-gray-700 text-center p-1">{item.title}</Text>
                              </View>
                           </Pressable>
                        )
                     })}
                  </View>
               </ScrollView>

            </View>
         </View>
      </Modal>
   )
}