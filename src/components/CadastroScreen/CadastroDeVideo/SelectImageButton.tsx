import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Alert, Pressable, Text, View, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

type SelectImageButtonProps = {
   imageURI: string,
   setImageURI: (uri: string) => void
}

export default function SelectImageButton({ setImageURI, imageURI }: SelectImageButtonProps) {

   const [loadingSelectImage, setLoadingSelectImage] = useState(false);

   const selectImage = async () => {
      setLoadingSelectImage(true);

      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [3, 5],
         quality: 1,
      });

      if (!result.canceled) {
         const { assets } = result as ImagePicker.ImagePickerSuccessResult;

         try {
            setImageURI(assets[0].uri);
         } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            Alert.alert('Erro', 'Erro ao fazer upload da imagem');
         }
      }
      setLoadingSelectImage(false);
   };

   return (
      <View className="flex items-center gap-8">

         <View className="flex items-center flex-row gap-4">
            <Pressable
               onPress={() => selectImage()}
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
                        {loadingSelectImage ? (
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
                              <MaterialCommunityIcons name={'image-plus'} size={28} color="#fff" className="" />
                           </>
                        )}
                     </MotiView>

                     <View className={`absolute h-10 -z-10 left-0 right-0 -bottom-[6px] rounded-xl bg-yellow-500`} />
                  </>
               )}
            </Pressable>

            {imageURI !== '' && (
               <Pressable
                  onPress={() => setImageURI('')}
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

      </View>
   );
}
