import { db } from "@/src/services/firebaseConfig";
import { stylesShadow } from "@/src/styles/styles";
import { trilhaFixedTypeCadastro, VideoInfoProps, videoTrilha } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { addDoc, collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { MotiView } from "moti";
import { useContext, useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import ButtonGoBack from "../../MyComponents/ButtonGoBack";
import CustomButton from "../../MyComponents/CustomButton";
import AddVideosTrilha from "./AddVideosTrilha";
import ModalAddVideosTrilha from "./ModalAddVideosTrilha";
import { DataUserContext } from "@/src/hook/useDataUser";
import VideoSendModal from "../../Modal/VideoSendModal";
import React from "react";

const formatDate = (date: Date): string => {
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
   const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano

   return `${day}/${month}/${year}`;
};

function generateUniqueID(length = 8): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
   }
   return result;
}
function generateUniqueID12C(length = 12): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
   }
   return result;
}

export default function CadastroTrilha() {
   const { trilhaSemana,getUserData } = useContext(DataUserContext)

   const [loadingSubmit, setLoadingSubmit] = useState(false);

   const [trilhaName, setTrilhaName] = useState('');
   const [trilhaDescription, setTrilhaDescription] = useState('');
   
   const [trilhaVideos, setTrilhaVideos] = useState<videoTrilha[]>([]);
   const [modalVisible, setModalVisible] = useState(false);
   const [availableVideos, setAvailableVideos] = useState<videoTrilha[]>([])

   const [typeTrilhaSelect, setTypeTrilhaSelect] = useState<'semana' | 'fixa'>('semana')

   const [mostrarInicioPicker, setMostrarInicioPicker] = useState(false);
   const [mostrarFimPicker, setMostrarFimPicker] = useState(false);

   const [dataInicio, setDataInicio] = useState(new Date());
   const [dataFim, setDataFim] = useState(new Date());

   const [videoSend, setVideoSend] = useState(false);

   function closeModal() {
      setVideoSend(false)
   }

   const handleAddVideoToTrilha = (video: videoTrilha) => {
      const videoJaAdicionado = trilhaVideos.some((v) => v.id === video.id);

      if (videoJaAdicionado) {
         alert("Este vídeo já foi adicionado à trilha!");
      } else {
         setTrilhaVideos([...trilhaVideos, video]);
         setModalVisible(false);
      }
   };

   const handleCreateTrilhaFixa = async () => {
      const uniqueID = generateUniqueID12C()
      const trilhaID = generateUniqueID()
      const videosAddTrilha = trilhaVideos.map((val) => { return {videoID: val.id, uniqueID: uniqueID} })

      const trilhaInfo: trilhaFixedTypeCadastro = {
         createdAt: formatDate(new Date()),
         description: trilhaDescription,
         id: trilhaID,
         name: trilhaName,
         videos: videosAddTrilha,
      };

      await setDoc(doc(db, 'trilhas', trilhaID), trilhaInfo);
      setVideoSend(true)
   }

   const handleCreateTrilhaSemana = async () => {
      const videosAddTrilha = trilhaVideos.map((val) => { return {videoID: val.id, uniqueID: generateUniqueID12C()} })

      const semana = {
         id: trilhaSemana.length + 1,
         name: trilhaName,
         description: trilhaDescription,
         createdAt: formatDate(new Date()),
         start: dataInicio.toLocaleDateString(),
         end: dataFim.toLocaleDateString(),
         videos: videosAddTrilha,
      };

      try {
         await setDoc(doc(db, 'trilhas', 'semana', '1', `semana${trilhaSemana.length + 1}`), semana);
         setVideoSend(true)
         getUserData()
         console.log("Nova semana criada com sucesso!");
      } catch (error) {
         console.error("Erro ao criar semana: ", error);
      }
   }

   const onChangeInicio = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
      if (selectedDate) {
         setDataInicio(selectedDate);
       }
      setMostrarInicioPicker(Platform.OS === "ios");
   };

   const onChangeFim = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
      if (selectedDate) {
         setDataFim(selectedDate);
       }
      setMostrarFimPicker(Platform.OS === "ios");
   }

   useEffect(() => {
      const fetchVideos = async () => {
         const videosCollection = collection(db, "treinamento");
         const q = query(videosCollection);
         const videosSnapshot = await getDocs(q);
         const videosList = videosSnapshot.docs.map(doc => {
            const data = doc.data() as VideoInfoProps

            const video: videoTrilha = {
               id: data.videoID,
               title: data.name,
               cargo: data.cargo,
               categoria: data.categoria,
               subCategoria: data.subCategoria,
               createdAt: data.createdAt,
               tutor: data.tutor,
               thumbnail: data.thumbnail
            }
            return video
         });
         await setAvailableVideos(videosList);

      };

      fetchVideos()
   }, [])

   return (
      <>
         <ScrollView className="flex-1 bg-white">
            <View className="flex flex-1 bg-white items-start p-4 pb-14 gap-10">
               <View className="flex w-full flex-row justify-between items-center">
                  <ButtonGoBack />

                  <View className="flex flex-row gap-6">
                     <Pressable className="w-24 relative" onPress={() => setTypeTrilhaSelect("semana")}>
                        {({ pressed }) => (
                           <MotiView
                              animate={{ backgroundColor: typeTrilhaSelect == 'semana' ? '#facc15' : '#fff', translateY: pressed ? 5 : 0 }}
                              transition={{ type: 'timing', duration: 200 }}
                              style={stylesShadow.shadow}
                              className="rounded-full flex flex-1 p-1 items-center justify-center"
                           >
                              <Text className={`font-bold ${typeTrilhaSelect == 'semana' ? 'text-white' : 'text-yellow-400'}`}>SEMANA</Text>


                           </MotiView>
                        )}
                     </Pressable>
                     <Pressable className="w-24 relative" onPress={() => setTypeTrilhaSelect("fixa")}>
                        {({ pressed }) => (
                           <MotiView
                              animate={{ backgroundColor: typeTrilhaSelect == 'fixa' ? '#facc15' : '#fff', translateY: pressed ? 5 : 0 }}
                              transition={{ type: 'timing', duration: 200 }}
                              style={stylesShadow.shadow}
                              className="rounded-full flex flex-1 p-1 items-center justify-center"
                           >
                              <Text className={`font-bold ${typeTrilhaSelect == 'fixa' ? 'text-white' : 'text-yellow-400'}`}>FIXA</Text>
                           </MotiView>
                        )}
                     </Pressable>
                  </View>
               </View>

               <View
                  style={stylesShadow.shadow}
                  className="self-center bg-white flex items-end justify-center rounded-full px-4 p-2 flex-row gap-2"
               >
                  <Text className="text-2xl font-black text-yellow-400">Cadastrar Trilha {typeTrilhaSelect == "fixa"? 'Fixa': 'Semanal'}</Text>
                  <Image resizeMode="contain" className="w-9 h-9" source={require('../../../assets/images/caminhoYellow.png')} />
               </View>

               <Text className="block ml-4 text-2xl font-bold text-gray-600">Preencha os campos da nova Trilha:</Text>

               <View className="flex gap-4 px-14 w-full">

                  {typeTrilhaSelect == "semana" && (
                     <View className="w-full justify-between flex-row">
                        <View className="flex items-center justify-center gap-1">
                           <Text className="block text-lg font-bold text-gray-600">Inicio:</Text>

                           <CustomButton color="yellow" submit={() => setMostrarInicioPicker(true)} disable={loadingSubmit}>
                              <View className="px-2 p-1 rounded-xl flex flex-row items-center justify-center gap-2 bg-yellow-400">
                                 <Text className="text-white text-lg font-bold">Selecionar Data</Text>
                              </View>
                           </CustomButton>
                           {mostrarInicioPicker && (
                              <DateTimePicker
                                 value={dataInicio}
                                 mode="date"
                                 display="default"
                                 onChange={onChangeInicio}
                              />
                           )}
                           <Text className="mt-2 block text-lg font-bold text-gray-600">{dataInicio.toLocaleDateString()}</Text>
                        </View>

                        <View className="flex items-center justify-center gap-1">
                           <Text className="block ml-4 text-lg font-bold text-gray-600">Fim:</Text>

                           <CustomButton color="yellow" submit={() => setMostrarFimPicker(true)} disable={loadingSubmit}>
                              <View className="px-2 p-1 rounded-xl flex flex-row items-center justify-center gap-2 bg-yellow-400">
                                 <Text className="text-white text-lg font-bold">Selecionar Data</Text>
                              </View>
                           </CustomButton>

                           {mostrarFimPicker && (
                              <DateTimePicker
                                 value={dataFim}
                                 mode="date"
                                 display="default"
                                 onChange={onChangeFim}
                              />
                           )}
                           <Text className="mt-2 block text-lg font-bold text-gray-600">{dataFim.toLocaleDateString()}</Text>
                        </View>
                     </View>
                  )}

                  <View>
                     <Text className="block ml-4 text-lg font-bold text-gray-600">Digite o nome:</Text>
                     <TextInput
                        value={trilhaName}
                        onChangeText={setTrilhaName}
                        className="bg-white border-2 text-gray-900 text-lg rounded-lg border-yellow-400 focus:border-yellow-500 block p-2 outline-none"
                     />
                  </View>

                  <View>
                     <Text className="block ml-4 text-lg font-bold text-gray-600">Digite a descrição:</Text>
                     <TextInput
                        multiline={true}
                        textAlignVertical="top"
                        value={trilhaDescription}
                        onChangeText={setTrilhaDescription}
                        className="bg-white h-44 border-2 text-gray-900 text-lg rounded-lg border-yellow-400 focus:border-yellow-500 block p-2 outline-none"
                     />
                  </View>
               </View>

               <AddVideosTrilha trilhaVideos={trilhaVideos} setTrilhaVideos={(data) => setTrilhaVideos(data)} />

               <View className="flex self-center">
                  <CustomButton color="yellow" submit={() => setModalVisible(true)} disable={false} rounded>
                     <View className="px-3 p-2 rounded-full flex flex-row items-center justify-center gap-4 bg-yellow-400">
                        <MaterialCommunityIcons name="plus" size={40} color="#fff" />
                     </View>
                  </CustomButton>
               </View>

               <View className="flex w-full items-center justify-center mt-8">
                  <CustomButton 
                     color="yellow" 
                     submit={() => typeTrilhaSelect == 'semana' ? handleCreateTrilhaSemana() : handleCreateTrilhaFixa()} 
                     disable={loadingSubmit}
                  >
                     {loadingSubmit ? (
                        <View className="flex w-64 p-2 rounded-xl bg-yellow-400">
                           <View className="flex items-center justify-center animate-spin">
                              <MaterialCommunityIcons name="loading" size={28} color="#fff" />
                           </View>
                        </View>
                     ) : (
                        <View className="w-64 p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                           <Text className="text-white text-2xl font-bold">Enviar</Text>
                           <MaterialCommunityIcons name="send" size={28} color="#fff" />
                        </View>
                     )}
                  </CustomButton>
               </View>
            </View>

            <ModalAddVideosTrilha
               availableVideos={availableVideos}
               closeModal={() => setModalVisible(false)}
               handleAddVideoToTrilha={(item) => handleAddVideoToTrilha(item)}
               modalVisible={modalVisible}
               trilhaVideos={trilhaVideos}
            />
         </ScrollView>

         <MotiView
            animate={{ translateY: videoSend ? -10 : 200 }}
            className="absolute bottom-0 self-center"
         >
            <VideoSendModal text="Vídeo enviado com sucesso!" onClose={closeModal} videoSend={videoSend} />
         </MotiView>
      </>
   );
}
