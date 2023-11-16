import {useEffect, useState} from 'react';
import {devicesHeight, devicesWidth} from './layout/layout';
import styled from 'styled-components/native';
import {colors} from './colors';
import CustomButton from './component/custom-button';
export default function ViewPager({handleFunction, timetable}: {handleFunction: any; timetable?: boolean}) {
	const [viewIndex, setViewIndex] = useState(0);
	const [viewList, setViewList] = useState([
		{imagePath: require('../../public/viewPager/home.png')},
		{imagePath: require('../../public/viewPager/travelList.png')},
		{imagePath: require('../../public/viewPager/timetable1.png')},
		{imagePath: require('../../public/viewPager/timetable2.png')},
	]);
	const newPage = (e: any) => {
		setViewIndex(Math.round(e.nativeEvent.contentOffset.x / devicesWidth));
		console.log(e.nativeEvent.contentOffset.x);
	};
	useEffect(() => {
		if (timetable ?? false) {
			let copy = [...viewList];
			setViewList(copy.slice(2, 4));
		}
	}, []);
	return (
		<MainContainer>
			<Carousel
				nestedScrollEnabled={true}
				pagingEnabled
				snapToInterval={devicesWidth}
				decelerationRate={'fast'}
				onScroll={e => {
					newPage(e);
				}}
				horizontal={true}
				showsHorizontalScrollIndicator={false}>
				{viewList.map((item, idx) => (
					<ImageAllContainer key={idx}>
						<ImageContainer source={item.imagePath}></ImageContainer>
					</ImageAllContainer>
				))}
			</Carousel>
			{viewIndex != viewList.length - 1 ? (
				<HStack>
					<DotHStack>
						{[...Array(viewList.length)].map((value, index) => (
							<Dot key={index} size={viewIndex == index ? 20 : 10}></Dot>
						))}
					</DotHStack>
					<CancelContainer onPress={handleFunction}>
						<SkipText>건너뛰기</SkipText>
					</CancelContainer>
				</HStack>
			) : (
				<CustomButton label={'시작하기'} onPress={handleFunction}></CustomButton>
			)}
		</MainContainer>
	);
}
const DotHStack = styled.View`
	flex-direction: row;
`;
const SkipText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: white;
`;
const Carousel = styled.ScrollView``;
const HStack = styled.View`
	flex-direction: row;
	width: 100%;
	height: 10%;
	align-items: center;
	justify-content: center;
`;
const Dot = styled.View<{size: number}>`
	width: ${props => props.size}px;
	height: 10px;
	background-color: ${props => (props.size == 20 ? colors.selectButton : 'white')};
	border-radius: 99px;
	margin: 5px;
`;
const CancelContainer = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 20px;
`;
const MainContainer = styled.SafeAreaView`
	flex: 1;
	align-items: center;
	background-color: rgba(122, 122, 122, 1);
`;
const ImageAllContainer = styled.View`
	width: ${devicesWidth * 0.8}px;
	margin: 0px ${devicesWidth * 0.1}px;
`;
const ImageContainer = styled.Image`
	width: 100%;
	height: 100%;
`;
