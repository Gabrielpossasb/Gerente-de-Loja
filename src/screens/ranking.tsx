import { MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { MotiView } from "moti";
import { useContext, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { db } from "../services/firebaseConfig";
import { stylesShadow } from "../styles/styles";
import { userDataType } from "../types/customTypes";
import CustomButton from "../components/MyComponents/CustomButton";
import { DataUserContext } from "../hook/useDataUser";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CadastroStackRoutesParamsList } from "../routes/cadastro.stack.routes";
import { TabParamList } from "../routes/tab.routes";

type users = {
   score: number;
   sale: number;
   pa: number;
   displayName: string;
   loja: string;
}

type rankingsTYPE = {
   label: string;
   value: 'score' | 'sale' | 'pa';
}

export default function Ranking() {
   const { userData } = useContext(DataUserContext)

   const navigation = useNavigation<NavigationProp<TabParamList>>()

   const [users, setUsers] = useState<users[]>([]);
   const [loadingUsers, setLoadingUsers] = useState(false)

   const [selectRanking, setselectRanking] = useState<rankingsTYPE>({ label: 'Pontuação', value: 'score' })
   const [showModalRankings, setShowModalRankings] = useState(false)
   const [rankings, setRankings] = useState<rankingsTYPE[]>([
      { label: 'Pontuação', value: 'score' },
      { label: 'Vendas', value: 'sale' },
      { label: 'PA', value: 'pa' },
   ])

   // Função para buscar os usuários
   const fetchUsers = async (key: 'score' | 'sale' | 'pa') => {
      setLoadingUsers(true);
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => {
         const data = doc.data() as userDataType

         const userFiltred = {
            score: data.score,
            sale: data.sale,
            pa: data.pa,
            displayName: data.displayName,
            loja: data.loja
         }

         return userFiltred
      });

      const sortedUsers = [...usersList].sort((a, b) => b[key] - a[key]);
      await setUsers(sortedUsers);
      setLoadingUsers(false);
      console.log(users)
   };

   // Função para ordenar os usuários de acordo com a key
   const sortUsersByKey = (key: 'score' | 'sale' | 'pa') => {
      console.log(users)
      const sortedUsers = [...users].sort((a, b) => b[key] - a[key]);
      setUsers(sortedUsers);
   };
   const topThreeUsers = [users[1], users[0], users[2]];

   useEffect(() => {
      fetchUsers("score");
   }, []);

   return (
      <ScrollView className="flex-1 bg-white">
         <View className="flex flex-1 bg-white p-x pb-16 gap-8">

            <View
               style={stylesShadow.shadow}
               className="rounded-xl -mt-4 bg-yellow-400 self-center flex items-baseline justify-center flex-row gap-4 px-6 pt-6 p-2"
            >
               <Text className="text-3xl font-black text-white">Ranking</Text>

               <MaterialCommunityIcons name="podium-gold" size={32} color={'#fff'} />

            </View>

            <View className="flex flex-row items-start justify-between px-8">

               <View className="flex flex-row gap-6">
                  <View className="w-40">
                     <Text className="text-base font-bold text-neutral-700 self-center">Selecione o Ranking:</Text>

                     <Pressable
                        onPress={() => setShowModalRankings(!showModalRankings)}
                        className="flex flex-row gap-1 items-center justify-between p-1 pl-3 pr-2 bg-white rounded-xl z-10"
                        style={stylesShadow.shadow}
                     >
                        <Text className="text-yellow-600 font-bold text-xl">{selectRanking.label}</Text>
                        <MotiView
                           animate={{ rotate: showModalRankings ? '180deg' : '0deg' }}
                           transition={{ type: 'timing', duration: 400 }}
                        >
                           <MaterialCommunityIcons name={'chevron-down'} size={32} color={'#ca8a04'} />
                        </MotiView>
                     </Pressable>

                     <MotiView
                        animate={{
                           translateY: showModalRankings ? 0 : -50,
                           opacity: showModalRankings ? 1 : 0,
                        }}
                        transition={{
                           type: 'timing',
                           duration: 300,
                        }}
                        style={stylesShadow.shadow}
                        className="flex items-center absolute left-0 right-0 top-10 justify-center gap-4 pt-10 py-4 p-3 border-2 border-neutral-200/80 bg-neutral-50 rounded-xl"
                     >
                        {showModalRankings && rankings.map((val, index) => (
                           <Pressable
                              disabled={val.value == selectRanking.value}
                              key={index}
                              onPress={() => { sortUsersByKey(val.value), setselectRanking(val), setShowModalRankings(false) }}
                              className="flex bg-white w-full items-center justify-center rounded-xl p-2"
                              style={stylesShadow.shadow}
                           >
                              <Text className={`font-semibold ${val.value == selectRanking.value ? 'text-yellow-600' : 'text-neutral-700'}`}>{val.label}</Text>
                           </Pressable>
                        ))}
                     </MotiView>
                  </View>
               </View>

               <View className="flex gap-3 flex-row">
                  <Pressable onPress={() => fetchUsers(selectRanking.value)} className=" flex p-1 bg-white rounded-full" style={stylesShadow.shadow}>
                     <View className={``}>
                        <MaterialCommunityIcons name="reload" size={28} color={'#facc15'} />
                     </View>
                  </Pressable>

                  {userData.acesso == 'admin' && (
                     <Pressable 
                        onPress={() => navigation.navigate('CadastroStack', { screen: 'editUsuario',  params: { from: 'ranking' }})}
                        className=" flex p-1 bg-white rounded-full" style={stylesShadow.shadow}>
                        <View className={``}>
                           <MaterialCommunityIcons name="pencil" size={28} color={'#facc15'} />
                        </View>
                     </Pressable>
                  )}
               </View>

            </View>


            <View className="mt-6 px-3 -z-10">
               {loadingUsers ? (
                  <View className="flex flex-1 items-center justify-center p-4">
                     <View className="flex rounded-full">
                        <MaterialCommunityIcons name="loading" size={48} color="#facc15" className="" />
                     </View>
                  </View>
               ) : (
                  <View className="flex">

                     <View className="flex flex-row max-h-60  items-end justify-center gap-4 -mb-6 px-4">
                        {topThreeUsers.map((user, index) =>
                           index === 0 ? (
                              <View key={index} className="w-full  flex flex-[0.33] justify-center items-center">
                                 <MaterialCommunityIcons
                                    name="account"
                                    size={54}
                                    color={"#fff"}
                                    className="bg-yellow-400 rounded-full"
                                 />
                                 <Image
                                    resizeMode="contain"
                                    className="w-full h-36 "
                                    source={require("../assets/images/second_place.png")}
                                 />
                              </View>
                           ) : index === 1 ? (
                              <View key={index} className="w-full   flex flex-[0.33] justify-center items-center">
                                 <MaterialCommunityIcons
                                    name="account"
                                    size={64}
                                    color={"#fff"}
                                    className="bg-yellow-400 rounded-full"
                                 />
                                 <Image
                                    resizeMode="contain"
                                    className="w-full h-44 "
                                    source={require("../assets/images/first_place.png")}
                                 />
                              </View>
                           ) : index === 2 ? (
                              <View key={index} className="w-full  flex flex-[0.33] justify-center items-center">
                                 <MaterialCommunityIcons
                                    name="account"
                                    size={44}
                                    color={"#fff"}
                                    className="bg-yellow-400 rounded-full"
                                 />
                                 <Image
                                    resizeMode="contain"
                                    className="w-full h-32 "
                                    source={require("../assets/images/third_place.png")}
                                 />
                              </View>
                           ) : null
                        )}
                     </View>

                     <View className="flex gap-2 z-10">
                        {users.map((user, index) => (
                           <View
                              style={stylesShadow.shadow}
                              key={index}
                              className={`flex flex-row p-2 bg-white items-center rounded-lg border border-gray-200 justify-between ${users.length !== index + 1 ? "border-b" : ""
                                 }`}
                           >
                              <Text className="text-lg text-gray-700 font-bold">#{index + 1}</Text>
                              <Text className="text-lg text-gray-700 font-bold">{user.displayName}</Text>
                              <View className="flex flex-row items-end justify-center gap-1">
                                 <Text className="text-lg font-bold text-yellow-400">
                                    {selectRanking.value == 'score' ? user.score.toLocaleString()
                                       : selectRanking.value == 'sale' ? user.sale.toLocaleString()
                                          : user.pa.toLocaleString()
                                    }
                                 </Text>
                                 <Image
                                    width={40}
                                    height={40}
                                    resizeMode="contain"
                                    className="max-w-8 max-h-8 w-8 h-8 bg-contain"
                                    source={require("../assets/images/diamante.png")}
                                 />
                              </View>
                              <Text className="text-lg text-gray-700 font-bold">{user.loja}</Text>
                           </View>
                        ))}
                     </View>
                  </View>
               )}
            </View>
         </View>
      </ScrollView >
   )
}