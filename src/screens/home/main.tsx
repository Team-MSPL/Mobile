import { Flex,Text,Center,Box,ScrollView,Button,VStack} from 'native-base';

export default function Main(){
	return(
		<ScrollView  bgColor='#EFFBFB' p='2'>    
			<Text fontSize='2xl' bold color='#2E9AFE' >나느네
				<Text fontSize='2xl' color='black'>님,{'\n'}다님과 떠나볼까요?</Text>
			</Text>
			<Center my='5'>
				<Center bgColor='white' w='300' h='200' borderRadius='10px' borderWidth='1px' borderColor='grey'>
					<Button w='100' h='100' borderRadius='99px' bgColor='#58D3F7'>
                +{/* 플러스는 아이콘이나 svg하면 될듯 지금은 그냥 이걸로함 */}
					</Button>
					<Text mt='4' bold>새로운 일정 만들기</Text>
					<Text>새로운 여정을 추가해보세요</Text>
				</Center>
			</Center>
			<VStack my='3'>
				<Text fontSize='md' bold>여긴 어때요?</Text>
				<Text fontSize='sm' color='grey'>다님에서 최대 검색지를 찾아봤어요</Text>
			</VStack>
         

		</ScrollView>
	);
}