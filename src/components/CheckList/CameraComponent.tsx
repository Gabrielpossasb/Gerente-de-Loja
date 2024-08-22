import { CameraContext } from "@/src/hook/useCamera";
import { CompletionContext } from "@/src/hook/useCompletion";
import { CameraView } from "expo-camera";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MotiView } from "moti";
import { useContext, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, storage } from "../../services/firebaseConfig";

interface listType {
   name: string;
   check: boolean;
   description: string;
   image: string | null;
}

export function CameraComponent() {
   const cameraRef = useRef<CameraView>(null);
   const [hasPhoto, setHasPhoto] = useState(false)
   const [capturedImage, setCapturedImage] = useState('');
   const [ImageLoading, setImageLoading] = useState(false)

   const { createCompletionPercentage } = useContext(CompletionContext)

   const { cam, workChecked, setCam, setList } = useContext(CameraContext)

   const takePicture = async () => {

      if (cameraRef.current) {
         const photo = await cameraRef.current.takePictureAsync();
         if (photo) {
            setCapturedImage(photo.uri);
         }
      }

      setHasPhoto(true)
   };

   const todayDate = () => {
      const today = new Date()
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const formattedDate = `${day < 10 ? ('0' + day) : day}_${month < 10 ? ('0' + month) : month}`;

      return formattedDate
   }

   const uploadImageToFirebase = async (uri: string) => {
      const formattedDate = todayDate();
      try {
         const storageRef = ref(storage, `1/${formattedDate}/${workChecked.name}.jpg`);
         const response = await fetch(uri);
         const blob = await response.blob();

         return new Promise<string>((resolve, reject) => {

            uploadBytes(storageRef, blob).then(() => {
               console.log('Uploaded a blob or file!');
               getDownloadURL(storageRef).then((url: string | PromiseLike<string>) => {
                  resolve(url);
               }).catch((error: any) => {
                  console.error('Error getting download URL:', error);
                  reject(error);
               });
            }).catch((error: any) => {
               console.error('Error uploading file:', error);
               reject(error);
            });
         });

      } catch (error) {
         console.error('Erro ao enviar a imagem para o Firebase Storage:', error);
         return null;
      }
   };

   const HandleCheck = async () => {

      setImageLoading(true)
      setHasPhoto(false)

      const docRef = doc(db, '01', 'checkList');

      const imageUrl = await uploadImageToFirebase(capturedImage);

      setList((prevList) => {
         const newList = [...prevList]; // Criando uma cópia do array original
         newList[workChecked.id] = { ...newList[workChecked.id], check: true, image: imageUrl }; // Modificando o objeto desejado

         const checkedCount = newList.filter(item => item.check).length; // Usando a lista atualizada
         const totalItems = newList.length;
         const percentage = (checkedCount / totalItems) * 100;
         createCompletionPercentage(percentage);

         updateDoc(docRef, {
            items: newList,
            completionPercentage: percentage
         });

         return newList; // Retornando a nova lista atualizada
      });

      setCam(false)
      setHasPhoto(false)
      setImageLoading(false)

   }

   return (
      <>
         {
            cam ?
               <View className="flex absolute top-0 bottom-0 right-0 left-0 overflow-hidden bg-gray-900 z-20">

                  {ImageLoading ?
                     <View className={`absolute top-0 right-0 bottom-0 left-0 bg-white flex items-center justify-center duration-500 ${ImageLoading ? 'opacity-100' : 'opacity-0'}`}>
                        <MotiView
                           from={{ translateX: -40 }}
                           animate={{ translateX: 40 }}
                           transition={{
                              type: 'timing',
                              duration: 1000,
                              loop: true,
                              repeatReverse: true
                           }}
                           className="flex w-12 h-10 absolute bg-yellow-500 rounded-full z-30"
                        />
                        <MotiView
                           from={{ translateX: -40 }}
                           animate={{ translateX: 40 }}
                           transition={{
                              type: 'timing',
                              duration: 1000,
                              delay: 50,
                              loop: true,
                              repeatReverse: true
                           }}
                           className="flex w-12 h-10 absolute bg-yellow-400 rounded-full z-20"
                        />
                        <MotiView
                           from={{ translateX: -40 }}
                           animate={{ translateX: 40 }}
                           transition={{
                              type: 'timing',
                              duration: 1000,
                              delay: 100,
                              loop: true,
                              repeatReverse: true
                           }}
                           className="flex w-12 h-10 absolute bg-yellow-300 rounded-full z-10"
                        />
                     </View>
                     :
                     <CameraView style={{ flex: 1, position: "relative" }} ref={cameraRef} facing='back'>

                        <View className="relative z-20 flex h-full p-4 justify-between">
                           <View className="flex items-start">
                              <TouchableOpacity onPress={() => setCam(false)} >
                                 <View className="bg-black rounded-full duration-200">
                                    <Icon name="closecircle" size={32} color={"#fff"} />
                                 </View>
                              </TouchableOpacity>
                           </View>

                           <View className="flex flex-row justify-center items-end">

                              {hasPhoto ?
                                 <MotiView
                                    from={{ translateY: 60, scale: 0.3 }}
                                    animate={{ translateY: 0, scale: 1 }}
                                    transition={{
                                       duration: 500,
                                       delay: 500,
                                       type: "timing"
                                    }}
                                 >
                                    <View className="flex flex-row gap-6">

                                       <TouchableOpacity onPress={() => HandleCheck()}>
                                          <View className={`gap-2 border border-b-4 border-green-600 p-2 px-4 flex flex-row items-center justify-center
                                          rounded-xl bg-green-400`}>
                                             <Icon name="checkcircle" size={24} className="bg-white rounded-full" color={'rgb(22 163 74)'} />
                                             <Text className="font-extrabold text-xl text-white">ENVIAR</Text>
                                          </View>
                                       </TouchableOpacity>

                                       <TouchableOpacity onPress={() => setHasPhoto(false)}>
                                          <View className="gap-2 border border-b-4 border-red-600 p-2 px-4 flex flex-row items-center justify-center
                                          rounded-xl bg-red-400">
                                             <Text className="font-extrabold text-xl text-white">APAGAR</Text>
                                             <Icon name="delete" size={24} color={'rgb(220 38 38)'} />
                                          </View>
                                       </TouchableOpacity>

                                    </View>
                                 </MotiView>
                                 :
                                 <TouchableOpacity className="relative" onPress={() => takePicture()}>
                                    <View className="absolute top-0 right-0 left-0 -bottom-1 rounded-full bg-yellow-600"></View>
                                    <View className="bg-yellow-400  h-20 w-20 p-2 flex items-center justify-center border-2 border-yellow-600 rounded-full">
                                       <Ionicons name="camera" className="" size={48} color={'#fff'} />
                                    </View>
                                 </TouchableOpacity>

                              }

                           </View>
                        </View>
                        <View className={`absolute top-0 right-0 bottom-0 left-0 duration-500 ${hasPhoto ? 'opacity-100' : 'opacity-0'}`}>
                           <Image source={{ uri: capturedImage }} className="w-full h-full" />
                        </View>
                     </CameraView>
                  }


               </View>
               :
               <></>
         }
      </>
   )
}