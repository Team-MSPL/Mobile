import styled from 'styled-components/native';
import {Dimensions, Keyboard, Pressable, SafeAreaView, ScrollView} from 'react-native';
import {colors} from '../../utill/colors';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default function Festival({navigation}: any) {
	return (
		<SafeAreaView style={{backgroundColor: colors.backgroundGray}}>
			<ScrollView>
				<FestivalImage source={require('../../../public/festival.png')}></FestivalImage>
			</ScrollView>
		</SafeAreaView>
	);
}

const FestivalImage = styled.Image`
	width: ${deviceWidth}px;
	height: ${deviceHeight}px;
`;
