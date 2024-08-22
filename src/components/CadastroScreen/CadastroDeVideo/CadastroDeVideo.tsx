import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import VideoSendModal from "../../Modal/VideoSendModal";
import ButtonGoBack from "../../MyComponents/ButtonGoBack";
import FormCadastroVideo from "./FormCadastroVideo";

export default function CadastroDeVideo() {

   const [videoSend, setVideoSend] = useState(false);

   function closeModal() {
      setVideoSend(false)
   }

   return (
      <>
         <ScrollView>
            <View className="flex bg-white flex-1 gap-8 items-start relative p-6 pb-14">

               <ButtonGoBack />

               <View
                  style={stylesShadow.shadow}
                  className="self-center bg-white round-xl flex items-center justify-center rounded-xl px-4 flex-row gap-2"
               >
                  <Text className="text-2xl font-black text-yellow-400">Cadastrar Vídeo</Text>
                  <MaterialCommunityIcons name="video-plus" size={32} color={'#facc15'} />
               </View>

               <View className="flex mt-4 gap-6 w-full items-center">

                  <Text className="text-2xl font-bold text-gray-600 self-start">Preencha os dados do novo vídeo:</Text>              

                  <FormCadastroVideo videoSend={() => setVideoSend(true)}/>
               </View>
            </View>
         </ScrollView>

         <MotiView
            animate={{ translateY: videoSend ? -10 : 200 }}
            className="absolute bottom-0 self-center"
         >
            <VideoSendModal text="Vídeo enviado com sucesso!" onClose={closeModal} videoSend={videoSend} />
         </MotiView>
      </>
   )
}