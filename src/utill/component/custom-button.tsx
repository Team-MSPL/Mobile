import {Button, Text} from 'native-base';

export default function CustomButton({label, onPress, isDisabled}: CustomButtonProps) {
	return (
		<Button onPress={onPress} bgColor='#ABD9FF' borderRadius='10px' isDisabled={isDisabled}>
			<Text color='white' bold>
				{label}
			</Text>
		</Button>
	);
}

type CustomButtonProps = {
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
};
