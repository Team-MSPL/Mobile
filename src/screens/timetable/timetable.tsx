import {JSX, JSXElementConstructor, ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getDrivingDuration, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import TimetableDayView from '../../utill/component/timetable/timetable-day-view';
import TimetableInfoView from '../../utill/component/timetable/timetable-info-view';
export default function Timetable({navigation}: any) {
	const {timetable, day, moveTimeList} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);

	let wayPoint = {start: '', goal: '', wayPoint: ''};
	const getDuration = async () => {
		timetable.map(async (item, idx) => {
			item.map((value, index) => {
				if (index === 0) {
					wayPoint.start = `${value.lng},${value.lat}`;
				} else if (index === item.length - 1) {
					wayPoint.goal = `${value.lng},${value.lat}`;
				} else {
					wayPoint.wayPoint += `${value.lng},${value.lat}|`;
				}
			});
			wayPoint.wayPoint && (wayPoint.wayPoint = wayPoint.wayPoint.slice(0, -1));
			await dispatch(getDrivingDuration(wayPoint));
			console.log(wayPoint);
			wayPoint = {start: '', goal: '', wayPoint: ''};
		});

		drawTimetable();
	};
	const drawTimetable = async () => {
		console.log('나 왔엉~!');
		console.log('wpqkf', moveTimeList[0][0]);
		let copy = [...timetable];
		timetable.map((item, idx) => {
			let time = 9;
			item.map((value, index) => {
				copy[idx][index].x = idx;
				copy[idx][index].y = time;
				index != item.length - 1 && (time += Math.ceil(moveTimeList[idx][index] / 1000 / 60 / 30));
			});
		});
		await dispatch(travelSliceActions.enrollTimetable(copy));
	};
	useLayoutEffect(() => {
		getDuration();

		//dispatch(getDrivingDuration());
	}, []);
	useEffect(() => {
		console.log('덥당', moveTimeList);
	}, []);
	return (
		<Box bgColor='#EFFBFB'>
			<HStack bgColor='blue.400'>
				<Text fontSize='md' bold>
					왼쪽
				</Text>
				<Spacer />
				<Text fontSize='xl' bold>
					{day[0].format('YYYY-MM-DD') + '~' + day[day.length - 1].format('YYYY-MM-DD')}
				</Text>
				<Spacer />
				<Text fontSize='md' bold>
					오른쪽
				</Text>
			</HStack>
			<TimetableDayView />
			<ScrollView position='relative'>
				<TimetableInfoView />
				<HStack>
					<VStack>
						{[...Array(18)].map((value, index) => (
							<Box key={index} w='60px' h='70px'>
								<Text>{index + 6}</Text>
							</Box>
						))}
					</VStack>
					{[...Array(5)].map((item, inx) => {
						return (
							<VStack key={inx}>
								{[...Array(36)].map((value, index) => (
									<Box
										key={index}
										w='70px'
										h='35px'
										borderLeftWidth='1px'
										borderTopWidth={index % 2 ? '0px' : '1px'}
										borderRightWidth={inx == 4 ? '1px' : '0px'}
										borderBottomWidth={index == 35 ? '1px' : '0px'}>
										<Text>{index}</Text>
									</Box>
								))}
							</VStack>
						);
					})}
				</HStack>
			</ScrollView>
		</Box>
	);
}
