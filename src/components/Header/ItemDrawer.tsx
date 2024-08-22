import { StackRoutesParamsList } from "@/src/routes/stack.routes";
import { TabParamList } from "@/src/routes/tab.routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import { Pressable, Text, View, ViewProps } from "react-native";

type ItemDrawer = ViewProps & {
   text: string;
   screen: keyof TabParamList;
   closeDrawer: () => void;
}

export default function ItemDrawer({ children, text, screen, closeDrawer }: ItemDrawer) {

   const navigation = useNavigation<NavigationProp<TabParamList>>()

   return (
      <Pressable
         onPress={() => { closeDrawer() ,navigation.navigate(screen)}}
         className="flex  w-full border-t-[1px] border-neutral-400"
      >
         {({pressed}) => (
            <MotiView
               animate={{ 
                  translateX: pressed ? 30 : 0
               }}
               transition={{ duration: 100, type: "timing" }}
               className="flex flex-row gap-4 p-4"
            >
               {children}
               <Text className="text-gray-600 text-2xl font-bold">{text}</Text>
            </MotiView>
         )}
      </Pressable>
   )
}