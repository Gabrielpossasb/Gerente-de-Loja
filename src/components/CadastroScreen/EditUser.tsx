import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import ButtonGoBack from "../MyComponents/ButtonGoBack";
import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, doc, getDocs, query, writeBatch } from "firebase/firestore";
import { db } from "@/src/services/firebaseConfig";
import { userDataType } from "@/src/types/customTypes";
import { Pressable } from "react-native";
import { MotiView } from "moti";
import CustomButton from "../MyComponents/CustomButton";
import VideoSendModal from "../Modal/VideoSendModal";

type editUserTYPE = {
   label: string;
   value: 'score' | 'sale' | 'pa';
}

export default function EditUser() {

   const [userUpdate, setUserUpdate] = useState(false)

   const [typeEdit, setTypeEdit] = useState<'group' | 'single'>('group')
   const [editableUserData, setEditableUserData] = useState('')

   const [editedValues, setEditedValues] = useState<{ [key: string]: number }>({});

   const [selectUserField, setSelectUserField] = useState<editUserTYPE>({ label: 'Vendas', value: 'sale' })
   const [showModalUserFields, setShowModalUserFields] = useState(false)
   const [userFields, setUserFields] = useState<editUserTYPE[]>([
      { label: 'Pontuação', value: 'score' },
      { label: 'Vendas', value: 'sale' },
      { label: 'PA', value: 'pa' },
   ])

   const [availableUsers, setAvailableUsers] = useState<userDataType[]>([])

   const handleInputChange = (userId: string, value: number) => {
      setEditedValues(prevValues => ({
         ...prevValues,
         [userId]: value, // Salva o valor editado pelo ID do usuário
      }));
   }

   const updateAllUsers = async () => {
      try {
         const batch = writeBatch(db); // Usa um batch para realizar atualizações em lote
         availableUsers.forEach(user => {
            const userRef = doc(db, "users", user.uid); // Referência ao documento do usuário
            const updatedValue = editedValues[user.uid]; // Pega o valor editado para o usuário
            if (updatedValue) {
               // Atualiza apenas se houver um valor editado
               batch.update(userRef, { [selectUserField.value]: updatedValue });
            }
         });
         await batch.commit(); // Aplica todas as atualizações
         setUserUpdate(true)
         setEditedValues({})
         fetchUsers()
      } catch (error) {
         console.error("Erro ao atualizar usuários:", error);
         alert("Erro ao atualizar os usuários.");
      }
   };

   const fetchUsers = async () => {
      const UsersCollection = collection(db, "users");
      const q = query(UsersCollection);
      const UsersSnapshot = await getDocs(q);
      const UsersList = UsersSnapshot.docs.map(doc => {
         const data = doc.data() as userDataType

         const video = data;
         return video
      });
      await setAvailableUsers(UsersList);
   };

   useEffect(() => {
      fetchUsers()
   }, [])

   return (
      <>
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={120}
         >

            <ScrollView>
               <View className="flex bg-white flex-1 gap-8 items-start p-6 pb-14">

                  <ButtonGoBack />

                  <View
                     style={stylesShadow.shadow}
                     className="self-center bg-white  flex items-center justify-center rounded-full px-4 flex-row gap-2"
                  >
                     <Text className="text-2xl font-black text-yellow-400">Editar Usuários</Text>
                     <MaterialCommunityIcons name="account-edit" size={32} color={'#facc15'} />
                  </View>



                  <View className="flex gap-4">
                     <Text className="font-semibold text-gray-700 text-lg">Escolha um dos modos de Edição:</Text>

                     <View className="flex flex-row gap-6">
                        <Pressable className="w-24 relative" onPress={() => setTypeEdit("group")}>
                           {({ pressed }) => (
                              <MotiView
                                 animate={{
                                    backgroundColor: typeEdit == 'group' ? '#facc15' : '#fff',
                                    borderColor: typeEdit == 'group' ? '#eab308' : '#fff',
                                    translateY: pressed ? 5 : 0,
                                 }}
                                 transition={{ type: 'timing', duration: 200 }}
                                 style={stylesShadow.shadow}
                                 className="rounded-full flex  p-1 items-center justify-center border-2"
                              >
                                 <Text className={`font-bold ${typeEdit == 'group' ? 'text-white' : 'text-yellow-400'}`}>GRUPO</Text>

                              </MotiView>
                           )}
                        </Pressable>
                        <Pressable className="w-24 relative" onPress={() => setTypeEdit("single")}>
                           {({ pressed }) => (
                              <MotiView
                                 animate={{
                                    backgroundColor: typeEdit == 'single' ? '#facc15' : '#fff',
                                    borderColor: typeEdit == 'single' ? '#eab308' : '#fff',
                                    translateY: pressed ? 5 : 0
                                 }}
                                 transition={{ type: 'timing', duration: 200 }}
                                 style={stylesShadow.shadow}
                                 className="rounded-full flex  p-1 items-center justify-center border-2"
                              >
                                 <Text className={`font-bold ${typeEdit == 'single' ? 'text-white' : 'text-yellow-400'}`}>USUÁRIO</Text>
                              </MotiView>
                           )}
                        </Pressable>
                     </View>
                  </View>


                  <View className="w-44 gap-2 z-20">
                     <Text className="text-base font-bold text-neutral-700 self-center">Selecione o que editar?</Text>

                     <Pressable
                        onPress={() => setShowModalUserFields(!showModalUserFields)}
                        className="flex flex-row gap-1 items-center justify-between p-1 pl-3 pr-2 bg-white rounded-xl z-10"
                        style={stylesShadow.shadow}
                     >
                        <Text className="text-yellow-600 font-bold text-xl">{selectUserField.label}</Text>
                        <MotiView
                           animate={{ rotate: showModalUserFields ? '180deg' : '0deg' }}
                           transition={{ type: 'timing', duration: 400 }}
                        >
                           <MaterialCommunityIcons name={'chevron-down'} size={32} color={'#ca8a04'} />
                        </MotiView>
                     </Pressable>

                     <MotiView
                        animate={{
                           translateY: showModalUserFields ? 0 : -50,
                           opacity: showModalUserFields ? 1 : 0,
                        }}
                        transition={{
                           type: 'timing',
                           duration: 300,
                        }}
                        style={stylesShadow.shadow}
                        className="flex items-center absolute left-0 right-0 top-10 justify-center gap-4 pt-10 py-4 p-3 border-2 border-neutral-200/80 bg-neutral-50 rounded-xl"
                     >
                        {showModalUserFields && userFields.map((val, index) => (
                           <Pressable
                              disabled={val.value == selectUserField.value}
                              key={index}
                              onPress={() => { setSelectUserField(val), setShowModalUserFields(false) }}
                              className="flex bg-white w-full items-center justify-center rounded-xl p-2"
                              style={stylesShadow.shadow}
                           >
                              <Text className={`font-semibold ${val.value == selectUserField.value ? 'text-yellow-600' : 'text-neutral-700'}`}>{val.label}</Text>
                           </Pressable>
                        ))}
                     </MotiView>
                  </View>

                  <View className="flex w-full ">
                     <View className="flex flex-row items-center gap-4 px-2 py-2 mx-5 rounded-t-2xl bg-gray-600 z-10">
                        <Text className="text-white font-bold flex flex-[0.33] ">{'NOME'}</Text>

                        <Text className="text-white font-bold flex flex-[0.33] text-center">{'ANTIGO'}</Text>
                        <Text className="text-white font-bold flex flex-[0.33] text-center">{'NOVO'}</Text>
                     </View>



                     <ScrollView className="w-full h-[300px]" >
                        <View className="flex gap-4 pb-4 w-full">
                           {availableUsers.map((user) => (
                              <View key={user.uid} className="flex flex-row items-center gap-4 px-4 py-2 rounded-lg bg-white mx-2" style={stylesShadow.shadow}>
                                 <Text className="text-gray-600 font-bold flex flex-[0.33] ">{user.displayName}</Text>

                                 <Text className="flex flex-[0.33] text-center">{user[selectUserField.value]}</Text>

                                 <TextInput
                                    keyboardType="number-pad"
                                    className="flex flex-[0.33] text-center border border-gray-400 rounded-lg"
                                    placeholder="..."
                                    value={editedValues[user.uid]?.toString() || ''} // Certifique-se de que não seja undefined
                                    onChangeText={(value) => handleInputChange(user.uid, Number(value))} // Atualiza o estado ao digitar
                                 />
                              </View>
                           ))}
                        </View>
                     </ScrollView>

                  </View>

                  <View className="flex w-full items-center justify-center">
                     <CustomButton
                        color="yellow"
                        submit={() => typeEdit == 'group' && updateAllUsers()}
                        disable={false}
                     >

                        <View className="w-64 p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                           <Text className="text-white text-xl font-bold">Atualizar Informções</Text>
                           <MaterialCommunityIcons name="send" size={28} color="#fff" />
                        </View>

                     </CustomButton>
                  </View>

               </View>
            </ScrollView>
         </KeyboardAvoidingView>

         <MotiView
            animate={{ translateY: userUpdate ? -10 : 200 }}
            className="absolute bottom-0 self-center"
         >
            <VideoSendModal onClose={() => setUserUpdate(false)} videoSend={userUpdate} text={'Usuário criado com sucesso!'} />
         </MotiView>
      </>
   )
}