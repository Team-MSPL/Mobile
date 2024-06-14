import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {useAppSelector} from '../../redux';
import {Linking} from 'react-native';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {PretendardVariableText} from '../../utill/layout/layout';

export default function NeedVersionUpdate() {
	const {updateStoreUrl} = useAppSelector(state => state.settingSlice);
	const checkNetwork = async () => {
		Linking.openURL(updateStoreUrl);
	};
	return (
		<Container>
			<ViewContaniner>
				<PretendardVariableText size={18} lineHeight={22} color={colors.Black}>
					새로운 여행을 위해 업데이트가 필요해요!
				</PretendardVariableText>
				<CustomButton label={'업데이트'} onPress={checkNetwork} width={widthPercentage(200)} />
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
	background-color: rgba(0, 0, 0, 0.2);
`;
const ViewContaniner = styled.Pressable`
	background-color: white;
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(200)}px;
	align-items: center;
	justify-content: space-between;
	border-radius: 12px;
	border-width: 1px;
	padding: ${widthPercentage(20)}px;
	border-color: ${colors.backgroundWhite};
`;
