import { db, storage } from "@/src/services/firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { getFunctions, HttpsCallable, httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import * as Yup from 'yup';
import CustomButton from "../../MyComponents/CustomButton";
import CustomInput from "../../MyComponents/CustomInput";
import CustomPicker from "../../MyComponents/CustomPicker";
import CadastroPerguntas from "./CadastroPerguntas";
import SelectVideoButton from "./SelectVideoButton";
import { Question, VideoInfoProps } from "@/src/types/customTypes";
import { createThumbnail } from 'react-native-create-thumbnail';
import SelectImageButton from "./SelectImageButton";

const formatDate = (date: Date): string => {
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
   const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano

   return `${day}/${month}/${year}`;
};

function generateUniqueID(length = 8): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
   }
   return result;
}

type CheckVideoIDResult = {
   exists: boolean;
};

const functions = getFunctions();
const checkVideoID: HttpsCallable<{ videoID: string }, CheckVideoIDResult> = httpsCallable(functions, 'checkVideoID');

const validationSchema = Yup.object().shape({
   name: Yup.string().required('Título é obrigatório'),
   categoria: Yup.string().required('Categoria é obrigatório'),
   subCategoria: Yup.string().required('Sub-Categoria é obrigatório'),
   cargo: Yup.string().required('Cargo é obrigatório'),
   videoID: Yup.string().required('VideoID é obrigatório'),
   tutor: Yup.string().required('Tutor(a) é obrigatório'),
});

type FormCadastroVideoPROPS = {
   videoSend: () => void
}

export default function FormCadastroVideo({ videoSend }: FormCadastroVideoPROPS) {

   const [videoURI, setVideoURI] = useState('')
   const [thumbnailURI, setThumbnailURI] = useState('');

   const [loadingSubmit, setLoadingSubmit] = useState(false)

   const [questions, setQuestions] = useState<Question[]>([]);

   return (
      <Formik
         initialValues={{
            cargo: '',
            categoria: '',
            subCategoria: '',
            name: '',
            videoID: '',
            tutor: ''
         }}
         validationSchema={validationSchema}
         onSubmit={async (values, { setSubmitting, setFieldError, setFieldValue, resetForm }) => {

            if (videoURI == '') {
               Alert.alert('Nehum video foi selecionado!')
               return;
            }

            if (thumbnailURI === '') {
               Alert.alert('Nenhuma thumbnail foi selecionada!');
               return;
            }

            if (questions.length < 1) {
               Alert.alert('Pelo menos uma pergunta deve ser criada!')
               return;
            }

            setLoadingSubmit(true)

            let success = false;
            while (!success) {
               try {
                  const response = await checkVideoID({ videoID: values.videoID });
                  if (response.data.exists) {
                     // UUID já existe, gere um novo
                     setFieldValue('videoID', generateUniqueID());
                  } else {
                     success = true;
                  }
               } catch (error) {
                  setFieldError('videoID', 'An error occurred. Please try again.');
                  success = true; // Saia do loop em outros erros
               }
            }

            if (success && videoURI && thumbnailURI) {
               try {
                  const videoResponse = await fetch(videoURI);
                  const videoBlob = await videoResponse.blob();
                  const videoStorageRef = ref(storage, `Treinamento/${values.videoID}`);
                  const videoUploadTask = uploadBytesResumable(videoStorageRef, videoBlob);

                  videoUploadTask.on(
                     'state_changed',
                     (snapshot) => {
                        // Pode adicionar código para exibir o progresso
                     },
                     (error) => {
                        //setFieldError('videoData', error.message);
                        setSubmitting(false);
                     },
                     async () => {
                        const videoDownloadURL = await getDownloadURL(videoUploadTask.snapshot.ref);

                        const thumbnailResponse = await fetch(thumbnailURI);
                        const thumbnailBlob = await thumbnailResponse.blob();
                        const thumbnailRef = ref(storage, `Thumbnails/${values.videoID}_thumbnail`);
                        const thumbnailUploadTask = uploadBytesResumable(thumbnailRef, thumbnailBlob);

                        thumbnailUploadTask.on('state_changed', null, (error) => {
                           setSubmitting(false);
                        }, async () => {
                           const thumbnailDownloadURL = await getDownloadURL(thumbnailUploadTask.snapshot.ref);
   
                           const videoInfo: VideoInfoProps = {
                              cargo: values.cargo,
                              categoria: values.categoria,
                              subCategoria: values.subCategoria,
                              name: values.name,
                              url: videoDownloadURL,
                              thumbnail: thumbnailDownloadURL,
                              videoID: values.videoID,
                              tutor: values.tutor,
                              createdAt: formatDate(new Date()),
                              questions: questions
                           };
   
                           await setDoc(doc(db, 'treinamento', values.videoID), videoInfo);
   
                           setSubmitting(false);
                           setLoadingSubmit(false);
                           videoSend();
                           setVideoURI('');
                           setThumbnailURI('');
                           setQuestions([]);
                           resetForm({
                              values: {
                                 videoID: generateUniqueID(),
                                 cargo: '',
                                 categoria: '',
                                 subCategoria: '',
                                 name: '',
                                 tutor: ''
                              }
                           });
                        });
                     }
                  );
               } catch (error) {
                  //setFieldError('videoData', 'Failed to upload video. Please try again.');
                  setSubmitting(false);
               }
            }
         }}
      >
         {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {

            useEffect(() => {
               setFieldValue('videoID', generateUniqueID());
            }, []);

            return (

               <View className="flex w-full items-center gap-8">

                  <View className="flex items-center gap-2 mb-6">

                     <Text className="block ml-4 text-xl font-bold text-gray-600">Selecione o vídeo:</Text>

                     {videoURI != '' && (
                        <View className="flex flex-row gap-2">
                           <Text className="block ml-4 text-2xl font-bold text-green-500 underline">Selecionado</Text>
                           <View className="flex bg-green-500 p-1 items-center justify-center rounded-full">
                              <MaterialCommunityIcons name="check" color={'#fff'} size={22} />
                           </View>
                        </View>
                     )}

                     <SelectVideoButton setVideoURI={(val) => setVideoURI(val)} videoURI={videoURI} />

                  </View>

                  <View className="flex items-center gap-2 mb-6">
                     <Text className="block ml-4 text-xl font-bold text-gray-600">Selecione a Thumbnail:</Text>
                     {thumbnailURI !== '' && (
                        <View className="flex flex-row gap-2">
                           <Text className="block ml-4 text-2xl font-bold text-green-500 underline">Selecionado</Text>
                           <View className="flex bg-green-500 p-1 items-center justify-center rounded-full">
                              <MaterialCommunityIcons name="check" color={'#fff'} size={22} />
                           </View>
                        </View>
                     )}
                     <SelectImageButton setImageURI={(val) => setThumbnailURI(val)} imageURI={thumbnailURI} />
                  </View>

                  <Field
                     name="name"
                     component={CustomInput}
                     text="Título do vídeo"
                     placeholder="Digite o título do vídeo"
                     error={errors.name}
                     touched={touched.name}
                  />

                  <Field
                     name="categoria"
                     component={CustomPicker}
                     text="Selecione a categoria"
                     error={errors.categoria}
                     touched={touched.categoria}
                     options={[
                        { label: 'Selecione uma categoria', value: '' },
                        { label: 'Categoria 1', value: 'categoria 1' },
                        { label: 'Categoria 2', value: 'categoria 2' },
                        { label: 'Categoria 3', value: 'categoria 3' }
                     ]}
                  />

                  <Field
                     name="subCategoria"
                     component={CustomPicker}
                     text="Selecione a Sub-categoria"
                     error={errors.subCategoria}
                     touched={touched.subCategoria}
                     options={[
                        { label: 'Selecione uma sub-categoria', value: '' },
                        { label: 'Sub-categoria 1', value: 'sub-categoria 1' },
                        { label: 'Sub-categoria 2', value: 'sub-categoria 2' },
                        { label: 'Sub-categoria 3', value: 'sub-categoria 3' }
                     ]}
                  />

                  <Field
                     name="tutor"
                     component={CustomPicker}
                     text="Selecione o tutor(a)"
                     error={errors.tutor}
                     touched={touched.tutor}
                     options={[
                        { label: 'Selecione um tutor', value: '' },
                        { label: 'Tutor 1', value: 'tutor 1' },
                        { label: 'Tutor 2', value: 'tutor 2' },
                        { label: 'Tutor 3', value: 'tutor 3' }
                     ]}
                  />

                  <Field
                     name="cargo"
                     component={CustomPicker}
                     text="Selecione o cargo"
                     error={errors.cargo}
                     touched={touched.cargo}
                     options={[
                        { label: 'Selecione um cargo', value: '' },
                        { label: 'Vendedor', value: 'vendedor' },
                        { label: 'Caixa', value: 'caixa' },
                        { label: 'Gerente', value: 'gerente' }
                     ]}
                  />

                  <CadastroPerguntas questions={questions} setQuestions={(q) => setQuestions(q)} />

                  <CustomButton color="yellow" submit={handleSubmit} disable={loadingSubmit}>
                     {loadingSubmit ? (
                        <View className="flex w-64 p-2 rounded-xl bg-yellow-400">
                           <View className="flex items-center justify-center animate-spin">
                              <MaterialCommunityIcons name="loading" size={28} color="#fff" />
                           </View>
                        </View>
                     ) : (
                        <View className="w-64 p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
                           <Text className="text-white text-2xl font-bold">Enviar</Text>
                           <MaterialCommunityIcons name="send" size={28} color="#fff" />
                        </View>
                     )}
                  </CustomButton>

               </View>
            )
         }}
      </Formik>
   )
}