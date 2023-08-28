import moment from 'moment';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useAppDispatch, useAppSelector } from '../../redux';
import { savePost, savePostType, updatePost, updatePostType } from '../../redux/community/community.slice';

export default function CommunityWritingScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};
	const [postTitle, setPostTitle] = useState<string>(route.params.title);
	const [postContent, setPostContent] = useState<string>(route.params.content);
	const [postImage, setPostImage] = useState<string[]>(route.params.images);
	const [isNewPost, setIsNewPost] = useState<boolean>(route.params.isNewPost);
	const [isModalVisible, setIsMoreImageModalVisible] = useState<boolean>(false);
	const {userId, userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();

	const [check1, setCheck1] = useState<string[]>();

	// 사진 가져오기
	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			cropping: true,
			includeBase64: true,
		}).then(response => {
			let temporaryList = [];
			for (let i = 0; i < response.length; i++) {
				temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
			}
			//setPostImage(prevImages => [...prevImages, ...selectedImageUris]);
			setCheck1(temporaryList);
			console.log('이미지 주소');
		});
	};

	// * 게시글 등록
	const handlePostSubmit = () => {
		if (postTitle.trim() === '') {
			Alert.alert('제목을 입력해주세요');
			console.log('제목을 입력해주세요.');
			return;
		}

		if (postContent.trim() === '') {
			Alert.alert('내용을 입력해주세요');
			console.log('내용을 입력해주세요.');
			return;
		}

		if (postImage.length > 10) {
			Alert.alert('최대 10장까지만 사진을 업로드할 수 있습니다.');
			console.log('사진 업로드 제한', '최대 10장까지만 사진을 업로드할 수 있습니다.');
			return;
		}
		try {
			const newPostData: savePostType = {
				postTitle: postTitle,
				postContent: postContent,
				postImage: check1,
				postedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
			};

			const updatePostData: updatePostType = {
				postId: route.params.postId,
				postTitle: postTitle,
				postContent: postContent,
				postImage: check1,
				// TODO 게시글을 수정하면 수정한 시간 뜨게 하기
				//postedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
			};
			if (isNewPost) {
				dispatch(savePost(newPostData))
					.then(() => {
						Alert.alert('게시글이 등록되었습니다.');
						console.log('글이 성공적으로 저장되었습니다.');
					})
					.catch(error => {
						console.log('글을 저장하는 중에 오류가 발생했습니다:', error);
					});
			} else {
				console.log('여기 왔나');
				console.log(route.params.postId);
				dispatch(updatePost(updatePostData))
					.then(() => {
						Alert.alert('게시글이 수정되었습니다.');
						console.log('글이 성공적으로 저장되었습니다.');
					})
					.catch(error => {
						console.log('글을 저장하는 중에 오류가 발생했습니다:', error);
					});
			}
			goBack();
		} catch (error) {
			console.log('게시글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	// 이미지 더보기 모달 열기
	const openMoreImageModal = () => {
		setIsMoreImageModalVisible(true);
	};

	// 이미지 더보기 모달 닫기
	const closeMoreImageModal = () => {
		setIsMoreImageModalVisible(false);
	};

	return (
		<ScrollView style={styles.container}>
			<TextInput style={styles.titleInput} placeholder='제목' value={postTitle} onChangeText={setPostTitle} />
			<TextInput
				style={styles.contentInput}
				placeholder='내용'
				value={postContent}
				onChangeText={setPostContent}
				multiline
			/>
			<View style={styles.imageContainer}>
				{postImage.slice(0, 8).map((uri, index) => (
					<Image key={index} source={{uri}} style={styles.uploadedImage} />
				))}
				{postImage.length > 8 && (
					<TouchableOpacity style={styles.moreButton} onPress={openMoreImageModal}>
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
			<Modal visible={isModalVisible} onRequestClose={closeMoreImageModal}>
				<ScrollView contentContainerStyle={styles.modalContainer}>
					{postImage.map((uri, index) => (
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
