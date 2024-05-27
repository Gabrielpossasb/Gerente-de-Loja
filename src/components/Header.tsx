import { IoMenu, IoPersonCircle } from "react-icons/io5";

import { CompletionContext } from "../hook/useCompletion";
import { useContext } from "react";
import { DataUserContext } from "../hook/useDataUser";
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text } from "react-native";

export default function Header() {

    const { userData } = useContext(DataUserContext)

    const {completionPercentage} = useContext(CompletionContext)

    return (

        <View className="shadow-sm_gray flex flex-col w-full z-10">

            <View className="h-20 flex flex-row justify-between p-4  z-10">
            
                <View className=" flex flex-row items-center">
                    <View className="text-yellow-500">
                        <Icon name="person-circle" size={40} color={'rgb(234 179 8)'}/>
                    </View>

                    <View className="p-2 px-4 rounded-full bg-yellow-400 ">
                        <Text className="text-white text-lg font-bold">Karolaine</Text>
                    </View>
                </View>

                <View className="text-yellow-400">
                    <Icon name="menu" size={32} color={'rgb(234 179 8)'}/>
                </View>

            </View>

            <View className=" pt-10 py-4 px-10">
                    
                <View className="w-full h-5 flex bg-gray-300 rounded-full ">
                    
                    <View style={{ width: `${completionPercentage}%` }} className={`duration-700  relative bg-yellow-500 rounded-full text-yellow-500`}>

                        <View style={{ width: `${completionPercentage}%` }} className="h-[5px] mt-[4px] ml-4 bg-yellow-200/90 rounded-full"/>

                        <View className="flex absolute -right-4 -top-3 flex-col items-center ">
                            
                            <View className=" bg-white flex rounded-full">
                                <Icon name="person-circle" size={32} color={'rgb(234 179 8)'}/>
                            </View>
                            
                        </View>

                    </View>

                </View>

            </View>

        </View>

    )
}