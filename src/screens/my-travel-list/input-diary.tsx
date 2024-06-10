import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {BackHandler, Keyboard, TextInput} from 'react-native';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import CustomButton from '../../utill/component/custom-button';
import {reCourseName, travelSliceActions, updateDiary} from '../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SvgCancel, SvgPicture} from '../../utill/svg/svg';
import {HStack, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {usePhoto} from '../../utill/hooks/usePhoto';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import ImageView from 'react-native-image-viewing';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {RecommendBorderContainer} from '../enroll-info/region-recommend/detail-result';
import moment from 'moment';
import {savePost, updatePost} from '../../redux/community/community.slice';
export default function InputDiary({navigation, modify, setModify, text, setEditing}: any) {
	const {travelId, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [saveCheck, setSaveCheck] = useState(false);
	const [diaryValue, setDiaryValue] = useState(diary);

	const [pictureValue, setpictureValue] = useState<string[]>(picture);
	const changeDiary = (e: string) => {
		!saveCheck && setSaveCheck(true);
		dispatch(travelSliceActions.enrollReviewDiary(e));
		// setDiaryValue(e);
	};

	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused() && saveCheck) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '저장이 필요합니다. ',
						modalSubTitle: '변경사항이 저장되지않았습니다. 나가시겠습니까?',
						modalTopText: '수정계속하기',
						modalBottomText: '그냥 나가기',
						modalLeft: true,
						modalBottomFunctionUse: true,
						modalBottomFunction: () => {
							navigation.goBack();
						},
						modalFunction: goSaveDiary,
					}),
				);

				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [saveCheck, text, picture, diary]);
	const handleBuntton = () => {
		modify ? setModify(false) : goSaveDiary();
	};
	const {uploadImage} = useFirebaseStorage();
	let diaryImageRef = useRef<string[]>([]);
	const goSaveDiary = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const textData = {updateTravelName: text, travelId: travelId};
			await dispatch(reCourseName(textData));
			diaryImageRef.current = Array(picture.length).fill('');
			const ImageFunction = picture.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: travelId, category: 'diary'})) ?? '';
				diaryImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			const data = {travelId: travelId, diary: diary, picture: diaryImageRef.current};
			await dispatch(updateDiary(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '작성하신 내용을 커뮤니티에도 올리시겠습니까?',
					modalSubTitle: '*제목은 여행 제목으로 설정됩니다',
					modalFunction: handlePostSubmit,
					modalBottomFunctionUse: true,
					modalBottomFunction: () => {
						navigation.goBack();
					},
					modalTopText: '네, 올리겠습니다',
					modalBottomText: '아니요, 리뷰만 남기겠습니다',
				}),
			);
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '다이어리 저장이 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handlePostSubmit = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				postTitle: text,
				postContent: diary,
				postImage: [],
				postedAt: moment(Date()).format('yyyy/MM/DD HH:mm:ss'),
			};
			let postId = await dispatch(savePost(data)).unwrap();
			diaryImageRef.current = Array(picture.length).fill('');
			const ImageFunction = picture.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: postId.postId, category: 'post'})) ?? '';
				diaryImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			const uploadData = {
				postTitle: text,
				postContent: diary,
				postImage: diaryImageRef.current,
				postId: postId.postId,
			};
			await dispatch(updatePost(uploadData));

			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '등록',
					modalSubTitle: '게시글이 등록되었습니다.',
					modalFunction: () => {
						navigation.goBack();
					},
					modalSingleUse: true,
				}),
			);
		} catch (error) {
			modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'});
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	const changeImage = (e: any) => {
		dispatch(travelSliceActions.enrollReviewImage(e));
	};
	const {handleImagePickerLaunch} = usePhoto();
	const handelGetImage = async () => {
		handleImagePickerLaunch({
			photoData: picture,
			changeFunction: changeImage,
			saveCheck: saveCheck,
			setSaveCheck: setSaveCheck,
		});
	};
	const deletePicture = (e: number) => {
		let copy = [...picture];
		copy.splice(e, 1);
		dispatch(travelSliceActions.enrollReviewImage(copy));
		// setpictureValue(copy);
	};
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const viewingImgae = (e: number) => {
		setVisible(true);
		setImageIndex(e);
	};
	const changeModify = () => {
		setModify(true);
		handelGetImage();
	};
	const diaryRef = useRef<React.RefObject<TextInput>>();
	return (
		<RecommendBorderContainer>
			<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray5}>
				사진첩
			</PretendardSemiBoldText>
			<PictureCotainer>
				<PictureScroll horizontal={true} showsHorizontalScrollIndicator={false}>
					<PictureColorContainer onPress={modify ? handelGetImage : changeModify} noBorder={false}>
						<HStack gap={3}>
							<PretendardVariableText size={14} lineHeight={21} color={colors.PointYellow}>
								사진 추가
							</PretendardVariableText>
							<SvgPicture color={colors.PointYellow} width={widthPercentage(14)} />
						</HStack>
					</PictureColorContainer>
					{picture.map((item, idx) => (
						<PictureColorContainer
							noBorder={true}
							key={idx}
							onPress={() => {
								viewingImgae(idx);
							}}>
							{modify && (
								<CancelContainer
									onPress={() => {
										deletePicture(idx);
									}}>
									<SvgCancel
										color='white'
										width={widthPercentage(13)}
										height={widthPercentage(13)}></SvgCancel>
								</CancelContainer>
							)}
							<PictureElement
								width={widthPercentage(150)}
								height={widthPercentage(150)}
								resizeMode='cover'
								source={{uri: item}}></PictureElement>
						</PictureColorContainer>
					))}
				</PictureScroll>
			</PictureCotainer>
			<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Gray5}>
				일기
			</PretendardSemiBoldText>
			<DiaryTextInput
				value={diary}
				multiline={true}
				onPressIn={() => {
					!modify && setModify(true);
				}}
				placeholderTextColor={colors.Gray5}
				style={{
					color: 'black',
					fontSize: fontPercentage(14),
					fontFamily: 'PretendardVariable',
					lineHeight: fontPercentage(21),
				}}
				placeholder='여행 일기로 추억을 기록해보세요'
				blurOnSubmit={true}
				onChangeText={(value: string) => changeDiary(value)}></DiaryTextInput>
			{/* {!modify ? (
				<InsideGray
					status={diaryValue == ''}
					onPress={() => {
						setModify(true);
						diaryRef.current?.focus();
					}}>
					<PretendardVariableText size={14} lineHeight={21} color={colors.Gray5}>
						{diaryValue == '' ? '여행 일기로 추억을 기록해보세요' : diaryValue}
					</PretendardVariableText>
				</InsideGray>
			) : (
				<DiaryTextInput
					value={diaryValue}
					multiline={true}
					onPressIn={() => {
						modify && setModify(true);
					}}
					placeholderTextColor={colors.Gray5}
					style={{
						color: 'black',
						fontSize: fontPercentage(14),
						fontFamily: 'PretendardVariable',
						lineHeight: fontPercentage(21),
					}}
					placeholder='여행 일기로 추억을 기록해보세요'
					onChangeText={(value: string) => changeDiary(value)}></DiaryTextInput>
			)} */}
			<ImageView
				images={picture.map((item, idx) => ({
					uri: item,
				}))}
				onImageIndexChange={item => console.log(item)}
				imageIndex={imageIndex}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<ImageText>
								{index.imageIndex + 1}/{1}
							</ImageText>
						</ImageViewFooterComponent>
					);
				}}
			/>
			{/* <CustomButton
				onPress={handleBuntton}
				label={modify ? '수정 완료' : '리뷰 저장'}
				marginBottom={heightPercentage(15)}
				marginTop={heightPercentage(30)}></CustomButton> */}
		</RecommendBorderContainer>
	);
}
const NullContainer = styled.TouchableOpacity`
	width: ${widthPercentage(150)}px;
	height: ${widthPercentage(150)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundGray};
	align-items: center;
	justify-content: center;
`;
const InsideGray = styled.TouchableOpacity<{status: boolean}>`
	width: 100%;
	height: ${heightPercentage(120)}px;
	background-color: ${colors.Gray1};
	border-radius: 10px;
	margin: 10px 0px 0px 0px;
	text-align-vertical: top;
	padding: 9px 10px 10px 10px;
`;
const PlusCircle = styled.View`
	width: ${widthPercentage(30)}px;
	height: ${widthPercentage(30)}px;
	border-radius: 99px;
	border-width: 1px;
	align-items: center;
	justify-content: center;
`;
const PictureColorContainer = styled.TouchableOpacity<{noBorder: boolean}>`
	width: ${widthPercentage(150)}px;
	height: ${widthPercentage(150)}px;
	border-radius: 12px;
	align-items: center;
	border-width: ${props => (props.noBorder ? 0 : 1)}px;
	border-color: ${colors.PointYellow};
	justify-content: center;
	background-color: rgba(83, 80, 255, 0.08);
	margin-right: ${widthPercentage(12)}px;
	margin-top: ${heightPercentage(12)}px;
`;
export const CancelContainer = styled.TouchableOpacity`
	border-radius: 99px;
	padding: 10px;
	position: absolute;
	right: -10px;
	top: -10px;
	background-color: black;
	z-index: 3;
`;
export const DiaryTextInput = styled.TextInput`
	width: 100%;
	height: ${heightPercentage(120)}px;
	background-color: ${colors.Gray1};
	border-radius: 10px;
	margin: 10px 0px 0px 0px;
	text-align-vertical: top;
	padding: 10px;
`;
const PictureCotainer = styled.View`
	padding: 10px 0px;
	width: 100%;
	align-items: center;
	margin: 0px 0px 15px 0px;
	flex-direction: row;
`;
const PictureScroll = styled.ScrollView`
	flex-direction: row;
`;
export const PictureElementContainer = styled.Pressable`
	width: ${widthPercentage(125)}px;
	height: ${widthPercentage(125)}px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin: 10px ${widthPercentage(20)}px 0px 0px;
`;
export const PictureElement = styled.Image<{width?: number; height?: number}>`
	width: ${props => props.width ?? 135}px;
	height: ${props => props.height ?? 180}px;
	border-radius: 10px;
`;
