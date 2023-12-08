import {useEffect, useLayoutEffect, useState} from 'react';
import {
	TouchableOpacity,
	Dimensions,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Modal,
	BackHandler,
	Image,
} from 'react-native';
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
import {HeaderContianer, HeaderText} from '../../utill/layout/layout';
import {SvgMapIcon} from '../../utill/svg/svg';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import {usePosition} from '../../utill/hooks/usePosition';
import ViewPager from '../../utill/view-pager';
import Skeleton from '../../utill/component/skeleton/skeleton';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import MapInfo from './map-info';
export default function Timetable({navigation, route}: any) {
	const {
		timetable,
		day,
		makeMode,
		editMode,
		region,
		nDay,
		transit,
		tendency,
		travelId,
		tableShowFlag,
		travelName,
		saveFlag,
		modifyCheck,
	} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	const [mapViewState, setMapViewState] = useState(true);
	const [mapORtable, setMapORtable] = useState(false); //트루면 탐테
	const WINDOW_WIDTH = Dimensions.get('window').width;
	const WINDOW_HEIGHT = Dimensions.get('window').height;
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(travelSliceActions.resetMoveTimeList());
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
			dispatch(travelSliceActions.drawTimetable());
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '타임테이블 로딩 중 문제가 발생했습니다.\n다시시도해주세요',
				}),
			);
			navigation.goBack();
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goMapInfo = () => {
		setMapORtable(!mapORtable);
		//navigation.navigate('MapInfo', {mapIndex: -1});
	};
	const goMyTravelList = () => {
		navigation.popToTop();
		navigation.navigate('MyTravelListStack');
	};
	const goHome = () => {
		navigation.popToTop();
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '홈으로',
						modalSubTitle: modifyCheck
							? '수정 사항이 있습니다.\n저장하지않고 나가시겠습니까?\n\n*저장은 화면 우측 상단 저장 버튼을 눌러주세요!'
							: '홈으로 이동하시겠습니까?',
						modalFunction: goHome,
						modalLeft: true,
					}),
				);

				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [modifyCheck]);
	const {appsflyerLogEvent} = useAppsflyer();
	const firstSave = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
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
			dispatch(travelSliceActions.setSaveFlag(false));
			await dispatch(saveTravel(data));
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalSubTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	const goSave = async () => {
		// 저장 누를시 백엔드에 보내줄 아이들,.
		try {
			makeMode == 'solo' && appsflyerLogEvent({name: 'solo_save', value: {id: 'danim'}});
			dispatch(LoadingSliceActions.onLoading());
			const data = {travelId: travelId, timetable: timetable};
			await dispatch(updateTravelCourse(data));
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '수정 완료',
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
	useEffect(() => {
		makeMode == 'recommend' && saveFlag && firstSave();
	}, [saveFlag]);
	useLayoutEffect(() => {
		makeMode == 'recommend' && getDuration();
	}, []);
	useEffect(() => {
		makeMode == 'recommend' && setViewPagerView(true);
	}, []);
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: makeMode == 'recommend' ? false : true,
			gestureEnabled: makeMode == 'recommend' ? false : true,
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
							{makeMode != 'share' && mapORtable ? (
								<>
									<TouchableOpacity onPress={goViewPager}>
										<HeaderText>설명</HeaderText>
									</TouchableOpacity>
								</>
							) : (
								<TouchableOpacity onPress={goMapInfo}>
									<HeaderText>수정</HeaderText>
								</TouchableOpacity>
							)}
							{modifyCheck && (
								<TouchableOpacity onPress={goSave}>
									<HeaderText>저장</HeaderText>
								</TouchableOpacity>
							)}
						</>
					)}
				</HeaderContianer>
			),
			headerLeft: () =>
				makeMode == 'recommend' && (
					<TouchableOpacity
						style={{justifyContent: 'center'}}
						onPress={() => {
							dispatch(
								modalSliceActions.setOpenModal({
									modalTitle: '홈으로',
									modalSubTitle: modifyCheck
										? '수정 사항이 있습니다.\n저장하지않고 나가시겠습니까?\n\n*저장은 화면 우측 상단 저장 버튼을 눌러주세요!'
										: '홈으로 이동하시겠습니까?',
									modalLeft: true,
									modalFunction: goHome,
								}),
							);
						}}>
						<Image
							source={require('../../../public/images/danim_logo_row.png')}
							style={{height: 36, aspectRatio: 2.054}}
						/>
					</TouchableOpacity>
				),
		});
	}, [editMode, timetable, addList, x, makeMode, travelId, mapORtable, modifyCheck]);

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
	if (!tableShowFlag) return <Skeleton></Skeleton>;
	return mapORtable ? (
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
	) : (
		<MapInfo navigation={navigation}></MapInfo>
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
