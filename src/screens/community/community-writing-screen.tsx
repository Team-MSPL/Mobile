import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native';
import ImageView from 'react-native-image-viewing';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {communitySliceActions, getPostList, savePost, updatePost} from '../../redux/community/community.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import {CancelContainer, PictureElement, PictureElementContainer} from '../my-travel-list/input-diary';
import {SVGCamera, SvgCancel} from '../../utill/svg/svg';
import {usePhoto} from '../../utill/hooks/usePhoto';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';

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
					modalBottomFunctionUse: true,
					modalBottomFunction: handleRefresh,
					modalBottomText: '확인',
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
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<PrimaryButton
					label='작성'
					backgroundColor={colors.Primary}
					textColor={colors.Black}
					width={widthPercentage(60)}
					height={heightPercentage(28)}
					disabled={postData.postTitle.trim() === '' || postData.postContent.trim() === ''}
					onPress={handlePostSubmit}></PrimaryButton>
			),
		});
	}, [postData.postTitle, postData.postContent]);
	return (
		<SafeAreaView>
			<CommunityWritingContainer>
				<TitleInput
					placeholder='제목'
					placeholderTextColor={colors.Gray2}
					value={postData.postTitle}
					onChangeText={changeTitle}
					multiline={true}
				/>
				<ContentInput
					placeholder={`내용을 입력하세요\n 부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다.`}
					placeholderTextColor={colors.Gray2}
					value={postData.postContent}
					onChangeText={changeContent}
					multiline={true}
				/>
				{postData.postImage.length > 0 && (
					<ImageScrollViewContainer horizontal={true}>
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
					</ImageScrollViewContainer>
				)}
			</CommunityWritingContainer>
			<CammeraContainer onPress={handleImage}>
				<SVGCamera width={widthPercentage(24)} height={widthPercentage(24)} color='black' />
			</CammeraContainer>
		</SafeAreaView>
	);
}
export const CammeraContainer = styled.TouchableOpacity`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(48)}px;
	justify-content: center;
	padding-left: ${widthPercentage(20)}px;
	border-top-width: 1px;
	position: absolute;
	bottom: 0px;
	background-color: ${colors.backgroundGray};
	border-color: ${colors.Gray1};
`;
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
	margin-bottom: ${heightPercentage(48)}px;
`;

const TitleInput = styled.TextInput`
	border-bottom-width: 1px;
	border-color: ${colors.Gray2};
	width: ${widthPercentage(327)}px;
	margin-bottom: ${heightPercentage(10)}px;
	color: ${colors.Black};
	font-weight: 700;
`;
const ContentInput = styled.TextInput`
	border-bottom-width: 1px;
	border-color: ${colors.Gray2};
	width: ${widthPercentage(327)}px;
	margin-bottom: ${heightPercentage(10)}px;
	color: ${colors.Black};
	font-weight: 700;
	height: ${heightPercentage(500)}px;
`;
export const ImageScrollViewContainer = styled.ScrollView`
	background-color: ${colors.backgroundGray};
	gap: ${widthPercentage(20)}px;
`;
const ImageInputButtonText = styled.Text`
	font-size: 16px;
	color: ${colors.selectButton};
`;
