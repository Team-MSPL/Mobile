import {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getMyTravelList, getOneTravelCourse, travelSliceActions} from '../../redux/travel-info/travel.slice';
import 'moment/locale/ko';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import styled from 'styled-components/native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {Center, HStack, MainContainer, VStack} from '../../utill/layout/layout';
import {SvgRight, SvgRightAdd} from '../../utill/svg/svg';
import {DayViewContainer} from '../enroll-info/select-multi';
export default function MyTravelList({navigation}: any) {
	const {myTravelList, selectStartDate} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider, userName} = useAppSelector(state => state.userSlice);

	const dispatch = useAppDispatch();
	const goMyTravelDetail = async (e: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: e}));
			navigation.navigate('DetailInfo');
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '코스를 가져오던 중 에러가 발생했습니다',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goLogin = () => {
		navigation.replace('LoginScreen');
	};
	const getTravelList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getMyTravelList());
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '내 여행 리스트를 가져오던 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useBackHandler();
	useFocusEffect(
		useCallback(() => {
			socialloginProvider != 'anonymous' && getTravelList();
		}, []),
	);
	const goEnroll = () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		navigation.navigate('EnrollTravelTitle');
	};
	const dDayCalculate = (e: any) => {
		let sign = Math.sign(moment.duration(moment(e).hours(0).diff(moment())).asDays());
		let result = '';
		let totday = moment.duration(moment(e).hours(0).diff(moment())).asDays() * -1;
		if (totday > 0 && totday < 1) {
			result = '여행을 떠나는 날이에요';
		} else if (sign == 1) {
			result = '여행가기' + Math.ceil(moment.duration(moment(e).hours(0).diff(moment())).asDays()) + '일 전';
		} else if (sign == -1) {
			result =
				'여행 후' + (Math.floor(moment.duration(moment(e).hours(0).diff(moment())).asDays()) + 1) * -1 + '일';
		}
		return result;
	};

	return (
		<MainContainer>
			<NewTravelContainer>
				<HStack>
					<SubTitleColorText>{userName}</SubTitleColorText>
					<SubTitleBlackText>님, 다님과 떠나볼까요?</SubTitleBlackText>
				</HStack>
				<NewTravelHStack>
					<MainText>
						새로운
						{'\n'}여행 일정 만들기
					</MainText>
					<NewTravelButton onPress={goEnroll}>
						<ButtonText>출발</ButtonText>
						<ButtonRight>
							<SvgRight color={colors.selectButton} />
						</ButtonRight>
					</NewTravelButton>
				</NewTravelHStack>
			</NewTravelContainer>
			<NewTravelContainer>
				<SubTitleBlackText>잠시 머물렀던 그곳</SubTitleBlackText>
				<MainText>내 여행 기록</MainText>
			</NewTravelContainer>
			{socialloginProvider == 'anonymous' ? (
				<NewTravelContainer>
					<Center>
						<AnonymousText>로그인을 하면 추억을 남길수 있어요 </AnonymousText>
						<TouchableOpacity onPress={goLogin}>
							<SubTitleColorText>로그인하러가기</SubTitleColorText>
						</TouchableOpacity>
					</Center>
				</NewTravelContainer>
			) : myTravelList.length == 0 ? (
				<NewTravelContainer>
					<Center>
						<TouchableOpacity onPress={goEnroll}>
							<MainText>아직 만들어진 여행이 없어요!</MainText>
						</TouchableOpacity>
					</Center>
				</NewTravelContainer>
			) : (
				myTravelList.map((item, idx) => (
					<MyTravelContainer
						key={idx}
						onPress={() => {
							goMyTravelDetail(item._id);
						}}>
						<VStack>
							<DayText>
								{moment(item.day[0]).format('YYYY년-MM월-DD일') +
									'~' +
									moment(item.day[item.nDay - 1]).format('MM월-DD일')}
							</DayText>
							{/* <DayText>{dDayCalculate(item.day[0])}</DayText> */}
							<TravelTitleText>{item.travelName}</TravelTitleText>
						</VStack>
						<SvgRightAdd color={colors.selectButton} />
					</MyTravelContainer>
				))
			)}
		</MainContainer>
	);
}
const NewTravelContainer = styled.View`
	width: 100%;
	padding: 10px;
	margin: 10px 0px 50px 0px;
`;
const NewTravelHStack = styled(HStack)`
	justify-content: space-between;
	margin: 10px 0px 0px 0px;
`;
const MainText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: black;
`;
const NewTravelButton = styled.TouchableOpacity`
	width: 40%;
	height: 48px;
	padding: 10px;
	border-radius: 30px;
	background-color: ${colors.selectButton};
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const ButtonText = styled(MainText)`
	color: white;
	margin: 0px 0px 0px 10px;
`;
const ButtonRight = styled.View`
	width: 36px;
	height: 36px;
	border-radius: 99px;
	background-color: white;
	justify-content: center;
	align-items: center;
`;
const SubTitleColorText = styled(MainText)`
	font-size: 17px;
	color: ${colors.selectButton};
`;
const SubTitleBlackText = styled(MainText)`
	font-size: 17px;
	color: black;
	font-weight: 500;
`;
export const DayText = styled.Text`
	font-size: 17px;
	color: ${colors.selectButton};
`;

const MyTravelContainer = styled(DayViewContainer).attrs({as: TouchableOpacity})`
	margin: 5px 0px 5px 0px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const TravelTitleText = styled(SubTitleColorText)`
	font-size: 22px;
	font-weight: 900;
`;
const AnonymousText = styled(MainText)`
	color: ${colors.regionNormal};
`;
