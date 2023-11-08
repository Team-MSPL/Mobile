import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import {MainText} from '../../layout/layout';
import LoadingLottie from '../../loading-lottie';

export default function LoadingTimetable({navigation}: any) {
	const [view, setView] = useState(0);
	const viewList = ['선호 지역 탐색 중 🗺', '여행 동선 설계 중 ✈', '수집 자료 정리 중 📑', '맞춤 성향 분석 중 ✍'];
	useEffect(() => {
		navigation.setOptions({
			headerBackVisible: false,
		});
	});
	useEffect(() => {
		var a = 0;
		const interval = setInterval(() => {
			console.log('네네네네');
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
			<LimitText>사용자가 많을 수록 시간이 오래 걸릴 수 있어요</LimitText>
			<MainText>{viewList[view]}</MainText>
		</LoadingTimetableContainer>
	);
}

const LoadingTimetableContainer = styled.View`
	align-items: center;
	background-color: ${colors.main};
	flex: 1;
`;
const LimitText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
`;
const AdImage = styled.Image`
	width: 342px;
	height: 400px;
`;
const BarContainer = styled.View`
	width: 80%;
	height: 10px;
	border-radius: 10px;
	background-color: ${colors.normalButton};
	margin: 10px 0px 10px 0px;
`;
const BarContinueContainer = styled.View<{size: number}>`
	width: ${props => props.size * 25 + 25}%;
	height: 10px;
	border-radius: 10px;
	background-color: ${colors.selectButton};
`;
