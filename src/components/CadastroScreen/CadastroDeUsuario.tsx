import { DataUserContext } from "@/src/hook/useDataUser";
import { auth, db } from "@/src/services/firebaseConfig";
import { stylesShadow } from "@/src/styles/styles";
import { userDataType } from "@/src/types/customTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { Field, Formik } from "formik";
import { MotiView } from "moti";
import { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import * as Yup from 'yup';
import VideoSendModal from "../Modal/VideoSendModal";
import ButtonGoBack from "../MyComponents/ButtonGoBack";
import CustomButton from "../MyComponents/CustomButton";
import CustomInput from "../MyComponents/CustomInput";
import CustomPicker from "../MyComponents/CustomPicker";

const formatDate = (date: Date): string => {
   const day = date.getDate().toString().padStart(2, '0');
   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0
   const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano

   return `${day}/${month}/${year}`;
};

type Lojas = {
   label: string,
   value: string
}

type Acessos = Lojas;

type Trilhas = Lojas;

const validationSchema = Yup.object().shape({
   email: Yup.string().email('Email inválido').required('Email é obrigatório'),
   password: Yup.string()
      .required('Senha é obrigatória')
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .max(12, 'A senha deve ter no máximo 12 caracteres'),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas não são iguais')
      .required('Confirmação da senha é obrigatória'),
   name: Yup.string().required('Nome é obrigatório'),
   displayName: Yup.string().required('Apelido é obrigatório'),
   acesso: Yup.string().required('Tipo de acesso é obrigatório'),
   lojaID: Yup.string().required('Código da loja é obrigatório'),
   trilha: Yup.string().required('Trilha é obrigatória'),
});

export default function CadastroUsuario() {

   const { userData } = useContext(DataUserContext)

   const [password, setPassword] = useState('')

   const [lojas, setLojas] = useState<Lojas[]>([])
   const [acessos, setAcessos] = useState<Acessos[]>([])
   const [trilhas, setTrilhas] = useState<Trilhas[]>([])

   const [userCreate, setUserCreate] = useState(false)
   const [loadingCreateUser, setLoadingCreateUser] = useState(false)

   const getTrilhas = async () => {
      const trillhasCollection = collection(db, 'trilhas');
      const trilhasSnapshot = await getDocs(trillhasCollection);
      const trilhasList: Trilhas[] = trilhasSnapshot.docs.map(doc => {
         const data = doc.data();

         const trilhaInfo: Trilhas = {
            label: data.name,
            value: data.id
         };

         return trilhaInfo;
      })
      .filter(trilha => trilha.value !== 'semana');

      setTrilhas([{ label: "Selecione a Trilha", value: '' }, ...trilhasList])
   }

   const getLojas = async () => {
      const docRef = doc(db, 'infos', 'lojas');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         setLojas([{ label: "Selecione a Loja", value: '' }, ...docSnap.data().list])
      }
   }

   const getAcessos = async () => {
      const docRef = doc(db, 'infos', 'acessos');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
         setAcessos([{ label: "Selecione o Acesso", value: '' }, ...docSnap.data().list])
      }
   }

   useEffect(() => {
      getTrilhas()
      getAcessos()
      getLojas()
   }, [])

   return (
      <>
         <ScrollView>
            <View className="flex bg-white flex-1 gap-8 items-start p-6 pb-14">

               <ButtonGoBack />

               <View
                  style={stylesShadow.shadow}
                  className="self-center bg-white round-xl flex items-center justify-center rounded-xl px-4 flex-row gap-2"
               >
                  <Text className="text-2xl font-black text-yellow-400">Cadastrar Usuário</Text>
                  <MaterialCommunityIcons name="account-plus" size={32} color={'#facc15'} />
               </View>

               <View className="">
                  <Text className="block mt-4 ml-4 text-lg font-bold text-gray-600">Digite sua senha</Text>
                  <TextInput
                     onChangeText={(e) => setPassword(e)}
                     value={password}
                     placeholder="Digite sua senha"
                     className="bg-white border-2 border-yellow-300 text-gray-900 text-lg rounded-lg focus:border-yellow-500 block w-64 p-2 outline-none"
                  />
               </View>

               <View className="flex mt-4 gap-4 w-full items-center">
                  <Text className="text-xl font-bold text-gray-600 self-start">Preencha os dados do novo usuário:</Text>

                  <Formik
                     initialValues={{
                        lojaID: '',
                        name: '',
                        displayName: '',
                        acesso: '',
                        email: '',
                        confirmPassword: '',
                        password: '',
                        trilha: ''
                     }}
                     validationSchema={validationSchema}
                     onSubmit={async (values, { resetForm, setSubmitting }) => {
                        setLoadingCreateUser(true)

                        const selectLoja = lojas.filter((val) => { return val.value == values.lojaID && val })

                        try {
                           // 1. Obter o token do usuário atual
                           // const currentUser = authR.currentUser;
                           // if (!currentUser) throw new Error("Nenhum usuário está logado.");

                           // const tokenID = await currentUser.getIdToken(true);  // 'true' força a atualização do token
                           // if (!tokenID) throw new Error("Não foi possível obter o token do usuário atual.");

                           // 2. Criar usuário com Firebase Authentication
                           const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
                           const uid = userCredential.user.uid;
                           console.log("Novo usuário criado com UID:", uid);

                           await signInWithEmailAndPassword(auth, userData.email, password)

                           //Manter usuario atual logado
                           // auth.onAuthStateChanged(async (user) => {
                           //    if (user) {
                           //       const tokenID = await user.getIdToken()
                           //       console.log(await user.getIdToken())
                           //       await signInWithCustomToken(authR, tokenID);
                           //    }
                           // })

                           //Criação das informações do banco de dados
                           const userInfo: userDataType = {
                              acesso: values.acesso,
                              displayName: values.displayName,
                              email: values.email,
                              loja: selectLoja[0].label,
                              lojaID: selectLoja[0].value,
                              name: values.name,
                              uid: uid,
                              watchedVideos: [],
                              score: 0,
                              createdAt: formatDate(new Date()),
                              fixedTrackID: values.trilha,
                              weeklyTrackID: 'semana'
                           }

                           // Adicionar informações adicionais ao Firestore
                           await setDoc(doc(db, 'users', uid), userInfo);

                           setSubmitting(false);
                           resetForm({
                              values: {
                                 lojaID: '',
                                 name: '',
                                 displayName: '',
                                 acesso: '',
                                 email: '',
                                 confirmPassword: '',
                                 password: '',
                                 trilha: ''
                              }
                           })
                           setLoadingCreateUser(false)

                           setUserCreate(true)

                           console.log('Usuário criado com sucesso e informações adicionais salvas no Firestore.');
                        } catch (error) {
                           console.log('Erro ao criar usuário e salvar informações adicionais:', error);
                           setSubmitting(false);
                           resetForm({
                              values: {
                                 lojaID: '',
                                 name: '',
                                 displayName: '',
                                 acesso: '',
                                 email: '',
                                 confirmPassword: '',
                                 password: '',
                                 trilha: ''
                              }
                           })
                           setLoadingCreateUser(false)
                        }
                     }}
                  >
                     {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
                        <View className="flex w-full items-center gap-6">
                           <Field
                              name="email"
                              component={CustomInput}
                              text="Email"
                              placeholder="Digite o email"
                              error={errors.email}
                              touched={touched.email}
                           />
                           <Field
                              name="password"
                              component={CustomInput}
                              text="Senha"
                              placeholder="Digite a senha"
                              error={errors.password}
                              touched={touched.password}
                           />
                           <Field
                              name="confirmPassword"
                              component={CustomInput}
                              text="Confirmar Senha"
                              placeholder="Digite a senha novamente"
                              error={errors.confirmPassword}
                              touched={touched.confirmPassword}
                           />
                           <Field
                              name="name"
                              component={CustomInput}
                              text="Nome Completo"
                              placeholder="Digite o nome completo"
                              error={errors.name}
                              touched={touched.name}
                           />
                           <Field
                              name="displayName"
                              component={CustomInput}
                              text="Apelido"
                              placeholder="Digite o apelido"
                              error={errors.displayName}
                              touched={touched.displayName}
                           />

                           <Field
                              name="acesso"
                              component={CustomPicker}
                              text="Selecione o acesso"
                              error={errors.acesso}
                              touched={touched.acesso}
                              options={acessos}
                           />
                           <Field
                              name="lojaID"
                              component={CustomPicker}
                              text="Selecione a loja"
                              error={errors.lojaID}
                              touched={touched.lojaID}
                              options={lojas}
                           />
                           <Field
                              name="trilha"
                              component={CustomPicker}
                              text="Selecione a trilha"
                              error={errors.trilha}
                              touched={touched.trilha}
                              options={trilhas}
                           />

                           <View className=" mt-4">
                              <CustomButton color="yellow" submit={handleSubmit} disable={loadingCreateUser}>
                                 {loadingCreateUser ? (
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
                        </View>
                     )}
                  </Formik>
               </View>
            </View>
         </ScrollView>

         <MotiView
            animate={{ translateY: userCreate ? -10 : 200 }}
            className="absolute bottom-0 self-center"
         >
            <VideoSendModal onClose={() => setUserCreate(false)} videoSend={userCreate} text={'Usuário criado com sucesso!'} />
         </MotiView>
      </>
   )
}