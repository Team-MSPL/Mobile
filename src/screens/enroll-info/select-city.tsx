import {useState, useEffect, Fragment} from 'react';
import {TextInput, TouchableOpacity, ScrollView} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

import CustomButton from '../../utill/component/custom-button';
import {HStack, VStack, Divider, MainContainer, InputWrap, ClearTouchableOpacity} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import {colors} from '../../utill/colors';
import {SvgCancel} from '../../utill/svg/svg';
import {modalSliceActions} from '../../redux/modal/modalSlice';

import {ButtonContainer, MarginContainder} from './select-multi';
export default function SelectCity({viewComponent, goNextStep}: any) {
	const {region, regionRecommendFlag, cityIndex} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [search, setSearch] = useState('');
	const checkList = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '제주'];
	const selectPopularity = (e: {id: number; subTitle: string}) => {
		dispatch(
			travelSliceActions.selectPopularity({
				region: checkList.includes(e.subTitle) ? ['전체'] : [e.subTitle],
				cityIndex: e.id,
			}),
		);
	};
	const selectRegion = (e: string) => {
		if (e === '전체' || region.includes('전체')) {
			dispatch(travelSliceActions.selectRegion([e]));
		} else if (region.includes(e)) {
			const copy = region.filter(item => item !== e);
			dispatch(travelSliceActions.selectRegion(copy));
		} else {
			let copy = [...region];
			copy.push(e);
			dispatch(travelSliceActions.selectRegion(copy));
		}
	};

	const deleteRegion = (e: string) => {
		const copy = region.filter(item => item != e);
		dispatch(travelSliceActions.selectRegion(copy));
	};

	const selectCity = (e: number) => {
		if (region) {
			dispatch(travelSliceActions.selectRegion([]));
		}
		dispatch(travelSliceActions.enrollCityIndex(e));
	};

	const goNext = () => {
		region.length != 0
			? goNextStep()
			: dispatch(modalSliceActions.setOpenModal({modalTitle: '지역을 선택해주세요.'}));
	};

	//검색 관련
	const searchData =
		search &&
		cityViewList.find(item =>
			item.sub.some(
				subItem =>
					((subItem.subTitle.endsWith('시') || subItem.subTitle.endsWith('군')) &&
						item.id != 0 &&
						subItem.subTitle.startsWith(search)) ||
					item.title.startsWith(search),
			),
		);

	const searchCity = searchData && searchData.sub.find(item => item.subTitle.includes(search))?.subTitle;
	const changeSearch = (e: any) => {
		setSearch(e);
	};
	const addCity = () => {
		searchData && selectCity(searchData.id);
		const data = searchData && searchData.sub.find(item => item.subTitle.includes(search))?.subTitle;
		dispatch(travelSliceActions.selectRegion([data ?? '전체']));
	};
	return (
		<>
			<MainContainer showsVerticalScrollIndicator={false}>
				{/* 스테퍼 넣기 */}
				<StepText mainText='어디로 떠나실건가요?' subText='관심있는 여행 지역을 알려주세요.' />

				<InputAllContainter>
					<SearchInput
						placeholderTextColor={'grey'}
						style={{color: 'black'}}
						value={search}
						onChangeText={(text: string) => changeSearch(text)}
						placeholder='지역을 직접 검색해보세요 ex)부여'></SearchInput>
					{search && (
						<ClearTouchableOpacity
							onPress={() => {
								changeSearch('');
							}}>
							<SvgCancel width='20' height='20' color='black' />
						</ClearTouchableOpacity>
					)}
				</InputAllContainter>
				{searchData && (
					<SearchTouchableOpacity onPress={addCity}>
						<SelectRegion>{searchData?.title + ' ' + (searchCity ?? '')}</SelectRegion>
					</SearchTouchableOpacity>
				)}
				<SelectAllContainer>
					<SelectRegion>선택 지역</SelectRegion>
					<SelectListContainer horizontal={true}>
						{region?.map((item, regionIndex) => {
							return (
								<RegionElementContainer key={regionIndex} onPress={() => deleteRegion(item)}>
									<RegionElementContainerText>
										{item == '전체' ? cityViewList[cityIndex].title + ' ' + item : item}
									</RegionElementContainerText>
									<SvgCancel color='white' />
								</RegionElementContainer>
							);
						})}
					</SelectListContainer>
				</SelectAllContainer>
				<HStack>
					<RegionAllContainer>
						<StepInfo>Step 1</StepInfo>
						<RegionViewContainer>
							<ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
								{cityViewList.map((item, idx) => {
									return (
										<RegionItems
											key={idx}
											select={cityIndex == item.id}
											onPress={() => {
												selectCity(item.id);
											}}>
											<RegionText select={cityIndex == item.id}>{item.title}</RegionText>
										</RegionItems>
									);
								})}
							</ScrollView>
						</RegionViewContainer>
					</RegionAllContainer>
					<CityAllContainer>
						<StepInfo>Step 2</StepInfo>
						<CityViewContainer>
							<ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
								{cityViewList[cityIndex]?.sub.map((item, idx) => {
									return (
										<CityItems
											key={idx}
											select={region.includes(item.subTitle)}
											onPress={() => {
												cityIndex == 0 ? selectPopularity(item) : selectRegion(item.subTitle);
											}}>
											<CityText select={region.includes(item.subTitle)}>{item.subTitle}</CityText>
										</CityItems>
									);
								})}
							</ScrollView>
						</CityViewContainer>
					</CityAllContainer>
				</HStack>

				<MarginContainder />
			</MainContainer>
			<ButtonContainer>
				<CustomButton
					label={`다음 (${viewComponent + 1}/${regionRecommendFlag ? 3 : 5})`}
					onPress={goNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}
const InputAllContainter = styled(InputWrap)`
	border-color: ${colors.border};
	height: 50px;
`;
const RegionAllContainer = styled(VStack)`
	width: 30%;
`;

const CityAllContainer = styled(VStack)`
	width: 70%;
`;
const RegionViewContainer = styled.View`
	height: 300px;
	border-width: 1px;
	border-color: ${colors.regionNormal};
	margin: 10px 0px 0px 0px;
`;
const CityViewContainer = styled(RegionViewContainer)`
	margin: 10px 0px 0px 0px;
`;
const RegionItems = styled.TouchableOpacity<{select: boolean}>`
	justify-content: center;
	align-items: center;
	height: 40px;
	background-color: ${props => (props.select ? colors.selectButton : 'white')};
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
`;
const CityItems = styled(RegionItems)`
	background-color: ${props => (props.select ? colors.normalButton : 'white')};
	border-bottom-width: 0px;
`;
const RegionText = styled.Text<{select: boolean}>`
	color: ${props => (props.select ? 'white' : 'black')};
	font-size: 16px;
	font-weight: 500;
`;
const CityText = styled(RegionText)`
	color: ${props => (props.select ? colors.selectButton : 'black')};
`;
const RegionElementContainer = styled.TouchableOpacity`
	background-color: ${colors.selectButton};
	border-radius: 20px;
	margin: 0px 5px 0px 0px;
	padding: 10px 20px 10px 20px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const SearchTouchableOpacity = styled.TouchableOpacity`
	width: 100%;
	padding: 10px;
	background-color: #f0f0f0;
	border-radius: 10px;
`;
const RegionElementContainerText = styled.Text`
	font-size: 15px;
	color: white;
	margin: 0px 10px 0px 0px;
`;

const SelectRegion = styled.Text`
	font-size: 17px;
	color: black;
	font-weight: 500;
	margin: 0px 10px 0px 0px;
`;
const StepInfo = styled.Text`
	font-size: 14px;
	color: ${colors.selectButton};
	font-weight: 500;
	margin: 0% 1% 0% 0%;
`;
const SelectListContainer = styled.ScrollView`
	width: 100%;
	height: 50px;
	margin: 10px 0px 10px 0px;
	padding: 5px;
`;
const SearchInput = styled.TextInput`
	flex: 1;
	padding: 0px 0px 0px 8px;
`;
const SelectAllContainer = styled.View`
	width: 100%;
	margin: 10px 0px 0px 0px;
`;
export const cityViewList = [
	{
		id: 0,
		title: '인기',
		sub: [
			{id: 1, subTitle: '서울'},
			{id: 2, subTitle: '부산'},
			{id: 17, subTitle: '제주'},
			{id: 4, subTitle: '인천'},
			{id: 3, subTitle: '대구'},
			{id: 5, subTitle: '광주'},
			{id: 6, subTitle: '대전'},
			{id: 7, subTitle: '울산'},
			{id: 10, subTitle: '강릉시'},
			{id: 10, subTitle: '속초시'},
			{id: 15, subTitle: '경주시'},
			{id: 15, subTitle: '포항시'},
			{id: 14, subTitle: '여수시'},
		],
	},
	{id: 1, title: '서울', sub: [{id: 0, subTitle: '전체'}]},
	{id: 2, title: '부산', sub: [{id: 0, subTitle: '전체'}]},
	{id: 3, title: '대구', sub: [{id: 0, subTitle: '전체'}]},
	{id: 4, title: '인천', sub: [{id: 0, subTitle: '전체'}]},
	{id: 5, title: '광주', sub: [{id: 0, subTitle: '전체'}]},
	{id: 6, title: '대전', sub: [{id: 0, subTitle: '전체'}]},
	{id: 7, title: '울산', sub: [{id: 0, subTitle: '전체'}]},
	{id: 8, title: '세종', sub: [{id: 0, subTitle: '전체'}]},
	{
		id: 9,
		title: '경기',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '가평군'},
			{id: 2, subTitle: '고양시'},
			{id: 3, subTitle: '과천시'},
			{id: 4, subTitle: '광명시'},
			{id: 5, subTitle: '광주시'},
			{id: 6, subTitle: '구리시'},
			{id: 7, subTitle: '군포시'},
			{id: 8, subTitle: '김포시'},
			{id: 9, subTitle: '남양주시'},
			{id: 10, subTitle: '동두천시'},
			{id: 11, subTitle: '부천시'},
			{id: 12, subTitle: '성남시'},
			{id: 13, subTitle: '수원시'},
			{id: 14, subTitle: '시흥시'},
			{id: 15, subTitle: '안산시'},
			{id: 16, subTitle: '안성시'},
			{id: 17, subTitle: '안양시'},
			{id: 18, subTitle: '양주시'},
			{id: 19, subTitle: '양평군'},
			{id: 20, subTitle: '여주시'},
			{id: 21, subTitle: '연천군'},
			{id: 22, subTitle: '오산시'},
			{id: 23, subTitle: '용인시'},
			{id: 24, subTitle: '의왕시'},
			{id: 25, subTitle: '의정부시'},
			{id: 26, subTitle: '이천시'},
			{id: 27, subTitle: '파주시'},
			{id: 28, subTitle: '평택시'},
			{id: 29, subTitle: '포천시'},
			{id: 30, subTitle: '하남시'},
			{id: 31, subTitle: '화성시'},
		],
	},
	{
		id: 10,
		title: '강원',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '강릉시'},
			{id: 2, subTitle: '고성군'},
			{id: 3, subTitle: '동해시'},
			{id: 4, subTitle: '삼척시'},
			{id: 5, subTitle: '속초시'},
			{id: 6, subTitle: '양구군'},
			{id: 7, subTitle: '양양군'},
			{id: 8, subTitle: '영월군'},
			{id: 9, subTitle: '원주시'},
			{id: 10, subTitle: '인제군'},
			{id: 11, subTitle: '정선군'},
			{id: 12, subTitle: '철원군'},
			{id: 13, subTitle: '춘천시'},
			{id: 14, subTitle: '태백시'},
			{id: 15, subTitle: '평창군'},
			{id: 16, subTitle: '홍천군'},
			{id: 17, subTitle: '화천군'},
			{id: 18, subTitle: '횡성군'},
		],
	},
	{
		id: 11,
		title: '충북',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '괴산군'},
			{id: 2, subTitle: '단양군'},
			{id: 3, subTitle: '보은군'},
			{id: 4, subTitle: '영동군'},
			{id: 5, subTitle: '옥천군'},
			{id: 6, subTitle: '음성군'},
			{id: 7, subTitle: '제천시'},
			{id: 8, subTitle: '진천군'},
			{id: 9, subTitle: '청주시'},
			{id: 10, subTitle: '충주시'},
			{id: 11, subTitle: '증평군'},
		],
	},
	{
		id: 12,
		title: '충남',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '계룡시'},
			{id: 2, subTitle: '공주시'},
			{id: 3, subTitle: '금산군'},
			{id: 4, subTitle: '논산시'},
			{id: 5, subTitle: '당진시'},
			{id: 6, subTitle: '보령시'},
			{id: 7, subTitle: '부여군'},
			{id: 8, subTitle: '서산시'},
			{id: 9, subTitle: '서천군'},
			{id: 10, subTitle: '아산시'},
			{id: 11, subTitle: '예산군'},
			{id: 12, subTitle: '천안시'},
			{id: 13, subTitle: '청양군'},
			{id: 14, subTitle: '태안군'},
			{id: 15, subTitle: '홍성군'},
		],
	},
	{
		id: 13,
		title: '전북',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '고창군'},
			{id: 2, subTitle: '군산시'},
			{id: 3, subTitle: '김제시'},
			{id: 4, subTitle: '남원시'},
			{id: 5, subTitle: '무주군'},
			{id: 6, subTitle: '부안군'},
			{id: 7, subTitle: '순창군'},
			{id: 8, subTitle: '완주군'},
			{id: 9, subTitle: '익산시'},
			{id: 10, subTitle: '임실군'},
			{id: 11, subTitle: '장수군'},
			{id: 12, subTitle: '전주시'},
			{id: 13, subTitle: '정읍시'},
			{id: 14, subTitle: '진안군'},
		],
	},
	{
		id: 14,
		title: '전남',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '강진군'},
			{id: 2, subTitle: '고흥군'},
			{id: 3, subTitle: '곡성군'},
			{id: 4, subTitle: '광양시'},
			{id: 5, subTitle: '구례군'},
			{id: 6, subTitle: '나주시'},
			{id: 7, subTitle: '담양군'},
			{id: 8, subTitle: '목포시'},
			{id: 9, subTitle: '무안군'},
			{id: 10, subTitle: '보성군'},
			{id: 11, subTitle: '순천시'},
			{id: 12, subTitle: '신안군'},
			{id: 13, subTitle: '여수시'},
			{id: 14, subTitle: '영광군'},
			{id: 15, subTitle: '영암군'},
			{id: 16, subTitle: '완도군'},
			{id: 17, subTitle: '장성군'},
			{id: 18, subTitle: '장흥군'},
			{id: 19, subTitle: '진도군'},
			{id: 20, subTitle: '함평군'},
			{id: 21, subTitle: '해남군'},
			{id: 22, subTitle: '화순군'},
		],
	},
	{
		id: 15,
		title: '경북',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '경산시'},
			{id: 2, subTitle: '경주시'},
			{id: 3, subTitle: '고령군'},
			{id: 4, subTitle: '구미시'},
			{id: 5, subTitle: '김천시'},
			{id: 6, subTitle: '문경시'},
			{id: 7, subTitle: '봉화군'},
			{id: 8, subTitle: '상주시'},
			{id: 9, subTitle: '성주군'},
			{id: 10, subTitle: '안동시'},
			{id: 11, subTitle: '영덕군'},
			{id: 12, subTitle: '영양군'},
			{id: 13, subTitle: '영천시'},
			{id: 14, subTitle: '예천군'},
			{id: 15, subTitle: '울릉군'},
			{id: 16, subTitle: '울진군'},
			{id: 17, subTitle: '의성군'},
			{id: 18, subTitle: '청도군'},
			{id: 19, subTitle: '청송군'},
			{id: 20, subTitle: '칠곡군'},
			{id: 21, subTitle: '포항시'},
		],
	},
	{
		id: 16,
		title: '경남',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '거제시'},
			{id: 2, subTitle: '거창군'},
			{id: 3, subTitle: '고성군'},
			{id: 4, subTitle: '김해시'},
			{id: 5, subTitle: '남해군'},
			{id: 6, subTitle: '밀양시'},
			{id: 7, subTitle: '사천시'},
			{id: 8, subTitle: '산청군'},
			{id: 9, subTitle: '양산시'},
			{id: 10, subTitle: '의령군'},
			{id: 11, subTitle: '진주시'},
			{id: 12, subTitle: '창녕군'},
			{id: 13, subTitle: '창원군'},
			{id: 14, subTitle: '통영시'},
			{id: 15, subTitle: '하동군'},
			{id: 16, subTitle: '함안군'},
			{id: 17, subTitle: '함양군'},
			{id: 18, subTitle: '합천군'},
		],
	},
	{
		id: 17,
		title: '제주',
		sub: [
			{id: 0, subTitle: '전체'},
			{id: 1, subTitle: '서귀포시'},
			{id: 2, subTitle: '제주시'},
		],
	},
];
