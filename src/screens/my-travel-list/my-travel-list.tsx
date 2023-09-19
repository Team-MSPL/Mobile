import {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getMyTravelList, getOneTravelCourse} from '../../redux/travel-info/travel.slice';
import {TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {DayViewContainer} from '../enroll-info/select-multi';
import styled from 'styled-components/native';
import {HStack, MainContainer, VStack} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {SvgRight, SvgRightAdd} from '../../utill/svg/svg';
export default function MyTravelList({navigation}: any) {
	const {myTravelList} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider, userName} = useAppSelector(state => state.userSlice);

	const dispatch = useAppDispatch();
	const [view, setView] = useState(0);
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
	const goMakeTravel = () => {
		navigation.navigate('Home');
		navigation.navigate('SelectCity');
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
	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => <Text>내 여행</Text>,
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<TouchableOpacity
						onPress={() => {
							setView(view + 1);
						}}>
						<Text>새로고침</Text>
					</TouchableOpacity>
				),
		});
	}, []);
	useFocusEffect(
		useCallback(() => {
			socialloginProvider != 'anonymous' && getTravelList();
		}, []),
	);

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
					<NewTravelButton>
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
				<Box>익명이라 보여줄게 없엉 </Box>
			) : myTravelList.length == 0 ? (
				<TouchableOpacity onPress={goMakeTravel}>
					<Text>내 여행이 없네유 만들러 고고?</Text>
				</TouchableOpacity>
			) : (
				myTravelList.map((item, idx) => (
					<MyTravelContainer
						onPress={() => {
							goMyTravelDetail(item._id);
						}}>
						<VStack>
							<DayText>
								{moment(item.day[0]).format('YYYY년-MM월-DD일') +
									'~' +
									moment(item.day[item.nDay - 1]).format('MM월-DD일')}
							</DayText>
							<Text>{item.travelName}</Text>
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
