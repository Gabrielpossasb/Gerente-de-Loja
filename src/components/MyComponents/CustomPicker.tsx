import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type CustomPickerProps = {
  field: any;
  form: any;
  text: string;
  error: string | undefined;
  touched: boolean | undefined;
  options: [{ label:string, value: string}];
}

export default function CustomPicker ({ field, form, text, error, touched, options }: CustomPickerProps) {
  const hasError = touched && error !== undefined;

  return (
    <View className="w-72">
      <Text className="block ml-4 text-lg font-bold text-gray-600">{text}</Text>
      <View className={`bg-white border-2 ${hasError ? 'border-red-500' : 'border-yellow-300'} rounded-lg`}>
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue: string) => form.setFieldValue(field.name, itemValue)}
          onBlur={() => form.setFieldTouched(field.name, true)}
          className="text-gray-900 text-lg"
        >
          {options.map((option, id) => (
            <Picker.Item  key={id} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {hasError && <Text className="text-red-500 text-xs ml-4">{error}</Text>}
    </View>
  );
};
