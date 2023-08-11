import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import SelectButton from '../../../utill/component/select-button';
import {Text, Box, ScrollView, VStack, HStack, Divider, Button} from 'native-base';
import {RegionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';

export default function SelectTendency({navigation}: any) {
	const dispatch = useAppDispatch();

	const [select, setSelect] = useState(
		tendencyList.map(item => {
			return Array(item.list.length).fill(false);
		}),
	);

	const goNext = () => {
		console.log(navigation);
		let copy = [...select];
		copy = copy.map(item => {
			return item.map(data => {
				return data ? 1 : 0;
			});
		});
		dispatch(RegionRecommendSliceActions.enrollTendency(copy));
		navigation.navigate('RegionSelectDistance');
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
					추천 성향 설정
				</Text>
				<Text fontSize='md' color='grey'>
					어떤 스타일의 여행을 원하는가요?
				</Text>
				<Divider my='1' />
				{tendencyList.map((item, index) => {
					return (
						<Box key={index}>
							<Text fontSize='lg' bold>
								{item.title}
							</Text>
							<Box flexDir='row' flexWrap='wrap'>
								{item.list.map((data, idx) => {
									return (
										<SelectButton
											key={idx}
											label={data}
											onPress={() => selectData({index, idx})}
											bgColor={select[index][idx]}></SelectButton>
									);
								})}
							</Box>
						</Box>
					);
				})}

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}

const tendencyList = [
	{
		title: '누구와 떠나시나요?',
		multi: true,
		list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
	},
	{title: '테마는 무엇인가요?', multi: true, list: ['힐링', '에너제틱', '배움이 있는', '맛있는']},
	{
		title: '무엇을 하고싶으신가요?',
		multi: true,
		list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '역사여행'],
	},
	{
		title: '뭘하고싶나요?',
		multi: true,
		list: ['바다', '산', '드라이브코스', '산책', '쇼핑', '자연경관', '시티투어', '지역축제', '전통한옥'],
	},
	{
		title: '언젠데요?',
		multi: true,
		list: ['봄꽃', '여름피서', '가을단풍', '겨울스포츠,설경', '온천'],
	},
];
