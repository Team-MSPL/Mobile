import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	getDrivingDuration,
	getOneTravelCourse,
	saveTravel,
	travelSliceActions,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';
import {Alert, TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import DayView from '../../utill/component/timetable/day-view';
import InfoView from '../../utill/component/timetable/info-view';
import Background from '../../utill/component/timetable/background';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
export default function Timetable({navigation, route}: any) {
	const {timetable, day, makeMode, editMode, region, nDay, transit, tendency, travelId} = useAppSelector(
		state => state.travelSlice,
	);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [deleteList, setDeleteList] = useState<string[]>([]);
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			console.log(timetable.length);
			for (let i = 0; i < timetable.length; i++) {
				if (timetable[i].length != 1) {
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
			console.log('에러요', err);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goMapInfo = () => {
		navigation.navigate('MapInfo');
	};
	const goSave = async () => {
		// 저장 누를시 백엔드에 보내줄 아이들,.
		try {
			dispatch(LoadingSliceActions.onLoading());

			console.log('아디아디123벅', travelId);
			if (travelId == '') {
				console.log('아디아디벅', travelId);
				const data = {
					userId: userId,
					region: makeMode == 'recommend' ? region : ['자유여행'],
					day: day,
					nDay: nDay + 1,
					transit: transit,
					timetable: timetable,
					tendency: tendency,
				};
				await dispatch(saveTravel(data));
			} else {
				console.log('여기구여', travelId);
				const data = {travelId: travelId, timetable: timetable};
				await dispatch(updateTravelCourse(data));
			}
			Alert.alert(travelId == '' ? '저장 완료요 ' : '수정완료요', undefined, [
				{
					text: '저장리스트보기',
					onPress: () => {
						navigation.popToTop(), navigation.navigate('MyTravelListStack');
					},
				},
				{text: '계속보기'},
			]);
		} catch (err) {
			Alert.alert('저장중 에러가 발생했습니다');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}

		//혼자짤래요면 지역 '자유여행'으로
	};
	useLayoutEffect(() => {
		console.log('케케케ㅔ케케');
		makeMode == 'recommend' && getDuration();
		console.log(makeMode ? '옴' : '혼자');
		console.log('지다지', makeMode);
	}, []);
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Box>
					{editMode == 'delete' ? (
						<Box w='100%' h='60' alignItems='center'>
							<TouchableOpacity
								onPress={() => {
									const a = timetable.map((item, idx) =>
										item.filter(value => !deleteList.includes(value?.id ?? 'no')),
									);
									setDeleteList([]);
									dispatch(travelSliceActions.changeTimetable(a));
									console.log(a);
								}}>
								<Text>삭제요</Text>
							</TouchableOpacity>
						</Box>
					) : editMode == 'add' ? (
						<Box w='100%' h='60' alignItems='center'>
							<TouchableOpacity
								onPress={() => {
									//console.log(addList);
									navigation.navigate('TimetableAddPlace', {x: x, y: addList});
									setAddList([]);
									console.log('다음페이지');
								}}>
								<Text>추가요</Text>
							</TouchableOpacity>
						</Box>
					) : (
						<HStack w='100%' h='60'>
							<TouchableOpacity onPress={goMapInfo}>
								<Text>지도 함 볼래?</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={goSave}>
								<Text>저장 함 해볼래?</Text>
							</TouchableOpacity>
						</HStack>
					)}
				</Box>
			),
		});
	}, [editMode, timetable, addList, deleteList, x]);
	return (
		<Box bgColor='#EFFBFB'>
			<DayView setViewDayIndex={setViewDayIndex} viewDayIndex={viewDayIndex} />
			<Box>
				<ScrollView position='relative' mb='230'>
					<InfoView
						navigation={navigation}
						setDeleteList={setDeleteList}
						deleteList={deleteList}
						viewDayIndex={viewDayIndex}
					/>
					<Background setAddList={setAddList} addList={addList} setX={setX} x={x} />
				</ScrollView>
			</Box>
		</Box>
	);
}
