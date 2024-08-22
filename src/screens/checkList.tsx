import CheckList from '@/src/components/CheckList/CheckList';
import Header from '@/src/components/Header/Header';
import { CompletionProvider } from '@/src/hook/useCompletion';
import { DataUserProvider } from '@/src/hook/useDataUser';
import { View } from 'react-native';
import '../styles/global.css';
import { CameraProvider } from '../hook/useCamera';
import { CameraComponent } from '../components/CameraComponent';


export default function App() {

  /*
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <TouchableOpacityStyled className='bg-blue-950 flex self-center w-40 items-center rounded-md h-10 justify-center' onPress={requestPermission}>
          <TextStyled className='text-white font-bold text-xl'>Give Permission</TextStyled>
        </TouchableOpacityStyled>
      </View>
    );
  }
  */
  return (
    <CompletionProvider>
        <CameraProvider>
          <View className='flex relative bg-white flex-1'>
            <CameraComponent/>
            <Header />
            <CheckList />
          </View>
        </CameraProvider>
    </CompletionProvider>
  );
}