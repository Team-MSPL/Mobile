import {useAppDispatch, useAppSelector} from '../../../redux';
import {regionRecommendSliceActions, regionSearch} from '../../../redux/travel-info/region-recommend.slice';
import {BackgroundGray, MainContainer, PretendardSemiBoldText} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
import Stepper from '../../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import RangeSlider from 'rn-range-slider';
import {useEffect, useRef} from 'react';
import {logEvent} from '../../../../firebaseAnalytice';
import RouteButton from '../../../utill/component/route-button';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import CustomButton from '../../../utill/component/custom-button';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const {country} = useAppSelector(state => state.travelSlice);
	const {regionTendency, popularity} = useAppSelector(state => state.regionRecommendSlice);
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymouse_place_step2', {})
			: await logEvent('place_step2', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);

	const {countryList} = useTendencyHandler();
	const goNext = async () => {
		try {
			if (country == 0) {
				dispatch(
					regionRecommendSliceActions.enrollPopularity([
						rangeRef.current.low * 20,
						rangeRef.current.hight * 20,
					]),
				);
				navigation.navigate('RegionSelectDistance');
			} else {
				dispatch(LoadingSliceActions.onLoading());
				let datas = {
					selectList: regionTendency,
					selectPopular: popularity,
					recentPosition: {
						lat: cityViewList[country][1].sub[0].lat,
						lng: cityViewList[country][1].sub[0].lng,
					},
					distanceSensitivity: 10,
					version: 2,
					country: countryList[country].en, //241129 추가 - 디폴트는 Korea
				};
				const result = await dispatch(regionSearch(datas)).unwrap();
				console.log(result);
				if (result.length != 0) {
					// dispatch(updateFunctionToken({functionToken: functionToken - 1}));
					navigation.popToTop();
					navigation.navigate('RegionViewResult');
				} else {
					dispatch(
						modalSliceActions.setOpenModal({
							modalSubTitle:
								'적절한 여행지를 찾지못하였습니다.\n성향을 조금 조절한 후 다시 시도해주세요.',
							modalSingleUse: true,
						}),
					);
				}
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalSubTitle: '적절한 여행지를 찾지못하였습니다.\n성향을 조금 조절한 후 다시 시도해주세요.',
					modalSingleUse: true,
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const rangeRef = useRef({low: 1, hight: 5});
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<BackgroundGray>
			<Stepper total={7} now={6}></Stepper>
			<StepText
				styleText='3.여행지의 인기도를 선택해주세요.'
				mainText={'가고자 하는 여행지가 \n어떤 느낌이었으면 하나요?'}
				subText={`2023년 지역별 관광객 수를 기준으로\n5단계의 인기도를 설정했습니다.`}></StepText>
			<BarContainer>
				<RangeSlider
					min={1}
					max={5}
					step={1}
					minRange={1}
					renderRail={() => <Rail />}
					renderThumb={() => (
						<Thumb>
							<ThumbInside></ThumbInside>
						</Thumb>
					)}
					onValueChanged={(low, high) => {
						rangeRef.current.low = low;
						rangeRef.current.hight = high;
					}}
					renderRailSelected={() => <SelectRail />}></RangeSlider>
				<SpaceHstack>
					<PretendardSemiBoldText size={12} lineHeight={14.4} color={colors.Gray4}>
						가장 이색적인
					</PretendardSemiBoldText>
					<PretendardSemiBoldText size={12} lineHeight={14.4} color={colors.Gray4}>
						가장 유명한
					</PretendardSemiBoldText>
				</SpaceHstack>
				{country == 0 ? (
					<PretendardSemiBoldText
						size={11}
						lineHeight={18}
						color={colors.Gray2}
						style={{zIndex: 99, marginTop: 20}}>
						가장 이색적인 : 경남 함안군 등 37개 지역 {`\n`}상당히 이색적인 : 경북 청송군 등 53개 지역 {`\n`}
						균형잡힌 : 강원 화천시 등 32개 지역 {`\n`}상당히 유명한 : 강원 강릉시 등 30개 지역 {`\n`}가장
						유명한 : 서울, 제주 등 10개 지역
					</PretendardSemiBoldText>
				) : (
					<PretendardSemiBoldText
						size={11}
						lineHeight={18}
						color={colors.Gray2}
						style={{zIndex: 99, marginTop: 20}}>
						가장 이색적인 : 관광객이 적어 독특하고 매력적인 분위기를 느낄 수 있는 곳 {`\n`}이색적인 : 잘
						알려지지 않았지만 흥미로운 요소가 가득한 장소 {`\n`}
						매력적인 : 서서히 알려지기 시작하며 방문할 가치가 있는 특별한 장소 {`\n`}떠오르는 : 트렌디하고
						인기가 급상승 중인 장소로, 활기찬 분위기가 특징 {`\n`}가장 가장 유명한 : 많은 사람들이 방문하는
						대표적인 관광지
					</PretendardSemiBoldText>
				)}
			</BarContainer>
			{country == 0 ? (
				<RouteButton navigation={navigation} nextTitle='RegionSelectPopularity' goNext={goNext}></RouteButton>
			) : (
				<ButtonContainer>
					<CustomButton
						label='맞춤형 여행지를 확인해볼게요!'
						onPress={goNext}
						marginBottom={12}></CustomButton>
				</ButtonContainer>
			)}
		</BackgroundGray>
	);
}
const ButtonContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	margin-bottom: 2px;
`;
const SpaceHstack = styled.View`
	width: ${widthPercentage(300)}px;
	justify-content: space-between;
	flex-direction: row;
	align-self: center;
	margin-top: ${heightPercentage(5)}px;
`;
export const ThumbInside = styled.View`
	width: ${widthPercentage(15.53)}px;
	height: ${widthPercentage(15.53)}px;
	background-color: ${colors.Blue3};
	border-width: 2.12px;
	border-color: ${colors.backgroundWhite};
	border-radius: 99px;
`;
export const Thumb = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	background-color: rgba(132, 255, 3, 0.3);
	align-items: center;
	border-radius: 99px;
	justify-content: center;
`;
export const SelectRail = styled.View`
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Blue3};
	border-radius: 6px;
`;
const BarContainer = styled.View`
	width: ${widthPercentage(300)}px;
	align-self: center;
	border-radius: 6px;
	margin-vertical: ${heightPercentage(30)}px;
`;
export const Rail = styled.View`
	width: 100%;
	height: ${heightPercentage(10)}px;
	background-color: ${colors.Gray1};
	border-radius: 6px;
`;
