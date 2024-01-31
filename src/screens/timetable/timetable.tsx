import {useEffect, useLayoutEffect, useRef, useState} from 'react';
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
	updateShareUserList,
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
import MapInfo from './map-info';
import Toast from 'react-native-toast-message';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
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
		moveTimeErrorIndex,
		shareLoginFlag,
		shareViewWithStartFlag,
	} = useAppSelector(state => state.travelSlice);
	const {userId, userName, isLogin} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	const [mapViewState, setMapViewState] = useState(true);
	const [mapORtable, setMapORtable] = useState(false); //트루면 탐테
	const [modifyState, setmodifyState] = useState({state: false, day: 0, index: 0, value: {}});
	const WINDOW_WIDTH = Dimensions.get('window').width;
	const WINDOW_HEIGHT = Dimensions.get('window').height;
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			dispatch(travelSliceActions.resetMoveTimeList());
			let count = 0;
			for await (const timetableSubItems of timetable) {
				count += 1;
				try {
					if (timetableSubItems.length > 1) {
						for (let j = 0; j < timetableSubItems.length; j++) {
							if (j === 0) {
								wayPoint.start = `${timetableSubItems[j].lng},${timetableSubItems[j].lat}`;
							} else if (j === timetableSubItems.length - 1) {
								wayPoint.goal = `${timetableSubItems[j].lng},${timetableSubItems[j].lat}`;
							} else {
								wayPoint.wayPoint += `${timetableSubItems[j].lng},${timetableSubItems[j].lat}|`;
							}
						}
						wayPoint.wayPoint && (wayPoint.wayPoint = wayPoint.wayPoint.slice(0, -1));
						await dispatch(getDrivingDuration(wayPoint)).unwrap();
						wayPoint = {start: '', goal: '', wayPoint: ''};
					} else {
						dispatch(travelSliceActions.pushMoveTimeList());
					}
				} catch {
					dispatch(travelSliceActions.pushCatchMoveTimeList(count));
				}
			}
			dispatch(travelSliceActions.drawTimetable());
		} catch (err) {
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
	const checkMoveTimeError = () => {
		dispatch(travelSliceActions.checkMoveTimeError());
	};
	useEffect(() => {
		if (moveTimeErrorIndex != 0) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '알림',
					modalSubTitle: `${moveTimeErrorIndex}번째 날 여행지의 이동거리는 \n섬 등 자동차 이동이 불가한 지역으로 인해 오차가 있을 수 있습니다.`,
					modalFunction: checkMoveTimeError,
				}),
			);
		}
	}, [moveTimeErrorIndex]);
	const goMapInfo = () => {
		setMapORtable(!mapORtable);
	};
	const handleModify = () => {
		// let copy = [...timetable[modifyState.day]];
		// copy[modifyState.index] = {
		// 	...copy[modifyState.index],
		// 	y: (copy[modifyState.index]?.y ?? 0) + modifyRef.current.y,
		// };
		// console.log(copy[modifyState.index], modifyRef.current.y);
		// let copy2 = [...timetable];
		// copy2[modifyState.day] = copy;
		modifyRef.current.status
			? dispatch(travelSliceActions.changeTimetable(modifyRef.current.timetable))
			: dispatch(
					modalSliceActions.setOpenModal({modalTitle: '불가', modalSubTitle: '시간표를 다시 확인해주세요'}),
			  );
	};
	const modifyRef = useRef({x: 0, y: 0, timetable: [], status: false});
	const setModifyRef = (e: any) => {
		modifyRef.current = {x: e.x, y: e.y, timetable: e.timetable, status: e.status};
	};
	const timeRef = useRef(null);
	const goMyTravelList = () => {
		navigation.popToTop();
		navigation.navigate('MyTravelListStack');
		timeRef.current = setTimeout(() => {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: `${userName}님`,
					modalSubTitle: `여행을 성공적으로 만드셨군요! 이제 여행 계획을 일행과 공유해보세요!`,
					modalLeft: true,
					modalFunction: goKakaoShare,
				}),
			);
			clearTimeout(timeRef.current);
		}, 1000);
	};
	const goHome = () => {
		navigation.popToTop();
	};
	const exitApp = () => {
		BackHandler.exitApp();
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				userId == ''
					? dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '앱 종료',
								modalSubTitle: '앱을 종료하시겠습니까?',
								modalFunction: exitApp,
								modalLeft: true,
							}),
					  )
					: dispatch(
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
	}, [modifyCheck, userId]);
	const {appsflyerLogEvent} = useAppsflyer();
	const firstSave = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				userId: userId,
				region: makeMode == 'recommend' ? region : ['자유여행'],
				day: day.slice(0, nDay + 1),
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
					modalTitle: '여행 저장에 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}

		//혼자짤래요면 지역 '자유여행'으로
	};
	const addSharedList = async () => {
		if (userId == '') {
			dispatch(travelSliceActions.setShareLoginFlag(true));
			navigation.replace('LoginScreen');
		} else {
			try {
				dispatch(LoadingSliceActions.onLoading());
				const response = await dispatch(updateShareUserList({travelId: travelId})).unwrap();
				Toast.show({
					type: 'success',
					text1: response == 202 ? '이미 추가된 일정입니다.' : '추가가 완료되었습니다.',
					position: 'bottom',
				});
				dispatch(travelSliceActions.setShareLoginFlag(false));
			} catch (err: any) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '다시 시도',
						modalSubTitle: '잠시후 다시 시도해주세요',
					}),
				);
			} finally {
				dispatch(LoadingSliceActions.offLoading());
			}
		}
	};
	const [modifyView, setModifyView] = useState(true);
	const noModifyView = () => {
		setModifyView(false);
	};
	const {kakaoShare} = useKakaoShare();
	const goKakaoShare = async () => {
		try {
			await kakaoShare({travelName: travelName, travelId: travelId, startDay: day[0], endDay: day[nDay]});
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	useEffect(() => {
		shareLoginFlag && isLogin && addSharedList();
	}, [isLogin]);
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
		makeMode == 'share' &&
			!shareLoginFlag &&
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '공유자',
					modalSubTitle: `${
						userId == '' ? '로그인 후 ' : ''
					}공유 받은 여행 일정을 함께 수정하시겠습니까?\n\n ⦁ 수정 후 저장 버튼을 누르면 공유한 사람의 일정도 함께 수정됩니다!`,
					modalLeft: true,
					modalRightText: '추가할래요',
					modalLeftText: '보기만할래요',
					modalFunction: addSharedList,
					modalLeftFunctionUse: true,
					modalLeftFunction: noModifyView,
				}),
			);
	}, [makeMode]);
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: false,
			gestureEnabled: makeMode == 'recommend' ? false : true,
			headerRight: () => (
				<HeaderContianer>
					{modifyState.state ? (
						<TouchableOpacity
							onPress={() => {
								handleModify();
								setmodifyState({state: false, day: 0, index: 0, value: {}});
							}}>
							<HeaderText>완료</HeaderText>
						</TouchableOpacity>
					) : editMode == 'add' ? (
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
							{mapORtable ? (
								<>
									<TouchableOpacity onPress={goViewPager}>
										<HeaderText>설명</HeaderText>
									</TouchableOpacity>
									{modifyView && (
										<TouchableOpacity onPress={goSave}>
											<HeaderText>저장</HeaderText>
										</TouchableOpacity>
									)}
								</>
							) : (
								<TouchableOpacity onPress={goMapInfo}>
									<HeaderText>수정</HeaderText>
								</TouchableOpacity>
							)}
						</>
					)}
				</HeaderContianer>
			),
			headerLeft: () =>
				shareViewWithStartFlag && (
					<TouchableOpacity onPress={goKakaoShare}>
						<HeaderText>공유</HeaderText>
					</TouchableOpacity>
				),
			// makeMode == 'recommend' && (
			// 	<TouchableOpacity
			// 		style={{justifyContent: 'center'}}
			// 		onPress={() => {
			// 			dispatch(
			// 				modalSliceActions.setOpenModal({
			// 					modalTitle: '홈으로',
			// 					modalSubTitle: modifyCheck
			// 						? '수정 사항이 있습니다.\n저장하지않고 나가시겠습니까?\n\n*저장은 화면 우측 상단 저장 버튼을 눌러주세요!'
			// 						: '홈으로 이동하시겠습니까?',
			// 					modalLeft: true,
			// 					modalFunction: goHome,
			// 				}),
			// 			);
			// 		}}>
			// 		<Image
			// 			source={require('../../../public/images/danim_logo_row.png')}
			// 			style={{height: 36, aspectRatio: 2.054}}
			// 		/>
			// 	</TouchableOpacity>
			// ),
		});
	}, [
		editMode,
		timetable,
		addList,
		x,
		makeMode,
		travelId,
		mapORtable,
		modifyCheck,
		modifyState,
		shareViewWithStartFlag,
		shareLoginFlag,
		modifyView,
	]);
	const goScrollRef = useRef({now: 0, content: 0, layout: 0, wantGoing: 0});
	const goScroll = async (value: {data: number; up: boolean}) => {
		if (value.up) {
			goScrollRef.current.wantGoing =
				goScrollRef.current.now - goScrollRef.current.layout * 0.8 < 0
					? goScrollRef.current.now
					: goScrollRef.current.layout * 0.8;
			testRef.current.scrollTo({y: goScrollRef.current.now - goScrollRef.current.wantGoing});
			goScrollRef.current.now -= goScrollRef.current.wantGoing;
		} else {
			goScrollRef.current.wantGoing =
				goScrollRef.current.now + goScrollRef.current.layout * 0.8 >
				goScrollRef.current.content - goScrollRef.current.layout
					? goScrollRef.current.content - goScrollRef.current.layout - goScrollRef.current.now
					: goScrollRef.current.layout * 0.8;
			await testRef.current.scrollTo({
				y: goScrollRef.current.now + goScrollRef.current.wantGoing,
			});
			goScrollRef.current.now += goScrollRef.current.wantGoing;
		}
		return goScrollRef.current;
	};
	const changeViewState = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const state = usePosition(e);
		state != mapViewState && setMapViewState(state);
	};
	const goBack = () => {
		setViewPagerView(false);
	};
	const goViewPager = () => {
		setViewPagerView(true);
	};
	const firstFlag = useRef(true);
	const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		firstFlag.current &&
			(goScrollRef.current = {
				now: e.nativeEvent.contentOffset.y,
				content: e.nativeEvent.contentSize.height,
				layout: e.nativeEvent.layoutMeasurement.height,
				wantGoing: 0,
			});
	};
	const testRef = useRef();
	const panHandler = () => {};
	const [stop, setStop] = useState(true);
	const [viewPagerView, setViewPagerView] = useState(false);
	if (!tableShowFlag) return <Skeleton></Skeleton>;
	return mapORtable ? (
		<TimeTableContainer>
			<DayView setViewDayIndex={setViewDayIndex} viewDayIndex={viewDayIndex} navigation={navigation} />
			{!modifyState.state && mapViewState && (
				<MapContainer onPress={goMapInfo} right={WINDOW_WIDTH * 0.1} bottom={WINDOW_HEIGHT * 0.05}>
					<SvgMapIcon width={30} height={30} color={'white'} />
					<MapText>지도</MapText>
				</MapContainer>
			)}

			<ScrollVIewContainer>
				<TimetableScrollView
					scrollEnabled={stop}
					ref={testRef}
					contentOffset={{x: 0, y: 1}}
					onScroll={onScroll}
					showsVerticalScrollIndicator={false}
					onMomentumScrollEnd={changeViewState}
					// onScroll={changeViewState}
					scrollEventThrottle={16}>
					<InfoView
						navigation={navigation}
						viewDayIndex={viewDayIndex}
						goScroll={goScroll}
						setmodifyState={setmodifyState}
						modifyState={modifyState}
						panHandler={panHandler}
						setModifyRef={setModifyRef}
						setStop={setStop}
					/>
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
