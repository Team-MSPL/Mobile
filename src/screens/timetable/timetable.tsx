import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getDrivingDuration, travelSliceActions} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';
import {TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import DayView from '../../utill/component/timetable/day-view';
import InfoView from '../../utill/component/timetable/info-view';
import Background from '../../utill/component/timetable/background';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
export default function Timetable({navigation}: any) {
	const {timetable, day, makeMode, editMode} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const [deleteList, setDeleteList] = useState<string[]>([]);
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const getDuration = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
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
				}
			}
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
	const goSave = () => {
		// 저장 누를시 백엔드에 보내줄 아이들,.
		// const a = {
		// 	userId: userId,
		// 	travelId: travelId,
		// 	region: region,
		// 	day: day,
		// 	nDay: nDay,
		// 	transit: transit,
		// 	timetable: timetable,
		// 	tendency:tendency,
		// };
		//혼자짤래요면 지역 '자유여행'으로
	};
	useLayoutEffect(() => {
		makeMode && getDuration();
		console.log(makeMode ? '옴' : '혼자');
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
									navigation.navigate('TimetableAddPlace', {x: x, y: addList});
									setAddList([]);
									console.log('다음페이지');
								}}>
								<Text>추가요</Text>
							</TouchableOpacity>
						</Box>
					) : (
						<Box w='100%' h='60'>
							<TouchableOpacity onPress={goMapInfo}>
								<Text>지도 함 볼래?</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={goMapInfo}>
								<Text>저장 함 해볼래?</Text>
							</TouchableOpacity>
						</Box>
					)}
				</Box>
			),
		});
	}, [editMode]);
	return (
		<Box bgColor='#EFFBFB'>
			<DayView setViewDayIndex={setViewDayIndex} viewDayIndex={viewDayIndex} />
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
	);
}
