import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import React, { useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { DataUserContext } from "../hook/useDataUser";
import { SelectTrilhaContext } from "../hook/useSelectTrilha";
import { TabParamList } from "../routes/tab.routes";
import { stylesShadow } from "../styles/styles";
import { trilhaType } from "../types/customTypes";

export default function Treinamento() {

   const navigation = useNavigation<NavigationProp<TabParamList>>()

   const { trilha } = useContext(DataUserContext)
   const { setSelectTrilhaData } = useContext(SelectTrilhaContext)

   async function handleGoTrilha(val: trilhaType) {
      setSelectTrilhaData(val)
      navigation.navigate('TreinamentoStack', { screen: 'Trilha' })
   }

   return (
      <View className="flex flex-1 bg-white relative">
         <ScrollView className="flex flex-1">
            <View className="flex flex-1 justify-center p-10">

               {trilha.map((val, id) => {

                  const videosAssisidos = val.videos.filter((val) => { return val.watch == true && val })

                  return (
                     <Pressable

                        key={id}
                        className=""
                        onPress={() => handleGoTrilha(val)}
                     >
                        {({ pressed }) => (
                           <MotiView
                              animate={{ scale: pressed ? [0.9, 1] : 1 }}
                              transition={{ type: "timing", duration: 300 }}
                              style={stylesShadow.shadow}
                              className="flex items-center bg-white justify-center gap-4 p-6 rounded-2xl"
                           >
                              <Text className="text-3xl font-bold text-yellow-400">{val.name}</Text>

                              <View className="bg-white p-2 rounded-full" style={stylesShadow.shadow}>
                                 <MaterialCommunityIcons name="play" size={48} color={'#facc15'} />
                              </View>

                              <Text className="text-zinc-700 font-bold text-xl">{videosAssisidos.length} / {val.videos.length} vídeos assistidos</Text>
                           </MotiView>
                        )}
                     </Pressable>
                  )
               })}

            </View>
         </ScrollView>

      </View>
   )
}