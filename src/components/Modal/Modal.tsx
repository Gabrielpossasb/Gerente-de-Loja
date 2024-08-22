import { ModalProps, View } from "react-native";
import { Modal as RNModal } from "react-native";

export type PROPS = ModalProps & {
    isOpen: boolean
}   

export default function Modal ({ isOpen, children, ...rest}: PROPS) {
    
    
    
    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
            {...rest}
        >
            <View className="flex-1 justify-center items-center px-6 bg-zinc-900/30">
                {children}
            </View>
        </RNModal>
    )
}