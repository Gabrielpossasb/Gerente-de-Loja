import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View } from 'react-native';

import { NavigatorScreenParams } from '@react-navigation/native';
import { useContext } from 'react';
import Header from '../components/Header/Header';
import { DataUserContext } from '../hook/useDataUser';
import CadastroStackRoutes from './cadastro.stack.routes';
import TreinamentoStackRoutes, { TreinamentoStackRoutesParamsList } from './trilha.stack.routes';

export type TabParamList = {
	TreinamentoStack: NavigatorScreenParams<TreinamentoStackRoutesParamsList>;
	CadastroStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabRoutes() {

	const { userData } = useContext(DataUserContext)

	return (
		<Tab.Navigator
			screenOptions={{
				header: () => <Header />,
				tabBarActiveTintColor: 'rgba(234, 179, 8, 0.5)',
				tabBarStyle: { paddingBottom: 8, padding: 6, height: 55 },
				tabBarShowLabel: false
			}}
		>

			<Tab.Screen
				name='TreinamentoStack'
				component={TreinamentoStackRoutes}
				options={{
					tabBarIcon: ({ color, size, focused }) =>
						<View className={`flex p-2 items-center justify-center border-2 rounded-full ${focused ? 'border-yellow-400' : 'border-transparent'}`}>
							<Image
								source={require('../assets/images/caminho.png')}
								style={{ width: size, height: size }}
							/>
						</View>
				}}
			/>


			{/* <Tab.Screen
                name='checkList'
                component={CheckList}
                options={{
                    tabBarIcon: ({color, size}) => 
                        <Image 
                            source={require('../assets/images/questionario.png')} 
                            style={{ width: size, height: size }}
                        />,
                    tabBarLabel: 'Check List'
                }}
            /> */}

			{userData.acesso == 'admin' &&
				<Tab.Screen
					name='CadastroStack'
					component={CadastroStackRoutes}
					options={{
						tabBarIcon: ({ color, size, focused }) =>
							<View className={`flex p-2 items-center justify-center rounded-full border-2 ${focused ? 'border-yellow-400' : 'border-transparent'}`}>
								<Image
									source={require('../assets/images/registro.png')}
									style={{ width: size, height: size }}
								/>
							</View>
					}}
				/>
			}

		</Tab.Navigator>
	)
}