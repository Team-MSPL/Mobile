import React, {useEffect, useState} from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	FlatList,
	Image,
	Modal,
	Alert,
	ScrollView,
	Button,
	StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import shortid from 'shortid';
import ImageCropPicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAppSelector} from '../../redux';

export default function CommunityWritingScreen({navigation}: any) {
	const goBack = () => {
		navigation.goBack();
	};
	const [title, setTitle] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [images, setImages] = useState<string[]>([]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const {jwtToken} = useAppSelector(state => state.loginSlice);

	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			cropping: true,
			maxFiles: 10,
		}).then(response => {
			if (response.length > 10) {
				Alert.alert('사진은 최대 10장까지 가능합니다.');
				return;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i].size > 10000000) {
					Alert.alert('10Mb보다 작은 사진만 업로드 가능합니다.');
					return;
				}
			}
			if (!response || response.length === 0) {
				console.log('사진 선택을 취소하였습니다.');
				return;
			}
			const selectedImageUris = response.map(image => image.path);
			setImages(prevImages => [...prevImages, ...selectedImageUris]);
		});
	};

	const handlePostSubmit = () => {
		if (title.trim() === '') {
			Alert.alert('제목을 입력해주세요');
			console.log('제목을 입력해주세요.');
			return;
		}

		if (content.trim() === '') {
			Alert.alert('내용을 입력해주세요');
			console.log('내용을 입력해주세요.');
			return;
		}

		if (images.length > 10) {
			Alert.alert('최대 10장까지만 사진을 업로드할 수 있습니다.');
			console.log('사진 업로드 제한', '최대 10장까지만 사진을 업로드할 수 있습니다.');
			return;
		}

		try {
			firestore()
				.collection('커뮤니티')
				.doc(title) // 제목을 문서 ID로 사용
				.set({
					posterToken: jwtToken,
					postTitle: title,
					postContent: content,
					postKey: shortid.generate(),
					createdAt: firestore.FieldValue.serverTimestamp(),
					postImageList: images,
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

	const handleMoreButtonPress = () => {
		setIsModalVisible(true);
	};

	const handleModalClose = () => {
		setIsModalVisible(false);
	};

	return (
		<ScrollView style={styles.container}>
			<TextInput style={styles.titleInput} placeholder='제목' value={title} onChangeText={setTitle} />
			<TextInput
				style={styles.contentInput}
				placeholder='내용'
				value={content}
				onChangeText={setContent}
				multiline
			/>
			<View style={styles.imageContainer}>
				{images.slice(0, 8).map((uri, index) => (
					<Image key={index} source={{uri}} style={styles.uploadedImage} />
				))}
				{images.length > 8 && (
					<TouchableOpacity style={styles.moreButton} onPress={handleMoreButtonPress}>
						<Text style={styles.moreButtonText}>더보기</Text>
					</TouchableOpacity>
				)}
			</View>
			<TouchableOpacity style={styles.attachButton} onPress={handleImagePickerLaunch}>
				<Text style={styles.attachButtonText}>사진 선택하기</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.submitButton} onPress={handlePostSubmit}>
				<Text style={styles.submitButtonText}>글 등록하기</Text>
			</TouchableOpacity>
			<Modal visible={isModalVisible} onRequestClose={handleModalClose}>
				<ScrollView contentContainerStyle={styles.modalContainer}>
					{images.map((uri, index) => (
						<Image key={index} source={{uri}} style={styles.modalImage} />
					))}
				</ScrollView>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	titleInput: {
		fontSize: 18,
		borderBottomWidth: 1,
		borderColor: '#ccc',
		marginBottom: 16,
	},
	contentInput: {
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		height: 200,
		padding: 8,
		marginBottom: 16,
	},
	imageContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		marginBottom: 16,
	},
	uploadedImage: {
		width: 100,
		height: 100,
		margin: 8,
	},
	moreButton: {
		width: 100,
		height: 100,
		margin: 8,
		backgroundColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
	},
	moreButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
	},
	attachButton: {
		backgroundColor: 'blue',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
		marginBottom: 16,
	},
	attachButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
	},
	submitButton: {
		backgroundColor: 'green',
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	submitButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
	},
	modalContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 16,
	},
	modalImage: {
		width: 100,
		height: 100,
		margin: 8,
	},
});
