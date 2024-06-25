import {memo} from 'react';
import {RegionImage} from '../../../screens/enroll-info/final-check';
import {HStack, PretendardSemiBoldText, PretendardVariableText, TagContainer, VStack} from '../../layout/layout';
import {TagShopText} from '../../../screens/home/main';
import styled from 'styled-components/native';
import {fontPercentage, heightPercentage, widthPercentage} from '../../layout/responsive-size';
import moment from 'moment';
import {useAppSelector} from '../../../redux';
import {colors} from '../../colors';

const AbsoluteTopBarComponent = ({modify}: {modify: boolean}) => {
	const {day, transit, bandwidth, nDay, region, travelName, regionInfo} = useAppSelector(state => state.travelSlice);
	return (
		<AbsoluteTopBars opacityState={modify}>
			<HStack justifyContent='space-between' marginVertical={heightPercentage(10)}>
				<RegionImage
					source={{
						uri: regionInfo?.photo == '' ? 'https://danim.me/square_logo.png' : regionInfo?.photo,
					}}
				/>
				<VStack>
					<HStack>
						<PretendardVariableText size={12} lineHeight={18} color={colors.PointYellow}>
							{region[0]}
							{region.length >= 2 ? ` +${region.length - 1}` : ''}
						</PretendardVariableText>
						<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
							{' '}
							| {moment(day[0]).format('YY.MM.DD') + ' - ' + moment(day[nDay]).format('YY.MM.DD')}
						</PretendardVariableText>
					</HStack>
					<PretendardSemiBoldText size={16} lineHeight={21.6} color={colors.Gray5}>
						{travelName}
					</PretendardSemiBoldText>
				</VStack>
				<VStack gap={heightPercentage(3)} alignItems='flex-end'>
					<TagContainer backgroundColor={colors.backgroundWhite}>
						<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
							#
						</TagShopText>
						<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
							{!transit ? '자동차·렌트카' : '대중교통'}
						</PretendardSemiBoldText>
					</TagContainer>
					<TagContainer backgroundColor={colors.backgroundWhite}>
						<TagShopText color={colors.Gray2} size={fontPercentage(12)}>
							#
						</TagShopText>
						<PretendardSemiBoldText size={12} lineHeight={14} color={colors.Gray5}>
							{bandwidth ? '여유있는 일정' : '알찬 일정'}
						</PretendardSemiBoldText>
					</TagContainer>
				</VStack>
			</HStack>
		</AbsoluteTopBars>
	);
};
export default memo(AbsoluteTopBarComponent);
export const AbsoluteTopBars = styled.View<{opacityState: boolean}>`
	width: 100%;
	height: ${heightPercentage(71)}px;
	position: ${props => (props.opacityState ? 'relative' : 'absolute')};
	top: 0;
	z-index: 100;
	background-color: rgba(255, 255, 255, 0.9);
	padding: 0px ${widthPercentage(12)}px;
`;
