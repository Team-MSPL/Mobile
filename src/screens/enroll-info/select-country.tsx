import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray, FlexWrap} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import RouteButton from '../../utill/component/route-button';
import {SvgChina, SvgJapan, SvgKorea, SvgPhilippine, SvgSingapore, SvgTailiand, SvgVietnam} from '../../utill/svg/svg';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

export default function RecommendSelectCountry({navigation}: any) {
	const {country} = useAppSelector(state => state.travelSlice);

	const {countryList, handleCountryClick} = useTendencyHandler();
	const imageList = [
		<SvgKorea width={30} height={20} />,
		<SvgJapan width={30} height={20} />,
		<SvgChina width={30} height={20} />,
		<SvgVietnam width={30} height={20} />,
		<SvgTailiand width={30} height={20} />,
		<SvgPhilippine width={30} height={20} />,
		<SvgSingapore width={30} height={20} />,
	];
	const dispatch = useAppDispatch();
	useFocusEffect(
		useCallback(() => {
			dispatch(travelSliceActions.enrollCityIndex(0));
			dispatch(travelSliceActions.selectRegion([]));
		}, []),
	);
	const selectPopularity = () => {
		dispatch(
			travelSliceActions.selectPopularity({
				region: '싱가포르',
				cityIndex: 1,
				cityDistance: [0],
			}),
		);
	};
	return (
		<BackgroundGray>
			<Stepper total={11} now={1}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='어디로 떠나시나요?'></StepText>
			<FlexWrap gap={10}>
				{countryList.map((item, idx) => (
					<TendencyButton
						bgColor={country == idx}
						label={item.ko}
						key={idx}
						divide={true}
						width={widthPercentage(158)}
						imageSvg={imageList[idx]}
						betaFlag={idx != 0}
						onPress={() => {
							handleCountryClick(idx);
						}}></TendencyButton>
				))}
			</FlexWrap>
			<RouteButton
				navigation={navigation}
				nextTitle={country != 6 ? 'SelectCity' : 'SelectDay'}
				btnFunction={country == 6 ? selectPopularity : undefined}></RouteButton>
		</BackgroundGray>
	);
}
