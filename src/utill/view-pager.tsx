import {useEffect, useState} from 'react';
import {devicesHeight, devicesWidth} from './layout/layout';
import styled from 'styled-components/native';
import {colors} from './colors';
import CustomButton from './component/custom-button';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
export default function ViewPager({
	handleFunction,
	timetable,
	sliceNumber,
	scrollState,
}: {
	handleFunction: any;
	timetable?: boolean;
	sliceNumber?: number;
	scrollState?: boolean;
}) {
	const [viewIndex, setViewIndex] = useState(0);
	const [viewList, setViewList] = useState([
		{imagePath: require('../../public/viewPager/main.png')},
		{imagePath: require('../../public/viewPager/preset.png')},
		{imagePath: require('../../public/viewPager/timetable.png')},
		{imagePath: require('../../public/viewPager/afterTravel.png')},
		{imagePath: require('../../public/viewPager/modify.png')},
	]);
	const newPage = (e: any) => {
		setViewIndex(Math.round(e.nativeEvent.contentOffset.x / devicesWidth));
	};
	useEffect(() => {
		console.log(sliceNumber);
		if (timetable ?? false) {
			let copy = [...viewList];
			setViewList(copy.slice(2, 4));
		} else if (sliceNumber ?? false) {
			console.log('qwe');
			let copy = [...viewList];
			setViewList(copy.slice(sliceNumber - 1, sliceNumber));
		}
	}, []);
	return (
		<MainContainer>
			<Carousel
				nestedScrollEnabled={true}
				pagingEnabled
				snapToInterval={devicesWidth}
				scrollEventThrottle={200}
				decelerationRate={'fast'}
				disableIntervalMomentum={true}
				onScroll={e => {
					newPage(e);
				}}
				horizontal={true}
				showsHorizontalScrollIndicator={false}>
				{viewList.map((item, idx) => (
					<ImageAllContainer key={idx} scrollState={scrollState ?? false}>
						<ImageContainer resizeMode='stretch' source={item.imagePath}></ImageContainer>
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
						<SkipText>닫기</SkipText>
					</CancelContainer>
				</HStack>
			) : (
				<CustomButton
					label={scrollState ? '닫기' : '시작하기'}
					onPress={handleFunction}
					marginBottom={10}></CustomButton>
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
	background-color: ${props => (props.size == 20 ? colors.Primary : 'white')};
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
	background-color: rgba(102, 102, 102, 1);
`;
const ImageAllContainer = styled.View<{scrollState: boolean}>`
	width: ${devicesWidth}px;
	align-items: center;
	margin-bottom: ${heightPercentage(10)}px;
`;
const ImageContainer = styled.Image`
	width: ${widthPercentage(327)}px;
	height: 100%;
`;
