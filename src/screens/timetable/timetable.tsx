import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {TouchableOpacity, BackHandler, Image, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {
	deleteTravelCourse,
	detailTripadvisor,
	recommendApi,
	recommendTripadvisor,
	reviewAndPoint,
	saveTravel,
	travelSliceActions,
	updateShareUserList,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {HeaderContianer, PretendardBold, PretendardBoldText, PretendardVariableText} from '../../utill/layout/layout';
import shortId from 'shortid';
import Skeleton from '../../utill/component/skeleton/skeleton';
import MapInfo from './map-info';
import Toast from 'react-native-toast-message';
import useKakaoShare from '../../utill/hooks/useKakaoShare';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {logEvent} from '../../../firebaseAnalytice';
import {DistanceType, useDistance} from '../../utill/hooks/useDistance';
import moment from 'moment';
import {eventSliceActions} from '../../redux/event/event.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Timetable({navigation, route}: any) {
	const {
		timetable,
		day,
		makeMode,
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
		regionInfo,
		autoRecommendFlag,
		country,
	} = useAppSelector(state => state.travelSlice);
	const {userId, userName, isLogin, socialloginProvider} = useAppSelector(state => state.userSlice);

	const {modalConfettiFlag} = useAppSelector(state => state.modalSlice);
	const dispatch = useAppDispatch();
	const [addList, setAddList] = useState<number[]>([]);
	const [modifyState, setmodifyState] = useState({state: false, day: 0, index: 0, value: {}});
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const departure = useRef<DistanceType>({lat: 0, lng: 0});
	const getRecommendList = async (e: {
		name: string;
		x: number;
		index: number;
		y: number;
		category: string;
		lat: number;
		lng: number;
		apiCategory: string;
		radius: number;
		backupLat: number;
		backupLng: number;
		status: any;
	}) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let result = await dispatch(
				region[0].startsWith('해외')
					? recommendTripadvisor({
							category: e.apiCategory,
							lat: e.lat,
							lng: e.lng,
							radius: e.radius,
							name: e.status.name,
					  })
					: recommendApi({
							category: e.apiCategory,
							lat: e.lat,
							lng: e.lng,
							radius: e.radius,
					  }),
			).unwrap();
			result = region[0].startsWith('해외') ? result.data : result;
			if (result.length == 0) {
				result = await dispatch(
					region[0].startsWith('해외')
						? recommendTripadvisor({
								category: e.apiCategory,
								lat: e.lat,
								lng: e.lng,
								radius: Number(e.radius) * 1.5,
								name: e.status.name,
						  })
						: recommendApi({
								category: e.apiCategory,
								lat: e.lat,
								lng: e.lng,
								radius: Number(e.radius) * 1.5,
						  }),
				).unwrap();
				result = region[0].startsWith('해외') ? result.data : result;
				result.length == 0 &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '추천드릴 수 있는 장소가 부족한 곳은 추천하지 못했어요 ㅠㅠ',
							modalSingleUse: true,
						}),
					);
				return [];
			}
			if (region[0].startsWith('해외')) {
				let copy = await dispatch(detailTripadvisor({id: result[0].location_id})).unwrap();
				console.log(copy);
				result = [{...result, place_name: copy.name, y: copy.latitude, x: copy.longitude}, {}];
			}
			return result;
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '동선 상에 추천할 수 있는 장소가 없습니다 ㅠㅠ',
				}),
			);
			navigation.goBack();
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const restaurantRecommend = useCallback(
		async (e: {value: any; index: number; idx: number}) => {
			try {
				let lat = 0;
				let lng = 0;
				let radius = 2000;
				let status = timetable[e.idx][e.index - 1];
				let goCheck = true;
				if (timetable[e.idx].length == 1) {
				} else {
					if (e.index == timetable[e.idx].length - 1) {
						if (timetable[e.idx][timetable[e.idx].length - 2].name.includes('추천')) {
							goCheck = false;
						} else {
							lat = timetable[e.idx][timetable[e.idx].length - 2].lat;
							lng = timetable[e.idx][timetable[e.idx].length - 2].lng;
							status = timetable[e.idx][timetable[e.idx].length - 2];
						}
					} else if (e.index == 0) {
						if (timetable[e.idx][1].name.includes('추천')) {
							goCheck = false;
						} else {
							lat = timetable[e.idx][1].lat;
							lng = timetable[e.idx][1].lng;
							status = timetable[e.idx][1];
						}
					} else {
						const departure = {
							lat: timetable[e.idx][e.index - 1].lat,
							lng: timetable[e.idx][e.index - 1].lng,
						};
						const arrival = {
							lat: timetable[e.idx][e.index + 1].lat,
							lng: timetable[e.idx][e.index + 1].lng,
						};
						const distance = Math.ceil(useDistance({departure: departure, arrival: arrival}));
						lat = (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2;
						lng = (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2;
						radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
						if (
							timetable[e.idx][e.index - 1].name.includes('추천') &&
							timetable[e.idx][e.index + 1].name.includes('추천')
						) {
							goCheck = false;
						} else if (timetable[e.idx][e.index - 1].name.includes('추천')) {
							status = timetable[e.idx][e.index + 1];
						} else if (timetable[e.idx][e.index + 1].name.includes('추천')) {
							status = timetable[e.idx][e.index - 1];
						}
					}
					if (goCheck) {
						const startNumber = e.value.y; // 시작 숫자
						const count = e.value.takenTime / 30; // 원하는 갯수

						const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);
						const data = await getRecommendList({
							name: '식당 추천',
							x: e.value.x,
							index: e.index,
							y: sequentialArray,
							category: e.value.category,
							lat: lat,
							lng: lng,
							apiCategory: region[0].startsWith('해외') ? 'restaurants' : 'FD6',
							radius: radius,
							backupLat: timetable[e.idx][e.index - 1]?.lat ?? 0,
							backupLng: timetable[e.idx][e.index - 1]?.lng ?? 0,
							status: status,
						});
						return data;
					} else {
						// dispatch(
						// 	modalSliceActions.setOpenModal({
						// 		modalTitle: '추천이 불가합니다.',
						// 		modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
						// 	}),
						// );
					}
				}
			} catch (e) {}
		},
		[timetable, region],
	);

	const accommodationRecommend = async (e: {value: any; index: number; idx: number}) => {
		try {
			if (timetable[e.idx].length < 2) {
			} else {
				let lat = 0;
				let lng = 0;
				let goCheck = true;
				if (e.index == 0) {
					if (timetable[e.idx][e.index + 1].name.includes('추천')) {
						goCheck = false;
					} else {
						lat = timetable[e.idx][e.index + 1].lat;
						lng = timetable[e.idx][e.index + 1].lng;
					}
				} else {
					if (timetable[e.idx][e.index - 1].name.includes('추천')) {
						goCheck = false;
					} else {
						lat = timetable[e.idx][e.index - 1].lat;
						lng = timetable[e.idx][e.index - 1].lng;
					}
				}
				if (goCheck) {
					const startNumber = e.value.y; // 시작 숫자
					const count = e.value.takenTime / 30; // 원하는 갯수
					const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);
					const data = await getRecommendList({
						name: '숙소 추천',
						x: e.value.x,
						index: e.index,
						y: sequentialArray,
						category: e.value.category,
						lat: lat,
						lng: lng,
						apiCategory: region[0].startsWith('해외') ? 'hotels' : 'AD5',
						radius: 2000,
						backupLat: e.index != 0 ? timetable[e.idx][e.index - 1].lat : timetable[e.idx][e.index + 1].lat,
						backupLng: e.index != 0 ? timetable[e.idx][e.index - 1].lng : timetable[e.idx][e.index + 1].lng,
						status: e.index != 0 ? timetable[e.idx][e.index - 1] : timetable[e.idx][e.index + 1],
					});
					return data;
				} else {
					// dispatch(
					// 	modalSliceActions.setOpenModal({
					// 		modalTitle: '추천이 불가합니다.',
					// 		modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					// 	}),
					// );
				}
			}
		} catch (e) {}
	};
	const handleAutoRecommend = async ({item, copy, idx}: any) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let copy2 = [...item];
			const handleItems = item.map(async (value, index) => {
				if (value.name == '점심 추천' || value.name == '저녁 추천') {
					let items = await restaurantRecommend({value: value, index: index, idx: idx});
					if (items?.length != 0) {
						let checks = copy2.filter((checkValue, checkIndex) => {
							items[0].place_name == checkValue.name;
						});
						items = items[checks.length == 0 ? 0 : 1];
						copy2[index] = {
							...copy2[index],
							name: items.place_name,
							lat: Number(items.y),
							lng: Number(items.x),
							category: value.category,
							x: value.x,
							y: value.y,
							id: shortId.generate(),
						};
					} else {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '추천드릴 수 있는 장소가 부족한 곳은 추천하지 못했어요 ㅠㅠ',
								modalSingleUse: true,
							}),
						);
					}
				} else if (value.name == '숙소 추천' && index != 0) {
					let items = await accommodationRecommend({value: value, index: index, idx: idx});
					if (items?.length != 0) {
						items = items[0];
						copy2[index] = {
							...copy2[index],
							name: items.place_name,
							lat: Number(items.y),
							lng: Number(items.x),
							category: value.category,
							x: value.x,
							y: value.y,
							id: shortId.generate(),
						};
					} else {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '추천드릴 수 있는 장소가 부족한 곳은 추천하지 못했어요 ㅠㅠ',
								modalSingleUse: true,
							}),
						);
					}
				} else if (index == 0 && value.name == '숙소 추천') {
					if (copy[idx - 1].at(-1)?.category == value.category && copy[idx - 1].at(-1)?.name != '숙소 추천') {
						copy2[index] = {
							...copy2[index],
							name: copy[idx - 1].at(-1)?.name,
							lat: Number(copy[idx - 1].at(-1)?.lat),
							lng: Number(copy[idx - 1].at(-1)?.lng),
							category: value.category,
							x: value.x,
							y: value.y,
							id: shortId.generate(),
						};
					}
				}
			});
			await Promise.all(handleItems);
			return copy2;
		} catch (e: any) {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			if (autoRecommendFlag) {
				let copy = [...timetable];
				await timetable.reduce(async (prev, item, idx) => {
					await prev;
					const newElem = await handleAutoRecommend({item, copy, idx});
					copy[idx] = newElem;
				}, Promise.resolve());
				dispatch(travelSliceActions.changeTimetable(copy));
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
		if (!modalConfettiFlag) {
			timeRef.current = setTimeout(() => {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: `${userName}님`,
						modalSubTitle: `여행을 성공적으로 만드셨군요! 이제 여행 계획을 일행과 공유해보세요!`,
						modalLeft: true,
						modalFunction: goKakaoShare,
						modalTopText: '카카오톡으로 공유',
						modalBottomText: '다음에 할게요',
						modalConfetti: true,
					}),
				);
				clearTimeout(timeRef.current);
			}, 1000);
		}
	};
	const handleCooper = async () => {
		let cooperType = await AsyncStorage.getItem(country == 0 ? 'inbound' : 'outbound');
		if (cooperType != moment().format('DD').toString()) {
			await logEvent('showTimetableCooperation', {});
			dispatch(
				eventSliceActions.setCooperationState({
					status: true,
					type: country == 0 ? 'inbound' : 'outbound',
				}),
			);
		}
	};
	useEffect(() => {
		handleCooper();
	}, []);
	const goHome = () => {
		navigation.popToTop();
		navigation.replace('Tab');
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
								modalFunction: () => {
									modifyCheck && goSave();
								},
								modalBottomFunctionUse: true,
								modalBottomFunction: goHome,
								modalTopText: modifyCheck ? '저장하고 나가기' : '둘러보기',
								modalBottomText: modifyCheck ? '그냥 나가기' : '나가기',
							}),
					  );

				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, [modifyCheck, userId]);
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

	const hasOverlap = timetableList => {
		const timeBlocks = timetableList.map(item => {
			const start = item.y;
			const end = item.y + item.takenTime / 30; // y 단위가 30분이면 takenTime/30을 더함
			return {start, end};
		});

		// 시작시간 기준으로 정렬
		timeBlocks.sort((a, b) => a.start - b.start);

		for (let i = 1; i < timeBlocks.length; i++) {
			const prev = timeBlocks[i - 1];
			const current = timeBlocks[i];

			if (current.start < prev.end) {
				// 겹침 발생
				return true;
			}
		}

		return false; // 겹치는 시간 없음
	};
	const goSave = async () => {
		// 저장 누를시 백엔드에 보내줄 아이들,.
		try {
			dispatch(LoadingSliceActions.onLoading());
			const checkList = timetable.map(item => hasOverlap(item));
			if (checkList.includes(true)) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '겹치는 시간',
						modalSubTitle: '겹치는 시간이 있습니다. 시간을 수정해주세요.',
						modalFunction: () => {},
					}),
				);
			} else {
				const data = {travelId: travelId, timetable: timetable};
				await dispatch(updateTravelCourse(data));
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '수정 완료',
						modalSubTitle: '내 여행 리스트로 이동합니다.',
						modalFunction: goMyTravelList,
					}),
				);
				await logEvent('edit_course_save', {
					course: travelName,
				});
			}
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
			await kakaoShare({
				travelName: travelName,
				travelId: travelId,
				startDay: day[0],
				endDay: day[nDay],
				photo: regionInfo?.photo,
			});

			await logEvent('share', {course: travelName});
		} catch (err) {
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
			let endSign = Math.sign(moment.duration(moment(day[0]).hours(0).diff(moment())).asDays());
			if (endSign != -1) {
				const data = {
					travelId: travelId,
					review: '여행가기 전 삭제',
					point: 5,
					tendencyPoint: tendency,
				};
				if (!!travelId) dispatch(reviewAndPoint(data));
			}
			//await firebaseImageRemove({pictureList: picture, id: travelId, category: 'diary'}); TODO 공유자때문에 공유자가 아무도없을때 백에서 삭제하는로직으로 바꿔야함
			await dispatch(deleteTravelCourse({travelId: travelId}));
			navigation.popToTop();
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
						userId == '' || socialloginProvider == 'anonymous' ? '로그인 후 ' : ''
					}공유 받은 여행 코스를 함께 수정하시겠습니까?\n\n ⦁ 수정 후 저장 버튼을 누르면 공유한 사람의 일정도 함께 수정됩니다!`,
					modalLeft: true,
					modalRightText: '추가할래요',
					modalLeftText: '보기만할래요',
					modalFunction: addSharedList,
					modalLeftFunctionUse: true,
					modalLeftFunction: noModifyView,
				}),
			);
	}, [makeMode, socialloginProvider]);
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: false,
			gestureEnabled: makeMode == 'recommend' ? false : true,
			headerRight: () => (
				<HeaderContianer>
					<>
						{socialloginProvider != 'anonymous' && (
							<TouchableOpacity onPress={removeCheck} style={{marginRight: 10}}>
								<PretendardVariableText size={16} lineHeight={24} color={colors.PointGreen1}>
									삭제
								</PretendardVariableText>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							onPress={async () => {
								setModify(!modify);
								!modify &&
									(await logEvent('edit_course_start', {
										course: travelName,
									}));
							}}>
							<PretendardVariableText size={16} lineHeight={24} color={colors.PointYellow}>
								{modify ? '취소' : '편집'}
							</PretendardVariableText>
						</TouchableOpacity>
					</>
				</HeaderContianer>
			),
			headerLeft: () =>
				socialloginProvider != 'anonymous' && (
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
							<TouchableOpacity style={{marginLeft: widthPercentage(5)}} onPress={goKakaoShare}>
								<PretendardBoldText size={18} lineHeight={24} color={colors.PointYellow}>
									공유
								</PretendardBoldText>
							</TouchableOpacity>
						)}
					</>
				),
		});
	}, [
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
		socialloginProvider,
	]);
	// if (true) return <></>;
	if (!tableShowFlag) return <Skeleton></Skeleton>;
	return <MapInfo navigation={navigation} goSave={goSave} modify={modify} setModify={setModify}></MapInfo>;
}
