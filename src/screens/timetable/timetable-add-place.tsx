import {useEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {GOOGLE_API_KEY} from '@env';
import {recommendApi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import moment from 'moment';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Center, VStack, HStack} from '../../utill/layout/layout';
import {
	CourseAndReview,
	CourseContainer,
	CourseTitleText,
	CourseSubTitleText,
	IconContainer,
} from '../my-travel-list/detail-info';
import {SvgCoffee, SvgHome} from '../../utill/svg/svg';
import {
	TimeContainer,
	ASD,
	TimeItemContainer,
	TimeStepText,
	TimeItemText,
	DayPressable,
} from '../enroll-info/select-day';

import Icon from 'react-native-vector-icons/AntDesign';

import Icons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../utill/component/custom-button';
import {useDistance} from '../../utill/hooks/useDistance';
import {SearchClearButton, SearchClearContainer} from '../enroll-info/search-place';
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
				const departure = {
					lat: timetable[route.params.x][newY.current - 1].lat,
					lng: timetable[route.params.x][newY.current - 1].lng,
				};
				const arrival = {
					lat: timetable[route.params.x][newY.current].lat,
					lng: timetable[route.params.x][newY.current].lng,
				};

				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival})); // 두 지점 간의 거리 (단위: km)
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
	const DeleteIconContainer = styled(Icon)`
		background-color: ${colors.selectButton};
		border-radius: 5px;
		padding: 0.6%;
		margin: 0px 0px 0px 10px;
	`;
	const DeleteIconContainers = styled(Icons)`
		border-radius: 5px;
		padding: 0.6%;
		margin: 0px 0px 0px 10px;
	`;
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
	const DaySelectInfoList = [
		{step: 'Start', title: '시작 시간', time: route.params.y[0]},
		{step: 'End', title: '종료 시간', time: route.params.y[route.params.y.length - 1] + 1},
	];

	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const clearButton = () => (
		<SearchClearContainer>
			<TouchableOpacity onPress={clearInput}>
				<SearchClearButton>취소</SearchClearButton>
			</TouchableOpacity>
		</SearchClearContainer>
	);
	return (
		<MainContainer>
			<DayContainer>
				<DayText>
					{moment(day[route.params.x]).format('YYYY-MM-DD')},{weekdays[moment(day[route.params.x]).day()]}요일
				</DayText>
			</DayContainer>

			<TimeContainer>
				<ASD>
					{[...Array(2)].map((item, idx) => (
						<TimeItemContainer key={idx}>
							<TimeStepText>{DaySelectInfoList[idx].step}</TimeStepText>
							<TimeItemText>{DaySelectInfoList[idx].title}</TimeItemText>
							<HStack>
								<DayElementContainer>
									<TimeItemText>
										{DaySelectInfoList[idx].time < 12 ? '오전' : '오후'}
										{Math.floor((DaySelectInfoList[idx].time * 30 + 360) / 60)}:
										{String((DaySelectInfoList[idx].time * 30 + 360) % 60).padStart(2, '0')}
									</TimeItemText>
								</DayElementContainer>
							</HStack>
						</TimeItemContainer>
					))}
				</ASD>
			</TimeContainer>

			<SearchContainer>
				{getInfo.name ? (
					<AddHStack>
						<AddText>{getInfo.name}</AddText>
						<TouchableOpacity
							onPress={() => {
								setGetInfo({lat: 0, lng: 0, name: ''});
							}}>
							<DeleteIconContainer name={'delete'} size={20} color={'white'} />
						</TouchableOpacity>
					</AddHStack>
				) : (
					<GooglePlacesAutocomplete
						placeholder='장소를 검색해보세요!'
						placeholderTextColor={'grey'}
						query={{
							key: GOOGLE_API_KEY,
							language: 'ko',
							components: 'country:kr',
						}}
						ref={autocompleteRef}
						textInputProps={{placeholderTextColor: 'grey'}}
						styles={{
							textInputContainer: {borderWidth: 1, borderColor: colors.selectButton, borderRadius: 10},
							textInput: {margin: 1},
							listView: {height: 300},
						}}
						renderRightButton={clearButton}
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
			</SearchContainer>
			<CourseAndReview>
				<RecommendContainer color='#ffccb6' onPress={() => goRecommend('CE7')}>
					<CourseTitleText>카페 추천</CourseTitleText>
					<IconContainer>
						<SvgCoffee color='white' />
					</IconContainer>
				</RecommendContainer>
				<RecommendContainer
					color='#cbaacb'
					onPress={() => {
						goRecommend('AD5');
					}}>
					<CourseTitleText>숙소 추천</CourseTitleText>

					<IconContainer>
						<SvgHome width={36} height={36} color='white' />
					</IconContainer>
				</RecommendContainer>
				<RecommendContainer
					color='#abdee6'
					onPress={() => {
						goRecommend('FD6');
					}}>
					<CourseTitleText>식당 추천</CourseTitleText>
					<IconContainer>
						<DeleteIconContainers name={'restaurant'} size={36} color={'white'} />
					</IconContainer>
				</RecommendContainer>
			</CourseAndReview>
			<CustomButton label='추가하기' isDisabled={!getInfo.name} onPress={addTimetable} />
		</MainContainer>
	);
}

const DayContainer = styled.View`
	width: 100%;
	height: 48px;
	border-radius: 10px;
	background-color: ${colors.selectButton};
	padding: 10px;
	align-items: center;
	justify-content: center;
	margin: 0px 0px 10px 0px;
`;
const DayText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: white;
`;
const RecommendContainer = styled(CourseContainer)<{color: string}>`
	width: 30%;
	background-color: ${props => props.color};
	height: 100px;
`;

const MainContainer = styled.View`
	flex: 1;
	background-color: white;
	padding: 10px;
`;
const DayElementContainer = styled(DayPressable).attrs({as: View})`
	width: 80%;
`;
const SearchContainer = styled.View`
	width: 100%;
	margin: 5% 0% 5% 0%;
	height: 100px;
`;

const AddText = styled.Text`
	font-size: 20px;
	gont-weight: bold;
	color: ${colors.selectButton};
`;
const AddHStack = styled(HStack)`
	align-items: center;
	justify-content: center;
`;
