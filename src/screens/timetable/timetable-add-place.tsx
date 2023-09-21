import {useEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Alert, TouchableOpacity} from 'react-native';
import {Text, Box, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {GOOGLE_API_KEY} from '@env';
import {recommendApi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import moment from 'moment';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Center, VStack} from '../../utill/layout/layout';
import {CourseAndReview, CourseContainer, CourseTitleText, CourseSubTitleText} from '../my-travel-list/detail-info';
import {SvgCoffee, SvgHome} from '../../utill/svg/svg';
export default function TimetableAddPlace({navigation, route}: any) {
	const {day, timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [getInfo, setGetInfo] = useState({lat: 0, lng: 0, name: ''});
	const newY = useRef(0);
	const goRecommend = (category: string) => {
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		switch (newY.current) {
			case timetable[route.params.x].length:
				lat = timetable[route.params.x][timetable[route.params.x].length - 1].lat;
				lng = timetable[route.params.x][timetable[route.params.x].length - 1].lng;

				break;
			case 0:
				lat = timetable[route.params.x][0].lat;
				lng = timetable[route.params.x][0].lng;
				break;
			case -1:
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '참고할 관광지가 없어서 보여줄 수 없습니다!',
						modalSubTitle: '동일한 날짜에 아무것도 없으면 추천을 해줄 수 없습니다.',
					}),
				);
				return 0;
			default:
				const dLat =
					(timetable[route.params.x][newY.current - 1].lat - timetable[route.params.x][newY.current].lat) *
					(Math.PI / 180);
				const dLon =
					(timetable[route.params.x][newY.current - 1].lng - timetable[route.params.x][newY.current].lng) *
					(Math.PI / 180);

				const a =
					Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(timetable[route.params.x][newY.current - 1].lat * (Math.PI / 180)) *
						Math.cos(timetable[route.params.x][newY.current].lat * (Math.PI / 180)) *
						Math.sin(dLon / 2) *
						Math.sin(dLon / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				const distance = Math.ceil(6371 * c); // 두 지점 간의 거리 (단위: km)
				lat =
					(timetable[route.params.x][newY.current - 1].lat + timetable[route.params.x][newY.current].lat) / 2;
				lng =
					(timetable[route.params.x][newY.current - 1].lng + timetable[route.params.x][newY.current].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;

				break;
		}
		const categoryIndex = category == 'AD5' ? 4 : category == 'FD6' ? 1 : 3;
		navigation.navigate('Recommend', {
			name: '',
			x: route.params.x,
			index: newY.current,
			y: route.params.y,
			category: categoryIndex,
			lat: lat,
			lng: lng,
			apiCategory: category,
			radius: radius,
		});
	};
	const addTimetable = () => {
		const updateItem = {
			...getInfo,
			category: 5,
			concept: [0],
			partner: [0],
			play: [0],
			popular: 0,
			season: [0],
			tour: [0],
			x: route.params.x,
			y: route.params.y[0],
			id: shortId.generate(),
			takenTime: route.params.y.length * 30,
		};
		let copy = [...timetable];
		let xArrayCopy = [...copy[route.params.x]];
		xArrayCopy.splice(newY.current, 0, updateItem);
		copy[route.params.x] = xArrayCopy;
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.goBack();
	};
	useEffect(() => {
		newY.current = timetable[route.params.x].findIndex(item => item?.y > route.params.y[0]);
		if (newY.current == -1) {
			if (timetable[route.params.x].length == 0) {
				newY.current = -1;
			} else {
				newY.current = timetable[route.params.x].length;
			}
		}
	}, []);
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	return (
		<Center>
			<DayContainer>
				<DayText>
					{moment(day[route.params.x]).format('YYYY-MM-DD')},{weekdays[moment(day[route.params.x]).day()]}요일
				</DayText>
			</DayContainer>
			<Text>
				시간은! {(route.params.y[0] * 30 + 360) / 60}시 ~
				{((route.params.y[route.params.y.length - 1] + 1) * 30 + 360) / 60}
			</Text>
			<Text>{route.params.y[2]}</Text>
			<TouchableOpacity disabled={!getInfo.name} style={{opacity: getInfo.name ? 1 : 0.5}} onPress={addTimetable}>
				<Text bold fontSize='xl'>
					추가
				</Text>
			</TouchableOpacity>
			<HStack>
				<TouchableOpacity
					style={{opacity: getInfo.name ? 1 : 0.5}}
					onPress={() => {
						goRecommend('CE7');
					}}>
					<Text bold fontSize='xl'>
						카페 추천
					</Text>
				</TouchableOpacity>
				<Spacer />

				<TouchableOpacity
					style={{opacity: getInfo.name ? 1 : 0.5}}
					onPress={() => {
						goRecommend('AD5');
					}}>
					<Text bold fontSize='xl'>
						숙소 추천
					</Text>
				</TouchableOpacity>
				<Spacer />
				<TouchableOpacity
					style={{opacity: getInfo.name ? 1 : 0.5}}
					onPress={() => {
						goRecommend('FD6');
					}}>
					<Text bold fontSize='xl'>
						식당 추천
					</Text>
				</TouchableOpacity>
			</HStack>
			{getInfo.name ? (
				<HStack>
					<Text bold fontSize='lg'>
						{getInfo.name}
					</Text>
					<TouchableOpacity
						onPress={() => {
							setGetInfo({lat: 0, lng: 0, name: ''});
						}}>
						<Text>삭제</Text>
					</TouchableOpacity>
				</HStack>
			) : (
				<GooglePlacesAutocomplete
					placeholder='장소를 검색해보세요!'
					query={{
						key: GOOGLE_API_KEY,
						language: 'ko',
						components: 'country:kr',
					}}
					styles={{textInputContainer: {zIndex: 1}, textInput: {zIndex: 1}}}
					fetchDetails={true}
					onPress={async (data, details) => {
						setGetInfo({
							lat: details?.geometry.location.lat ?? 0,
							lng: details?.geometry.location.lng ?? 0,
							name: details?.name ?? '검색불가',
						});
					}}
					onFail={error => console.log(error)}
					onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
			)}
			<CourseAndReview>
				<CoffeeContainer onPress={() => goRecommend('CE7')}>
					<VStack>
						<CourseTitleText>카페 추천</CourseTitleText>
						<CourseSubTitleText>지금 인기 있는 카페를 추천해드려요</CourseSubTitleText>
					</VStack>
					<SvgCoffee color='white' />
				</CoffeeContainer>
				<AccommodationsContainer
					onPress={() => {
						goRecommend('AD5');
					}}>
					<VStack>
						<CourseTitleText>숙소 추천</CourseTitleText>
						<CourseSubTitleText>성향에 맞는 숙소를 추천해드려요</CourseSubTitleText>
					</VStack>
					<SvgHome width={36} height={36} color='white' />
				</AccommodationsContainer>
			</CourseAndReview>
		</Center>
	);
}

const DayContainer = styled.View`
	width: 80%;
	height: 48px;
	border-radius: 10px;
	background-color: ${colors.selectButton};
	padding: 10px;
	align-items: center;
	justify-content: center;
`;
const DayText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: white;
`;
const CoffeeContainer = styled(CourseContainer)`
	background-color: ${colors.coffeeColor};
`;

const AccommodationsContainer = styled(CourseContainer)`
	background-color: ${colors.accommodationColor};
`;
