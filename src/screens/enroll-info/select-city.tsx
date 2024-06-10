import {ScrollView} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getRegionInfo, travelSliceActions} from '../../redux/travel-info/travel.slice';

import CustomButton from '../../utill/component/custom-button';
import {BackgroundGray, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import {colors} from '../../utill/colors';
import {SvgCancel} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';

import {ButtonContainer} from './select-multi';
import Stepper from '../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
export default function SelectCity({navigation}: any) {
	const {region, regionRecommendFlag, cityIndex, cityDistance} = useAppSelector(state => state.travelSlice);
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
										width={widthPercentage(13)}
										height={widthPercentage(13)}
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
			<ButtonContainer>
				<CustomButton label={`다음`} onPress={goNext}></CustomButton>
			</ButtonContainer>
		</BackgroundGray>
	);
}
const TestImage = styled.Image`
	width: ${widthPercentage(100)}px;
	height: ${heightPercentage(100)}px;
`;
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
			{id: 13, subTitle: '창원군', lat: 35.2028593, lng: 128.6000923},
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
