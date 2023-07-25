import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import shortid from 'shortid';
import ImagePicker from 'react-native-image-picker';

export default function CommunityWritingScreen({navigation}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [title, setTitle] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [imageList, setImageList] = useState<string[]>([]);

	const handleImageLibraryLaunch = () => {
		const options: any = {mediaType: 'photo', maxWidth: 500, maxHeight: 500};
		ImagePicker.launchImageLibrary(options, handleImageResponse);
	};

	const handleImageResponse = (response: ImagePicker.ImagePickerResponse) => {
		if (response.didCancel) {
			console.log('사용자가 이미지 선택을 취소했습니다.');
		} else if (response.assets && response.assets.length > 0) {
			const updatedImageList: any = [...imageList, response.assets[0].uri];
			setImageList(updatedImageList);
		}
	};

	const handleSubmit = async () => {
		if (title.trim() === '' || content.trim() === '') {
			Alert.alert('제목과 내용을 입력해주세요.');
			return;
		}
		// 글 작성과 이미지 업로드 등 필요한 처리를 수행합니다.
		// Firestore에 데이터를 저장하고, 이미지를 저장하는 로직 등을 구현해야 합니다.
		// 아래의 예시는 Firestore에 데이터를 저장하는 방법을 보여줍니다.

		try {
			firestore()
				.collection('커뮤니티')
				.doc(title) // 제목을 문서 ID로 사용
				.set({
					postTitle: title,
					postContent: content,
					postKey: shortid.generate(),
					createdAt: firestore.FieldValue.serverTimestamp(),
					// 여러 필드값 추가 가능
					// 예: author: 'John Doe', views: 0, likes: 0, ...
				})
				.then(() => {
					console.log('글이 성공적으로 저장되었습니다.');
				})
				.catch(error => {
					console.log('글을 저장하는 중에 오류가 발생했습니다:', error);
				});

			console.log('게시글이 등록되었습니다.');
			goBack();
			// 게시글 등록 완료 후 필요한 처리를 추가하면 됩니다.
		} catch (error) {
			console.log('게시글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				value={title}
				onChangeText={text => setTitle(text)}
				placeholder='제목을 입력하세요...'
			/>
			<TextInput
				style={styles.input}
				value={content}
				onChangeText={text => setContent(text)}
				placeholder='내용을 입력하세요...'
				multiline={true}
			/>
			<View style={styles.imageContainer}>
				{imageList.map((imageUri, index) => (
					<Image key={index} source={{uri: imageUri}} style={styles.uploadedImage} />
				))}
			</View>

			<TouchableOpacity style={styles.attachButton} onPress={handleImageLibraryLaunch}>
				<Text style={styles.attachButtonText}>갤러리에서 사진 선택하기</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
				<Text style={styles.submitButtonText}>글 등록하기</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 10,
		marginBottom: 12,
	},
	imageContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	uploadedImage: {
		width: 100,
		height: 100,
		borderRadius: 8,
		marginBottom: 8,
	},
	attachButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	attachButtonText: {
		color: '#fff',
		fontSize: 16,
	},
	submitButton: {
		backgroundColor: '#1976D2',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 18,
	},
});
