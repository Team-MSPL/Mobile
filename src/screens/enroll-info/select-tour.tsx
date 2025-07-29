import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import RouteButton from '../../utill/component/route-button';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import shortid from 'shortid';

export default function RecommendSelectTour({navigation}: any) {
	const {
		tendency,
		makeMode,
		accommodations,
		nDay,
		essentialPlaces,
		departure,
		departureSelected,
		departureAirport,
		departureTrain,
	} = useAppSelector(state => state.travelSlice);
	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 3, region: false, item: item});
	};
	const dispatch = useAppDispatch();
	const goNext = () => {
		let data = Array.from({length: nDay + 1}, () => []);
		let departureInfo;
		switch (departureSelected) {
			case 'departureAirport':
				departureInfo = departureAirport;
				break;
			case 'departureTrain':
				departureInfo = departureTrain;
				break;
			case 'departure':
				departureInfo = departure;
				break;
		}
		if (departureSelected != '') {
			data[0].push({
				category: 6,
				id: shortid(),
				takenTime: 0,
				x: 0,
				y: 6,
				lat: departureInfo?.lat,
				lng: departureInfo?.lng,
				name: departureInfo?.name,
			});
			dispatch(
				travelSliceActions.updateFiled({
					field: 'transitInfo',
					value: {
						outbound: {
							departureAirport: '', //출밢녀
							departureTime: new Date(), //출발시간
							arrivalAirport: departureInfo?.name, //도착편
							arrivalTime: new Date(), //도착시간
							airline: '', //항공사혹은 기차번호
							reservationNumber: '', //에약번호

							departurHour: 6, //출발시각
							arrivalHour: 8, //도착시각
							Address: {
								lat: departureInfo?.lat,
								lng: departureInfo?.lng,
							},
							type:
								departureSelected == 'departureAirport'
									? 'airport'
									: departureSelected == 'departureTrain'
									? 'train'
									: 'none',
						},
						inbound: {
							departureAirport: '',
							departureTime: new Date(),
							arrivalAirport: '',
							arrivalTime: new Date(),
							airline: '',
							reservationNumber: '',

							departurHour: 6, //출발시각
							arrivalHour: 8, //도착시각
							Address: {
								lat: 0,
								lng: 0,
							},
							type:
								departureSelected == 'departureAirport'
									? 'airport'
									: departureSelected == 'departureTrain'
									? 'train'
									: 'none',
						},
					},
				}),
			);
		}
		essentialPlaces.forEach((item, index) => {
			data[item?.day - 1].push({
				category: 5,
				id: shortid(),
				takenTime: 60,
				x: item?.day - 1,
				y:
					(essentialPlaces
						.filter((filterItem, idx) => filterItem.day == item.day)
						.findIndex(findItem => findItem.id == item.id) +
						1) *
						2 +
					6,
				lat: item?.lat,
				lng: item?.lng,
				name: item?.name,
			});
		});
		accommodations.slice(1).forEach((item, index) => {
			if (index != 0 && data[index - 1].at(-1)?.category == 4) {
				data[index].push({
					category: 4,
					id: shortid(),
					takenTime: 0,
					x: 0,
					y: 6,
					lat: data[index - 1].at(-1)?.lat,
					lng: data[index - 1].at(-1)?.lng,
					name: data[index - 1].at(-1)?.name,
				});
			}
			if (item?.name != '') {
				data[index].push({
					category: 4,
					id: shortid(),
					takenTime: 360,
					x: 0,
					y: 36,
					lat: item.lat,
					lng: item.lng,
					name: item.name,
				});
			}
		});
		makeMode == 'planner' && dispatch(travelSliceActions.changeTimetable(data));
		navigation.navigate(makeMode == 'planner' ? 'Planner' : 'SelectDistance');
	};
	return (
		<BackgroundGray>
			<Stepper total={13} now={12}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어디를 가고 싶으신가요?'
				subText='* 중복 선택 가능'
				warningText={
					tendency[0][tendency[0].length - 1] == 1 && tendency[3][5] == 1
						? '반려동물과 실내 여행지는 함께 선택할 수 없어요'
						: ''
				}></StepText>
			<ButtonsContainer>
				{tendencyList[3]?.list.map((item, idx) => (
					<TendencyButton
						marginBottom={0}
						bgColor={tendency[3][idx] == 1}
						label={item}
						divide={true}
						key={idx}
						imageUrl={tendencyList[3]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<RouteButton
				navigation={navigation}
				nextTitle={makeMode == 'planner' ? 'Planner' : 'SelectDistance'}
				goNext={goNext}
				isDisabled={tendency[0][tendency[0].length - 1] == 1 && tendency[3][5] == 1}></RouteButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: ${heightPercentage(74)}px;
	gap: ${widthPercentage(8)}px;
`;
