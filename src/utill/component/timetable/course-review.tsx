import styled from 'styled-components/native';
import {BackgroundGray, MainContainer} from '../../layout/layout';
import {Keyboard} from 'react-native';
import shortId from 'shortid';
import {useEffect, useRef, useState} from 'react';
import {colors} from '../../colors';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {savePlaceReview} from '../../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import CustomButton from '../custom-button';
import {CammeraContainer, ImageScrollViewContainer} from '../../../screens/community/community-writing-screen';
import {SVGCamera, SvgCancel} from '../../svg/svg';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {usePhoto} from '../../hooks/usePhoto';
import {CancelContainer, PictureElement, PictureElementContainer} from '../../../screens/my-travel-list/input-diary';
import useFirebaseStorage from '../../hooks/useFirebaseStorage';
import PrimaryButton from '../primary-button';
import {hikingSaveReview} from '../../../redux/travel-info/hiking.slice';

export function CourseReview({navigation, route}: any) {
	const [reviewData, setReviewData] = useState('');
	const {userIdToken} = useAppSelector(state => state.userSlice);
	const [reviewImage, setReviewImage] = useState([]);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<PrimaryButton
					label='등록'
					backgroundColor={colors.Primary}
					textColor={colors.Black}
					width={widthPercentage(60)}
					height={heightPercentage(28)}
					disabled={reviewData.trim() === ''}
					onPress={handleSavePlaceReview}></PrimaryButton>
			),
		});
	}, [reviewData, reviewImage]);
	const {uploadImage} = useFirebaseStorage();
	const dispatch = useAppDispatch();
	const changeText = (e: string) => {
		setReviewData(e);
	};
	const goBack = () => {
		navigation.goBack();
	};
	const changeImage = (e: any) => {
		console.log(typeof e[0]);
		setReviewImage(e);
	};
	const diaryImageRef = useRef<string[]>([]);
	const handleSavePlaceReview = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const randomId = shortId.generate();
			// id 체크해서 변경 후에 파이어베이스 업로드 확인하기
			console.log(randomId);
			diaryImageRef.current = Array(reviewImage.length).fill('');
			const ImageFunction = reviewImage.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: randomId, category: 'review'})) ?? '';
				diaryImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			let data = {
				region: route.params.value.region,
				name: route.params.value.name,
				reviewContent: reviewData,
				reviewUserToken: userIdToken,
				reviewPhotoList: diaryImageRef.current,
				reviewId: randomId,
			};
			route.params.value.region == '소백산국립공원(경북)'
				? await dispatch(hikingSaveReview(data))
				: await dispatch(savePlaceReview(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '등록완료',
					modalSubTitle: '소중한 기록을 남겨주셔서 감사합니다.',
					modalFunction: goBack,
				}),
			);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const {handleImagePickerLaunch} = usePhoto();
	const handleImage = () => {
		handleImagePickerLaunch({photoData: reviewImage, changeFunction: changeImage});
	};
	const deletePicture = (idx: number) => {
		let copy = [...reviewImage];
		copy.splice(idx, 1);
		setReviewImage(copy);
	};
	return (
		<BackgroundGray>
			<ReviewPressable showsVerticalScrollIndicator={false}>
				<ReviewInput
					onChangeText={e => changeText(e)}
					blurOnSubmit={true}
					placeholder='방문했던 곳에 대해 이야기해주세요.'
					multiline={true}
					placeholderTextColor={colors.Gray2}
					value={reviewData}></ReviewInput>
			</ReviewPressable>
			{reviewImage.length > 0 && (
				<ImageScrollViewContainer horizontal={true}>
					{reviewImage.map((uri, index) => {
						return (
							<PictureElementContainer onPress={() => {}} key={index}>
								<CancelContainer
									onPress={() => {
										deletePicture(index);
									}}>
									<SvgCancel
										color='white'
										width={widthPercentage(13)}
										height={widthPercentage(13)}></SvgCancel>
								</CancelContainer>
								<PictureElement source={{uri: uri}} />
							</PictureElementContainer>
						);
					})}
				</ImageScrollViewContainer>
			)}
			<CammeraContainer onPress={handleImage}>
				<SVGCamera width={widthPercentage(24)} height={widthPercentage(24)} color='black' />
			</CammeraContainer>
		</BackgroundGray>
	);
}

const ReviewPressable = styled.ScrollView`
	height: ${heightPercentage(300)}px;
`;
const ReviewInput = styled.TextInput`
	text-align-vertical: top;
	width: ${widthPercentage(327)}px;
	margin-bottom: ${heightPercentage(10)}px;
	color: ${colors.Black};
	font-weight: 700;
`;
