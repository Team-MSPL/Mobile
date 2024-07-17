import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, SafeAreaView, TouchableOpacity} from 'react-native';
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
import {SVGCamera, SvgCancel, SvgRight} from '../../utill/svg/svg';
import {usePhoto} from '../../utill/hooks/usePhoto';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';
import {PretendardVariableText} from '../../utill/layout/layout';
import {useBackHandler} from '../../utill/hooks/useBackhandler';

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
	useBackHandler({type: 'communityExit'});
	const {uploadImage} = useFirebaseStorage();
	// * 게시글 등록
	const handlePostSubmit = async () => {
		try {
			Keyboard.dismiss();
			dispatch(LoadingSliceActions.onLoading());
			if (route.params.isNewPost) {
				const data = {
					postTitle: postData.postTitle,
					postContent: postData.postContent,
					postImage: [],
					postedAt: moment(Date()).format('yyyy/MM/DD HH:mm:ss'),
				};
				let postId = await dispatch(savePost(data)).unwrap();
				diaryImageRef.current = Array(postData.postImage.length).fill('');
				const ImageFunction = postData.postImage.map(async (item, idx) => {
					let data = (await uploadImage({item: item, idx: idx, id: postId.postId, category: 'post'})) ?? '';
					diaryImageRef.current[idx] = data;
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
				diaryImageRef.current = Array(postData.postImage.length).fill('');
				const ImageFunction = postData.postImage.map(async (item, idx) => {
					let data = (await uploadImage({item: item, idx: idx, id: postData._id, category: 'post'})) ?? '';
					diaryImageRef.current[idx] = data;
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
					modalSingleUse: true,
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
				<TouchableOpacity
					style={{
						display:
							postData.postTitle.trim() === '' || postData.postContent.trim() === '' ? 'none' : 'flex',
					}}
					disabled={postData.postTitle.trim() === '' || postData.postContent.trim() === ''}
					onPress={handlePostSubmit}>
					<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
						등록
					</PretendardVariableText>
				</TouchableOpacity>
			),
		});
	}, [postData.postTitle, postData.postContent, postData.postImage]);
	return (
		<SafeAreaView style={{flex: 1}}>
			<Container>
				<CommunityWritingContainer>
					<TitleInput
						placeholder='제목'
						placeholderTextColor={colors.Gray2}
						value={postData.postTitle}
						onChangeText={changeTitle}
						multiline={true}
						blurOnSubmit={true}
					/>
					<ContentInput
						placeholder={`내용을 입력하세요\n 부적절하거나 불쾌감을 줄 수 있는 컨텐츠는 제재를 받을 수 있습니다.`}
						placeholderTextColor={colors.Gray2}
						value={postData.postContent}
						onChangeText={changeContent}
						textAlignVertical='top'
						multiline={true}
						blurOnSubmit={true}
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
											<SvgCancel
												color='white'
												width={widthPercentage(15)}
												height={widthPercentage(15)}></SvgCancel>
										</CancelContainer>
										<PictureElement source={{uri: uri}} />
										<BarContainer>
											<MoveButton
												disabled={index == 0}
												onPress={() => {
													moveImage({index: index, direction: false});
												}}>
												{index != 0 && (
													<SvgRight
														width={widthPercentage(16)}
														height={widthPercentage(16)}
														color={colors.Black}
														transform={180}
													/>
												)}
											</MoveButton>
											<MoveButton
												disabled={index == postData.postImage.length - 1}
												onPress={() => {
													moveImage({index: index, direction: true});
												}}>
												{index != postData.postImage.length - 1 && (
													<SvgRight
														width={widthPercentage(16)}
														height={widthPercentage(16)}
														color={colors.Black}
													/>
												)}
											</MoveButton>
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
			</Container>
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
	justify-content: space-around;
	background-color: rgba(0, 0, 0, 0.2);
`;
const MoveButton = styled.TouchableOpacity`
	width: 50%;
	align-items: center;
`;
const Container = styled.View`
	flex: 1;
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
	margin-bottom: ${heightPercentage(30)}px;
`;
