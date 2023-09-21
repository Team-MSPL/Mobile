import {Box, HStack, ScrollView, Text} from 'native-base';
import {useEffect, useLayoutEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
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
import {SvgMapIcon} from '../../utill/svg/svg';
export default function Timetable({navigation, route}: any) {
	const {timetable, day, makeMode, editMode, region, nDay, transit, tendency, travelId, tableShowFlag, travelName} =
		useAppSelector(state => state.travelSlice);
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
				<Box>
					{makeMode == 'share' ? (
						<TouchableOpacity onPress={goMapInfo}>
							<Text>지도 함 볼래?</Text>
						</TouchableOpacity>
					) : (
						<>
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
										<SvgMapIcon color={colors.selectButton} />
									</TouchableOpacity>
									<TouchableOpacity onPress={goSave}>
										<Text>저장</Text>
									</TouchableOpacity>
								</HStack>
							)}
						</>
					)}
				</Box>
			),
		});
	}, [editMode, timetable, addList, deleteList, x, makeMode]);

	if (!tableShowFlag)
		return (
			<Box>
				<Text>보여줄수없음</Text>
			</Box>
		);
	return (
		<TimeTableContainer>
			<DayView setViewDayIndex={setViewDayIndex} viewDayIndex={viewDayIndex} navigation={navigation} />
			<ScrollVIewContainer>
				<TimetableScrollView>
					<InfoView
						navigation={navigation}
						setDeleteList={setDeleteList}
						deleteList={deleteList}
						viewDayIndex={viewDayIndex}
					/>
					<Background setAddList={setAddList} addList={addList} setX={setX} x={x} />
				</TimetableScrollView>
			</ScrollVIewContainer>
		</TimeTableContainer>
	);
}

const TimeTableContainer = styled.View`
	width: 100%;
	background-color: white;
	flex: 1;
	padding: 10px;
`;
const ScrollVIewContainer = styled.View`
	width: 100%;
	flex: 0.8;
`;
const TimetableScrollView = styled.ScrollView`
	position: relative;
`;
