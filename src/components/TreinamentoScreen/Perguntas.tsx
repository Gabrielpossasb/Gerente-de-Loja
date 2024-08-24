import { DataUserContext } from "@/src/hook/useDataUser";
import { SelectTrilhaContext } from "@/src/hook/useSelectTrilha";
import { TreinamentoStackRoutesParamsList } from "@/src/routes/trilha.stack.routes";
import { db } from "@/src/services/firebaseConfig";
import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { doc, increment, updateDoc } from "firebase/firestore";
import LottieView from 'lottie-react-native';
import { MotiView } from "moti";
import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Image, Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../MyComponents/CustomButton";
import { useFocusEffect } from "expo-router";

const successMessages = [
   "Ótimo trabalho, continue assim! 😉",
   "Acertou na mosca! 🎯",
   "Você merece um troféu! 🏆",
   "Está arrasando nessa! 😎",
   "Arrasou demais! 💥",
   "Você é um gênio! 🎉",
   "Ninguém te segura! 🚀",
   "Acertou em cheio! 🎯😁",
   "Você é uma máquina de acertos! 🤖🔥",
   "Acertei de primeira? Claro que sim! 😎",
   "Uau, você está impossível hoje! 💪😄",
   "Essa foi com estilo! 😎✨",
   "Mais um pra conta! 📝🎉",
   "Tá voando baixo! 🛫😉",
   "Show! Você tá dominando! 🏆😄",
];

const errorMessages = [
   "Ops, não foi dessa vez 😔",
   "Foi por pouco 😔",
   "Nãooo, foi quase! 😭",
   "Ah, que vacilo! 😅",
   "Quase lá... mas não! 😜",
   "Esse foi na trave! ⚽️😆",
   "Errou feio, errou rude! 😆",
   "Essa foi feia! Tenta de novo! 🤭",
   "Essa doeu, hein? 😬",
   "Errou, mas a gente ainda te ama! ❤️😂",
   "Tava indo bem... até não estar! 😜",
   "É... hoje não é o seu dia! 🤷‍♂️😂",
   "Alguém ligou o modo 'errado'! 🤦‍♂️",
   "Tá jogando dardos no escuro? 🎯❌"
];

export default function Perguntas() {

   const navigation = useNavigation<NavigationProp<TreinamentoStackRoutesParamsList>>()
   const { params } = useRoute<RouteProp<TreinamentoStackRoutesParamsList, 'Perguntas'>>()

   const videoInfo = params.videoInfo

   const { userData, getUserData } = useContext(DataUserContext)
   const { setSelectTrilhaData, selectTrilha } = useContext(SelectTrilhaContext)

   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
   const [progressColors, setProgressColors] = useState<string[]>([]);

   const [score, setScore] = useState(0);
   const [visibleAnimations, setVisibleAnimations] = useState<number[]>([]);
   const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

   const [showAnswer, setShowAnswer] = useState(false);
   const [showScore, setShowScore] = useState(false);

   const [concluedQuestions, setConcluedQuestions] = useState(false)

   const confettiPositions = [
      { "left": -50, "top": 10 },
      { "left": 150, "top": 10 },
      { "left": 100, "top": 150 },
      { "left": 0, "top": 250 },
      { "left": 120, "top": 280 }
   ];

   const currentQuestion = videoInfo.questions[currentQuestionIndex];

   const closeQuestions = () => {
      navigation.navigate('PlayerVideo', { videoID: params.videoInfo.videoID })
   }

   const closeQuestionsAndVideo = () => {
      navigation.navigate('Trilha')
   }

   const handleAnswer = () => {
      if (selectedAnswer) {
         const isCorrect = selectedAnswer === currentQuestion.correctAnswerID;

         if (isCorrect) {
            setScore(prevScore => prevScore + 2);
            setFeedbackMessage(successMessages[Math.floor(Math.random() * successMessages.length)]);
         } else {
            setFeedbackMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
         }

         setProgressColors([...progressColors, isCorrect ? "bg-green-500" : "bg-red-500"]);
         setShowAnswer(true);
      }
   };

   const goToNextQuestion = () => {
      setShowAnswer(false);
      if (currentQuestionIndex < videoInfo.questions.length - 1) {
         setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
         setShowScore(true)
      }
      setSelectedAnswer(null);
   };

   const handleCheckVideo = async () => {
      setConcluedQuestions(true);

      // Atualiza o estado do vídeo para 'watch: true' apenas para o vídeo assistido
      const updatedTrilha = selectTrilha.videos.map((val: { videoID: string; watch: boolean }) => {
         if (val.videoID === videoInfo.videoID) {
            return { ...val, watch: true };
         }
         return val;
      });

      console.log('O vídeo terminou');

      // Atualize o estado do vídeo no banco de dados
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
         watchedVideos: updatedTrilha.filter(video => video.watch)  // Atualiza somente os vídeos que foram assistidos
      });

      const userRefScore = doc(db, 'users', userData.uid);
      await updateDoc(userRefScore, {
         score: increment(score)
      });

      console.log('Estado do vídeo atualizado para assistido');

      // Atualize o estado de selectTrilha com os vídeos atualizados
      setSelectTrilhaData({
         ...selectTrilha,
         videos: updatedTrilha
      });

      getUserData();  // Recarrega os dados do usuário
      setConcluedQuestions(false);
      closeQuestionsAndVideo();
   }

   useEffect(() => {
      if (showScore) {
         confettiPositions.forEach((_, index) => {
            setTimeout(() => {
               setVisibleAnimations((prev) => [...prev, index]);
            }, index * 1000); // Ajuste o intervalo conforme necessário
         });
      }
   }, [showScore]);

   useFocusEffect(
      React.useCallback(() => {
         const onBackPress = () => {
            navigation.navigate('PlayerVideo', { videoID: params.videoInfo.videoID })
            return true; // Retornar true impede o comportamento padrão de fechar o app
         };

         BackHandler.addEventListener('hardwareBackPress', onBackPress);

         return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [])
   );

   return (

      <ScrollView className="flex flex-1 bg-white">
         <View className="flex h-screen items-center gap-10 p-6">

            {(showScore && score > 0) &&
               confettiPositions.map((pos, index) =>
                  visibleAnimations.includes(index) ? (
                     <LottieView
                        key={index}
                        source={require('../../assets/gifs/firework.json')}
                        autoPlay
                        loop={true}
                        style={{
                           position: 'absolute',
                           top: pos.top,
                           left: pos.left,
                           width: 300,
                           height: 300,
                           opacity: 0.7
                        }}
                     />
                  ) : null
               )
            }

            <Pressable
               onPress={closeQuestions}
               className="relative self-start"

            >
               {({ pressed }) => (
                  <>
                     <View className="absolute top-2 left-0 right-0 -bottom-[6px] rounded-xl bg-yellow-500" />

                     <MotiView
                        from={{ translateY: 0 }}
                        animate={{ translateY: pressed ? [6, 0] : 0 }}
                        transition={{ type: 'timing', duration: 200 }}
                        className="flex flex-row gap-1 items-center justify-center p-1 px-1 pr-3 rounded-xl bg-yellow-400"
                     >
                        <MaterialCommunityIcons name="arrow-left" color={'#fff'} size={20} />

                        <View className="flex relative">
                           <Text className="font-bold text-white text-base">
                              Voltar
                           </Text>
                        </View>
                     </MotiView>

                  </>
               )}
            </Pressable>

            <View className="flex-row w-3/4 h-5 bg-gray-100 overflow-hidden rounded-full" style={stylesShadow.shadow}>
               {videoInfo.questions.map((_, index) => (
                  <View
                     key={index}
                     className={`flex-1 pl-4 pt-1 h-full ${progressColors[index] ? progressColors[index] : "bg-gray-200"} ${index < videoInfo.questions.length - 1 ? "mr-1" : ""
                        } `}
                  >
                     {progressColors[index] && <View className="h-1 w-3/4 bg-white/50 rounded-full" />}
                  </View>
               ))}
            </View>

            {showScore ? (
               <View className="flex items-center justify-center gap-8">

                  <Text className="text-center text-2xl font-bold text-gray-700">Parabéns !! Você concluiu o treinamento de {videoInfo.name}</Text>

                  <View className="flex gap-8 items-center">

                     <Text className="text-xl font-bold text-gray-500">Sua Pontuação:</Text>

                     <View className="flex flex-row gap-6">

                        <View className="flex flex-row gap-2 items-center justify-center">
                           <MaterialCommunityIcons name="check" size={32} color={'#4ade80'} />
                           <Text className="text-4xl font-bold text-green-500">{score / 2}</Text>
                        </View>

                        <View className="flex flex-row gap-2 justify-center items-center">
                           <MaterialCommunityIcons name="close" size={32} color={'#f87171'} />
                           <Text className="text-4xl font-bold text-red-500">{videoInfo.questions.length - (score / 2)}</Text>
                        </View>

                     </View>

                     <View className="flex flex-row items-center justify-center">
                        <Text className="text-3xl mt-2 font-bold text-gray-500">+ {score}</Text>
                        <Image className='w-9 h-9' source={require('../../assets/images/diamante.png')} />
                     </View>

                  </View>


               </View>
            ) : (
               <View className="flex items-start w-full gap-8">
                  <View className="flex flex-row gap-2 w-full">
                     <Text className="text-gray-800 text-xl w-full text-left font-bold">{currentQuestion.text}</Text>
                  </View>

                  <View className="flex pl-8 w-full">

                     {currentQuestion.alternatives.map((alt) => (
                        <Pressable
                           key={alt.id}
                           className={`flex flex-row gap-2 p-2 items-center w-full`}
                           onPress={() => setSelectedAnswer(alt.id)}
                           disabled={showAnswer}
                        >
                           <View
                              className={`h-5 w-5 rounded-full border-2 ${showAnswer
                                 ? alt.id == currentQuestion.correctAnswerID
                                    ? "border-green-500 bg-green-400"
                                    : alt.id == selectedAnswer
                                       ? "border-red-500 bg-red-400"
                                       : "border-gray-400"
                                 : alt.id == selectedAnswer
                                    ? "border-yellow-500 bg-yellow-400"
                                    : "border-gray-400"
                                 }`}
                           />
                           <Text className={`text-gray-600 font-bold text-xl ${showAnswer
                              ? alt.id == currentQuestion.correctAnswerID
                                 ? "text-green-400"
                                 : alt.id == selectedAnswer
                                    ? "text-red-400"
                                    : "text-gray-600"
                              : alt.id == selectedAnswer
                                 ? "text-yellow-400"
                                 : "text-gray-600"
                              }`
                           }>
                              {alt.text}
                           </Text>
                        </Pressable>
                     ))}

                  </View>


                  <MotiView
                     animate={{
                        opacity: showAnswer ? 1 : 0,
                        scale: showAnswer ? 1 : 0,
                        backgroundColor: selectedAnswer === currentQuestion.correctAnswerID
                           ? "#4ade80" // verde se a resposta estiver correta
                           : "#ef4444", // vermelho se a resposta estiver incorreta
                        borderColor: selectedAnswer === currentQuestion.correctAnswerID
                           ? "#16a34a" // verde se a resposta estiver correta
                           : "#dc2626" // vermelho se a resposta estiver incorreta
                     }}
                     transition={{
                        backgroundColor: {
                           delay: selectedAnswer === currentQuestion.correctAnswerID ? 0 : 0,
                           type: 'timing',
                           duration: 300
                        },
                        borderColor: {
                           delay: selectedAnswer === currentQuestion.correctAnswerID ? 0 : 0,
                           type: 'timing',
                           duration: 300
                        },
                        opacity: {
                           duration: 300
                        },
                        scale: {
                           duration: 300
                        }
                     }}
                     className={`p-1 px-2 w-full rounded-full flex items-center justify-center`}
                     style={stylesShadow.shadow}
                  >
                     <Text className={`text-base text-white font-bold `}>
                        {feedbackMessage}
                     </Text>
                  </MotiView>

               </View>
            )}



            <CustomButton color="yellow" submit={showScore ? handleCheckVideo : showAnswer ? goToNextQuestion : handleAnswer} disable={showScore ? false : !selectedAnswer}>
               <View className="w-64 p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">

                  {showAnswer &&
                     <>
                        <LottieView
                           source={require('../../assets/gifs/confetes.json')}
                           autoPlay
                           loop={false}
                           style={{
                              position: 'absolute',
                              width: 400,
                              height: 400,
                              transform: [{ rotate: '-180deg' }],
                           }}
                        />

                        <LottieView
                           source={require('../../assets/gifs/confetes.json')}
                           autoPlay
                           loop={false}
                           style={{
                              position: 'absolute',
                              width: 400,
                              height: 400,
                           }}
                        />
                     </>
                  }

                  {concluedQuestions ? (
                     <View className="flex items-center justify-center animate-spin">
                        <MaterialCommunityIcons name="loading" size={28} color="#fff" />
                     </View>
                  ) : (
                     <Text className="text-white text-2xl font-bold">{showScore ? 'Concluir' : showAnswer ? "Próxima" : "Responder"}</Text>
                  )}


               </View>
            </CustomButton>


         </View>
      </ScrollView>
   )
}