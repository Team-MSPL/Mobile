import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppSelector} from '../../redux';
import {Linking} from 'react-native';

export default function NeedVersionUpdate() {
	const {updateStoreUrl} = useAppSelector(state => state.settingSlice);
	const checkNetwork = async () => {
		Linking.openURL(updateStoreUrl);
	};
	return (
		<Container>
			<ViewContaniner>
				<Guide>새로운 여행을 위해 업데이트가 필요해요!</Guide>
				<CustomButton label={'업데이트'} onPress={checkNetwork} width={50} />
			</ViewContaniner>
		</Container>
	);
}

const Container = styled.View`
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(250, 250, 255, 0.9);
`;
const Guide = styled.Text`
	font-size: 16px;
	text-align: center;
	line-height: 24.5px;
	font-weight: 500;
	color: black;
`;
const ViewContaniner = styled.Pressable`
	background-color: white;
	width: 80%;
	border-radius: 5px;
	border-width: 1px;
	padding: 20px;
	border-color: ${colors.selectButton};
`;
