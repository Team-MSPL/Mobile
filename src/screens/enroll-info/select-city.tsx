import {ScrollView} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getRegionInfo, travelSliceActions} from '../../redux/travel-info/travel.slice';

import {BackgroundGray, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import {colors} from '../../utill/colors';
import {SvgCancel} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';

import Stepper from '../../utill/component/enroll-info/stepper';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useEffect} from 'react';
import {logEvent} from '../../../firebaseAnalytice';
import RouteButton from '../../utill/component/route-button';
export default function SelectCity({navigation}: any) {
	const {region, cityIndex, cityDistance} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const checkList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];
	const selectPopularity = (e: {id: number; subTitle: string; subId: number}) => {
		dispatch(
			travelSliceActions.selectPopularity({
				region: checkList.includes(e.subTitle) ? ['전체'] : [e.subTitle],
				cityIndex: e.id,
				cityDistance: [e.subId],
			}),
		);
	};
	const selectRegion = (e: any) => {
		if (e.subTitle === '전체' || region.includes('전체')) {
			dispatch(travelSliceActions.firstSelectRegion({region: [e.subTitle], cityDistance: [e.id]}));
		} else if (region.includes(e.subTitle)) {
			const copy = region.filter(item => item !== e.subTitle);
			const copyIndex = cityDistance.filter(item => item !== e.id);
			copy.length == 0 && dispatch(travelSliceActions.changeChecKStep(3));
			dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
		} else {
			let copy = [...region];
			copy.push(e.subTitle);
			let copyIndex = [...cityDistance];
			copyIndex.push(e.id);
			dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
		}
	};

	const deleteRegion = (e: string) => {
		let searchIndex = region.findIndex(item => item == e);
		let copy = [...region];
		let copyIndex = [...cityDistance];
		copy.splice(searchIndex, 1);
		copyIndex.splice(searchIndex, 1);
		copy.length == 0 && dispatch(travelSliceActions.changeChecKStep(3));
		dispatch(travelSliceActions.firstSelectRegion({region: copy, cityDistance: copyIndex}));
	};

	const selectCity = (e: number) => {
		if (region) {
			dispatch(travelSliceActions.selectRegion([]));
		}
		dispatch(travelSliceActions.enrollCityIndex(e));
	};

	const goNext = () => {
		if (region.length == 0) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '지역을 선택해주세요.'}));
		} else {
			navigation.navigate('SelectDay');
			dispatch(
				getRegionInfo({region: cityViewList[cityIndex].title + (region[0] != '전체' ? ' ' + region[0] : '')}),
			);
		}
	};
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step2', {})
			: await logEvent('course_step2', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	return (
		<BackgroundGray>
			<Stepper total={11} now={2}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 계획을 알려주세요.'
				mainText='어디로 떠나시나요?'></StepText>
			<Container>
				<SelectAllContainer>
					<SelectListContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						{region?.map((item, regionIndex) => {
							return (
								<RegionElementContainer key={regionIndex} onPress={() => deleteRegion(item)}>
									<PretendardSemiBoldText size={14} lineHeight={18.9} color={colors.backgroundWhite}>
										{item == '전체' ? cityViewList[cityIndex].title + ' ' + item : item}
									</PretendardSemiBoldText>
									<SvgCancel
										width={widthPercentage(12)}
										height={widthPercentage(12)}
										color={colors.Primary}
									/>
								</RegionElementContainer>
							);
						})}
					</SelectListContainer>
				</SelectAllContainer>
				<ScrollView horizontal={true} nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
					{cityViewList.map((item, idx) => {
						return (
							<RegionItems
								key={idx}
								select={cityIndex == item.id}
								onPress={() => {
									selectCity(item.id);
								}}>
								<PretendardSemiBoldText
									size={14}
									lineHeight={18.9}
									color={cityIndex == item.id ? colors.backgroundWhite : colors.Gray5}>
									{item.title}
								</PretendardSemiBoldText>
							</RegionItems>
						);
					})}
				</ScrollView>
				<WrapContainer>
					{cityViewList[cityIndex]?.sub.map((item, idx) => {
						return (
							<CityItems
								key={idx}
								select={region.includes(item.subTitle)}
								onPress={() => {
									cityIndex == 0 ? selectPopularity(item) : selectRegion(item);
								}}>
								<PretendardSemiBoldText
									size={14}
									lineHeight={18.9}
									color={region.includes(item.subTitle) ? colors.Gray5 : colors.Gray3}>
									{item.subTitle}
								</PretendardSemiBoldText>
							</CityItems>
						);
					})}
				</WrapContainer>
			</Container>
			{cityIndex == 1 && (
				<FlexContainer>
					<SeoulContainer>
						{cityViewList[1].sub.map((item, idx) => {
							return idx != 0 ? (
								<SeoulInsideAllContainer key={idx}>
									<SeoulInsideContainer width={widthPercentage(125)}>
										<PretendardVariableText size={12} lineHeight={16.2} color={colors.Gray4}>
											{item.subTitle}
										</PretendardVariableText>
									</SeoulInsideContainer>
									<SeoulInsideContainer width={widthPercentage(181)}>
										<PretendardVariableText size={12} lineHeight={16.2} color={colors.Gray2}>
											{item.example}
										</PretendardVariableText>
									</SeoulInsideContainer>
								</SeoulInsideAllContainer>
							) : null;
						})}
					</SeoulContainer>
				</FlexContainer>
			)}
			<RouteButton navigation={navigation} nextTitle='SelectMulti' goNext={goNext}></RouteButton>
		</BackgroundGray>
	);
}
const FlexContainer = styled.View`
	flex: 1;
	justify-content: center;
`;
const SeoulContainer = styled.View`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(199)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 12px;
	align-self: center;
	justify-content: center;
	padding: ${widthPercentage(10)}px;
	bottom: 0;
`;
const SeoulInsideAllContainer = styled.View`
	width: ${widthPercentage(316)}px;
	flex-direction: row;
	margin-top: ${heightPercentage(10)}px;
`;
const SeoulInsideContainer = styled.View<{width: number}>`
	width: ${props => props.width}px;
	align-items: start;
`;
const Container = styled.View`
	gap: ${heightPercentage(20)}px;
`;
const WrapContainer = styled.View`
	width: ${widthPercentage(327)}px;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${widthPercentage(10)}px;
`;
const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	padding: ${heightPercentage(5)}px ${widthPercentage(8)}px;
	background-color: ${props => (props.select ? colors.Gray5 : colors.backgroundGray)};
	border-radius: 99px;
`;
const CityItems = styled(RegionItems)`
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundWhite)};
	border-width: 1px;
	border-color: ${props => (props.select ? colors.backgroundWhite : colors.Gray3)};
	flex-direction: row;
`;
const RegionElementContainer = styled.TouchableOpacity`
	background-color: ${colors.Gray5};
	border-radius: 99px;
	padding: ${heightPercentage(5)}px ${widthPercentage(8)}px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: ${widthPercentage(4)}px;
	margin-right: ${widthPercentage(6)}px;
`;
const SelectListContainer = styled.ScrollView`
	width: 100%;
`;
const SelectAllContainer = styled.View`
	width: 100%;
	height: ${heightPercentage(30)}px;
`;
export const cityViewList = [
	{
		id: 0,
		title: '인기',
		sub: [
			{id: 1, subId: 0, subTitle: '서울'},
			{id: 2, subId: 0, subTitle: '부산'},
			{id: 17, subId: 0, subTitle: '제주'},
			{id: 4, subId: 0, subTitle: '인천'},
			{id: 3, subId: 0, subTitle: '대구'},
			{id: 5, subId: 0, subTitle: '광주'},
			{id: 6, subId: 0, subTitle: '대전'},
			{id: 7, subId: 0, subTitle: '울산'},
			{id: 10, subId: 1, subTitle: '강릉시'},
			{id: 10, subId: 5, subTitle: '속초시'},
			{id: 15, subId: 2, subTitle: '경주시'},
			{id: 15, subId: 21, subTitle: '포항시'},
			{id: 14, subId: 13, subTitle: '여수시'},
		],
	},
	{
		id: 1,
		title: '서울',
		sub: [
			{id: 0, subTitle: '전체', lat: 37.5518911, lng: 126.9917937},
			{id: 1, subTitle: '도심권', example: '종로구,중구,용산구', lat: 37.5658049, lng: 126.9751461},
			{id: 2, subTitle: '동남권', example: '강남구,서초구,송파구', lat: 37.497952, lng: 127.027619},
			{
				id: 3,
				subTitle: '동북권',
				example: '강북구,도봉구,노원구,성북구,동대문구,중랑구,성동구,광진구',
				lat: 37.6105288,
				lng: 127.0563905,
			},
			{
				id: 4,
				subTitle: '서남권',
				example: '강서구,양천구,구로구,영등포구,동작구,관악구,금천구',
				lat: 37.5360367,
				lng: 126.8745334,
			},
			{id: 5, subTitle: '서북권', example: '은평구,서대문구,마포구', lat: 37.5663937, lng: 126.9387066},
		],
	},
	{id: 2, title: '부산', sub: [{id: 0, subTitle: '전체', lat: 35.2100142, lng: 129.0688702}]},
	{id: 3, title: '대구', sub: [{id: 0, subTitle: '전체', lat: 35.8294374, lng: 128.5655119}]},
	{id: 4, title: '인천', sub: [{id: 0, subTitle: '전체', lat: 37.4562557, lng: 126.7052062}]},
	{id: 5, title: '광주', sub: [{id: 0, subTitle: '전체', lat: 35.1557358, lng: 126.8354271}]},
	{id: 6, title: '대전', sub: [{id: 0, subTitle: '전체', lat: 36.3398175, lng: 127.3940486}]},
	{id: 7, title: '울산', sub: [{id: 0, subTitle: '전체', lat: 35.5537228, lng: 129.2380554}]},
	{id: 8, title: '세종', sub: [{id: 0, subTitle: '전체', lat: 36.5606976, lng: 127.2587334}]},
	{
		id: 9,
		title: '경기',
		sub: [
			{id: 0, subTitle: '전체', lat: 37.8184719, lng: 127.4502156},
			{id: 1, subTitle: '가평군', lat: 37.8184719, lng: 127.4502156},
			{id: 2, subTitle: '고양시', lat: 37.6650719, lng: 126.8369961},
			{id: 3, subTitle: '과천시', lat: 37.4338294, lng: 127.0027656},
			{id: 4, subTitle: '광명시', lat: 37.4451612, lng: 126.8646989},
			{id: 5, subTitle: '광주시', lat: 37.40308539999999, lng: 127.3011624},
			{id: 6, subTitle: '구리시', lat: 37.5990186, lng: 127.1313079},
			{id: 7, subTitle: '군포시', lat: 37.3434691, lng: 126.9211003},
			{id: 8, subTitle: '김포시', lat: 37.6818227, lng: 126.6265338},
			{id: 9, subTitle: '남양주시', lat: 37.6625097, lng: 127.2436632},
			{id: 10, subTitle: '동두천시', lat: 37.916543, lng: 127.0779171},
			{id: 11, subTitle: '부천시', lat: 37.5042687, lng: 126.7886531},
			{id: 12, subTitle: '성남시', lat: 37.4073695, lng: 127.1162181},
			{id: 13, subTitle: '수원시', lat: 37.2803896, lng: 127.0077847},
			{id: 14, subTitle: '시흥시', lat: 37.3864796, lng: 126.7841675},
			{id: 15, subTitle: '안산시', lat: 37.3218778, lng: 126.8308848},
			{id: 16, subTitle: '안성시', lat: 37.0350330000001, lng: 127.3027301},
			{id: 17, subTitle: '안양시', lat: 37.4027313, lng: 126.9279179},
			{id: 18, subTitle: '양주시', lat: 37.8086632, lng: 127.001143},
			{id: 19, subTitle: '양평군', lat: 37.5180465, lng: 127.5792445},
			{id: 20, subTitle: '여주시', lat: 37.3024585, lng: 127.6157502},
			{id: 21, subTitle: '연천군', lat: 38.0964416, lng: 127.0275846},
			{id: 22, subTitle: '오산시', lat: 37.1632991, lng: 127.0513324},
			{id: 23, subTitle: '용인시', lat: 37.2214872, lng: 127.2218612},
			{id: 24, subTitle: '의왕시', lat: 37.3624626, lng: 126.9896996},
			{id: 25, subTitle: '의정부시', lat: 37.7361884, lng: 127.0684356},
			{id: 26, subTitle: '이천시', lat: 37.2097769, lng: 127.4810494},
			{id: 27, subTitle: '파주시', lat: 37.85242440000001, lng: 126.8115232},
			{id: 28, subTitle: '평택시', lat: 37.0159677, lng: 126.9941853},
			{id: 29, subTitle: '포천시', lat: 37.9697852, lng: 127.2502925},
			{id: 30, subTitle: '하남시', lat: 37.5228824, lng: 127.2059921},
			{id: 31, subTitle: '화성시', lat: 37.1616306, lng: 126.8654604},
		],
	},
	{
		id: 10,
		title: '강원',
		sub: [
			{id: 0, subTitle: '전체', lat: 37.7091295, lng: 128.8324462},
			{id: 1, subTitle: '강릉시', lat: 37.7091295, lng: 128.8324462},
			{id: 2, subTitle: '고성군', lat: 38.3773762, lng: 128.3997526},
			{id: 3, subTitle: '동해시', lat: 37.5067666, lng: 129.0555852},
			{id: 4, subTitle: '삼척시', lat: 37.2773968, lng: 129.1220028},
			{id: 5, subTitle: '속초시', lat: 38.17601, lng: 128.5194615},
			{id: 6, subTitle: '양구군', lat: 38.178176, lng: 128.001272},
			{id: 7, subTitle: '양양군', lat: 38.0045219, lng: 128.5950959},
			{id: 8, subTitle: '영월군', lat: 37.2039413, lng: 128.500649},
			{id: 9, subTitle: '원주시', lat: 37.3082307, lng: 127.9294889},
			{id: 10, subTitle: '인제군', lat: 38.0688048, lng: 128.263324},
			{id: 11, subTitle: '정선군', lat: 37.378668, lng: 128.7390494},
			{id: 12, subTitle: '철원군', lat: 38.2434576, lng: 127.4141162},
			{id: 13, subTitle: '춘천시', lat: 37.8897796, lng: 127.7398952},
			{id: 14, subTitle: '태백시', lat: 37.1722939, lng: 128.9800161},
			{id: 15, subTitle: '평창군', lat: 37.556735, lng: 128.4826261},
			{id: 16, subTitle: '홍천군', lat: 37.7450683, lng: 128.0742344},
			{id: 17, subTitle: '화천군', lat: 38.1383179, lng: 127.6849292},
			{id: 18, subTitle: '횡성군', lat: 37.5089632, lng: 128.0770982},
		],
	},
	{
		id: 11,
		title: '충북',
		sub: [
			{id: 0, subTitle: '전체', lat: 36.7697608, lng: 127.8294253},
			{id: 1, subTitle: '괴산군', lat: 36.7697608, lng: 127.8294253},
			{id: 2, subTitle: '단양군', lat: 36.9941896, lng: 128.3877555},
			{id: 3, subTitle: '보은군', lat: 36.4899504, lng: 127.729342},
			{id: 4, subTitle: '영동군', lat: 36.1597002, lng: 127.8142287},
			{id: 5, subTitle: '옥천군', lat: 36.3203938, lng: 127.6566592},
			{id: 6, subTitle: '음성군', lat: 36.9761637, lng: 127.6142294},
			{id: 7, subTitle: '제천시', lat: 37.0597328, lng: 127.141005},
			{id: 8, subTitle: '진천군', lat: 36.8708978, lng: 127.4405915},
			{id: 9, subTitle: '청주시', lat: 36.6272962, lng: 127.498731},
			{id: 10, subTitle: '충주시', lat: 36.0151461, lng: 127.8956693},
			{id: 11, subTitle: '증평군', lat: 36.7864783, lng: 127.6046068},
		],
	},
	{
		id: 12,
		title: '충남',
		sub: [
			{id: 0, subTitle: '전체', lat: 36.2915841, lng: 127.2344325},
			{id: 1, subTitle: '계룡시', lat: 36.2915841, lng: 127.2344325},
			{id: 2, subTitle: '공주시', lat: 36.47982, lng: 127.0752196},
			{id: 3, subTitle: '금산군', lat: 36.1190235, lng: 127.4782791},
			{id: 4, subTitle: '논산시', lat: 36.1908784, lng: 127.1577341},
			{id: 5, subTitle: '당진시', lat: 36.9023743, lng: 126.6545022},
			{id: 6, subTitle: '보령시', lat: 36.3331629, lng: 126.6129441},
			{id: 7, subTitle: '부여군', lat: 36.2463459, lng: 126.856897},
			{id: 8, subTitle: '서산시', lat: 36.7844993, lng: 126.4503169},
			{id: 9, subTitle: '서천군', lat: 36.0803312, lng: 126.6913277},
			{id: 10, subTitle: '아산시', lat: 36.8073191, lng: 126.980066},
			{id: 11, subTitle: '예산군', lat: 36.6706373, lng: 126.7843178},
			{id: 12, subTitle: '천안시', lat: 36.804138, lng: 127.2025586},
			{id: 13, subTitle: '청양군', lat: 36.4307266, lng: 126.8529299},
			{id: 14, subTitle: '태안군', lat: 36.7456421, lng: 126.2980528},
			{id: 15, subTitle: '홍성군', lat: 36.5697577, lng: 126.6253106},
		],
	},
	{
		id: 13,
		title: '전북',
		sub: [
			{id: 0, subTitle: '전체', lat: 35.4358216, lng: 126.7020806},
			{id: 1, subTitle: '고창군', lat: 35.4358216, lng: 126.7020806},
			{id: 2, subTitle: '군산시', lat: 35.9676772, lng: 126.7366293},
			{id: 3, subTitle: '김제시', lat: 35.8068736, lng: 126.8961044},
			{id: 4, subTitle: '남원시', lat: 35.4225506, lng: 127.4418975},
			{id: 5, subTitle: '무주군', lat: 35.9393652, lng: 127.7129454},
			{id: 6, subTitle: '부안군', lat: 35.7315661, lng: 126.7334651},
			{id: 7, subTitle: '순창군', lat: 35.4336326, lng: 127.0899527},
			{id: 8, subTitle: '완주군', lat: 35.9226113, lng: 127.2229862},
			{id: 9, subTitle: '익산시', lat: 36.0230799, lng: 126.9894962},
			{id: 10, subTitle: '임실군', lat: 35.5981956, lng: 127.2366461},
			{id: 11, subTitle: '장수군', lat: 35.6574424, lng: 127.5441988},
			{id: 12, subTitle: '전주시', lat: 35.8280463, lng: 127.1160156},
			{id: 13, subTitle: '정읍시', lat: 35.6026273, lng: 126.9058607},
			{id: 14, subTitle: '진안군', lat: 35.8287825, lng: 127.4300174},
		],
	},
	{
		id: 14,
		title: '전남',
		sub: [
			{id: 0, subTitle: '전체', lat: 34.6205005, lng: 126.7721492},
			{id: 1, subTitle: '강진군', lat: 34.6205005, lng: 126.7721492},
			{id: 2, subTitle: '고흥군', lat: 34.6112219, lng: 127.284978},
			{id: 3, subTitle: '곡성군', lat: 35.2166181, lng: 127.2635881},
			{id: 4, subTitle: '광양시', lat: 35.0286487, lng: 127.6494094},
			{id: 5, subTitle: '구례군', lat: 35.2369475, lng: 127.5030874},
			{id: 6, subTitle: '나주시', lat: 34.9883585, lng: 126.7201733},
			{id: 7, subTitle: '담양군', lat: 35.291486, lng: 126.9952909},
			{id: 8, subTitle: '목포시', lat: 34.8118351, lng: 126.3921664},
			{id: 9, subTitle: '무안군', lat: 34.9904519999999, lng: 126.4816856},
			{id: 10, subTitle: '보성군', lat: 34.8144789, lng: 127.1607138},
			{id: 11, subTitle: '순천시', lat: 34.99465670000001, lng: 127.3894958},
			{id: 12, subTitle: '신안군', lat: 34.827332, lng: 126.101074},
			{id: 13, subTitle: '여수시', lat: 34.7603737, lng: 127.6622221},
			{id: 14, subTitle: '영광군', lat: 35.2771719, lng: 126.5119874},
			{id: 15, subTitle: '영암군', lat: 34.7957261, lng: 126.6235896},
			{id: 16, subTitle: '완도군', lat: 34.3110596, lng: 126.7550541},
			{id: 17, subTitle: '장성군', lat: 35.32963850000001, lng: 127.7685447},
			{id: 18, subTitle: '장흥군', lat: 35.6816856, lng: 126.9069278},
			{id: 19, subTitle: '진도군', lat: 34.4868712, lng: 126.2634853},
			{id: 20, subTitle: '함평군', lat: 35.1126823, lng: 126.5355523},
			{id: 21, subTitle: '해남군', lat: 34.5732516, lng: 126.5989274},
			{id: 22, subTitle: '화순군', lat: 35.0081798, lng: 127.0334394},
		],
	},
	{
		id: 15,
		title: '경북',
		sub: [
			{id: 0, subTitle: '전체', lat: 35.8337972, lng: 128.8090748},
			{id: 1, subTitle: '경산시', lat: 35.8337972, lng: 128.8090748},
			{id: 2, subTitle: '경주시', lat: 35.8266161, lng: 129.235988},
			{id: 3, subTitle: '고령군', lat: 35.7370027, lng: 128.3055253},
			{id: 4, subTitle: '구미시', lat: 36.207309, lng: 128.3555532},
			{id: 5, subTitle: '김천시', lat: 36.0603835, lng: 128.0777247},
			{id: 6, subTitle: '문경시', lat: 36.6910006, lng: 128.1488468},
			{id: 7, subTitle: '봉화군', lat: 36.9341307, lng: 128.9128821},
			{id: 8, subTitle: '상주시', lat: 36.4295654, lng: 128.0669313},
			{id: 9, subTitle: '성주군', lat: 35.9071362, lng: 128.2336152},
			{id: 10, subTitle: '안동시', lat: 36.58023730000001, lng: 128.7800357},
			{id: 11, subTitle: '영덕군', lat: 36.4823919, lng: 129.3173955},
			{id: 12, subTitle: '영양군', lat: 36.6964131, lng: 129.1450322},
			{id: 13, subTitle: '영주시', lat: 36.8705017, lng: 128.5976721},
			{id: 14, subTitle: '영천시', lat: 36.0156997, lng: 128.9427024},
			{id: 15, subTitle: '예천군', lat: 36.6540137, lng: 128.4224359},
			{id: 16, subTitle: '울릉군', lat: 37.4844171, lng: 130.9058002},
			{id: 17, subTitle: '울진군', lat: 36.9038993, lng: 129.3124073},
			{id: 18, subTitle: '의성군', lat: 36.3620052, lng: 128.6151413},
			{id: 19, subTitle: '청도군', lat: 35.6739247, lng: 128.7832658},
			{id: 20, subTitle: '청송군', lat: 36.3569355, lng: 129.0574298},
			{id: 21, subTitle: '칠곡군', lat: 36.0153963, lng: 128.4629995},
			{id: 22, subTitle: '포항시', lat: 36.0929227, lng: 129.3052666},
		],
	},
	{
		id: 16,
		title: '경남',
		sub: [
			{id: 0, subTitle: '전체', lat: 34.8806427, lng: 128.6210824},
			{id: 1, subTitle: '거제시', lat: 34.8806427, lng: 128.6210824},
			{id: 2, subTitle: '거창군', lat: 35.7325671, lng: 127.9042308},
			{id: 3, subTitle: '고성군', lat: 35.0165117, lng: 128.2907283},
			{id: 4, subTitle: '김해시', lat: 35.2721355, lng: 128.8452281},
			{id: 5, subTitle: '남해군', lat: 34.8376721, lng: 127.8924234},
			{id: 6, subTitle: '밀양시', lat: 35.4984942, lng: 128.7895971},
			{id: 7, subTitle: '사천시', lat: 35.0481566, lng: 128.1102419},
			{id: 8, subTitle: '산청군', lat: 35.368606, lng: 127.8843338},
			{id: 9, subTitle: '양산시', lat: 35.4018747, lng: 128.0410269},
			{id: 10, subTitle: '의령군', lat: 35.3924481, lng: 128.2770734},
			{id: 11, subTitle: '진주시', lat: 35.205153, lng: 128.1297905},
			{id: 12, subTitle: '창녕군', lat: 35.5083094, lng: 128.4931971},
			{id: 13, subTitle: '창원시', lat: 35.2028593, lng: 128.6000923},
			{id: 14, subTitle: '통영시', lat: 34.8544227, lng: 128.433182},
			{id: 15, subTitle: '하동군', lat: 35.1381776, lng: 127.779014},
			{id: 16, subTitle: '함안군', lat: 35.2909696, lng: 128.4308338},
			{id: 17, subTitle: '함양군', lat: 35.5516407, lng: 127.7220624},
			{id: 18, subTitle: '합천군', lat: 35.576844, lng: 128.1421921},
		],
	},
	{
		id: 17,
		title: '제주',
		sub: [
			{id: 0, subTitle: '전체', lat: 33.3846216, lng: 126.5534925},
			{id: 1, subTitle: '서귀포시', lat: 33.2541205, lng: 126.560076},
			{id: 2, subTitle: '제주시', lat: 33.4996213, lng: 126.5311884},
		],
	},
];

const globalCityList = [
	{
		id: 0,
		title: '일본',
		enTitle: 'Japan',
		sub: [
			{id: 0, subTitle: '전체', lat: 35.682839, lng: 139.759455},
			{id: 1, subTitle: '도쿄', lat: 35.682839, lng: 139.759455},
			{id: 2, subTitle: '후쿠오카', lat: 33.590354, lng: 130.401716},
			{id: 3, subTitle: '오사카', lat: 34.693738, lng: 135.502165},
			{id: 4, subTitle: '삿포로', lat: 43.061452, lng: 141.354187},
			{id: 5, subTitle: '오키나와', lat: 26.512083, lng: 127.9998},
			{id: 6, subTitle: '교토', lat: 35.011636, lng: 135.7681},
			{id: 7, subTitle: '나고야', lat: 35.181446, lng: 136.906398},
			{id: 8, subTitle: '고베', lat: 34.690083, lng: 135.195511},
			{id: 9, subTitle: '요코하마', lat: 35.447507, lng: 139.642857},
			{id: 10, subTitle: '히로시마', lat: 34.385202, lng: 132.4553},
			{id: 11, subTitle: '가고시마', lat: 31.560255, lng: 130.5582},
			{id: 12, subTitle: '나가사키', lat: 32.7503, lng: 129.8777},
			{id: 13, subTitle: '우베', lat: 33.947222, lng: 131.295},
			{id: 14, subTitle: '마츠도', lat: 35.7281, lng: 139.892},
			{id: 15, subTitle: '후지사와', lat: 35.327361, lng: 139.479203},
			[
				{id: 0, lat: 0, lng: 0, subTitle: '도쿄'},
				{id: 1, lat: 0, lng: 0, subTitle: '후쿠오카'},
				{id: 2, lat: 0, lng: 0, subTitle: '오사카'},
				{id: 3, lat: 0, lng: 0, subTitle: '삿포로'},
				{id: 4, lat: 0, lng: 0, subTitle: '오키나와'},
				{id: 5, lat: 0, lng: 0, subTitle: '교토'},
				{id: 6, lat: 0, lng: 0, subTitle: '나고야'},
				{id: 7, lat: 0, lng: 0, subTitle: '유후'},
				{id: 8, lat: 0, lng: 0, subTitle: '고베'},
				{id: 9, lat: 0, lng: 0, subTitle: '요코하마'},
				{id: 10, lat: 0, lng: 0, subTitle: '나가사키'},
				{id: 11, lat: 0, lng: 0, subTitle: '나라'},
				{id: 12, lat: 0, lng: 0, subTitle: '히로시마'},
				{id: 13, lat: 0, lng: 0, subTitle: '가고시마'},
				{id: 14, lat: 0, lng: 0, subTitle: '오타루'},
				{id: 15, lat: 0, lng: 0, subTitle: '요이치'},
				{id: 16, lat: 0, lng: 0, subTitle: '샤코탄'},
				{id: 17, lat: 0, lng: 0, subTitle: '노보리베츠'},
				{id: 18, lat: 0, lng: 0, subTitle: '무로란'},
				{id: 19, lat: 0, lng: 0, subTitle: '도야코'},
				{id: 20, lat: 0, lng: 0, subTitle: '쿄고쿠'},
				{id: 21, lat: 0, lng: 0, subTitle: '니세코'},
				{id: 22, lat: 0, lng: 0, subTitle: '굿찬'},
				{id: 23, lat: 0, lng: 0, subTitle: '시라오이'},
				{id: 24, lat: 0, lng: 0, subTitle: '아사히카와'},
				{id: 25, lat: 0, lng: 0, subTitle: '우베'},
				{id: 26, lat: 0, lng: 0, subTitle: '아바시리'},
				{id: 27, lat: 0, lng: 0, subTitle: '소베츠'},
				{id: 28, lat: 0, lng: 0, subTitle: '하코다테'},
				{id: 29, lat: 0, lng: 0, subTitle: '우라호로'},
				{id: 30, lat: 0, lng: 0, subTitle: '샤리'},
				{id: 31, lat: 0, lng: 0, subTitle: '왓카나이'},
				{id: 32, lat: 0, lng: 0, subTitle: '도요토미'},
				{id: 33, lat: 0, lng: 0, subTitle: '토마마에'},
				{id: 34, lat: 0, lng: 0, subTitle: '루모이'},
				{id: 35, lat: 0, lng: 0, subTitle: '호쿠류'},
				{id: 36, lat: 0, lng: 0, subTitle: '다키카와'},
				{id: 37, lat: 0, lng: 0, subTitle: '아시베츠'},
				{id: 38, lat: 0, lng: 0, subTitle: '우타시나이'},
				{id: 39, lat: 0, lng: 0, subTitle: '비바이'},
				{id: 40, lat: 0, lng: 0, subTitle: '토마코마이'},
				{id: 41, lat: 0, lng: 0, subTitle: '니캇푸'},
				{id: 42, lat: 0, lng: 0, subTitle: '신히다카'},
				{id: 43, lat: 0, lng: 0, subTitle: '우라카와'},
				{id: 44, lat: 0, lng: 0, subTitle: '에리모'},
				{id: 45, lat: 0, lng: 0, subTitle: '타카스'},
				{id: 46, lat: 0, lng: 0, subTitle: '오토이넷푸'},
				{id: 47, lat: 0, lng: 0, subTitle: '오비히로'},
				{id: 48, lat: 0, lng: 0, subTitle: '메무로'},
				{id: 49, lat: 0, lng: 0, subTitle: '마쿠베츠'},
				{id: 50, lat: 0, lng: 0, subTitle: '오토후케'},
				{id: 51, lat: 0, lng: 0, subTitle: '시미즈'},
				{id: 52, lat: 0, lng: 0, subTitle: '히다카'},
				{id: 53, lat: 0, lng: 0, subTitle: '비라토리'},
				{id: 54, lat: 0, lng: 0, subTitle: '란코시'},
				{id: 55, lat: 0, lng: 0, subTitle: '쿠로마츠나이'},
				{id: 56, lat: 0, lng: 0, subTitle: '세타나'},
				{id: 57, lat: 0, lng: 0, subTitle: '오토베'},
				{id: 58, lat: 0, lng: 0, subTitle: '에사시'},
				{id: 59, lat: 0, lng: 0, subTitle: '카미노쿠니'},
				{id: 60, lat: 0, lng: 0, subTitle: '마츠마에'},
				{id: 61, lat: 0, lng: 0, subTitle: '후쿠시마'},
				{id: 62, lat: 0, lng: 0, subTitle: '시리우치'},
				{id: 63, lat: 0, lng: 0, subTitle: '키코나이'},
				{id: 64, lat: 0, lng: 0, subTitle: '호쿠토'},
				{id: 65, lat: 0, lng: 0, subTitle: '후쿠이'},
				{id: 66, lat: 0, lng: 0, subTitle: '치바'},
				{id: 67, lat: 0, lng: 0, subTitle: '시카베'},
				{id: 68, lat: 0, lng: 0, subTitle: '모리'},
				{id: 69, lat: 0, lng: 0, subTitle: '야쿠모'},
				{id: 70, lat: 0, lng: 0, subTitle: '이와나이'},
				{id: 71, lat: 0, lng: 0, subTitle: '에베쓰'},
				{id: 72, lat: 0, lng: 0, subTitle: '이와미자와'},
				{id: 73, lat: 0, lng: 0, subTitle: '미카사'},
				{id: 74, lat: 0, lng: 0, subTitle: '우라우스'},
				{id: 75, lat: 0, lng: 0, subTitle: '비에이'},
				{id: 76, lat: 0, lng: 0, subTitle: '가미후라노'},
				{id: 77, lat: 0, lng: 0, subTitle: '나카후라노'},
				{id: 78, lat: 0, lng: 0, subTitle: '가루이자와마치'},
				{id: 79, lat: 0, lng: 0, subTitle: '구사쓰'},
				{id: 80, lat: 0, lng: 0, subTitle: '쓰마고이'},
				{id: 81, lat: 0, lng: 0, subTitle: '다카야마'},
				{id: 82, lat: 0, lng: 0, subTitle: '후라노'},
				{id: 83, lat: 0, lng: 0, subTitle: '아카비라'},
				{id: 84, lat: 0, lng: 0, subTitle: '스나가와'},
				{id: 85, lat: 0, lng: 0, subTitle: '토마'},
				{id: 86, lat: 0, lng: 0, subTitle: '히가시카와'},
				{id: 87, lat: 0, lng: 0, subTitle: '몬베츠'},
				{id: 88, lat: 0, lng: 0, subTitle: '나요로'},
				{id: 89, lat: 0, lng: 0, subTitle: '가미시호로'},
				{id: 90, lat: 0, lng: 0, subTitle: '가미카와'},
				{id: 91, lat: 0, lng: 0, subTitle: '엔가루'},
				{id: 92, lat: 0, lng: 0, subTitle: '키타미'},
				{id: 93, lat: 0, lng: 0, subTitle: '타키노우에'},
				{id: 94, lat: 0, lng: 0, subTitle: '유베츠'},
				{id: 95, lat: 0, lng: 0, subTitle: '오조라'},
				{id: 96, lat: 0, lng: 0, subTitle: '츠베츠'},
				{id: 97, lat: 0, lng: 0, subTitle: '테시카가'},
				{id: 98, lat: 0, lng: 0, subTitle: '시베차'},
				{id: 99, lat: 0, lng: 0, subTitle: '코시미즈'},
				{id: 100, lat: 0, lng: 0, subTitle: '기요사토'},
				{id: 101, lat: 0, lng: 0, subTitle: '나카시베츠'},
				{id: 102, lat: 0, lng: 0, subTitle: '쓰루이'},
				{id: 103, lat: 0, lng: 0, subTitle: '구시로'},
				{id: 104, lat: 0, lng: 0, subTitle: '앗케시'},
				{id: 105, lat: 0, lng: 0, subTitle: '남포로'},
				{id: 106, lat: 0, lng: 0, subTitle: '유니'},
				{id: 107, lat: 0, lng: 0, subTitle: '나가누마'},
				{id: 108, lat: 0, lng: 0, subTitle: '에니와'},
				{id: 109, lat: 0, lng: 0, subTitle: '니키'},
				{id: 110, lat: 0, lng: 0, subTitle: '다카마쓰'},
				{id: 111, lat: 0, lng: 0, subTitle: '마루가메'},
				{id: 112, lat: 0, lng: 0, subTitle: '가마쿠라시'},
				{id: 113, lat: 0, lng: 0, subTitle: '야마토'},
				{id: 114, lat: 0, lng: 0, subTitle: '마츠다'},
				{id: 115, lat: 0, lng: 0, subTitle: '토요타'},
				{id: 116, lat: 0, lng: 0, subTitle: '마츠모토'},
				{id: 117, lat: 0, lng: 0, subTitle: '우에다'},
				{id: 118, lat: 0, lng: 0, subTitle: '아즈미노'},
				{id: 119, lat: 0, lng: 0, subTitle: '스와'},
				{id: 120, lat: 0, lng: 0, subTitle: '시오지리'},
				{id: 121, lat: 0, lng: 0, subTitle: '토미오카'},
				{id: 122, lat: 0, lng: 0, subTitle: '안나카'},
				{id: 123, lat: 0, lng: 0, subTitle: '다카사키'},
				{id: 124, lat: 0, lng: 0, subTitle: '치치부'},
				{id: 125, lat: 0, lng: 0, subTitle: '고후'},
				{id: 126, lat: 0, lng: 0, subTitle: '하코네'},
				{id: 127, lat: 0, lng: 0, subTitle: '타마'},
				{id: 128, lat: 0, lng: 0, subTitle: '오야마'},
				{id: 129, lat: 0, lng: 0, subTitle: '후지노미야'},
				{id: 130, lat: 0, lng: 0, subTitle: '미시마'},
				{id: 131, lat: 0, lng: 0, subTitle: '칸나미'},
				{id: 132, lat: 0, lng: 0, subTitle: '아타미'},
				{id: 133, lat: 0, lng: 0, subTitle: '이즈'},
				{id: 134, lat: 0, lng: 0, subTitle: '이토'},
				{id: 135, lat: 0, lng: 0, subTitle: '니시이즈'},
				{id: 136, lat: 0, lng: 0, subTitle: '누마즈'},
				{id: 137, lat: 0, lng: 0, subTitle: '아시카가'},
				{id: 138, lat: 0, lng: 0, subTitle: '칸라'},
				{id: 139, lat: 0, lng: 0, subTitle: '코가'},
				{id: 140, lat: 0, lng: 0, subTitle: '마츠도'},
				{id: 141, lat: 0, lng: 0, subTitle: '후나바시'},
				{id: 142, lat: 0, lng: 0, subTitle: '이시오카'},
				{id: 143, lat: 0, lng: 0, subTitle: '오시노'},
				{id: 144, lat: 0, lng: 0, subTitle: '치요다'},
				{id: 145, lat: 0, lng: 0, subTitle: '후지요시다'},
				{id: 146, lat: 0, lng: 0, subTitle: '고토'},
				{id: 147, lat: 0, lng: 0, subTitle: '쿠와나'},
				{id: 148, lat: 0, lng: 0, subTitle: '타치카와'},
				{id: 149, lat: 0, lng: 0, subTitle: '분쿄'},
				{id: 150, lat: 0, lng: 0, subTitle: '세타가야'},
				{id: 151, lat: 0, lng: 0, subTitle: '세키'},
				{id: 152, lat: 0, lng: 0, subTitle: '한노'},
				{id: 153, lat: 0, lng: 0, subTitle: '미하마'},
				{id: 154, lat: 0, lng: 0, subTitle: '스미다'},
				{id: 155, lat: 0, lng: 0, subTitle: '사가미하라'},
				{id: 156, lat: 0, lng: 0, subTitle: '히가시쿠루메'},
				{id: 157, lat: 0, lng: 0, subTitle: '후지사와'},
				{id: 158, lat: 0, lng: 0, subTitle: '기타'},
				{id: 159, lat: 0, lng: 0, subTitle: '하치오지'},
				{id: 160, lat: 0, lng: 0, subTitle: '가쓰시카'},
				{id: 161, lat: 0, lng: 0, subTitle: '코가네이'},
				{id: 162, lat: 0, lng: 0, subTitle: '후지카와구치코'},
				{id: 163, lat: 0, lng: 0, subTitle: '히타치오타'},
				{id: 164, lat: 0, lng: 0, subTitle: '도코로자와'},
				{id: 165, lat: 0, lng: 0, subTitle: '도요하시'},
				{id: 166, lat: 0, lng: 0, subTitle: '미야즈'},
				{id: 167, lat: 0, lng: 0, subTitle: '조후'},
				{id: 168, lat: 0, lng: 0, subTitle: '닛코'},
				{id: 169, lat: 0, lng: 0, subTitle: '마이즈루'},
				{id: 170, lat: 0, lng: 0, subTitle: '하마마츠'},
				{id: 171, lat: 0, lng: 0, subTitle: '야마나카코'},
				{id: 172, lat: 0, lng: 0, subTitle: '시바야마'},
				{id: 173, lat: 0, lng: 0, subTitle: '안조'},
				{id: 174, lat: 0, lng: 0, subTitle: '네리마'},
				{id: 175, lat: 0, lng: 0, subTitle: '히라츠카'},
				{id: 176, lat: 0, lng: 0, subTitle: '사쿠라가와'},
				{id: 177, lat: 0, lng: 0, subTitle: '토다'},
				{id: 178, lat: 0, lng: 0, subTitle: '다카시마'},
				{id: 179, lat: 0, lng: 0, subTitle: '나루사와'},
				{id: 180, lat: 0, lng: 0, subTitle: '오츠키'},
				{id: 181, lat: 0, lng: 0, subTitle: '케이힌지마'},
				{id: 182, lat: 0, lng: 0, subTitle: '오카자키'},
				{id: 183, lat: 0, lng: 0, subTitle: '나스'},
				{id: 184, lat: 0, lng: 0, subTitle: '이비가와'},
				{id: 185, lat: 0, lng: 0, subTitle: '요로'},
				{id: 186, lat: 0, lng: 0, subTitle: '코시가야'},
				{id: 187, lat: 0, lng: 0, subTitle: '요시미'},
				{id: 188, lat: 0, lng: 0, subTitle: '가와사키'},
				{id: 189, lat: 0, lng: 0, subTitle: '이즈노쿠니'},
				{id: 190, lat: 0, lng: 0, subTitle: '후추'},
				{id: 191, lat: 0, lng: 0, subTitle: '미노부'},
				{id: 192, lat: 0, lng: 0, subTitle: '시모츠마'},
				{id: 193, lat: 0, lng: 0, subTitle: '이타바시'},
				{id: 194, lat: 0, lng: 0, subTitle: '이나베'},
				{id: 195, lat: 0, lng: 0, subTitle: '이케다'},
				{id: 196, lat: 0, lng: 0, subTitle: '히라카타'},
				{id: 197, lat: 0, lng: 0, subTitle: '이가'},
				{id: 198, lat: 0, lng: 0, subTitle: '다카토리'},
				{id: 199, lat: 0, lng: 0, subTitle: '도베'},
				{id: 200, lat: 0, lng: 0, subTitle: '야나가와'},
				{id: 201, lat: 0, lng: 0, subTitle: '야마구치'},
				{id: 202, lat: 0, lng: 0, subTitle: '마쓰에'},
				{id: 203, lat: 0, lng: 0, subTitle: '야스기'},
				{id: 204, lat: 0, lng: 0, subTitle: '사카이미나토'},
				{id: 205, lat: 0, lng: 0, subTitle: '히메지'},
				{id: 206, lat: 0, lng: 0, subTitle: '기시와다'},
				{id: 207, lat: 0, lng: 0, subTitle: '사카이'},
				{id: 208, lat: 0, lng: 0, subTitle: '가시하라'},
				{id: 209, lat: 0, lng: 0, subTitle: '우쓰노미야'},
				{id: 210, lat: 0, lng: 0, subTitle: '미토'},
				{id: 211, lat: 0, lng: 0, subTitle: '히타치'},
				{id: 212, lat: 0, lng: 0, subTitle: '시로이시'},
				{id: 213, lat: 0, lng: 0, subTitle: '야마가타'},
				{id: 214, lat: 0, lng: 0, subTitle: '요코테'},
				{id: 215, lat: 0, lng: 0, subTitle: '히로사키'},
				{id: 216, lat: 0, lng: 0, subTitle: '고쇼가와라'},
				{id: 217, lat: 0, lng: 0, subTitle: '아오모리'},
				{id: 218, lat: 0, lng: 0, subTitle: '코사카'},
				{id: 219, lat: 0, lng: 0, subTitle: '히라이즈미'},
				{id: 220, lat: 0, lng: 0, subTitle: '이치노세키'},
				{id: 221, lat: 0, lng: 0, subTitle: '오사키'},
				{id: 222, lat: 0, lng: 0, subTitle: '카미'},
				{id: 223, lat: 0, lng: 0, subTitle: '이시노마키'},
				{id: 224, lat: 0, lng: 0, subTitle: '마츠시마'},
				{id: 225, lat: 0, lng: 0, subTitle: '리후'},
				{id: 226, lat: 0, lng: 0, subTitle: '센다이'},
				{id: 227, lat: 0, lng: 0, subTitle: '다가조'},
				{id: 228, lat: 0, lng: 0, subTitle: '카미노야마'},
				{id: 229, lat: 0, lng: 0, subTitle: '요네자와'},
				{id: 230, lat: 0, lng: 0, subTitle: '기타카타'},
				{id: 231, lat: 0, lng: 0, subTitle: '아이즈와카마츠'},
				{id: 232, lat: 0, lng: 0, subTitle: '가타시나'},
				{id: 233, lat: 0, lng: 0, subTitle: '아사고'},
				{id: 234, lat: 0, lng: 0, subTitle: '이카루가'},
				{id: 235, lat: 0, lng: 0, subTitle: '나가토'},
				{id: 236, lat: 0, lng: 0, subTitle: '내 거'},
				{id: 237, lat: 0, lng: 0, subTitle: '난토'},
				{id: 238, lat: 0, lng: 0, subTitle: '다카오카'},
				{id: 239, lat: 0, lng: 0, subTitle: '구리하라'},
				{id: 240, lat: 0, lng: 0, subTitle: '가나자와'},
				{id: 241, lat: 0, lng: 0, subTitle: '코야'},
				{id: 242, lat: 0, lng: 0, subTitle: '와카야마'},
				{id: 243, lat: 0, lng: 0, subTitle: '나루토'},
				{id: 244, lat: 0, lng: 0, subTitle: '시부카와'},
				{id: 245, lat: 0, lng: 0, subTitle: '요시오카'},
				{id: 246, lat: 0, lng: 0, subTitle: '나가노'},
				{id: 247, lat: 0, lng: 0, subTitle: '다테야마'},
				{id: 248, lat: 0, lng: 0, subTitle: '이미즈'},
				{id: 249, lat: 0, lng: 0, subTitle: '오쓰'},
				{id: 250, lat: 0, lng: 0, subTitle: '야스'},
				{id: 251, lat: 0, lng: 0, subTitle: '와카사'},
				{id: 252, lat: 0, lng: 0, subTitle: '오바마'},
				{id: 253, lat: 0, lng: 0, subTitle: '이네'},
				{id: 254, lat: 0, lng: 0, subTitle: '구라요시'},
				{id: 255, lat: 0, lng: 0, subTitle: '이즈모'},
				{id: 256, lat: 0, lng: 0, subTitle: '구레'},
				{id: 257, lat: 0, lng: 0, subTitle: '타마노'},
				{id: 258, lat: 0, lng: 0, subTitle: '오카야마'},
				{id: 259, lat: 0, lng: 0, subTitle: '아카이와'},
				{id: 260, lat: 0, lng: 0, subTitle: '코카'},
				{id: 261, lat: 0, lng: 0, subTitle: '모리야마'},
				{id: 262, lat: 0, lng: 0, subTitle: '쓰루'},
				{id: 263, lat: 0, lng: 0, subTitle: '와카야마현'},
				{id: 264, lat: 0, lng: 0, subTitle: '치바현'},
				{id: 265, lat: 0, lng: 0, subTitle: '미야기'},
				{id: 266, lat: 0, lng: 0, subTitle: '미야기현'},
			],
		],
	},
];
