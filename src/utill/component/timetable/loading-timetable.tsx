import {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {MainText} from '../../layout/layout';

export default function LoadingTimetable({navigation}: any) {
	const [view, setView] = useState(0);
	const viewList: {title: string; image: string}[] = [
		{title: '선호 지역 탐색 중', image: 'http://danim.me/lee.jpeg'},
		{title: '여행 동선 설계 중', image: 'http://danim.me/moon.jpeg'},
		{title: '수집 자료 정리 중', image: 'http://danim.me/park.jpeg'},
		{title: '맞춤 성향 분석 중', image: 'http://danim.me/shin.jpeg'},
	];
	useEffect(() => {
		var a = 0;
		const interval = setInterval(() => {
			a += 1;
			setView(view => {
				return a;
			});
			a == viewList.length - 1 && clearInterval(interval);
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<LoadingTimetableContainer>
			<AdImage source={{uri: viewList[view].image}}></AdImage>
			<LimitText>사용자가 많을 수록 시간이 오래 걸릴 수 있어요</LimitText>
			<MainText>{viewList[view].title}</MainText>
		</LoadingTimetableContainer>
	);
}

const LoadingTimetableContainer = styled.View`
	align-items: center;
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
