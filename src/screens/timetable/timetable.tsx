import {useEffect, useLayoutEffect, useState} from 'react';
import {TouchableOpacity, View, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Modal} from 'react-native';
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
import {HStack, HeaderContianer, HeaderText} from '../../utill/layout/layout';
import {SVGHelp, SvgMapIcon} from '../../utill/svg/svg';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {usePosition} from '../../utill/hooks/usePosition';
import ViewPager from '../../utill/view-pager';
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
		makeMode == 'recommend' && getDuration();
	}, []);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<HeaderContianer>
					{editMode == 'add' ? (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('TimetableAddPlace', {x: x, y: addList});
								setAddList([]);
								dispatch(travelSliceActions.editModeChange(''));
							}}>
							<HeaderText>추가</HeaderText>
						</TouchableOpacity>
					) : (
						<>
							<TouchableOpacity onPress={goSave}>
								<HeaderText>저장</HeaderText>
							</TouchableOpacity>
							<TouchableOpacity onPress={goViewPager}>
								<HeaderText>설명</HeaderText>
							</TouchableOpacity>
						</>
					)}
				</HeaderContianer>
			),
		});
	}, [editMode, timetable, addList, x, makeMode]);

	const changeViewState = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		setMapViewState(usePosition(e));
	};
	const goBack = () => {
		setViewPagerView(false);
	};
	const goViewPager = () => {
		setViewPagerView(true);
	};
	const [viewPagerView, setViewPagerView] = useState(false);
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
					onScroll={changeViewState}
					scrollEventThrottle={16}>
					<InfoView navigation={navigation} viewDayIndex={viewDayIndex} />
					<Background setAddList={setAddList} addList={addList} setX={setX} x={x} />
				</TimetableScrollView>
			</ScrollVIewContainer>

			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerView}
				onRequestClose={() => setViewPagerView(false)}>
				<ViewPager handleFunction={goBack} timetable={true} />
			</Modal>
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
	background-color: ${colors.main};
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
