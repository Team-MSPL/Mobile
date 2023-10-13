import {useEffect, useLayoutEffect, useState} from 'react';
import {TouchableOpacity, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	getDrivingDuration,
	saveTravel,
	travelSliceActions,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import Background from '../../utill/component/timetable/background';
import DayView from '../../utill/component/timetable/day-view';
import InfoView from '../../utill/component/timetable/info-view';
import {HStack} from '../../utill/layout/layout';
import {SVGHelp, SvgMapIcon} from '../../utill/svg/svg';
import {HeaderHStack} from '../my-travel-list/detail-info';
import Icon from 'react-native-vector-icons/AntDesign';
import background from '../../utill/component/timetable/background';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
export default function Timetable({navigation, route}: any) {
	const {timetable, day, makeMode, editMode, region, nDay, transit, tendency, travelId, tableShowFlag, travelName} =
		useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	const [mapViewState, setMapViewState] = useState(true);
	const WINDOW_WIDTH = Dimensions.get('window').width;
	const WINDOW_HEIGHT = Dimensions.get('window').height;
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const SaveContainer = styled(Icon)`
		border-radius: 5px;
	`;
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			console.log(timetable.length);
			for (let i = 0; i < timetable.length; i++) {
				if (timetable[i].length > 1) {
					for (let j = 0; j < timetable[i].length; j++) {
						if (j === 0) {
							wayPoint.start = `${timetable[i][j].lng},${timetable[i][j].lat}`;
						} else if (j === timetable[i].length - 1) {
							wayPoint.goal = `${timetable[i][j].lng},${timetable[i][j].lat}`;
						} else {
							wayPoint.wayPoint += `${timetable[i][j].lng},${timetable[i][j].lat}|`;
						}
					}
					wayPoint.wayPoint && (wayPoint.wayPoint = wayPoint.wayPoint.slice(0, -1));
					await dispatch(getDrivingDuration(wayPoint));
					wayPoint = {start: '', goal: '', wayPoint: ''};
				} else {
					dispatch(travelSliceActions.pushMoveTimeList());
				}
			}
			console.log('여기는 왓군요?');

			dispatch(travelSliceActions.drawTimetable());
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '타임테이블 로딩 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goMapInfo = () => {
		navigation.navigate('MapInfo', {mapIndex: -1});
	};
	const goMyTravelList = () => {
		navigation.popToTop();
		navigation.navigate('MyTravelListStack');
	};
	const openModalHelp = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '스케줄 사용가이드',
				modalSubTitle:
					'1. 스케줄 추가 \n 스케줄 추가는 꾹눌러서가능합니다.\n\n2. 스케줄 삭제 \n 스케줄 삭제는 스케줄을 선택해 상세페이지에서 가능합니다.\n\n3.카페/식당 추천 \n관광지 사이 위치를 추천합니다. ',
			}),
		);
	};
	const {appsflyerLogEvent} = useAppsflyer();
	const goSave = async () => {
		// 저장 누를시 백엔드에 보내줄 아이들,.
		try {
			makeMode == 'solo' && appsflyerLogEvent({name: 'solo_save', value: {id: 'danim'}});
			dispatch(LoadingSliceActions.onLoading());
			if (travelId == '') {
				const data = {
					userId: userId,
					region: makeMode == 'recommend' ? region : ['자유여행'],
					day: day,
					nDay: nDay + 1,
					transit: transit,
					timetable: timetable,
					tendency: tendency,
					travelName: travelName,
				};
				await dispatch(saveTravel(data));
			} else {
				console.log('여기구여', travelId);
				const data = {travelId: travelId, timetable: timetable};
				await dispatch(updateTravelCourse(data));
			}
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: travelId == '' ? '저장 완료' : '수정 완료',
					modalSubTitle: '내 여행 리스트로 이동합니다.',
					modalFunction: goMyTravelList,
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 저장 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}

		//혼자짤래요면 지역 '자유여행'으로
	};
	useLayoutEffect(() => {
		console.log(
			makeMode,
			'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
		);
		makeMode == 'recommend' && getDuration();
	}, []);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View>
					{makeMode == 'share' ? (
						<TouchableOpacity onPress={openModalHelp}>
							<SVGHelp width={25} height={25} color={'white'} />
						</TouchableOpacity>
					) : (
						<>
							{editMode == 'add' ? (
								<IconContainer
									onPress={() => {
										navigation.navigate('TimetableAddPlace', {x: x, y: addList});
										setAddList([]);
										dispatch(travelSliceActions.editModeChange(''));
									}}>
									<SaveContainer name={'plus'} size={25} color={'white'} />
								</IconContainer>
							) : (
								<HeaderHStack>
									<IconContainer onPress={goSave}>
										<SaveContainer name={'save'} size={25} color={'white'} />
									</IconContainer>
									<HelpContainer onPress={openModalHelp}>
										<SVGHelp width={20} height={20} color={'grey'} />
									</HelpContainer>
								</HeaderHStack>
							)}
						</>
					)}
				</View>
			),
		});
	}, [editMode, timetable, addList, x, makeMode]);
	const dragPositionCheck = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollY = e.nativeEvent.contentOffset.y;

		// 스크롤뷰의 컨텐츠 높이를 가져옵니다.
		const contentHeight = e.nativeEvent.contentSize.height;

		// 스크롤뷰의 높이를 가져옵니다.
		const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;

		// 스크롤이 거의 끝에 다다랐는지 확인합니다.
		if (scrollY + scrollViewHeight >= contentHeight - 20) {
			// 스크롤이 거의 끝에 다다랐을 때 원하는 작업을 수행합니다.
			setMapViewState(false);
		} else if (!mapViewState) {
			setMapViewState(true);
		}
	};
	if (!tableShowFlag) return <TimeTableContainer></TimeTableContainer>;
	return (
		<TimeTableContainer>
			<DayView setViewDayIndex={setViewDayIndex} viewDayIndex={viewDayIndex} navigation={navigation} />
			{mapViewState && (
				<MapContainer onPress={goMapInfo} right={WINDOW_WIDTH * 0.1} bottom={WINDOW_HEIGHT * 0.05}>
					<SvgMapIcon width={30} height={30} color={'white'} />
					<MapText>지도</MapText>
				</MapContainer>
			)}

			<ScrollVIewContainer>
				<TimetableScrollView
					showsVerticalScrollIndicator={false}
					onScroll={dragPositionCheck}
					scrollEventThrottle={16}>
					<InfoView navigation={navigation} viewDayIndex={viewDayIndex} />
					<Background setAddList={setAddList} addList={addList} setX={setX} x={x} />
				</TimetableScrollView>
			</ScrollVIewContainer>
		</TimeTableContainer>
	);
}

const MapContainer = styled.TouchableOpacity<{right: number; bottom: number}>`
	position: absolute;
	background-color: ${colors.selectButton};
	border-radius: 15px;
	align-items: center;
	justify-content: center;
	width: 60px;
	height: 60px;
	bottom: ${props => props.bottom}px;
	right: ${props => props.right}px;
	z-index: 99;
`;
const MapText = styled.Text`
	font-size: 15px;
	color: white;
`;
const TimeTableContainer = styled.View`
	width: 100%;
	background-color: white;
	flex: 1;
	padding: 10px;
`;
const ScrollVIewContainer = styled.View`
	width: 100%;
	flex: 0.9;
`;
const TimetableScrollView = styled.ScrollView`
	position: relative;
`;
const IconContainer = styled.TouchableOpacity`
	padding: 1%;
	border-radius: 5px;
	background-color: ${colors.selectButton};
	margin: 0px 0px 0px 10px;
`;
const HelpContainer = styled(IconContainer)`
	background-color: white;
`;
