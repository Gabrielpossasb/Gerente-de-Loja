import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import CustomButton from "../../MyComponents/CustomButton";
import ModalPerguntas from "./ModalPerguntas";
import { Question } from "@/src/types/customTypes";

type CadastroPerguntasPROPS = {
   questions: Question[];
   setQuestions: (question: Question[]) => void;
}

export default function CadastroPerguntas({ questions, setQuestions }: CadastroPerguntasPROPS) {
   const [modalVisible, setModalVisible] = useState(false);

   const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);

   const handleEditQuestion = (question: Question) => {
      setEditingQuestion(question);
      setModalVisible(true);
   };

   const handleAddQuestion = (question: Question) => {
      setModalVisible(false);
      setEditingQuestion(undefined)
      const questionIndex = questions.findIndex((q) => q.id === question.id);

      if (questionIndex !== -1) {
         // Se a pergunta já existir, atualize-a
         const updatedQuestions = [...questions];
         updatedQuestions[questionIndex] = question;
         setQuestions(updatedQuestions);
      } else {
         // Se a pergunta não existir, adicione-a
         setQuestions([...questions, question]);
      }
   };

   const handleDeleteQuestion = (questionId: string) => {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
   };

   return (
      <View className="w-full items-start flex gap-4 mb-4">

         <Text className="text-2xl self-start text-gray-800 font-bold">Adcione as Perguntas</Text>

         <View className="w-full gap-4 flex items-center px-4">

            {questions.map((item, index) => (
               <View key={item.id} className="w-full flex gap-2">

                  <View className="pl-4 flex flex-row gap-4 items-end">

                     <Text className="text-2xl font-bold text-gray-800">{`Pergunta ${index + 1}:`}</Text>

                     <View className="items-center mb-[6px] flex flex-row gap-4 justify-center">

                        <CustomButton color="yellow" disable={false} submit={() => handleEditQuestion(item)}>
                           <View className="p-2 w-12 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
                           </View>
                        </CustomButton>

                        <CustomButton color="red" disable={false} submit={() => handleDeleteQuestion(item.id)}>
                           <View className="p-2 w-12 rounded-xl flex flex-row items-center justify-center gap-4 bg-red-400">
                              <MaterialCommunityIcons name="trash-can" size={24} color="#fff" />
                           </View>
                        </CustomButton>

                     </View>

                  </View>

                  <View className="w-full p-2 border-2 border-yellow-300 rounded-lg">

                     <Text className="text-lg font-bold text-gray-600">
                        {` ${item.text}`}
                     </Text>

                     {item.alternatives.map((alt) => (
                        <Text key={alt.id} className={`pl-4 font-bold ${alt.id === item.correctAnswerID ? "text-green-500" : "text-red-500"}`}>
                           {alt.text}
                        </Text>
                     ))}
                  </View>

               </View>
            ))}

         </View>

         <CustomButton color="yellow" disable={false} submit={() => setModalVisible(true)}>
            <View className="p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">

               <Text className="text-white text-2xl font-bold">Criar</Text>
               <MaterialCommunityIcons name="plus" size={28} color="#fff" />

            </View>
         </CustomButton>


         <ModalPerguntas
            isVisible={modalVisible}
            onClose={() => {
               setModalVisible(false);
               setEditingQuestion(undefined); // Limpa a pergunta em edição ao fechar
            }}
            onAddQuestion={(q) => handleAddQuestion(q)}
            editingQuestion={editingQuestion}
         />

      </View>
   )
}