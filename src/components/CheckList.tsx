import { useContext, useEffect, useRef, useState } from "react";

import Icon from 'react-native-vector-icons/AntDesign';

import { CompletionContext } from "../hook/useCompletion";


import { db, storage } from "../services/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DataUserContext } from "../hook/useDataUser";
import { CameraView, useCameraPermissions } from "expo-camera";
import { TouchableOpacity, View, Text, Image, SafeAreaView } from "react-native";


interface listType {
    name: string;
    check: boolean;
    description: string;
    image: string | null;
}

export default function CheckList() {

    const [cam, setCam] = useState(false)
    const [hasPhoto, setHasPhoto] = useState(false)

    const [ workChecked, setWorkChecked ] = useState({
        name: '',
        id: 0
    })

    const {} = useContext(DataUserContext)

    const {createCompletionPercentage, completionPercentage} = useContext(CompletionContext)

    const [capturedImage, setCapturedImage] = useState('');
    const cameraRef = useRef<CameraView>(null);

    /*
    const getVideo = () => {

        setHasPhoto(false)
        
        navigator.mediaDevices
        .getUserMedia({
            video: { facingMode: 'environment', width: innerHeight, height: innerWidth }
        })
        .then(stream => {
            if (videoRef.current) {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            }
        })
        .catch( err => {
            console.error(err);
        })

        setCam(true)
    }
    */

    /*
    const takePhoto = () => {
        
        setHasPhoto(true)

        const width = innerWidth;
        const height = innerHeight;

        if (photoRef.current && videoRef.current) {
            let video = videoRef.current;
            let photo = photoRef.current;

            photo.width = width;
            photo.height = height;
        
            let ctx = photo.getContext('2d');

            if (ctx) {
                ctx.drawImage(video, 0, 0, width, height);

            }
        }

    }
    */

    const takePicture = async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync();
          if (photo) {
            setCapturedImage(photo.uri);
          }
        }

        setHasPhoto(true)
    };

    const todayDate = () => {
        const today = new Date()
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const formattedDate = `${day < 10 ? ('0' + day) : day}_${month < 10 ? ('0' + month) : month}`;

        return formattedDate
    }

    const uploadImageToFirebase = async (uri: string) => {
        const formattedDate = todayDate();
        try {
            const storageRef = ref(storage, `1/${formattedDate}/${workChecked.name}.jpg`);
            const response = await fetch(uri);
            const blob = await response.blob();
            
            return new Promise<string>((resolve, reject) => {
                
                uploadBytes(storageRef, blob).then(() => {
                    console.log('Uploaded a blob or file!');
                    getDownloadURL(storageRef).then((url: string | PromiseLike<string>) => {
                        resolve(url);
                    }).catch((error: any) => {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    });
                }).catch((error: any) => {
                    console.error('Error uploading file:', error);
                    reject(error);
                });
            });

        } catch (error) {
            console.error('Erro ao enviar a imagem para o Firebase Storage:', error);
            return null;
        }
      };
      
    /*
    const uploadPhotoToStorage = async () => {
       
        const formattedDate = todayDate();

        const storageRef = ref(storage, `1/${formattedDate}/${workChecked.name}.jpg`);

        return new Promise<string>((resolve, reject) => {
            if (photoRef.current) {
                photoRef.current.toBlob(blob => {
                    if (blob) {
                        uploadBytes(storageRef, blob).then(() => {
                            console.log('Uploaded a blob or file!');
                            getDownloadURL(storageRef).then((url: string | PromiseLike<string>) => {
                                resolve(url);
                            }).catch((error: any) => {
                                console.error('Error getting download URL:', error);
                                reject(error);
                            });
                        }).catch((error: any) => {
                            console.error('Error uploading file:', error);
                            reject(error);
                        });
                    } else {
                        reject('Blob not available');
                    }
                });
            } else {
                reject('Photo ref not available');
            }
        });

    };
    */

    const [ list, setList ] = useState<listType[]>([
        {
            name: 'Fachada da Loja',
            check: false,
            description: '',
            image: ''
        },
        {
            name: 'Vitrine',
            check: false,
            description: '',
            image: ''
        },
        {
            name: 'Calçado Masc',
            check: false,
            description: '',
            image: ''
        },
        {
            name: 'Calçado Fem',
            check: false,
            description: '',
            image: ''
        },
        {
            name: 'Calçado Inf',
            check: false,
            description: '',
            image: ''
        },
    ])

    const HandleCheck = async () => {
        setCam(false)
        setHasPhoto(false)

        const docRef = doc(db, '01', 'checkList');
        
        const imageUrl = await uploadImageToFirebase(capturedImage);
        
        setList(prevList => {
            const newList = [...prevList]; // Criando uma cópia do array original
            newList[workChecked.id] = { ...newList[workChecked.id], check: true, image: imageUrl }; // Modificando o objeto desejado
        
            const checkedCount = newList.filter(item => item.check).length; // Usando a lista atualizada
            const totalItems = newList.length;
            const percentage = (checkedCount / totalItems) * 100;
            createCompletionPercentage(percentage);

            updateDoc(docRef, {
                items: newList,
                completionPercentage: percentage
            });
            
            return newList; // Retornando a nova lista atualizada
        });
        
    }

    async function getCheckListData() {
        const today = new Date().toLocaleDateString();
        const docRef = doc(db, "01", "checkList");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const lastOpenedDate = data.lastOpenedDate;
    
            // Verifique se a data atual é diferente da última data registrada
            if (lastOpenedDate !== today) {
                // Atualize a variável "check" para false em cada item do array
                const updatedItems = data.items.map((item: any) => ({ ...item, check: false, image: '' }));
                await updateDoc(docRef, { items: updatedItems, lastOpenedDate: today, completionPercentage: 0 });
        
            } else {
                const checkList:listType[] = docSnap.data().items
                const percentage = docSnap.data().completionPercentage
                setList(checkList)
                createCompletionPercentage(percentage)
            }
        } else {
        // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }    
    }

    useEffect(() => {
        getCheckListData()
    }, [])

    return (

        <View className="relative">

            { cam ? (
                <View className="flex overflow-hidden  bg-gray-900 z-20">
                        
                    <CameraView ref={cameraRef} facing='back' />
                    
                    { hasPhoto ? (
                        <View className={`absolute top-10 right-0 bottom-0 duration-500 ${ hasPhoto ? 'left-0': '-left-[1999px]'}`}>
                            <View className="flex items-center justify-center">
                                <Image source={{ uri: capturedImage }} className="object-contain" />
                            </View>
                        </View>
                        ): ( <View/>)
                    }
                    
                    <TouchableOpacity onPress={() => setCam(false)} 
                        className="absolute top-6 left-6 bg-black rounded-full duration-200 hover:top-5 hover:left-7">
                            <Icon name="closecircle" size={32} color={"#fff"}/>
                    </TouchableOpacity>
                    
                    <View className="flex flex-row justify-center items-end w-screen  gap-6">

                        <TouchableOpacity disabled={!hasPhoto} onPress={() => HandleCheck()}>
                            <View className={`  duration-500 
                                p-1
                                rounded-full ${hasPhoto?'bg-green-800': 'bg-gray-500'}`}>

                                <Icon name="checkcircle" size={40} color={hasPhoto?'rgb(22 163 74)': '#eee'}/>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => takePicture()}>
                            <View className="bg-gray-400 duration-500 
                                 border-gray-300 border-4 w-16 h-16 
                                rounded-full"></View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setHasPhoto(false)}>
                            <View className="bg-white hover:bg-gray-400 duration-500 
                                border-2 border-white hover:border-white p-1 
                                rounded-full">

                                <Icon name="delete" size={40} color={'#000'}/>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
            ) : (
                <></>
            )}              

            <View className="flex flex-col p-10 pb-20 gap-16">

                { list.map( (val, id) => (
                    <View key={id} className="flex flex-col relative items-center">
                
                        <TouchableOpacity
                            onPress={() => {setCam(true), setWorkChecked({name:val.name, id:id})}} 
                            className=""
                        >
                            <View className={`
                                flex w-48 justify-center items-center border-b-4 p-4 rounded-xl border  duration-500 delay-500  
                                ${val.check
                                    ? 'bg-yellow-400 text-white border-yellow-600 shadow-sm_yellow'
                                    : 'bg-gray-100 border-gray-500 text-gray-700 shadow-sm_gray'
                                }`}>
                                    <Text className="font-black drop-shadow-md ">{val.name}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                ))}

            </View>

        </View>

    )
}