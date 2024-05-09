import {useCallback, useRef} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteAI,
	getAiList,
	getMyTravelList,
	getOneTravelCourse,
	travelSliceActions,
} from '../../redux/travel-info/travel.slice';
import 'moment/locale/ko';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import styled from 'styled-components/native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {Center, PretendardSemiBoldText, PretendardVariableText, TagContainer, VStack} from '../../utill/layout/layout';
import {SVGFlag, SvgRight, SVGRightAdd} from '../../utill/svg/svg';
import {ButtonContainer, DayViewContainer} from '../enroll-info/select-multi';
import {userSliceActions} from '../../redux/user/user.slice';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';
import CustomButton from '../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
export default function MyTravelList({navigation}: any) {
	const {myTravelList, selectStartDate, aiList} = useAppSelector(state => state.travelSlice);

	const dispatch = useAppDispatch();
	const goMyTravelDetail = async (e: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const whenDday = dDayCalculate({startDay: e.day[0], endDay: e.day[e.nDay - 1]});
			await dispatch(getOneTravelCourse({travelId: e._id}));
			if (!whenDday.endFlag) {
				dispatch(
					travelSliceActions.setMakeMode({shareViewWithStartFlag: !whenDday.endFlag, makeMode: 'modify'}),
				);
				navigation.navigate('Timetable');
			} else {
				navigation.navigate('DetailInfo');
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '코스 가져오기가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const getTravelList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = await dispatch(getMyTravelList()).unwrap();
			await dispatch(getAiList());
		} catch (err) {
			dispatch(travelSliceActions.setMyTravelList([]));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useBackHandler({type: 'exit'});
	useFocusEffect(
		useCallback(() => {
			getTravelList();
		}, []),
	);
	const checkGoEnroll = async () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '생각 중인 여행 지역이 있으신가요?',
				modalFunction: regionRecommend,
				modalBottomFunctionUse: true,
				modalBottomFunction: goEnroll,
				modalTopText: '아니요, 여행 지역부터 추천해주세요.',
				modalBottomText: '네, 바로 여행 코스를 추천받을래요.',
			}),
		);
	};
	const regionRecommend = () => {
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('RegionSelectWho');
	};
	const goEnroll = () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		navigation.navigate('EnrollTravelTitle');
	};
	const dDayCalculate = (e: any) => {
		//e.startDay=시작날짜e.endDay=끝나느날짜
		// 0~1 당일  -1 미래 1과거
		//여행 전, 여행 당일 ,여행 중, 여행 끝나는날, 여행 끝나고
		let startSign = Math.sign(moment.duration(moment(e.startDay).hours(0).diff(moment())).asDays());
		let endSign = Math.sign(moment.duration(moment(e.endDay).hours(0).diff(moment())).asDays());
		let result = '';
		let startStatus = moment.duration(moment(e.startDay).hours(0).diff(moment())).asDays() * -1;
		let endStatus = moment.duration(moment(e.endDay).hours(0).diff(moment())).asDays() * -1;
		let endFlag = false;
		if (startStatus > 0 && startStatus < 1) {
			result = '여행을 떠나는 날이에요';
		} else if (startSign == 1) {
			result =
				'여행가기' + Math.ceil(moment.duration(moment(e.startDay).hours(0).diff(moment())).asDays()) + '일 전';
		} else if (startSign == -1 && endSign == 1) {
			result = '신나는 여행 중이에요!';
		} else if (endStatus > 0 && endStatus < 1) {
			result = '여행의 마지막 날이에요!';
		} else if (endSign == -1) {
			result =
				'여행 후' +
				(Math.floor(moment.duration(moment(e.endDay).hours(0).diff(moment())).asDays()) + 1) * -1 +
				'일';
			endFlag = true;
		}
		let data = {result: result, endFlag: endFlag};
		return data;
	};
	const goPreset = (data: any) => {
		dispatch(
			travelSliceActions.setCache({
				presetDatas: data.preset,
				presetTendency: data.bestPointList,
				day: data.day,
				nDay: data.nDay - 1,
				transit: data.transit,
				tendency: data.tendency,
				travelName: data.travelName ?? '임시여행',
				aiID: data._id,
				region: data.region,
			}),
		);
		navigation.navigate('Preset');
	};
	const monthRef = useRef(moment().add(1, 'month').format('MM'));
	const renderItem = (item: any) => {
		let after = monthRef.current;
		monthRef.current = moment(item.item.day[0]).format('MM');
		return (
			<>
				{item.index == 0 && aiList.length != 0 && (
					<>
						<DivideDayContainer>
							<PretendardVariableText
								size={12}
								lineHeight={18}
								color={colors.Gray2}
								marginTop={heightPercentage(30)}>
								코스 미확정
							</PretendardVariableText>
						</DivideDayContainer>
						{aiList.map((data, idx) => (
							<MyTravelContainer
								key={idx}
								onPress={() => {
									goPreset(data);
								}}>
								<VStack>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
										{moment(data.day[0]).format('YYYY년-MM월-DD일') +
											'~' +
											moment(data.day[data.nDay - 1]).format('MM월-DD일')}
									</PretendardVariableText>
									<PretendardVariableText
										size={14}
										lineHeight={21}
										color={colors.Gray5}
										marginTop={2}>
										여행 코스를 선택하고{`\n`}편집하여 여행 계획을 완성해보세요!
									</PretendardVariableText>

									<TagContainer
										backgroundColor={colors.backgroundGray}
										height={heightPercentage(30)}
										width={widthPercentage(105)}>
										<PretendardVariableText size={14} lineHeight={21} color={colors.PointYellow}>
											{data.region[0]}
										</PretendardVariableText>
										<SVGFlag width={10} color={colors.Primary} />
									</TagContainer>
								</VStack>
							</MyTravelContainer>
						))}
					</>
				)}
				{monthRef.current != after && (
					<DivideDayContainer>
						<PretendardVariableText
							size={12}
							lineHeight={18}
							color={colors.Gray2}
							marginTop={heightPercentage(30)}>
							{moment(item.item.day[item.item.nDay - 1]).format('YYYY년 MM월')}
						</PretendardVariableText>
					</DivideDayContainer>
				)}
				<MyTravelContainer
					onPress={() => {
						goMyTravelDetail(item.item);
					}}>
					<VStack>
						<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
							{moment(item.item.day[0]).format('YYYY년-MM월-DD일') +
								'~' +
								moment(item.item.day[item.item.nDay - 1]).format('MM월-DD일')}
						</PretendardVariableText>
						<PretendardVariableText size={14} lineHeight={21} color={colors.Gray5}>
							{item.item.travelName}
						</PretendardVariableText>
						<PretendardVariableText size={14} lineHeight={21} color={colors.PointYellow}>
							{
								dDayCalculate({startDay: item.item.day[0], endDay: item.item.day[item.item.nDay - 1]})
									.result
							}
						</PretendardVariableText>
						<TagContainer
							backgroundColor={colors.backgroundGray}
							height={heightPercentage(30)}
							width={widthPercentage(105)}>
							<PretendardVariableText size={14} lineHeight={21} color={colors.PointYellow}>
								{item.item.region[0]}
							</PretendardVariableText>
							<SVGFlag width={10} color={colors.Primary} />
						</TagContainer>
					</VStack>
				</MyTravelContainer>
			</>
		);
	};
	return (
		<TravelContainer>
			<TravleListContainer>
				{myTravelList.length == 0 ? (
					<Center>
						<PretendardSemiBoldText size={16} lineHeight={22} color={colors.Gray2}>
							아직 만들어진 여행이 없어요:(
						</PretendardSemiBoldText>
					</Center>
				) : (
					<FlatList
						data={myTravelList}
						renderItem={renderItem}
						initialNumToRender={20}
						showsVerticalScrollIndicator={false}
						keyExtractor={item => item._id}
						nestedScrollEnabled></FlatList>
				)}
			</TravleListContainer>
			<CustomButton
				label='새로운 여행 떠나기'
				onPress={checkGoEnroll}
				width={widthPercentage(327)}
				marginBottom={12}></CustomButton>
		</TravelContainer>
	);
}
const TravleListContainer = styled.View`
	height: 85%;
`;
const DivideDayContainer = styled.View`
	padding: 0px 15px;
`;
const TravelContainer = styled.View`
	background-color: ${colors.main};
	padding: 0px 24px 0px 24px;
	height: 100%;
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
