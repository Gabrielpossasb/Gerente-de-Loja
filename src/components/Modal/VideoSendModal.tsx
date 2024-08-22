import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type VideoSendModalProps = {
   videoSend: boolean;
   onClose: () => void;
   text: string;
};

export default function VideoSendModal({ videoSend, onClose, text }: VideoSendModalProps) {

   const [progress, setProgress] = useState(1);

   const progressRef = useRef(progress);

   function handleClose() {
      onClose()
   }

   useEffect(() => {
      let timer: NodeJS.Timeout;
      let progressInterval: NodeJS.Timeout;

      if (videoSend) {
         setProgress(1);
         progressRef.current = 1;

         timer = setTimeout(() => {
            onClose();
         }, 4000); // Modal will auto close after 2 seconds

         const totalDuration = 4000; // Total duration for the progress to complete
         const intervalTime = 40; // Interval time in milliseconds
         const decrementValue = intervalTime / totalDuration; // Value to decrement progress

         progressInterval = setInterval(() => {
            progressRef.current -= decrementValue;
            setProgress(progressRef.current);
         }, intervalTime);
      }

      return () => {
         clearTimeout(timer);
         clearInterval(progressInterval);
      };
   }, [videoSend, onClose]);

   return (
      <View className='p-1 bg-green-500 rounded-xl border-2 border-green-600'>

         <View className='flex px-4 flex-row justify-between gap-4 items-center'>
            <Text className='text-white text-lg font-bold'>{text}</Text>
            <Pressable className='p-2 ' onPress={handleClose}>
               <MaterialCommunityIcons name='close' size={20} color={'#fff'} />
            </Pressable>
         </View>


      </View>
   );
};
