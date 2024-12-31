import {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	deleteTravelCourse,
	getAiList,
	getMyTravelList,
	getOneTravelCourse,
	getRegionInfo,
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
import {
	Center,
	HStack,
	HeaderContianer,
	PretendardSemiBoldText,
	PretendardVariableText,
	TagContainer,
	VStack,
} from '../../utill/layout/layout';
import {SVGFlag, SvgCheck} from '../../utill/svg/svg';
import {DayViewContainer} from '../enroll-info/select-multi';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import CustomButton from '../../utill/component/custom-button';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {logEvent} from '../../../firebaseAnalytice';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import NeedLogin from '../../utill/component/login/need-login';
export default function MyTravelList({navigation}: any) {
	const {myTravelList, selectStartDate, aiList} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const [shareFlag, setShareFlag] = useState(false);
	const [shareSeleted, setShareSeleted] = useState<number[]>([0]);
	const dispatch = useAppDispatch();
	const scrollViewRef = useRef<FlatList | null>(null);
	const goMyTravelDetail = async (e: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const whenDday = dDayCalculate({startDay: e.day[0], endDay: e.day[e.nDay - 1]});
			const data = await dispatch(getOneTravelCourse({travelId: e._id})).unwrap();
			dispatch(
				getRegionInfo({
					region: data.region[0].replace(/도심권| 동남권| 동북권|서남권|서북권|서귀포시|제주시'/g, '전체'),
				}),
			);
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
			await dispatch(getAiList());
			const data = await dispatch(getMyTravelList()).unwrap();
		} catch (err) {
			dispatch(travelSliceActions.setMyTravelList([]));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const shareFlagBackHandle = () => {
		setShareFlag(false);
	};
	useBackHandler({type: shareFlag ? 'listBackHandle' : 'exit', propsFunction: shareFlagBackHandle});

	useFocusEffect(
		useCallback(() => {
			if (socialloginProvider != 'anonymous') {
				getTravelList();
				setShareFlag(false);
			}
		}, [socialloginProvider]),
	);
	const handleGoogleAnalytics = async () => {
		if (socialloginProvider != 'anonymous') {
			await logEvent('view_course_list', {});
		}
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
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
	const regionRecommend = async () => {
		dispatch(regionRecommendSliceActions.reset());
		dispatch(travelSliceActions.reset());
		navigation.navigate('RegionSelectWho');
		await logEvent('place_step1', {});
	};
	const goEnroll = async () => {
		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season, globalFlag: false}));
		navigation.navigate('EnrollTravelTitle');
		await logEvent('course_step1', {});
	};

	const {kakaoShare} = useKakaoShare();
	//await dispatch(deleteTravelCourse({travelId: travelId}));
	const handleShare = () => {
		shareSeleted.forEach((item, index) => {
			goKakaoShare(item);
		}, []);
	};
	const hanldeCheckDelete = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '삭제하시겠습니까?',
				modalFunction: handledelete,
				modalTopText: '삭제',
				modalBottomText: '아니요',
			}),
		);
	};
	const handledelete = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const deleteFunction = shareSeleted.map(async item => {
				await dispatch(deleteTravelCourse({travelId: myTravelList[item]._id}));
			}, []);
			await Promise.all(deleteFunction);
			getTravelList();
			setShareFlag(false);
		} catch (e) {
			console.log('ddd');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goKakaoShare = async (index: number) => {
		try {
			const regionPhoto = await dispatch(
				getRegionInfo({
					region: myTravelList[shareSeleted[index]].region[0].replace(
						/도심권| 동남권| 동북권|서남권|서북권|서귀포시|제주시'/g,
						'전체',
					),
				}),
			).unwrap();
			await kakaoShare({
				travelName: myTravelList[shareSeleted[index]].travelName,
				travelId: myTravelList[shareSeleted[index]]._id,
				startDay: myTravelList[shareSeleted[index]].day[0],
				endDay: myTravelList[shareSeleted[index]].day[myTravelList[shareSeleted[index]].nDay - 1],
				photo: regionPhoto?.photo ?? '',
			});

			await logEvent('share', {course: myTravelList[shareSeleted[index]].travelName});
			setShareFlag(false);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	useEffect(() => {
		if (scrollViewRef.current) {
			shareFlag &&
				scrollViewRef.current?.scrollToIndex({
					animated: true,
					index: shareSeleted.at(-1) ?? 0,
					viewPosition: 0.5,
				});
		}
		// scrollViewRef.current?.scrollToOffset({offset: 300});
		//shareSeleted != -1 && shareFlag && scrollViewRef.current?.scrollToIndex({index: shareSeleted});
	}, [shareSeleted, shareFlag]);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<HeaderContianer>
						<SearchTouchableOpacity
							onPress={() => {
								setShareFlag(!shareFlag);
								!shareFlag && setShareSeleted([0]);
							}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								{shareFlag ? '취소' : '공유'}
							</PretendardVariableText>
						</SearchTouchableOpacity>
					</HeaderContianer>
				),
		});
	}, [shareFlag, socialloginProvider]);
	useEffect(() => {
		if (shareSeleted.length == 0) {
			setShareFlag(false);
			setShareSeleted([0]);
		}
	}, [shareSeleted]);
	const dDayCalculate = useCallback((e: any) => {
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
	}, []);
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
				aiId: data._id,
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
						{aiList?.map((data, idx) => (
							<MyTravelContainer
								key={idx}
								onPress={() => {
									goPreset(data);
								}}
								disabled={shareFlag}
								shareFlag={shareFlag}
								shareSeleted={!shareFlag}>
								<VStack>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
										{moment(data.day[0]).format('YYYY년 MM월 DD일') +
											' ~ ' +
											moment(data.day[data.nDay - 1]).format('MM월 DD일')}
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
											{data.region[0].split('/').at(-1)}
										</PretendardVariableText>
										<SVGFlag
											width={widthPercentage(12)}
											height={widthPercentage(15)}
											color={colors.Primary}
										/>
									</TagContainer>
								</VStack>
							</MyTravelContainer>
						))}
					</>
				)}
				{(monthRef.current != after || item.index == 0) && (
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
					onLongPress={() => {
						if (!shareFlag) {
							setShareFlag(true);
							setShareSeleted([item.index]);
						}
					}}
					shareFlag={shareFlag}
					shareSeleted={shareSeleted.includes(item.index)}
					onPress={() => {
						if (shareFlag) {
							let copy = [...shareSeleted];
							console.log(copy, item.index, copy.includes(item.index));
							copy.includes(item.index)
								? (copy = copy.filter((copyItem, copyIndex) => copyItem != item.index))
								: copy.push(item.index);
							setShareSeleted(copy);
						} else {
							goMyTravelDetail(item.item);
						}
						// shareFlag ? (let copy=[...shareSeleted],setShareSeleted(item.index),) : goMyTravelDetail(item.item);
					}}>
					<VStack>
						<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
							{moment(item.item.day[0]).format('YYYY년 MM월 DD일') +
								' ~ ' +
								moment(item.item.day[item.item.nDay - 1]).format('MM월 DD일')}
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
								{item.item.region[0].split('/').at(-1)}
							</PretendardVariableText>
							<SVGFlag width={widthPercentage(12)} height={widthPercentage(15)} color={colors.Primary} />
						</TagContainer>
					</VStack>
					{shareFlag && (
						<CircleContainer shareSeleted={shareSeleted.includes(item.index)}>
							<SvgCheck
								color={shareSeleted.includes(item.index) ? colors.backgroundWhite : colors.Gray2}
							/>
						</CircleContainer>
					)}
				</MyTravelContainer>
			</>
		);
	};
	if (socialloginProvider == 'anonymous') {
		return <NeedLogin navigation={navigation} />;
	}
	return (
		<TravelContainer>
			<TravleListContainer>
				{myTravelList.length == 0 && aiList.length == 0 ? (
					<Center>
						<PretendardSemiBoldText size={16} lineHeight={22} color={colors.Gray2}>
							아직 만들어진 여행이 없어요:(
						</PretendardSemiBoldText>
					</Center>
				) : (
					<FlatList
						ref={scrollViewRef}
						data={myTravelList}
						renderItem={renderItem}
						initialNumToRender={20}
						showsVerticalScrollIndicator={false}
						keyExtractor={item => item._id}
						nestedScrollEnabled></FlatList>
				)}
			</TravleListContainer>
			<HStack gap={5}>
				<CustomButton
					label={shareFlag ? '삭제하기' : '새로운 여행 떠나기'}
					isDisabled={!shareFlag ? false : false}
					onPress={shareFlag ? hanldeCheckDelete : checkGoEnroll}
					width={widthPercentage(327)}
					divide={shareFlag ? true : false}
					marginBottom={12}></CustomButton>
				{shareFlag && (
					<CustomButton
						label={'공유하기'}
						isDisabled={shareSeleted.length >= 2}
						onPress={handleShare}
						divide={true}
						marginBottom={12}></CustomButton>
				)}
			</HStack>
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

const MyTravelContainer = styled(DayViewContainer).attrs({as: TouchableOpacity})<{
	shareFlag: boolean;
	shareSeleted: boolean;
}>`
	opacity: ${props => (!props.shareFlag ? 1 : props.shareSeleted ? 1 : 0.5)};
	margin: 5px 0px 5px 0px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const SearchTouchableOpacity = styled.TouchableOpacity`
	width: 50%;
	align-items: center;
`;
const CircleContainer = styled.View<{shareSeleted: boolean}>`
	width: ${widthPercentage(30)}px;
	height: ${widthPercentage(30)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	background-color: ${props => (props.shareSeleted ? colors.Primary : colors.Gray1)};
`;
