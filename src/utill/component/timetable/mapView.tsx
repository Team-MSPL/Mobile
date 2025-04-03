import {JSXElementConstructor, ReactElement, memo, useMemo} from 'react';
import {Platform} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Image} from 'react-native';
import {widthPercentage} from '../../layout/responsive-size';
import {PretendardSemiBoldText} from '../../layout/layout';
import {Circle} from '../../../screens/timetable/preset';
import {MarkerContainer} from '../../../screens/timetable/preset-detail';
import {colors} from '../../colors';

function CustomMapView({timetable, select, onTouchStart, onTouchEnd}) {
	// 메모리 최적화를 위해 useMemo 사용
	const {markers, polylines, centerLatitude, centerLongitude, latitudeDelta, longitudeDelta} = useMemo(() => {
		let positions: {latitude: number; longitude: number}[] = [];
		let markerElements: ReactElement[] = [];
		let polylineElements: ReactElement[] = [];

		timetable.forEach((value, index) => {
			const polylineCoordinates = value
				.map(item => {
					if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
						positions.push({latitude: item.lat, longitude: item.lng});
						return {latitude: item.lat, longitude: item.lng};
					}
					return null;
				})
				.filter(item => item !== null);

			value.forEach((item, idx) => {
				if (item.name !== '점심 추천' && item.name !== '저녁 추천' && item.name !== '숙소 추천') {
					// 고유한 key 생성 (index와 item.lat, item.lng을 조합)
					const markerKey = `marker_${index}_${item.lat}_${item.lng}`;

					markerElements.push(
						<Marker
							key={markerKey} // 고유한 key 사용
							coordinate={{latitude: item.lat, longitude: item.lng}}
							title={item.name}
							centerOffset={{x: 0, y: 0}}
							anchor={{x: 0.5, y: 0.5}}
							style={{zIndex: 4}}>
							{index === select ? (
								item.category === 4 ? (
									<Image
										source={require('../../../../public/images/hotel.png')}
										style={{
											width: widthPercentage(30),
											height: widthPercentage(30),
											zIndex: 200,
										}}
									/>
								) : item.category === 1 ? (
									<Image
										source={require('../../../../public/images/defalutFood.png')}
										style={{
											width: widthPercentage(30),
											height: widthPercentage(30),
											zIndex: 200,
										}}
									/>
								) : (
									<MarkerContainer key={markerKey}>
										<PretendardSemiBoldText
											size={13}
											lineHeight={19}
											color={colors.backgroundWhite}>
											{idx + 1}
										</PretendardSemiBoldText>
									</MarkerContainer>
								)
							) : (
								<Circle color={colors.Gray5} key={markerKey} style={{zIndex: 1}} />
							)}
						</Marker>,
					);
				}
			});

			polylineElements.push(
				<Polyline
					key={`polyline_${index}`}
					coordinates={polylineCoordinates}
					strokeColor={index === select ? colors.PointYellow : colors.Gray5}
					strokeWidth={Platform.isPad ? 5 : 2}
				/>,
			);
		});

		const minLatitude = Math.min(...positions.map(marker => marker.latitude));
		const maxLatitude = Math.max(...positions.map(marker => marker.latitude));
		const minLongitude = Math.min(...positions.map(marker => marker.longitude));
		const maxLongitude = Math.max(...positions.map(marker => marker.longitude));

		const centerLatitude = (maxLatitude + minLatitude) / 2;
		const centerLongitude = (maxLongitude + minLongitude) / 2;
		const deltaLatitude = maxLatitude - minLatitude;
		const deltaLongitude = maxLongitude - minLongitude;

		return {
			markers: markerElements,
			polylines: polylineElements,
			centerLatitude,
			centerLongitude,
			latitudeDelta: deltaLatitude + deltaLatitude + 0.02,
			longitudeDelta: deltaLongitude + deltaLongitude + 0.02,
		};
	}, [timetable, select]);

	return (
		<MapView
			showsMyLocationButton={true}
			style={{width: '100%', flex: 0.42}}
			showsUserLocation={true}
			onTouchStart={onTouchStart}
			onTouchEnd={() => {
				onTouchEnd;
				console.log(markers);
			}}
			region={{
				latitude: centerLatitude,
				longitude: centerLongitude,
				latitudeDelta: latitudeDelta,
				longitudeDelta: longitudeDelta,
			}}>
			{/* {markers} */}
			{polylines}
		</MapView>
	);
}

export default memo(CustomMapView);
