import {useEffect, useRef, useState} from 'react';
import {PretendardBoldText, devicesWidth} from './layout/layout';
import styled from 'styled-components/native';
import {colors} from './colors';
import CustomButton from './component/custom-button';
import {heightPercentage, widthPercentage} from './layout/responsive-size';
import {Platform} from 'react-native';
import RouteButton from './component/route-button';
import {ButtonContainer} from '../screens/enroll-info/select-multi';
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
		{imagePath: require('../../public/viewPager/main1.png')},
		{imagePath: require('../../public/viewPager/main2.png')},
		{imagePath: require('../../public/viewPager/preset.png')},
		{imagePath: require('../../public/viewPager/timetable.png')},
		{imagePath: require('../../public/viewPager/afterTravel.png')},
		{imagePath: require('../../public/viewPager/modify.png')},
	]);
	const newPage = (e: any) => {
		setViewIndex(Math.round(e.nativeEvent.contentOffset.x / devicesWidth));
	};
	const handleNext = () => {
		// setViewIndex(prev => prev + 1);
		handleScroll(1);
	};
	const handleBack = () => {
		// setViewIndex(prev => prev + 1);
		handleScroll(-1);
	};
	const handleScroll = (e: number) => {
		scrollRef?.current?.scrollTo({x: (viewIndex + e) * widthPercentage(375)});
	};
	const scrollRef = useRef(null);
	useEffect(() => {
		if (timetable ?? false) {
			let copy = [...viewList];
			setViewList(copy.slice(2, 4));
		} else if (sliceNumber ?? false) {
			let copy = [...viewList];
			setViewList(copy.slice(0, sliceNumber));
		}
	}, []);
	return (
		<MainContainer>
			<Carousel
				nestedScrollEnabled={true}
				ref={scrollRef}
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
			<HStack deco={`position:absolute;bottom:${heightPercentage(60)}px;`}>
				<DotHStack>
					{[...Array(viewList.length)].map((value, index) => (
						<Dot key={index} size={viewIndex == index ? 20 : 10}></Dot>
					))}
				</DotHStack>
				{/* <CancelContainer onPress={handleFunction}>
					<PretendardBoldText size={20} lineHeight={26} color={colors.backgroundWhite}>
						닫기
					</PretendardBoldText>
				</CancelContainer> */}
			</HStack>
			{viewIndex == 0 ? (
				<CustomButton
					bgColor={colors.Primary}
					textColor={colors.Gray5}
					label='다음으로'
					onPress={handleNext}
					deco={`position: absolute; align-self: center; bottom: 10; width: ${widthPercentage(328)};`}
				/>
			) : (
				<RouteButton
					navigation={''}
					leftText={'이전으로'}
					LeftBtnFunction={handleBack}
					nextText={viewIndex == viewList.length - 1 ? '시작하기' : '다음으로'}
					btnFunction={viewIndex == viewList.length - 1 ? handleFunction : handleNext}></RouteButton>
			)}
		</MainContainer>
	);
}
const DotHStack = styled.View`
	flex-direction: row;
`;
const Carousel = styled.ScrollView``;
const HStack = styled.View<{deco: string}>`
	flex-direction: row;
	width: 100%;
	height: 10%;
	align-items: center;
	justify-content: center;
	${props => props.deco}
`;
const Dot = styled.View<{size: number}>`
	width: ${props => widthPercentage(props.size)}px;
	height: ${heightPercentage(10)}px;
	background-color: ${props => (props.size == 20 ? colors.Primary : 'white')};
	border-radius: 99px;
	margin: ${widthPercentage(5)}px;
`;
const CancelContainer = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	position: absolute;
	right: ${widthPercentage(20)}px;
`;
const MainContainer = styled.SafeAreaView`
	flex: 1;
	align-items: center;
	background-color: rgba(102, 102, 102, 1);
`;
const ImageAllContainer = styled.View<{scrollState: boolean}>`
	width: ${devicesWidth}px;
	align-items: center;
`;
const ImageContainer = styled.Image`
	width: ${widthPercentage(Platform.isPad ? 280 : 375)}px;
	height: 100%;
`;
