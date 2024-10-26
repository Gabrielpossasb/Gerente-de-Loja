import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Pressable, View, ViewProps } from "react-native";

type PROPS = ViewProps & {
   submit: () => void,
   disable: boolean,
   color: 'yellow' | 'red' | 'green',
   rounded?: boolean;
}

export default function CustomButton({ submit, disable, color, rounded = false, children, ...rest }: PROPS ) {

   const [selectColor, setSelectColor] = useState('')

   useEffect(() => {
      if (color == 'yellow') {
         setSelectColor('#eab308')
      } else if (color == 'red') {
         setSelectColor('#ef4444')
      } else if (color == 'green') {
         setSelectColor('#22c55e')
      }
   }, [])

   return (
      <Pressable
         onPress={submit}
         className=""
         disabled={disable}
         {...rest}
      >
          {({ pressed }) => (
            <View className="relative items-center flex">
               <MotiView
                  from={{ translateY: 0 }}
                  animate={{ translateY: pressed ? [6,0] : 0 }}
                  transition={{ type: 'timing', duration: 200 }}
                  className="w-full"
               >
                  {children}
               </MotiView>

               <View 
                  className={`absolute top-[6px] -z-10 left-0 right-0  ${rounded ? 'rounded-full -bottom-[5px]' :'rounded-xl -bottom-[6px]'}`} 
                  style={{ backgroundColor: selectColor}}
               />
            </View>
         )}
      </Pressable>

   )
}