import { stylesShadow } from "@/src/styles/styles";
import { videoTrilha } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type AddVideosTrilhaPROPS = {
   trilhaVideos: videoTrilha[];
   setTrilhaVideos: (data: videoTrilha[]) => void;
}

export default function AddVideosTrilha({ trilhaVideos, setTrilhaVideos }: AddVideosTrilhaPROPS) {

   const [movedIndex, setMovedIndex] = useState<number | null>(null);
   const [replacedIndex, setReplacedIndex] = useState<number | null>(null);

   const itemWidth = 60;
   var toRight = true;
   var cont = 2
   const marginInicial = 100
   var marginL = 0
   var marginT = 8

   const handleDeleteOnList = (id: string) => {
      const newTrilha = trilhaVideos.filter((val) => val.id != id && val)
      setTrilhaVideos(newTrilha)
   }

   const resetHighlight = () => {
      setTimeout(() => {
         setMovedIndex(null);
         setReplacedIndex(null);
      }, 2000); // 1 segundo
   };

   const handleMoveUp = (index: number) => {
      if (index > 0) {
         const newTrilhaVideos = [...trilhaVideos];
         const temp = newTrilhaVideos[index - 1];
         newTrilhaVideos[index - 1] = newTrilhaVideos[index];
         newTrilhaVideos[index] = temp;

         setMovedIndex(index - 1); // Define o índice movido
         setReplacedIndex(index);  // Define o índice substituído

         setTrilhaVideos(newTrilhaVideos);

         resetHighlight();
      }
   };

   const handleMoveDown = (index: number) => {
      if (index < trilhaVideos.length - 1) {
         const newTrilhaVideos = [...trilhaVideos];
         const temp = newTrilhaVideos[index + 1];
         newTrilhaVideos[index + 1] = newTrilhaVideos[index];
         newTrilhaVideos[index] = temp;

         setMovedIndex(index + 1); // Define o índice movido
         setReplacedIndex(index);  // Define o índice substituído

         setTrilhaVideos(newTrilhaVideos);

         resetHighlight();
      }
   };

   const renderItem = (item: videoTrilha, index: number) => {
      const backgroundColor = index === movedIndex ? '#dcfce7' :
         index === replacedIndex ? '#ffedd5' : 'white';

      const marginCorner = 35;
      const marginCenter = 25;

      marginL = cont == 0 ? marginInicial : 0.9 * itemWidth * cont;

      if (cont == 4) {
         marginT = marginCorner;
         marginL -= 15;
      } else if (cont == 0) {
         marginT = marginCorner;
         marginL -= 85;
      } else if (cont == 1 && toRight == true) {
         marginT = marginCorner;
      } else if (cont == 3 && toRight == false) {
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

      return (
         <MotiView
            key={item.id}
            from={{ opacity: 0, translateY: 20, }}
            animate={{ opacity: 1, translateY: 0, translateX: marginL}}
            transition={{ type: 'timing', duration: 300, translateX: {delay: 100}}}
            style={[{ marginTop: marginT }]}
            className="flex items-center justify-center"
         >
            <View className="flex h-20 w-20 bg-white  rounded-full overflow-hidden items-center justify-center" style={stylesShadow.shadow}>
               <Image className="w-20 h-20" src={item.thumbnail} resizeMode="contain" />
            </View>
            <Text className="w-28 text-neutral-700 font-semibold text-center">{item.title}</Text>
         </MotiView>
      );
   };

   return (
      <View className="w-full">
         <Text className="block ml-4 text-2xl font-bold text-gray-600">
            Vídeos Selecionados:
         </Text>

         <View className="w-screen px-2 pb-10 flex self-center">
            {trilhaVideos.map((item, index) => (
               <View key={item.id} className="flex flex-row items-center">
                  <View className="flex flex-row items-center gap-3">
                     <Text className="font-bold text-neutral-600 text-lg">#{index + 1}</Text>

                     <Pressable
                        onPress={() => handleDeleteOnList(item.id)}
                        className="relative"
                     >
                        {({ pressed }) => (
                           <>
                              <MotiView
                                 from={{ translateY: 0 }}
                                 animate={{ translateY: pressed ? 4 : 0 }}
                                 transition={{ type: 'timing', duration: 200 }}
                                 className={`p-1 px-2 flex flex-row items-center justify-between rounded-xl bg-red-400`}
                              >
                                 <MaterialCommunityIcons name={'trash-can'} size={24} color="#fff" className="" />
                              </MotiView>

                              <View className={`absolute h-10 -z-10 left-0 right-0 -bottom-[4px] rounded-xl bg-red-500`} />
                           </>
                        )}
                     </Pressable>

                     <View className="flex-col gap-2">
                        <Pressable onPress={() => handleMoveUp(index)} style={stylesShadow.shadow} className="bg-green-400 p-1 rounded-full">
                           <MaterialCommunityIcons name="arrow-up-bold" size={24} color="white" />
                        </Pressable>
                        <Pressable onPress={() => handleMoveDown(index)} style={stylesShadow.shadow} className="bg-orange-400 p-1 rounded-full">
                           <MaterialCommunityIcons name="arrow-down-bold" size={24} color="white" />
                        </Pressable>
                     </View>

                     
                  </View>
                  {renderItem(item, index)}
               </View>
            ))}
         </View>
      </View >
   )
}