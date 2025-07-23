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
	const {tendency, makeMode, accommodations, nDay, essentialPlaces} = useAppSelector(state => state.travelSlice);
	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 3, region: false, item: item});
	};
	const dispatch = useAppDispatch();
	const goNext = () => {
		let data = Array.from({length: nDay + 1}, () => []);

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
	margin-top: ${heightPercentage(134)}px;
	gap: ${widthPercentage(8)}px;
`;
