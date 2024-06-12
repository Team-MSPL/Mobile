import {memo, useRef} from 'react';
import {Animated} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {colors} from '../../colors';
import {useDistance} from '../../hooks/useDistance';
import PrimaryButton from '../primary-button';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
const InfoView = ({navigation, test, index, idx, modify, CancelModify}: any) => {
	const {timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const accommodationRecommend = (e: {value: any; index: number; idx: number}) => {
		CancelModify(false);
		if (timetable[e.idx].length < 2) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
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
				navigation.navigate('Recommend', {
					name: '숙소 추천',
					x: e.value.x,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					apiCategory: 'AD5',
					radius: 2000,
					backupLat: e.index != 0 ? timetable[e.idx][e.index - 1].lat : timetable[e.idx][e.index + 1].lat,
					backupLng: e.index != 0 ? timetable[e.idx][e.index - 1].lng : timetable[e.idx][e.index + 1].lng,
					status: e.index != 0 ? timetable[e.idx][e.index - 1] : timetable[e.idx][e.index + 1],
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	};
	const restaurantRecommend = (e: {value: any; index: number; idx: number}) => {
		CancelModify(false);
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		let status = timetable[e.idx][e.index - 1];
		let goCheck = true;
		if (timetable[e.idx].length == 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
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
				const departure = {lat: timetable[e.idx][e.index - 1].lat, lng: timetable[e.idx][e.index - 1].lng};
				const arrival = {lat: timetable[e.idx][e.index + 1].lat, lng: timetable[e.idx][e.index + 1].lng};
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

				navigation.navigate('Recommend', {
					name: '식당 추천',
					x: e.value.x,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					apiCategory: 'FD6',
					radius: radius,
					backupLat: timetable[e.idx][e.index - 1]?.lat ?? 0,
					backupLng: timetable[e.idx][e.index - 1]?.lng ?? 0,
					status: status,
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	};

	const pan = useRef(new Animated.ValueXY()).current;

	const locationRef = useRef({x: 0, y: 0});
	pan.addListener(async e => {
		locationRef.current = {x: e.x, y: e.y};
	});
	return (
		<PrimaryButton
			label={test.name}
			disabled={modify}
			backgroundColor={colors.Primary}
			textColor={colors.Gray5}
			onPress={() => {
				test.category == 1
					? restaurantRecommend({
							value: test,
							index: index,
							idx: idx,
					  })
					: accommodationRecommend({
							value: test,
							index: index,
							idx: idx,
					  });
			}}
			// onLongPress={drag}
			marginBottom={heightPercentage(10)}
			width={widthPercentage(282)}
			height={heightPercentage(42)}></PrimaryButton>
	);
};

export default memo(InfoView);
