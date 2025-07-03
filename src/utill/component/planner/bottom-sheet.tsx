import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
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

function PlannerBottomSheet({navigation}: any) {
	const {day, region, cityIndex, country, nDay} = useAppSelector(state => state.travelSlice);
	const sheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints: ReadonlyArray<string | number> = useMemo(() => ['10%', '45%', '90%'], []);
	// callbacks
	const handleSheetChange = useCallback((index: number) => {
		console.log('handleSheetChange', index);
	}, []);
	return (
		<BottomSheet
			ref={sheetRef}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			onChange={handleSheetChange}
			index={1}>
			<CustomBottomSheetScrollView
				showsVerticalScrollIndicator={false}
				style={{marginBottom: heightPercentage(100)}}>
				{/* <BackgroundGray modify={modify} viewMap={viewMap}> */}
				<PretendardSemiBoldText size={22} lineHeight={26} color={colors.Black}>
					{region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]}까지 어떻게 가시나요?
					{/* {moment(day[0]).format('YYYY/MM/DD')}~{moment(day[1]).format('YYYY/MM/DD')} */}
				</PretendardSemiBoldText>
				{/* </BackgroundGray> */}
				{['가는', '오는'].map((item, index) => (
					<HStack justifyContent='space-between;'>
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
				))}
			</CustomBottomSheetScrollView>
			<RouteButton
				navigation={navigation}
				nextTitle='RecommendSelectPlay'
				nextText='다음으로'
				leftText='건너뛰기'
				LeftBtnFunction={() => {
					console.log('d');
				}}></RouteButton>
		</BottomSheet>
	);
}
const CustomBottomSheetScrollView = styled(BottomSheetScrollView)`
	padding: 0px ${widthPercentage(20)}px;
`;
export default memo(PlannerBottomSheet);
