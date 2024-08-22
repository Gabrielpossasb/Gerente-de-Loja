import { useContext, useEffect } from "react";

import { CompletionContext } from "../../hook/useCompletion";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../services/firebaseConfig";

import { MotiView } from 'moti';
import { CameraContext } from "../../hook/useCamera";

interface listType {
	name: string;
	check: boolean;
	description: string;
	image: string | null;
}

export default function CheckList() {

	const { createCompletionPercentage, completionPercentage } = useContext(CompletionContext)
	const { list, setList, cam, setCam, setWorkChecked } = useContext(CameraContext)

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
				const checkList: listType[] = docSnap.data().items
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

		<View className="flex flex-[0.75]">

			<ScrollView>
				<View className="flex p-10 items-center pb-20 gap-16">

					{list.map((val, id) => (
						<MotiView
							key={id}
							animate={{
								scale: val.check ? [1.2, 1] : 1,
								translateY: val.check ? [-10, 0] : 0,
							}}
							transition={{
								duration: 700,
								type: "timing",
								delay: val.check ? 300 : 0
							}}
						>
							<View className="flex flex-row relative items-center">

								<TouchableOpacity onPress={() => { setCam(!cam), setWorkChecked({ name: val.name, id: id }) }}>

									<View className="flex justify-center items-center">
										<View className={`flex w-48 z-10 justify-center items-center border-b-4 p-4 rounded-xl border delay-500  
													${val.check
												? 'bg-yellow-400 text-white border-yellow-500 shadow-sm_yellow'
												: 'bg-gray-100 border-gray-500 text-gray-700 shadow-sm_gray'
											}`}>
											<Text className={`font-black drop-shadow-md ${val.check ? 'text-white' : 'text-gray-700'}`}>{val.name}</Text>
										</View>

										<Image className={`h-14 w-14 duration-300 ${val.check ? 'opacity-100' : 'opacity-0'}`} source={require('../assets/images/medalha.png')} />

									</View>

								</TouchableOpacity>

							</View>
						</MotiView>
					))}
				</View>
			</ScrollView>
		</View>
	)
}