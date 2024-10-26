import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MotiView } from "moti";
import { useContext, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { DataUserContext } from "../../hook/useDataUser";
import Drawer from "./Drawer";
import LogoutModal from "./LogoutModal";

export default function Header() {

   const { userData } = useContext(DataUserContext)

   const [handleLogout, setHandleLogout] = useState(false)

   const [openDrawer, setOpenDrawer] = useState(false)

   return (

      <View className=" bg-white flex flex-col w-full z-10" style={{ elevation: 5 }}>

         <View className="h-20 flex flex-row justify-between items-center p-4  z-10">

            <View className=" flex flex-row items-center">
               <View className="text-yellow-500">
                  <Icon name="person-circle" size={40} color={'rgb(234 179 8)'} />
               </View>

               <View className="p-2 px-4 rounded-full bg-yellow-400 ">
                  <Text className="text-white text-lg font-bold">{userData.displayName}</Text>
               </View>
            </View>

            <View className='flex flex-row w-16 items-center justify-center gap-1'>
               <Text className='text-3xl font-bold text-yellow-400'>{userData.score}</Text>
               <Image width={40} height={40} resizeMode='contain' className='w-6 h-6 bg-contain' source={require('../../assets/images/diamante.png')} />
            </View>

            <Pressable onPress={() => setOpenDrawer(true)}>
               {({ pressed }) => (
                  <MotiView
                     animate={{ scale: pressed ? [0.6, 1] : 1 }}
                     transition={{ duration: 200 }}
                     className=""
                  >
                     <MaterialCommunityIcons name="menu" size={36} color="rgb(234 179 8)" />
                  </MotiView>
               )}
            </Pressable>

         </View>

         <LogoutModal closeModalLogout={() => setHandleLogout(false)} handleLogout={handleLogout} />

         <Drawer openLogoutModal={() => setHandleLogout(true)} openDrawer={openDrawer} closeDrawer={() => setOpenDrawer(false)} />

      </View>

   )
}