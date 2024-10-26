import { CadastroStackRoutesParamsList } from "@/src/routes/cadastro.stack.routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";
import React from "react";
import { View, ViewProps } from "react-native";
import Svg, { Ellipse } from "react-native-svg";

type CadastroButtonNavigationProps = ViewProps & {
   pressed: boolean
};

export default function CadastroButtonNavigation({ pressed, children, ...rest }: CadastroButtonNavigationProps) {

   return (
      <>
         <View className="absolute top-[10px] right-0 left-0 -bottom-1  rounded-full">
            <Svg height="100" width="100" >
               <Ellipse
                  cx="50" // Coordenada x do centro da elipse
                  cy="50" // Coordenada y do centro da elipse
                  rx="50"  // Raio horizontal
                  ry="45"  // Raio vertical
                  fill="#eab308"
               />
            </Svg>
         </View>

         <MotiView
            animate={{ translateY: pressed ? [8, 0] : 0 }}
            transition={{ type: 'timing', duration: 200 }}
            className=" flex items-center justify-center w-full h-full rounded-full"
         >
            <View className="absolute top-0">
               <Svg height="100" width="100" >
                  <Ellipse
                     cx="50" // Coordenada x do centro da elipse
                     cy="50" // Coordenada y do centro da elipse
                     rx="50"  // Raio horizontal
                     ry="45"  // Raio vertical
                     fill="#facc15"
                  />
               </Svg>
            </View>

            {children}

         </MotiView>
      </>
   )
}