import BottomSheet, {BottomSheetScrollView, useBottomSheetInternal} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {memo, useCallback, useMemo, useRef, useState} from 'react';
import {styled} from 'styled-components/native';
import {useAppSelector} from '../../../redux';
import {colors} from '../../colors';
import {BackgroundGray, HStack, PretendardSemiBoldText, VStack} from '../../layout/layout';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {cityViewList} from '../enroll-info/city-list';
import RouteButton from '../route-button';
import {LeftBar, RegistButton} from './components';
import Animated, {useAnimatedReaction, runOnJS} from 'react-native-reanimated';
import {SvgAirPort, SvgAirPortIcon, SvgAirPortIngIcon} from '../../svg/svg';
function PlannerBottomSheet({navigation, step, setStep}: any) {
	const {day, region, cityIndex, country, nDay} = useAppSelector(state => state.travelSlice);
	const sheetRef = useRef<BottomSheet>(null);
	const [btnVisible, setBtnVisible] = useState(true);
	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => ['10%', '65%', '90%'], []);
	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		console.log('handleSheetChange', index);
	}, []);
	function SheetContent() {
		const {animatedIndex} = useBottomSheetInternal();

		useAnimatedReaction(
			() => animatedIndex.value,
			(curr, prev) => {
				if (curr !== prev && prev != null) {
					runOnJS(setBtnVisible)(!(curr < prev && Math.floor(curr) == 0));
				}
			},
			[animatedIndex],
		);

		return <></>;
	}
	const transitScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:10px;'>
					{region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]}까지 어떻게 가시나요?
				</PretendardSemiBoldText>
				{['가는', '오는'].map((item, index) => (
					<>
						<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
							<HStack gap={3}>
								<LeftBar color={colors.Blue1} />
								<VStack>
									<PretendardSemiBoldText size={19} lineHeight={23} color={colors.Black}>
										{item}편
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={13} lineHeight={17} color={colors.PlannerGray}>
										{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<RegistButton
								color={colors.Blue1}
								onPress={() => {
									navigation.navigate('RegistTransit');
								}}>
								<PretendardSemiBoldText size={13} lineHeight={18} color={colors.backgroundWhite}>
									{item} 편 등록
								</PretendardSemiBoldText>
							</RegistButton>
						</HStack>
						<TransitBox>
							<HStack>
								<IconContainer>
									<SvgAirPortIcon />
								</IconContainer>
								<PretendardSemiBoldText size={14} lineHeight={18} color={colors.Black}>
									대한항공 /asldnsakl
								</PretendardSemiBoldText>
							</HStack>
							<HStack justifyContent='space-between'>
								<VStack>
									<PretendardSemiBoldText size={32} lineHeight={36} color={colors.Black}>
										ICN
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
										인천 국제 공항
									</PretendardSemiBoldText>
								</VStack>
								<VStack>
									<HStack deco={`margin-top:-20px;`}>
										<Dash></Dash>
										<SvgAirPortIngIcon></SvgAirPortIngIcon>
									</HStack>
									<PretendardSemiBoldText
										size={8}
										lineHeight={12}
										color={colors.Gray4}
										deco={'text-align:center;'}>
										1시간
									</PretendardSemiBoldText>
								</VStack>
								<VStack>
									<PretendardSemiBoldText
										size={32}
										lineHeight={36}
										color={colors.Black}
										deco={'text-align:right;'}>
										HAN
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
										노이 바이 국제 공항
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<HStack gap={widthPercentage(13)} s>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									출발 정보
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									시간
								</PretendardSemiBoldText>
							</HStack>
							<HStack gap={widthPercentage(13)}>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									도착 정보
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={12} lineHeight={16} color={colors.Gray4}>
									시간
								</PretendardSemiBoldText>
							</HStack>
						</TransitBox>
					</>
				))}
			</>
		);
	};
	const accommodationScreen = () => {
		return (
			<>
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black} deco='margin-bottom:10px;'>
					어디서 머무시나요?
				</PretendardSemiBoldText>
				{Array(nDay + 1)
					.fill('')
					.map((item, index) => (
						<HStack justifyContent='space-between;' deco='margin-bottom:10px;'>
							<HStack gap={3}>
								<LeftBar color={colors.Pink1} />
								<VStack>
									<PretendardSemiBoldText size={19} lineHeight={23} color={colors.Black}>
										{index + 1}일 차
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={13} lineHeight={17} color={colors.PlannerGray}>
										{moment(day[index == 0 ? index : nDay]).format('YYYY-MM-DD')}
									</PretendardSemiBoldText>
								</VStack>
							</HStack>
							<RegistButton
								color={colors.Pink1}
								onPress={() => {
									navigation.navigate('RegistTransit');
								}}>
								<PretendardSemiBoldText size={13} lineHeight={18} color={colors.backgroundWhite}>
									숙소 등록
								</PretendardSemiBoldText>
							</RegistButton>
						</HStack>
					))}
			</>
		);
	};
	return (
		<>
			<BottomSheet
				ref={sheetRef}
				snapPoints={snapPoints}
				enableDynamicSizing={false}
				onChange={handleSheetChange}
				index={1}>
				<SheetContent />
				<CustomBottomSheetScrollView
					showsVerticalScrollIndicator={false}
					style={{marginBottom: heightPercentage(100)}}>
					{step == 0 ? transitScreen() : accommodationScreen()}
				</CustomBottomSheetScrollView>
			</BottomSheet>
			{btnVisible && (
				<RouteButton
					navigation={navigation}
					nextText='다음으로'
					leftText='건너뛰기'
					btnFunction={() => {
						setStep(step + 1);
					}}
					LeftBtnFunction={() => {
						setStep(step + 1);
					}}></RouteButton>
			)}
		</>
	);
}
const CustomBottomSheetScrollView = styled(BottomSheetScrollView)`
	padding: 0px ${widthPercentage(20)}px;
`;
const TransitBox = styled.View`
	width: ${widthPercentage(333)}px;
	height: ${widthPercentage(203)}px;
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray2};
	padding: ${widthPercentage(17)}px ${widthPercentage(24)}px;
	gap: ${widthPercentage(10)}px;
`;
const IconContainer = styled.View`
	width: ${widthPercentage(28)}px;
	height: ${widthPercentage(28)}px;
	border-radius: 99px;
	background-color: ${colors.Blue1};
	align-items: center;
	justify-content: center;
`;
const Dash = styled.View`
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(1)}px;
	border-width: 1px;
	border-style: dashed;
`;
export default memo(PlannerBottomSheet);
