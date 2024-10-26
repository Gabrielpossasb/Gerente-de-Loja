import { stylesShadow } from "@/src/styles/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, Text, TextInput, View } from "react-native";
import Modal from "../../Modal/Modal";
import CustomButton from "../../MyComponents/CustomButton";
import { Question } from "@/src/types/customTypes";

function generateUniqueID(length = 8): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
   }
   return result;
}

type ModalPerguntasPROPS = {
   isVisible: boolean;
   onClose: () => void;
   onAddQuestion: (question: Question) => void;
   editingQuestion?: Question;
}

export default function ModalPerguntas({ isVisible, onAddQuestion, onClose, editingQuestion }: ModalPerguntasPROPS) {

   const [currentPage, setCurrentPage] = useState(1);

   const [text, setText] = useState("");
   const [correctAnswer, setCorrectAnswer] = useState("");
   const [wrongAnswers, setWrongAnswers] = useState(["", "", ""]);

   const handleNext = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, 3));
   };

   const handlePrevious = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
   };

   const handleAdd = () => {
      if (!text.trim() || !correctAnswer.trim() || wrongAnswers.some(answer => !answer.trim())) {
         alert("Por favor, preencha todos os campos.");
         return;
      }

      // Se for uma edição, manter os IDs atuais, caso contrário, gerar novos
      const correctAnswerID = editingQuestion
         ? editingQuestion.correctAnswerID
         : generateUniqueID();

      const newQuestion: Question = {
         id: editingQuestion ? editingQuestion.id : generateUniqueID(),
         text,
         alternatives: [
            { id: correctAnswerID, text: correctAnswer },
            ...wrongAnswers.map((answer, index) => ({
               id: editingQuestion ? editingQuestion.alternatives[index + 1]?.id : generateUniqueID(),
               text: answer,
            })),
         ],
         correctAnswerID: correctAnswerID,
      };

      onAddQuestion(newQuestion);
      setCurrentPage(1)
      setText("");
      setCorrectAnswer("");
      setWrongAnswers(["", "", ""]);
   };

   useEffect(() => {
      if (editingQuestion) {
         setText(editingQuestion.text);
         setCorrectAnswer(editingQuestion.alternatives.find(alt => alt.id === editingQuestion.correctAnswerID)?.text || "");
         setWrongAnswers(editingQuestion.alternatives.filter(alt => alt.id !== editingQuestion.correctAnswerID).map(alt => alt.text));
      }
   }, [editingQuestion]);

   

   return (
      <Modal id="cadastroPerguntas" isOpen={isVisible}>

         <View style={stylesShadow.shadow} className="flex bg-white h-[450px] w-full rounded-xl border-2 border-neutral-400 items-center justify-start gap-4 p-4 py-12">

            <Pressable onPress={onClose} className="absolute right-0 top-0 p-3">
               <View className="bg-white rounded-full p-1" style={stylesShadow.shadow}>
                  <MaterialCommunityIcons name="close" size={24} color={'#000'} />
               </View>
            </Pressable>

            <View className="w-80 gap-6">
               {currentPage === 1 && (
                  <>
                     <View>
                        <Text className="block ml-4 text-lg font-bold text-gray-600">
                           Digite a Pergunta:
                        </Text>
                        <TextInput
                           multiline={true}
                           textAlignVertical="top"
                           value={text}
                           onChangeText={setText}
                           className="bg-white h-44 border-2 text-gray-900 text-lg rounded-lg border-yellow-400 focus:border-yellow-500 block p-2 outline-none"
                        />
                        <Text className="block text-sm font-bold text-gray-500">
                           *Coloque o ponto de interrogação no final.
                        </Text>
                     </View>

                     <View>
                        <Text className="block ml-4 text-lg font-bold text-gray-600">Resposta Correta:</Text>
                        <TextInput
                           value={correctAnswer}
                           onChangeText={setCorrectAnswer}
                           className="bg-white border-2 text-gray-900 text-lg rounded-lg border-yellow-400 focus:border-yellow-500 block p-2 outline-none"
                        />
                     </View>
                  </>
               )}

               {currentPage === 2 && (
                  <View className="mb-6 gap-4">

                     <Text className="block -ml-4 text-xl font-bold text-gray-800">Respostas Erradas:</Text>

                     {wrongAnswers.map((wrongAnswer, index) => (
                        <View key={index}>

                           <Text className="block ml-4 text-lg font-bold text-gray-600">Resposta {index + 1}:</Text>
                           <TextInput
                              value={wrongAnswer}
                              onChangeText={(text) => {
                                 const newAnswers = [...wrongAnswers];
                                 newAnswers[index] = text;
                                 setWrongAnswers(newAnswers);
                              }}
                              className="bg-white border-2 text-gray-900 text-lg rounded-lg border-yellow-400 focus:border-yellow-500 block p-2 outline-none"
                           />

                        </View>
                     ))}
                  </View>
               )}
            </View>

            <View className="flex flex-row absolute bottom-6 gap-8">

               {currentPage > 1 && (
                  <CustomButton color="yellow" disable={false} submit={handlePrevious}>
                     <View className="p-2 w-32 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                        <Text className="text-white text-2xl font-bold">Voltar</Text>
                     </View>
                  </CustomButton>
               )}

               {currentPage < 2 && (
                  <CustomButton color="yellow" disable={false} submit={handleNext}>
                     <View className="p-2 w-32 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                        <Text className="text-white text-2xl font-bold">Próximo</Text>
                     </View>
                  </CustomButton>
               )}

               {currentPage === 2 && (
                  <CustomButton color="green" disable={false} submit={handleAdd}>
                     <View className="p-2 w-32 rounded-xl flex flex-row items-center justify-center gap-4 bg-green-400">
                        <Text className="text-white text-2xl font-bold">Confirmar</Text>
                     </View>
                  </CustomButton>
               )}

            </View>
         </View>
      </Modal>
   )
}