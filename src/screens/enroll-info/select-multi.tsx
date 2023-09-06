import {useState} from 'react';
import SelectAccommodation from '../../utill/component/templet/select-accommodation';
import SelectEssential from '../../utill/component/templet/select-essential';
import {Text, ScrollView, VStack, HStack, Divider, Spacer} from 'native-base';
import CustomButton from '../../utill/component/custom-button';

export default function SelectMulti({navigation}: any) {
	const [accommodation, setAccommodation] = useState(false);
	const [essential, setEssential] = useState(false);
	const goNext = () => {
		navigation.navigate('SelectDistance');
	};

	const openAccommodation = () => {
		setAccommodation(!accommodation);
	};

	const openEssential = () => {
		setEssential(!essential);
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					여행 일정 등록
				</Text>
				<Text fontSize='md' color='grey'>
					미리 정한 장소가 있나요?
				</Text>
				<Divider my='1' />
				<HStack space='3'>
					<Text>로고</Text>
					<Text fontSize='lg' bold>
						숙소
					</Text>
					<Spacer />
					<Text onPress={openAccommodation}>열어보자</Text>
				</HStack>
				<Divider my='1' />
				{accommodation && <SelectAccommodation navigation={navigation} />}
				<HStack space='3'>
					<Text>로고</Text>
					<Text fontSize='lg' bold>
						필수 여행지
					</Text>
					<Spacer />
					<Text onPress={openEssential}>열어보자</Text>
				</HStack>
				<Divider my='1' />
				{essential && <SelectEssential navigation={navigation} />}

				<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
