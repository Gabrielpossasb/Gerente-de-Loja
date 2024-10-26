import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import CadastroButtonNavigation from "../components/CadastroScreen/CadastroButtonNavigation";
import { CadastroStackRoutesParamsList } from "../routes/cadastro.stack.routes";
import { stylesShadow } from "../styles/styles";

export default function CadastroScreen() {

   const navigation = useNavigation<NavigationProp<CadastroStackRoutesParamsList>>()

   return (
      <View className="flex bg-white flex-1 items-center justify-start p-4 py-10 gap-10">

         <View style={stylesShadow.shadow} className="bg-white rounded-full p-4 px-8 ">
            <Text className="text-4xl font-black text-yellow-400">Cadastros</Text>
         </View>

         <View className="flex w-full justify-between gap-16">

            <View className="flex items-center justify-center gap-5">
               <View className="flex flex-row gap-8">
                  <Pressable
                     onPress={() => navigation.navigate('cadastroUsuario')}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (

                        <CadastroButtonNavigation pressed={pressed}>
                           <MaterialCommunityIcons name="account-plus" size={64} color={'#fff'} />
                        </CadastroButtonNavigation>

                     )}
                  </Pressable>

                  <Pressable
                     onPress={() => navigation.navigate('editUsuario', { from: 'cadastro'})}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (

                        <CadastroButtonNavigation pressed={pressed}>
                           <MaterialCommunityIcons name="account-edit" size={64} color={'#fff'} />
                        </CadastroButtonNavigation>

                     )}
                  </Pressable>
               </View>

               <View style={stylesShadow.shadow} className="bg-white rounded-2xl p-1 w-32 items-center ">
                  <Text className="text-xl font-black text-yellow-400">USUÁRIO</Text>
               </View>
            </View>

            <View className="flex items-center justify-center gap-5">
               <View className="flex flex-row gap-8">
                  <Pressable
                     onPress={() => navigation.navigate('cadastroVideo')}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (
                        <CadastroButtonNavigation pressed={pressed}>
                           <MaterialCommunityIcons name="video-plus" size={64} color={'#fff'} />
                        </CadastroButtonNavigation>
                     )}
                  </Pressable>
                  <Pressable
                     onPress={() => navigation.navigate('editVideo')}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (
                        <CadastroButtonNavigation pressed={pressed}>
                           <MaterialCommunityIcons name="video" size={64} color={'#fff'} />
                        </CadastroButtonNavigation>
                     )}
                  </Pressable>
               </View>
               <View style={stylesShadow.shadow} className="bg-white rounded-2xl p-1 w-32 items-center ">
                  <Text className="text-xl font-black text-yellow-400">VÍDEO</Text>
               </View>
            </View>

            <View className="flex items-center justify-center gap-5">
               <View className="flex flex-row gap-8">
                  <Pressable
                     onPress={() => navigation.navigate('cadastroTrilha')}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (
                        <CadastroButtonNavigation pressed={pressed}>
                           <View className="w-12 h-16 items-center justify-center flex">
                              <Image style={{ resizeMode: 'contain' }} className="w-14 h-20" source={require('../assets/images/caminho1.png')} />
                           </View>
                        </CadastroButtonNavigation>
                     )}
                  </Pressable>
                  <Pressable
                     onPress={() => navigation.navigate('editTrilha')}
                     className="w-[100px] h-[90px] flex items-center justify-center relative"
                  >
                     {({ pressed }) => (
                        <CadastroButtonNavigation pressed={pressed}>
                           <View className="w-12 h-16 items-center justify-center flex">
                              <Image style={{ resizeMode: 'contain' }} className="w-14 h-20" source={require('../assets/images/caminho1.png')} />
                           </View>
                        </CadastroButtonNavigation>
                     )}
                  </Pressable>
               </View>
               <View style={stylesShadow.shadow} className="bg-white rounded-2xl p-1 w-32 items-center ">
                  <Text className="text-xl font-black text-yellow-400">TRILHA</Text>
               </View>
            </View>

         </View>

      </View>
   )
}