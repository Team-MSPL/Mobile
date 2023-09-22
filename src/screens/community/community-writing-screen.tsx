import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {savePost, savePostType, updatePost, updatePostType} from '../../redux/community/community.slice';
import {colors} from '../../utill/colors';
import {PostImageIndicatorText, PostImageView} from './community-reading-screen';

export default function CommunityWritingScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};
	const [postTitle, setPostTitle] = useState<string>(route.params.title);
	const [postContent, setPostContent] = useState<string>(route.params.content);
	const [postImage, setPostImage] = useState<string[]>(route.params.images);
	const [isNewPost, setIsNewPost] = useState<boolean>(route.params.isNewPost);
	const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);

	const dispatch = useAppDispatch();

	// 사진 가져오기
	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			cropping: true,
			includeBase64: true,
		}).then(response => {
			const temporaryList = [];
			for (let i = 0; i < response.length; i++) {
				temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
			}
			setPostImage(temporaryList);
		});
	};

	// * 게시글 등록
	const handlePostSubmit = () => {
		console.log('야야양야야', postTitle);
		if (postTitle.trim() === '') {
			Alert.alert('제목을 입력해주세요');
			console.log(postTitle);
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
				postImage: postImage,
				postedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
			};

			const updatePostData: updatePostType = {
				postId: route.params.postId,
				postTitle: postTitle,
				postContent: postContent,
				postImage: postImage,
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

	// 변화되는 인덱스
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	// 초기 인덱스
	const [initialImageIndex, setInitialImageIndex] = useState<number | null>(null);
	const onSelect = (index: number) => {
		setInitialImageIndex(index);
		setCurrentImageIndex(index);
		setIsImageModalVisible(index === 0 || !!index);
	};

	// 앱 바 우측 더보기
	// useEffect(() => {
	// 	navigation.setOptions({
	// 		headerRight: () =>
	// 			socialloginProvider != 'anonymous' && (
	// 				<TouchableOpacity
	// 					onPress={() => {
	// 						handlePostSubmit();
	// 					}}>
	// 					<SubmitText>작성</SubmitText>
	// 				</TouchableOpacity>
	// 			),
	// 	});
	// }, []);

	useEffect(() => {
		setPostTitle(postTitle);
		console.log('제머고', postTitle);
		console.log('내용', postContent);
		//console.log('사진', postImage);
	}, [postTitle]);
	useEffect(() => {
		setPostContent(postContent);
		console.log('제머고', postTitle);
		console.log('내용', postContent);
		//console.log('사진', postImage);
	}, [postContent]);

	useEffect(() => {
		setPostImage(postImage);
		console.log('제머고', postTitle);
		console.log('내용', postContent);
		console.log('사진', postImage);
	}, [postImage]);

	return (
		<CommunityWritingContainer>
			<CommunityWritingSafeAreaContainer>
				<CommunityWritingTitleText>제목</CommunityWritingTitleText>
				<TitleInput
					placeholder='제목을 입력해주세요'
					value={postTitle}
					onChangeText={text => setPostTitle(text)}
					multiline={true}
				/>

				<CommunityWritingTitleText>내용</CommunityWritingTitleText>
				<ContentInput
					placeholder='내용을 입력해주세요'
					value={postContent}
					onChangeText={text => setPostContent(text)}
					multiline={true}
				/>
				<CommunityWritingTitleText>사진(최대 5장까지 가능합니다)</CommunityWritingTitleText>
				<ImageContainer horizontal={true}>
					<ImageInputButton onPress={handleImagePickerLaunch}>
						<ImageInputButtonText>사진 추가하기</ImageInputButtonText>
						<ImageInputButtonIcon name='pluscircleo' />
					</ImageInputButton>
					{postImage.map((uri, index) => {
						return (
							<ImageWrapper
								onPress={() => {
									onSelect(index);
								}}
								key={index}>
								<PostImage source={{uri: uri}} />
							</ImageWrapper>
						);
					})}
					<ImageView
						images={postImage.map(uri => ({uri}))}
						imageIndex={initialImageIndex || 0}
						visible={isImageModalVisible}
						onImageIndexChange={setCurrentImageIndex}
						onRequestClose={() => {
							setIsImageModalVisible(false);
						}}
						HeaderComponent={() => (
							<PostImageView>
								<PostImageIndicatorText>{`${currentImageIndex + 1}/${
									postImage.length
								}`}</PostImageIndicatorText>
							</PostImageView>
						)}
					/>
				</ImageContainer>
				<SubmitButton onPress={handlePostSubmit}>
					<SubmitText>게시</SubmitText>
				</SubmitButton>
			</CommunityWritingSafeAreaContainer>
		</CommunityWritingContainer>
	);
}

const CommunityWritingContainer = styled.ScrollView`
	flex: 1;
	background-color: white;
	padding: 12px;
`;

// safearea 영역
const CommunityWritingSafeAreaContainer = styled.SafeAreaView`
	flex: 1;
`;

const CommunityWritingTitleText = styled.Text`
	font-weight: bold;
	font-size: 20px;
	margin-bottom: 16px;
`;
const TitleInput = styled.TextInput`
	border: ${colors.border};
	border-radius: 12px;
	width: 100%;
	padding: 12px;
	margin-bottom: 24px;
`;
const ContentInput = styled.TextInput`
	border: ${colors.border};
	border-radius: 12px;
	width: 100%;
	aspect-ratio: 1.5;
	padding: 12px;
	margin-bottom: 24px;
`;
const ImageContainer = styled.ScrollView`
	background-color: #f0f0f0;
	width: 100%;
	padding: 12px;
	margin-bottom: 24px;
	border-radius: 12px;
`;
const ImageInputButton = styled.TouchableOpacity`
	height: 160px;
	aspect-ratio: 0.8;
	border: ${colors.border};
	border-radius: 12px;
	align-items: center;
	justify-content: space-evenly;
	background-color: #2698fa13;
	margin-right: 12px;
`;
const ImageInputButtonText = styled.Text`
	font-size: 16px;
	color: ${colors.selectButton};
`;
const ImageInputButtonIcon = styled(AntDesignIcon)`
	font-size: 24px;
	color: ${colors.border};
`;

// 사진을 누를 수 있게 하기 위한 componenet
const ImageWrapper = styled.TouchableOpacity``;
const PostImage = styled.Image`
	height: 160px;
	aspect-ratio: 0.8;
	border-radius: 12px;
	margin-right: 12px;
`;

const SubmitText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: ${colors.main};
`;
const SubmitButton = styled.TouchableOpacity`
	border-radius: 12px;
	height: 48px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.selectButton};
	width: 100%;
`;
