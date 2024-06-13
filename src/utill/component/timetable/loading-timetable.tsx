import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import {MainText, PretendardBoldText} from '../../layout/layout';
import LoadingLottie from '../../loading-lottie';
import {useAppSelector} from '../../../redux';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';

export default function LoadingTimetable({navigation}: any) {
	const [view, setView] = useState(0);
	const viewList = ['선호 지역 탐색 중 🗺', '여행 동선 설계 중 ✈', '수집 자료 정리 중 📑', '맞춤 성향 분석 중 ✍'];
	const {userName} = useAppSelector(state => state.userSlice);
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: false,
		});
	});
	useEffect(() => {
		var a = 0;
		const interval = setInterval(() => {
			a += 1;
			setView(view => {
				return a;
			});
			a == viewList.length - 1 && clearInterval(interval);
		}, 4000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<LoadingTimetableContainer>
			<LoadingLottie />
			<BarContainer>
				<BarContinueContainer size={view}></BarContinueContainer>
			</BarContainer>
			<PretendardBoldText size={16} lineHeight={21.6} color={colors.Black}>
				다님만의 ai를 바탕으로{' '}
				<PretendardBoldText size={16} lineHeight={21.6} color={colors.Primary}>
					{userName}
				</PretendardBoldText>
				님께 {'\n'}꼭 맞는 여행지를 생성중이에요!
			</PretendardBoldText>
			<MainText>{viewList[view]}</MainText>
		</LoadingTimetableContainer>
	);
}

const LoadingTimetableContainer = styled.View`
	align-items: center;
	background-color: ${colors.main};
	flex: 1;
`;
const BarContainer = styled.View`
	width: 80%;
	height: ${heightPercentage(10)}px;
	border-radius: 10px;
	background-color: ${colors.normalButton};
	margin: ${widthPercentage(10)}px 0px ${widthPercentage(10)}px 0px;
`;
const BarContinueContainer = styled.View<{size: number}>`
	width: ${props => props.size * 25 + 25}%;
	height: ${heightPercentage(10)}px;
	border-radius: 10px;
	background-color: ${colors.Primary};
`;
