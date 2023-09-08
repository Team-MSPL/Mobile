import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Button} from 'native-base';
import {FlexWrap} from '../../utill/layout/layout';
export default function SelectTendency({navigation}: any) {
	const {transit, season} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const [select, setSelect] = useState(
		tendencyList.map(item => {
			return Array(item.list.length).fill(false);
		}),
	);

	const goNext = () => {
		let copy = [...select];
		copy.push(season);
		copy = copy.map(item => {
			return item.map(data => {
				return data ? 1 : 0;
			});
		});
		dispatch(travelSliceActions.enrollTendency(copy));
		console.log(copy);
		navigation.navigate('FinalCheck');
	};
	const selectData = ({index, idx}: {index: number; idx: number}) => {
		let copy = [...select];
		copy[index][idx] = !copy[index][idx];
		setSelect(copy);
	};

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					여행 성향 설정
				</Text>
				<Text fontSize='md' color='grey'>
					어떤 스타일의 여행을 가실 계획이신가요?
				</Text>
				<Divider my='1' />
				<Text fontSize='xl' bold>
					어떻게 이동하시나요?
				</Text>
				<HStack>
					<SelectButton
						label='자차(렌트카)'
						onPress={() => dispatch(travelSliceActions.enrollTransit(0))}
						bgColor={transit == 0}></SelectButton>
					<SelectButton
						label='대중교통'
						onPress={() => dispatch(travelSliceActions.enrollTransit(1))}
						bgColor={transit == 1}></SelectButton>
				</HStack>
				{tendencyList.map((item, index) => {
					return (
						<Box key={index}>
							<Text fontSize='lg' bold>
								{item.title}
							</Text>
							<FlexWrap>
								{item.list.map((data, idx) => {
									return (
										<SelectButton
											key={idx}
											label={data}
											onPress={() => selectData({index, idx})}
											bgColor={select[index][idx]}></SelectButton>
									);
								})}
							</FlexWrap>
						</Box>
					);
				})}

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}

export const tendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와', '반려동물과'],
	},
	{title: '테마는 무엇인가요?', multi: true, list: ['힐링', '액티비티', '배움이 있는', '맛있는']},
	{
		title: '무엇을 하고싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '유적지', '박물관'],
	},
	{
		title: '뭘하고싶나요?',
		multi: true,
		list: ['바다', '산', '드라이브코스', '산책', '쇼핑', '실내여행지', '시티투어', '지역축제', '전통한옥'],
	},
];
