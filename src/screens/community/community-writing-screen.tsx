import moment from 'moment';
import React, {useRef, useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import ImageView from 'react-native-image-viewing';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {communitySliceActions, getPostList, savePost, updatePost} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import CustomButton from '../../utill/component/custom-button';
import {CancelContainer, PictureElement, PictureElementContainer} from '../my-travel-list/input-diary';
import {SvgCancel} from '../../utill/svg/svg';
import {usePhoto} from '../../utill/hooks/usePhoto';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import {heightPercentage} from '../../utill/layout/responsive-size';

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
	const {handleImagePickerLaunch} = usePhoto();
	const handleImage = () => {
		handleImagePickerLaunch({photoData: postData.postImage, changeFunction: changeImage});
	};
	const deletePicture = (idx: number) => {
		let copy = [...postData.postImage];
		copy.splice(idx, 1);
		dispatch(communitySliceActions.setPostImage(copy));
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

	let diaryImageRef = useRef<string[]>([]);

	const {uploadImage} = useFirebaseStorage();
	// * 게시글 등록
	const handlePostSubmit = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			if (route.params.isNewPost) {
				const data = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: [],
					postedAt: moment(Date()).format('yyyy/MM/DD HH:mm:ss'),
				};
				let postId = await dispatch(savePost(data)).unwrap();
				diaryImageRef.current = [];
				const ImageFunction = postData.postImage.map(async (item, idx) => {
					let data = (await uploadImage({item: item, idx: idx, id: postId.postId, category: 'post'})) ?? '';
					diaryImageRef.current.push(data);
				});
				await Promise.all(ImageFunction);
				const uploadData = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: diaryImageRef.current,
					postId: postId.postId,
				};
				await dispatch(updatePost(uploadData));
			} else {
				diaryImageRef.current = [];
				const ImageFunction = postData.postImage.map(async (item, idx) => {
					let data = (await uploadImage({item: item, idx: idx, id: postData._id, category: 'post'})) ?? '';
					diaryImageRef.current.push(data);
				});
				await Promise.all(ImageFunction);
				const data = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: diaryImageRef.current,
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

	//direction true=오른쪽
	const moveImage = ({index, direction}: {index: number; direction: boolean}) => {
		let copy = [...postData.postImage];
		let temp = copy[index + (direction ? 1 : -1)];
		copy[index + (direction ? 1 : -1)] = copy[index];
		copy[index] = temp;
		changeImage(copy);
	};

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
					<PictureElementContainer onPress={handleImage}>
						<ImageInputButtonText>사진 추가하기</ImageInputButtonText>
						<ImageInputButtonIcon name='pluscircleo' />
					</PictureElementContainer>
					{postData.postImage.map((uri, index) => {
						return (
							<PictureElementContainer
								onPress={() => {
									setCurrentImageIndex(index);
									setIsImageModalVisible(true);
								}}
								key={index}>
								<CancelContainer
									onPress={() => {
										deletePicture(index);
									}}>
									<SvgCancel color='white' width={13} height={13}></SvgCancel>
								</CancelContainer>
								<PictureElement source={{uri: uri}} />
								<BarContainer>
									{index != 0 && (
										<MoveButton
											onPress={() => {
												moveImage({index: index, direction: false});
											}}>
											<ImageInputButtonText>왼</ImageInputButtonText>
										</MoveButton>
									)}
									{index != postData.postImage.length - 1 && (
										<MoveButton
											onPress={() => {
												moveImage({index: index, direction: true});
											}}>
											<ImageInputButtonText>오</ImageInputButtonText>
										</MoveButton>
									)}
								</BarContainer>
							</PictureElementContainer>
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
				<CustomButton
					label='게시'
					onPress={handlePostSubmit}
					width={100}
					isDisabled={postData.postTitle.trim() === '' || postData.postContent.trim() === ''}></CustomButton>
			</CommunityWritingContainer>
		</SafeAreaView>
	);
}
const BarContainer = styled.View`
	width: 100%;
	position: absolute;
	height: ${heightPercentage(40)}px;
	bottom: 0px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;
const MoveButton = styled.TouchableOpacity`
	width: 50%;
`;
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
const ImageInputButtonText = styled.Text`
	font-size: 16px;
	color: ${colors.selectButton};
`;
const ImageInputButtonIcon = styled(AntDesignIcon)`
	font-size: 24px;
	color: ${colors.border};
`;
