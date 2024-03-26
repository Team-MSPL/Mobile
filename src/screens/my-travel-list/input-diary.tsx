import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {BackHandler} from 'react-native';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import CustomButton from '../../utill/component/custom-button';
import {updateDiary} from '../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {SVGPencil, SvgCancel, SvgPicture} from '../../utill/svg/svg';
import {PretendardVariableText, VStack} from '../../utill/layout/layout';
import {usePhoto} from '../../utill/hooks/usePhoto';
import {useUriToBlob} from '../../utill/hooks/useUriToBlob';
import {getStorage, ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {storage, firebase} from '../../../config';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
import ImageView from 'react-native-image-viewing';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function InputDiary({navigation}: any) {
	const {travelId, region, diary, picture, reviewCheck} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [saveCheck, setSaveCheck] = useState(false);
	const [diaryValue, setDiaryValue] = useState(diary);

	const [pictureValue, setpictureValue] = useState<string[]>(picture);
	const changeDiary = (e: string) => {
		!saveCheck && setSaveCheck(true);
		setDiaryValue(e);
	};

	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused() && saveCheck) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '저장이 필요합니다. ',
						modalSubTitle: '변경사항이 저장되지않았습니다. 나가시겠습니까?',
						modalTopText: '나가기',
						modalBottomText: '수정계속하기',
						modalLeft: true,
						modalFunction: () => {
							navigation.goBack();
						},
					}),
				);

				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [saveCheck]);
	const {uploadImage} = useFirebaseStorage();
	let diaryImageRef = useRef<string[]>([]);
	const goSaveDiary = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			diaryImageRef.current = [];
			const ImageFunction = pictureValue.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: travelId, category: 'diary'})) ?? '';
				diaryImageRef.current.push(data);
			});
			await Promise.all(ImageFunction);
			const data = {travelId: travelId, diary: diaryValue, picture: diaryImageRef.current};
			await dispatch(updateDiary(data));
			navigation.goBack();
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

	const {handleImagePickerLaunch} = usePhoto();
	const handelGetImage = async () => {
		handleImagePickerLaunch({
			photoData: pictureValue,
			changeFunction: setpictureValue,
			saveCheck: saveCheck,
			setSaveCheck: setSaveCheck,
		});
	};
	const deletePicture = (e: number) => {
		let copy = [...pictureValue];
		copy.splice(e, 1);
		setpictureValue(copy);
	};
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const viewingImgae = (e: number) => {
		setVisible(true);
		setImageIndex(e);
	};
	return (
		<>
			<PretendardVariableText size={20} lineHeight={27} color={colors.Black}>
				여행 일기
			</PretendardVariableText>
			<PictureCotainer>
				<PictureScroll horizontal={true} showsHorizontalScrollIndicator={false}>
					<PictureElementContainer onPress={handelGetImage}>
						<PictuerVstack>
							<SvgPicture color={colors.selectButton} />
							<PictureText>사진 추가</PictureText>
						</PictuerVstack>
					</PictureElementContainer>
					{pictureValue.map((item, idx) => (
						<PictureElementContainer
							key={idx}
							onPress={() => {
								viewingImgae(idx);
							}}>
							<CancelContainer
								onPress={() => {
									deletePicture(idx);
								}}>
								<SvgCancel color='white' width={13} height={13}></SvgCancel>
							</CancelContainer>
							<PictureElement source={{uri: item}}></PictureElement>
						</PictureElementContainer>
					))}
				</PictureScroll>
			</PictureCotainer>
			<PretendardVariableText size={16} lineHeight={19.09} color={colors.Black}>
				일기
			</PretendardVariableText>
			<DiaryTextInput
				value={diaryValue}
				multiline={true}
				placeholderTextColor={'grey'}
				style={{color: 'black'}}
				placeholder='여행 일기로 추억을 기록해보세요'
				onChangeText={(value: string) => changeDiary(value)}></DiaryTextInput>
			<ImageView
				images={pictureValue.map((item, idx) => ({
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
			<TestButton onPress={goSaveDiary}>
				<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
					{diary == '' ? '일기 & 사진 저장' : '일기 & 사진 수정'}
				</PretendardVariableText>
			</TestButton>
		</>
	);
}

const TestButton = styled.TouchableOpacity`
	width: ${widthPercentage(120)}px;
	height: ${heightPercentage(40)}px;
	border-radius: 12px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	align-self: center;
	margin-top: ${widthPercentage(10)}px;
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
const DiaryText = styled.Text`
	font-size: 17px;
	font-weight: bold;
	color: black;
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
const PictureText = styled.Text`
	margin: 10px 0px 0px 0px;
	font-size: 15px;
	font-weight: bold;
	color: ${colors.selectButton};
`;
const PictuerVstack = styled(VStack)`
	align-items: center;
	justify-content: center;
`;
export const PictureElement = styled.Image`
	width: 135px;
	height: 180px;
	border-radius: 10px;
`;
