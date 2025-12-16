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
import {logEvent} from '../../../firebaseAnalytice';
import {useBackHandler} from '../../utill/hooks/useBackhandler';

export default function HomeProductCountry({navigation}: any) {
	const {country} = useAppSelector(state => state.travelSlice);

	useBackHandler({type: 'exit'});
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
	const btnNext = async () => {
		await logEvent(`main_product_country_select`, {title: countryList[country].en});
		navigation.navigate('PresetProduct', {trigger: 'home'});
	};
	return (
		<BackgroundGray>
			<StepText
				marginTop={heightPercentage(10)}
				styleText=''
				mainText='상품을 보고자하는 나라를 선택해주세요.'></StepText>
			<FlexWrap gap={10}>
				{countryList.map((item, idx) => (
					<TendencyButton
						bgColor={country == idx}
						label={item.ko}
						key={idx}
						divide={true}
						width={widthPercentage(158)}
						imageSvg={imageList[idx]}
						onPress={async () => {
							await logEvent(`main_product_country_select`, {idx});
							handleCountryClick(idx);
						}}></TendencyButton>
				))}
			</FlexWrap>
			<RouteButton navigation={navigation} btnFunction={btnNext}></RouteButton>
		</BackgroundGray>
	);
}
