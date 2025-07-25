import {JSXElementConstructor, ReactElement, memo, startTransition, useEffect, useMemo} from 'react';
import {Platform} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Image} from 'react-native';
import {widthPercentage} from '../../layout/responsive-size';
import {PretendardSemiBoldText} from '../../layout/layout';
import {MarkerContainer} from '../../../screens/timetable/preset-detail';
import {colors} from '../../colors';
import {useAppSelector} from '../../../redux';
import styled from 'styled-components/native';
import {cityViewList} from '../enroll-info/city-list';

function CustomMapView({select, onTouchStart, onTouchEnd}) {
	// 메모리 최적화를 위해 useMemo 사
	const {timetable, country, cityIndex} = useAppSelector(state => state.travelSlice);
	const {imageList} = useMemo(() => {
		let images = [];
		let markerElements: ReactElement[] = [];
		timetable[select]?.forEach((item, idx) => {
			if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
				// 고유한 key 생성 (index와 item.lat, item.lng을 조합)
				const markerKey = `marker_${item.lat}_${item.lng}`;

				markerElements.push(
					<Marker
						key={markerKey} // 고유한 key 사용
						coordinate={{latitude: item.lat, longitude: item.lng}}
						tracksViewChanges={false}
						title={item.name}
						centerOffset={{x: 0, y: 0}}
						anchor={{x: 0.5, y: 0.5}}
						style={{zIndex: 4}}>
						{item.category === 4 || item.category === 1 ? (
							<Image
								source={
									item.category === 4
										? require('../../../../public/images/hotel.png')
										: require('../../../../public/images/defalutFood.png')
								}
								style={{
									width: widthPercentage(30),
									height: widthPercentage(30),
									zIndex: 200,
								}}
							/>
						) : (
							<MarkerContainer key={markerKey}>
								<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
									{idx + 1}
								</PretendardSemiBoldText>
							</MarkerContainer>
						)}
					</Marker>,
				);
			}
		});
		// Array(timetable.length)
		// 	.fill(1)
		// 	.forEach((testItem, testIdx) => {
		// 		let markerElements: ReactElement[] = [];
		// 		timetable?.forEach((value, index) => {
		// 			value?.forEach((item, idx) => {
		// 				if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
		// 					// 고유한 key 생성 (index와 item.lat, item.lng을 조합)
		// 					const markerKey = `marker_${index}_${item.lat}_${item.lng}`;
		// 					{
		// 						index === testIdx &&
		// 							markerElements.push(
		// 								<Marker
		// 									key={markerKey} // 고유한 key 사용
		// 									coordinate={{latitude: item.lat, longitude: item.lng}}
		// 									tracksViewChanges={false}
		// 									title={item.name}
		// 									centerOffset={{x: 0, y: 0}}
		// 									anchor={{x: 0.5, y: 0.5}}
		// 									style={{zIndex: 4}}>
		// 									{index === testIdx ? (
		// 										item.category === 4 || item.category === 1 ? (
		// 											<Image
		// 												source={
		// 													item.category === 4
		// 														? require('../../../../public/images/hotel.png')
		// 														: require('../../../../public/images/defalutFood.png')
		// 												}
		// 												style={{
		// 													width: widthPercentage(30),
		// 													height: widthPercentage(30),
		// 													zIndex: 200,
		// 												}}
		// 											/>
		// 										) : (
		// 											<MarkerContainer key={markerKey}>
		// 												<PretendardSemiBoldText
		// 													size={13}
		// 													lineHeight={19}
		// 													color={colors.backgroundWhite}>
		// 													{idx + 1}
		// 												</PretendardSemiBoldText>
		// 											</MarkerContainer>
		// 										)
		// 									) : (
		// 										<Circle color={colors.Gray5} key={markerKey} />
		// 									)}
		// 								</Marker>,
		// 							);
		// 					}
		// 				}
		// 			});
		// 		});
		// 		images.push(markerElements);
		// 	});
		return {
			imageList: markerElements,
		};
	}, [timetable, select]);
	const {polylines, centerLatitude, centerLongitude, latitudeDelta, longitudeDelta} = useMemo(() => {
		let positions: {latitude: number; longitude: number}[] = [];
		let polylineElements: ReactElement[] = [];

		timetable?.forEach((value, index) => {
			if (index == select) {
				const polylineCoordinates = value
					.map(item => {
						if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
							positions.push({latitude: item.lat, longitude: item.lng});
							return {latitude: item.lat, longitude: item.lng};
						}
						return null;
					})
					.filter(item => item !== null);

				polylineElements.push(
					<Polyline
						key={`polyline_${index}`}
						coordinates={polylineCoordinates}
						strokeColor={index === select ? colors.PointYellow : colors.Gray5}
						strokeWidth={Platform.isPad ? 5 : 2}
					/>,
				);
			}
			// if (!value || value.length === 0 || index != select) {
			// 	polylineElements.push([]);
			// } else {
			// 	const polylineCoordinates = value
			// 		.map(item => {
			// 			if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
			// 				positions.push({latitude: item.lat, longitude: item.lng});
			// 				return {latitude: item.lat, longitude: item.lng};
			// 			}
			// 			return null;
			// 		})
			// 		.filter(item => item !== null);

			// 	polylineElements.push(
			// 		<Polyline
			// 			key={`polyline_${index}`}
			// 			coordinates={polylineCoordinates}
			// 			strokeColor={index === select ? colors.PointYellow : colors.Gray5}
			// 			strokeWidth={Platform.isPad ? 5 : 2}
			// 		/>,
			// 	);
			// }
		});

		const minLatitude = Math.min(...positions?.map(marker => marker.latitude));
		const maxLatitude = Math.max(...positions?.map(marker => marker.latitude));
		const minLongitude = Math.min(...positions?.map(marker => marker.longitude));
		const maxLongitude = Math.max(...positions?.map(marker => marker.longitude));

		const centerLatitude = (maxLatitude + minLatitude) / 2;
		const centerLongitude = (maxLongitude + minLongitude) / 2;
		const deltaLatitude = maxLatitude - minLatitude;
		const deltaLongitude = maxLongitude - minLongitude;
		return {
			polylines: polylineElements,
			centerLatitude,
			centerLongitude,
			latitudeDelta: deltaLatitude + deltaLatitude + 0.04,
			longitudeDelta: deltaLongitude + deltaLongitude + 0.04,
		};
	}, [timetable, select]);

	return (
		<MapView
			showsMyLocationButton={true}
			style={{width: '100%', flex: onTouchStart ? 0.42 : 1}}
			showsUserLocation={true}
			onTouchStart={onTouchStart ?? null}
			onTouchEnd={onTouchEnd ?? null}
			region={{
				latitude: (isNaN(centerLatitude) ? cityViewList[country][cityIndex].sub[0].lat : centerLatitude) - 0.03,
				longitude: isNaN(centerLongitude) ? cityViewList[country][cityIndex].sub[0].lng : centerLongitude,
				latitudeDelta: latitudeDelta <= 0 ? 0.13 : latitudeDelta,
				longitudeDelta: longitudeDelta <= 0 ? 0.13 : longitudeDelta,
			}}>
			{imageList}
			{polylines}
		</MapView>
	);
}

export default memo(CustomMapView);
const Circle = styled.View<{color: string}>`
	width: ${widthPercentage(10)}px;
	height: ${widthPercentage(10)}px;
	border-radius: 99px;
	background-color: ${props => props.color};
	z-index: 2;
`;

//TODO 타임테이블 네이버지도ui
// import {JSXElementConstructor, ReactElement, memo, startTransition, useEffect, useMemo} from 'react';
// import {Platform} from 'react-native';
// import MapView, {Marker, Polyline} from 'react-native-maps';
// import {Image} from 'react-native';
// import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
// import {PretendardSemiBoldText} from '../../layout/layout';
// import {MarkerContainer} from '../../../screens/timetable/preset-detail';
// import {colors} from '../../colors';
// import {useAppSelector} from '../../../redux';
// import styled from 'styled-components/native';

// function CustomMapView({select, onTouchStart, onTouchEnd}) {
// 	// 메모리 최적화를 위해 useMemo 사
// 	const {timetable} = useAppSelector(state => state.travelSlice);
// 	const {imageList} = useMemo(() => {
// 		let images = [];
// 		Array(timetable.length)
// 			.fill(1)
// 			.forEach((testItem, testIdx) => {
// 				let markerElements: ReactElement[] = [];
// 				timetable.forEach((value, index) => {
// 					value.forEach((item, idx) => {
// 						if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
// 							// 고유한 key 생성 (index와 item.lat, item.lng을 조합)
// 							const markerKey = `marker_${index}_${item.lat}_${item.lng}`;

// 							markerElements.push(
// 								<Marker
// 									key={markerKey} // 고유한 key 사용
// 									coordinate={{latitude: item.lat, longitude: item.lng}}
// 									tracksViewChanges={false}
// 									title={item.name}
// 									centerOffset={{x: 0, y: 0}}
// 									anchor={{x: 0.5, y: 0.5}}
// 									style={{zIndex: 4}}>
// 									{index === testIdx ? (
// 										item.category === 4 || item.category === 1 ? (
// 											<Image
// 												source={
// 													item.category === 4
// 														? require('../../../../public/images/hotel.png')
// 														: require('../../../../public/images/defalutFood.png')
// 												}
// 												style={{
// 													width: widthPercentage(30),
// 													height: widthPercentage(30),
// 													zIndex: 200,
// 												}}
// 											/>
// 										) : (
// 											<MarkerContainer key={markerKey}>
// 												<PretendardSemiBoldText
// 													size={13}
// 													lineHeight={19}
// 													color={colors.backgroundWhite}>
// 													{idx + 1}
// 												</PretendardSemiBoldText>
// 											</MarkerContainer>
// 										)
// 									) : (
// 										// <MarkerContainer key={markerKey}>
// 										// 	<PretendardSemiBoldText
// 										// 		size={13}
// 										// 		lineHeight={19}
// 										// 		color={colors.backgroundWhite}>
// 										// 		{idx + 21}
// 										// 	</PretendardSemiBoldText>
// 										// </MarkerContainer>
// 										<Circle color={colors.Gray5} key={markerKey} />
// 									)}
// 								</Marker>,
// 							);
// 						}
// 					});
// 				});
// 				images.push(markerElements);
// 			});
// 		return {
// 			imageList: images,
// 		};
// 	}, [timetable]);
// 	const {polylines, centerLatitude, centerLongitude, latitudeDelta, longitudeDelta} = useMemo(() => {
// 		let positions: {latitude: number; longitude: number}[] = [];
// 		let polylineElements: ReactElement[] = [];

// 		timetable.forEach((value, index) => {
// 			const polylineCoordinates = value
// 				.map(item => {
// 					if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
// 						positions.push({latitude: item.lat, longitude: item.lng});
// 						return {latitude: item.lat, longitude: item.lng};
// 					}
// 					return null;
// 				})
// 				.filter(item => item !== null);

// 			polylineElements.push(
// 				<Polyline
// 					key={`polyline_${index}`}
// 					coordinates={polylineCoordinates}
// 					strokeColor={index === select ? colors.PointYellow : colors.Gray5}
// 					strokeWidth={Platform.isPad ? 5 : 2}
// 				/>,
// 			);
// 		});

// 		const minLatitude = Math.min(...positions.map(marker => marker.latitude));
// 		const maxLatitude = Math.max(...positions.map(marker => marker.latitude));
// 		const minLongitude = Math.min(...positions.map(marker => marker.longitude));
// 		const maxLongitude = Math.max(...positions.map(marker => marker.longitude));

// 		const centerLatitude = (maxLatitude + minLatitude) / 2;
// 		const centerLongitude = (maxLongitude + minLongitude) / 2;
// 		const deltaLatitude = maxLatitude - minLatitude;
// 		const deltaLongitude = maxLongitude - minLongitude;

// 		return {
// 			polylines: polylineElements,
// 			centerLatitude,
// 			centerLongitude,
// 			latitudeDelta: deltaLatitude + deltaLatitude + 0.02,
// 			longitudeDelta: deltaLongitude + deltaLongitude + 0.02,
// 		};
// 	}, [timetable, select]);

// 	return (
// 		<MapView
// 			showsMyLocationButton={true}
// 			style={{width: '100%', height: heightPercentage(812), position: 'absolute', top: 0}}
// 			showsUserLocation={true}
// 			onTouchStart={onTouchStart ?? null}
// 			onTouchEnd={onTouchEnd ?? null}
// 			region={{
// 				latitude: centerLatitude,
// 				longitude: centerLongitude,
// 				latitudeDelta: latitudeDelta,
// 				longitudeDelta: longitudeDelta,
// 			}}>
// 			{imageList[select]}
// 			{polylines}
// 		</MapView>
// 	);
// }

// export default memo(CustomMapView);
// const Circle = styled.View<{color: string}>`
// 	width: ${widthPercentage(10)}px;
// 	height: ${widthPercentage(10)}px;
// 	border-radius: 99px;
// 	background-color: ${props => props.color};
// 	z-index: 2;
// `;
