import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {colors} from '../../colors';
import {SvgCheck, SvgRight} from '../../svg/svg';

type Props = {
	title: string;
	open: boolean;
	onToggle: () => void;
	completed?: boolean;
	children?: React.ReactNode;
};

export default function CollapsibleSection({title, open, onToggle, completed = false, children}: Props) {
	// Controlled component: 내부에서 open 상태를 직접 변경하지 않고, 부모의 onToggle 호출만 함.
	// (애니메이션 등은 부모에서 open prop을 받고 처리하도록 권장)
	return (
		<View style={styles.sectionContainer}>
			<TouchableOpacity activeOpacity={0.85} onPress={onToggle} style={styles.sectionHeader}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={{marginRight: 8, color: colors.grey800, fontSize: 22}}>{title}</Text>
					{completed ? <SvgCheck color={colors.blue500} /> : null}
				</View>
				<SvgRight transform={open ? 90 : 0} color={colors.grey400} />
			</TouchableOpacity>
			{open ? <View style={styles.sectionBody}>{children}</View> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	sectionHeader: {
		height: 56,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionBody: {
		paddingBottom: 18,
		paddingTop: 6,
	},
});
