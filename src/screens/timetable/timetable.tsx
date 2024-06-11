import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {TouchableOpacity, BackHandler, Image, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	deleteTravelCourse,
	getDrivingDuration,
	saveTravel,
	travelSliceActions,
	updateShareUserList,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {HeaderContianer, PretendardVariableText} from '../../utill/layout/layout';
import {useAppsflyer} from '../../utill/hooks/useAppsflyer';
import Skeleton from '../../utill/component/skeleton/skeleton';
import MapInfo from './map-info';
import Toast from 'react-native-toast-message';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
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
	const [modifyState, setmodifyState] = useState({state: false, day: 0, index: 0, value: {}});
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
									? '수정 사항이 있습니다.\n저장하지않고 나가시겠습니까?'
									: '홈으로 이동하시겠습니까?',
								modalFunction: () => {},
								modalBottomFunctionUse: true,
								modalBottomFunction: goHome,
								modalTopText: modifyCheck ? '저장하러 가기' : '둘러보기',
								modalBottomText: modifyCheck ? '그냥 나가기' : '나가기',
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
	const removeCheck = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '이 여행을 삭제할까요?',
				modalSubTitle: '여행을 삭제하면 되돌릴 수 없습니다.',
				modalFunction: goRemove,
				modalTopText: '삭제할래요',
				modalLeft: true,
			}),
		);
	};
	const goRemove = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			//await firebaseImageRemove({pictureList: picture, id: travelId, category: 'diary'}); TODO 공유자때문에 공유자가 아무도없을때 백에서 삭제하는로직으로 바꿔야함
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.goBack();
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 삭제가 실패했습니다',
					modalSubTitle: '잠시후 다시 시도해주세요',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const [modify, setModify] = useState(false);
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
		makeMode == 'share' &&
			!shareLoginFlag &&
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '공유자',
					modalSubTitle: `${
						userId == '' ? '로그인 후 ' : ''
					}공유 받은 여행 코스를 함께 수정하시겠습니까?\n\n ⦁ 수정 후 저장 버튼을 누르면 공유한 사람의 일정도 함께 수정됩니다!`,
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
					<>
						<TouchableOpacity onPress={removeCheck} style={{marginRight: 10}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointGreen1}>
								삭제
							</PretendardVariableText>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								setModify(!modify);
							}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								{modify ? '취소' : '편집'}
							</PretendardVariableText>
						</TouchableOpacity>
					</>
				</HeaderContianer>
			),
			headerLeft: () => (
				<>
					{Platform.OS != 'android' && (
						<TouchableOpacity
							onPress={() => {
								dispatch(
									modalSliceActions.setOpenModal({
										modalTitle: '홈으로',
										modalSubTitle: modifyCheck
											? '수정 사항이 있습니다.\n저장하지않고 나가시겠습니까?'
											: '홈으로 이동하시겠습니까?',
										modalFunction: () => {},
										modalBottomFunctionUse: true,
										modalBottomFunction: goHome,
										modalTopText: modifyCheck ? '저장하러 가기' : '둘러보기',
										modalBottomText: modifyCheck ? '그냥 나가기' : '나가기',
									}),
								);
							}}
							style={{
								justifyContent: 'center',
								marginLeft: widthPercentage(4),
								marginRight: widthPercentage(4),
							}}>
							<Image
								resizeMode='contain'
								source={require('../../../public/images/danim_logo_row.png')}
								style={{height: heightPercentage(36), aspectRatio: 2.054}}
							/>
						</TouchableOpacity>
					)}
					{shareViewWithStartFlag && (
						<TouchableOpacity onPress={goKakaoShare}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								공유
							</PretendardVariableText>
						</TouchableOpacity>
					)}
				</>
			),
		});
	}, [
		editMode,
		timetable,
		addList,
		makeMode,
		travelId,
		modifyCheck,
		modifyState,
		shareViewWithStartFlag,
		shareLoginFlag,
		modifyView,
		modify,
	]);
	if (!tableShowFlag) return <Skeleton></Skeleton>;
	return <MapInfo navigation={navigation} goSave={goSave} modify={modify} setModify={setModify}></MapInfo>;
}
