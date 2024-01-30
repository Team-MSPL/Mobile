import styled from 'styled-components/native';
import {MainContainer} from '../../layout/layout';
import {Keyboard} from 'react-native';
import {useState} from 'react';
import {colors} from '../../colors';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {savePlaceReview} from '../../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import CustomButton from '../custom-button';

export function CourseReview({navigation, route}: any) {
	const [reviewData, setReviewData] = useState('');
	const {userIdToken} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const changeText = (e: string) => {
		setReviewData(e);
	};
	const goBack = () => {
		navigation.goBack();
	};
	const handleSavePlaceReview = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let data = {
				region: route.params.value.region,
				name: route.params.value.name,
				reviewContent: reviewData,
				reviewUserToken: userIdToken,
				reviewPhotoList: [],
			};
			await dispatch(savePlaceReview(data));
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
	return (
		<MainContainer>
			<ReviewPressable
				onPress={() => {
					Keyboard.dismiss();
				}}>
				<ReviewInput
					onChangeText={e => changeText(e)}
					placeholder='리뷰를 남겨주세요'
					multiline={true}
					placeholderTextColor={'grey'}
					value={reviewData}></ReviewInput>
			</ReviewPressable>
			<CustomButton label='등록' onPress={handleSavePlaceReview}></CustomButton>
		</MainContainer>
	);
}

const ReviewPressable = styled.Pressable`
	flex: 1;
`;
const ReviewInput = styled.TextInput`
	width: 100%;
	height: 200px;
	border-width: 1px;
	border-radius: 5px;
	border-color: ${colors.selectButton};
	padding: 8px;
	font-size: 16px;
	font-weight: 400;
	color: black;
	text-align-vertical: top;
`;
