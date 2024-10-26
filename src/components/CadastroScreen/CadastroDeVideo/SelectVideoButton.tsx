import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Alert, Pressable, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

type SelectVideoButtonPROPS = {
   videoURI: string,
   setVideoURI: (a: string) => void
}

export default function SelectVideoButton({setVideoURI, videoURI}: SelectVideoButtonPROPS) {

   const [loadingSelectVideo, setLoadingSelectVideo] = useState(false)

   const selectVideo = async () => {
      setLoadingSelectVideo(true)

      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled) {
         const { assets } = result as ImagePicker.ImagePickerSuccessResult

         try {
            setVideoURI(assets[0].uri)
         } catch (error) {
            console.error('Erro ao fazer upload do vídeo:', error);
            Alert.alert('Erro', 'Erro ao fazer upload do vídeo');
         }
      }
      setLoadingSelectVideo(false)
   };

   return (
      <View className="flex items-center flex-row gap-4">

         <Pressable
            onPress={() => selectVideo()}
            className="relative"
         >
            {({ pressed }) => (
               <>
                  <MotiView
                     from={{ translateY: 0 }}
                     animate={{ translateY: pressed ? [6, 0] : 0 }}
                     transition={{ type: 'timing', duration: 200 }}
                     className={`p-1 px-4 w-44 flex flex-row items-center justify-between rounded-xl bg-yellow-400`}
                  >
                     {loadingSelectVideo ? (
                        <View className="flex flex-1 ">
                           <View className="flex items-center justify-center animate-spin">
                              <MaterialCommunityIcons name="loading" size={28} color="#fff" className="" />
                           </View>
                        </View>
                     ) : (
                        <>
                           <Text className="text-white text-xl font-bold">
                              Procurar
                           </Text>
                           <MaterialCommunityIcons name={'video-plus'} size={28} color="#fff" className="" />
                        </>
                     )}
                  </MotiView>

                  <View className={`absolute h-10 -z-10 left-0 right-0 -bottom-[6px] rounded-xl bg-yellow-500`} />
               </>
            )}
         </Pressable>

         {videoURI != '' && (
            <Pressable
               onPress={() => setVideoURI('')}
               className="relative"
            >
               {({ pressed }) => (
                  <>
                     <MotiView
                        from={{ translateY: 0 }}
                        animate={{ translateY: pressed ? 6 : 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className={`p-1 px-4 w-40 flex flex-row items-center justify-between rounded-xl bg-red-400`}
                     >
                        <Text className="text-white text-2xl font-bold">
                           {'Excluir'}
                        </Text>
                        <MaterialCommunityIcons name={'close'} size={28} color="#fff" className="" />
                     </MotiView>

                     <View className={`absolute h-10 -z-10 left-0 right-0 -bottom-[6px] rounded-xl bg-red-500`} />
                  </>
               )}
            </Pressable>
         )}
      </View>
   )
}