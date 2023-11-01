import moment from 'moment';
import React, {useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {communitySliceActions, getPostList, savePost, updatePost} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';

export default function CommunityWritingScreen({navigation, route}: any) {
	const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
	const {blockUserList} = useAppSelector(state => state.userSlice);
	const {postData} = useAppSelector(state => state.communitySlice);

	const dispatch = useAppDispatch();

	const changeTitle = (e: string) => {
		dispatch(communitySliceActions.setPostTitle(e));
	};
	const changeContent = (e: string) => {
		dispatch(communitySliceActions.setPostContent(e));
	};
	const changeImage = (e: string[]) => {
		dispatch(communitySliceActions.setPostImage(e));
	};
	// 사진 가져오기
	const handleImagePickerLaunch = () => {
		ImageCropPicker.openPicker({
			multiple: true,
			mediaType: 'photo',
			cropping: true,
			compressImageQuality: 0.1,
			includeBase64: true,
		}).then(response => {
			const temporaryList = [];
			for (let i = 0; i < response.length; i++) {
				temporaryList.push(`data:${response[i].mime};base64,${response[i]?.data}`);
			}
			changeImage(temporaryList);
		});
	};
	const handleRefresh = async () => {
		try {
			dispatch(communitySliceActions.resetPostList());
			await dispatch(getPostList({page: 1, sort: 1, blockList: blockUserList}));
			navigation.popToTop();
		} catch {
			modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'});
		}
	};
	// * 게시글 등록
	const handlePostSubmit = async () => {
		if (postData.postTitle.trim() === '') {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '제목을 입력해주세요'}));
			return;
		}

		if (postData.postContent.trim() === '') {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '내용을 입력해주세요'}));
			return;
		}

		if (postData.postImage.length > 5) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '업로드 제한',
					modalSubTitle: '사진은 최대 5장까지 가능합니다.',
				}),
			);
			return;
		}

		try {
			dispatch(LoadingSliceActions.onLoading());
			if (route.params.isNewPost) {
				const data = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: postData.postImage,
					postedAt: moment(Date()).format('yyyy/MM/DD HH:mm:ss'),
				};
				await dispatch(savePost(data));
			} else {
				const data = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: postData.postImage,
					postId: postData._id,
				};
				await dispatch(updatePost(data));
			}

			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '등록',
					modalSubTitle: '게시글이 등록되었습니다.',
					modalFunction: handleRefresh,
				}),
			);
		} catch (error) {
			modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'});
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	// 변화되는 인덱스
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

	return (
		<SafeAreaView>
			<CommunityWritingContainer>
				<CommunityWritingTitleText>제목</CommunityWritingTitleText>
				<TitleInput
					placeholder='제목을 입력해주세요'
					placeholderTextColor={'grey'}
					style={{color: 'black'}}
					value={postData.postTitle}
					onChangeText={changeTitle}
					multiline={true}
				/>

				<CommunityWritingTitleText>내용</CommunityWritingTitleText>
				<ContentInput
					placeholder='부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다.'
					placeholderTextColor={'grey'}
					style={{color: 'black'}}
					value={postData.postContent}
					onChangeText={changeContent}
					multiline={true}
				/>
				<CommunityWritingTitleText>사진(최대 5장까지 가능합니다)</CommunityWritingTitleText>
				<ImageContainer horizontal={true}>
					<ImageInputButton onPress={handleImagePickerLaunch}>
						<ImageInputButtonText>사진 추가하기</ImageInputButtonText>
						<ImageInputButtonIcon name='pluscircleo' />
					</ImageInputButton>
					{postData.postImage.map((uri, index) => {
						return (
							<ImageWrapper
								onPress={() => {
									setCurrentImageIndex(index);
									setIsImageModalVisible(true);
								}}
								key={index}>
								<PostImage source={{uri: uri}} />
							</ImageWrapper>
						);
					})}
					<ImageView
						images={postData.postImage.map(uri => ({uri}))}
						imageIndex={currentImageIndex}
						visible={isImageModalVisible}
						onRequestClose={() => {
							setIsImageModalVisible(false);
						}}
						FooterComponent={index => {
							return (
								<ImageViewFooterComponent>
									<ImageText>
										{index.imageIndex + 1}/{postData.postImage.length}
									</ImageText>
								</ImageViewFooterComponent>
							);
						}}
					/>
				</ImageContainer>
				<SubmitButton onPress={handlePostSubmit}>
					<SubmitText>게시</SubmitText>
				</SubmitButton>
			</CommunityWritingContainer>
		</SafeAreaView>
	);
}

const CommunityWritingContainer = styled.ScrollView`
	background-color: ${colors.main};
	padding-horizontal: 24px;
	padding-vertical: 12px;
`;

const CommunityWritingTitleText = styled.Text`
	font-weight: bold;
	font-size: 20px;
	margin-bottom: 16px;
	color: black;
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
	margin-bottom: 24px;
`;
