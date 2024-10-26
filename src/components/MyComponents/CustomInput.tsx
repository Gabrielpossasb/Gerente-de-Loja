import { FieldInputProps } from "formik";
import { TextInput } from "react-native";
import { Text, View } from "react-native";

type CustomInputProps = {
   field: FieldInputProps<any>;
   text: string;
   placeholder: string;
   error?: string;
   touched?: boolean;
};

export default function CustomInput({
   field,
   text,
   placeholder,
   error,
   touched
}: CustomInputProps) {
   return (
      <View className="w-72">
         <Text className="block ml-4 text-lg font-bold text-gray-600">{text}</Text>
         <TextInput
            onChangeText={field.onChange(field.name)}
            onBlur={field.onBlur(field.name)}
            value={field.value}
            placeholder={placeholder}
            className={`bg-white border-2 text-gray-900 text-lg rounded-lg focus:border-yellow-500 block p-2 outline-none ${ touched && error ? 'border-red-500' : 'border-yellow-300'}`}
         />
         { field.name == 'name' && <Text className="text-sm text-neutral-500 font-semibold">*Titulo mais objetivo possível</Text>}
         {touched && error && <Text className="text-red-500 text-xs ml-4">{error}</Text>}
      </View>
   );
};