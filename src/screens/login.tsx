import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, } from "firebase/auth";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import CustomButton from "../components/MyComponents/CustomButton";
import { StackRoutesParamsList } from "../routes/stack.routes";
import { auth } from "../services/firebaseConfig";

export default function Login() {

	const navigation = useNavigation<NavigationProp<StackRoutesParamsList>>()

	const [email, setEmail] = useState('')

	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false);

	const [login, setLogin] = useState(true)

	function handleLogin(email: string, password: string) {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in 
				const user = userCredential.user;
				navigation.reset({
					index: 0,
					routes: [{ name: 'Loading' }],
				});
				// ...
			})
			.catch((error) => {
				setLogin(false)
			});

	}

	return (
		<ScrollView className="flex-1 bg-white">
			<View className="p-10 gap-6 flex flex-1 bg-white flex-col pt-16">


				<View className="flex gap-1 items-center">
					<Text className="text-3xl text-gray-800 font-black">Bem Vindo! </Text>
					<View className="h-[4px] mb-3 w-48 bg-yellow-400 rounded-full self-center" />
					<Text className="text-lg font-semibold text-gray-600 text-center w-72">Faça login na sua conta inserindo seus dados abaixo:</Text>
				</View>

				<View className="flex gap-2">
					<Text
						className="block ml-4 text-lg font-bold text-gray-600"
					>
						Email
					</Text>
					<TextInput
						onChangeText={(val) => setEmail(val)}
						value={email}
						placeholder="example@gmail.com"
						className="bg-white border-2 text-gray-900 text-lg rounded-lg border-yellow-300 focus:border-yellow-500 block p-2 outline-none"
					/>
				</View>

				<View className="flex gap-2">
					<Text
						className="block ml-4 text-lg font-bold text-gray-600"
					>
						Senha
					</Text>
					<TextInput
						secureTextEntry={!showPassword}
						onChangeText={(val) => setPassword(val)}
						value={password}
						id="password"
						placeholder="•••••••••"
						className="bg-white border-2 text-gray-900 text-lg rounded-lg border-yellow-300 focus:border-yellow-500 block p-2 outline-none"
					/>
				</View>

				<View className="flex justify-center items-center w-full">
					<Text className={` text-lg font-bold ${!login ? 'text-red-500 opacity-100' : 'text-white opacity-0'}`}>
						Email ou senha inválidos
					</Text>
				</View>

				<CustomButton color="yellow" submit={() => handleLogin(email, password)} disable={false}>
					<View className="px-20 p-2 rounded-xl flex flex-row items-center justify-center gap-4 bg-yellow-400">
						<Text className="text-white text-2xl font-bold">ENTRAR</Text>
						<MaterialCommunityIcons name="login" size={24} color="white" />
					</View>
				</CustomButton>

			</View>
		</ScrollView>
	)
}