import {useCallback} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getMyTravelList, getOneTravelCourse, travelSliceActions} from '../../redux/travel-info/travel.slice';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {Center, HStack, MainContainer, devicesWidth} from '../../utill/layout/layout';
import {SvgRight} from '../../utill/svg/svg';
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
			<MyTravelListContainer>
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
							<TouchableOpacity onPress={goMakeTravel}>
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
							<MyTravelContainerThumbnail
								source={require('../../../public/images/danim_logo2.png')}
								resizeMode='contain'></MyTravelContainerThumbnail>
							<MyTravelTextContainer>
								<TravelTitleText>{item.travelName}</TravelTitleText>
								<HStack>
									<DateIcon name='calendar' />
									<DateText>
										{moment(item.day[0]).format('YYYY.MM.DD') +
											' ~ ' +
											moment(item.day[item.nDay - 1]).format('MM.DD')}
									</DateText>
								</HStack>
								<HStack>
									<RegionIcon name='enviromento' />
									{item.region.length == 1 ? (
										<RegionText>{item.region}</RegionText>
									) : (
										<RegionText>
											{item.region[0]} 외 {item.region.length - 1}곳
										</RegionText>
									)}
								</HStack>
							</MyTravelTextContainer>
						</MyTravelContainer>
					))
				)}
			</MyTravelListContainer>
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
	font-size: ${devicesWidth * 0.04}px;
	color: ${colors.Gray};
`;

const MyTravelListContainer = styled.View`
	align-items: center;
`;

const MyTravelContainer = styled.TouchableOpacity`
	width: ${devicesWidth * 0.9}px;
	height: ${devicesWidth * 0.32}px;
	flex-direction: row;
	align-items: center;
	justify-content: space-evenly;
	border-radius: ${devicesWidth * 0.03}px;
	background-color: ${colors.main};
	${Platform.OS === 'android' ? 'elevation: 4;' : 'box-shadow: 0px 2px 4px #ccc;'}
	margin-bottom: ${devicesWidth * 0.05}px;
`;

const MyTravelContainerThumbnail = styled.ImageBackground`
	height: ${devicesWidth * 0.24}px;
	aspect-ratio: 1;
	align-items: center;
	justify-content: center;
	border-radius: ${devicesWidth * 0.04}px;
`;

const MyTravelTextContainer = styled.View`
	height: ${devicesWidth * 0.24}px;
	width: ${devicesWidth * 0.56}px;
`;

const TravelTitleText = styled.Text`
	color: ${colors.Black};
	font-size: ${devicesWidth * 0.04}px;
	font-weight: 600;
	margin-bottom: ${devicesWidth * 0.02}px;
`;

const DateIcon = styled(Icon)`
	font-size: ${devicesWidth * 0.04}px;
	color: ${colors.DanimSub};
	margin-right: ${devicesWidth * 0.01}px;
	margin-bottom: ${devicesWidth * 0.03}px;
`;
const DateText = styled.Text`
	font-size: ${devicesWidth * 0.04}px;
	font-weight: 500;
	color: ${colors.LightGray3};
	margin-bottom: ${devicesWidth * 0.03}px;
`;
const RegionIcon = styled(Icon)`
	font-size: ${devicesWidth * 0.04}px;
	margin-right: ${devicesWidth * 0.01}px;
	color: ${colors.DanimSub};
`;
const RegionText = styled.Text`
	font-size: ${devicesWidth * 0.04}px;
	font-weight: 500;
	color: ${colors.LightGray3};
`;

const AnonymousText = styled(MainText)`
	color: ${colors.regionNormal};
`;
