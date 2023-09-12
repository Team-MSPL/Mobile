import styled from 'styled-components/native';
export default function Policy5() {
	return (
		<>
			<TextContainer>
				<TitleText>제5장 과오금, 피해보상 등</TitleText>
			</TextContainer>

			<TextContainer>
				<MainText> 제30조 취소 및 환불</MainText>
				<SubText>
					{' '}
					(1) 회원은 다음 각 호의 사항에 따라 사이트 및 앱에서 구입한 "콘텐츠"의 환불 또는 변경을 요청할 수
					있습니다. 단, "콘텐츠"를 다운로드 또는 실시간 스트리밍 서비스를 통해 열어보았다면 제공한 "콘텐츠"를
					이미 이용한 것으로 간주하여 환불이 불가능합니다.{'\n '}
					(2) 구매한 "콘텐츠"는 다운로드 또는 스트리밍으로 이용하지 않은 경우 전액 환불이 가능합니다. {'\n '}
					(3) 다음 각 호의 경우에는 이용자가 환불을 요청할 수 없습니다.- "콘텐츠"를 다운로드 또는 스트리밍
					서비스를 통해 열람한 경우 - 서비스 업데이트를 통한 문제 해결이 가능함에도 회원의 의사로 이를
					거부하여 서비스를 이용하지 못하는 경우- 회원의 실수로 해당 서비스를 이용하지 못하는 경우{'\n '}
					(4) 개별 서비스의 성격에 따라 회사는 별도 약관 및 이용조건에 따른 취소 및 환불 규정을 정할 수
					있으며, 이 경우 개별 약관 및 이용조건 상의 취소 및 환불규정이 우선 적용됩니다.{'\n '}
					(5) 기타 본 약관 및 사이트의 이용안내에 규정되지 않은 취소 및 환불에 대한 사항에 대해서는 소비자
					피해보상규정에서 정한 바에 따릅니다.
				</SubText>
			</TextContainer>
			<TextContainer>
				<MainText>제31조(과오금)</MainText>
				<SubText>
					{' '}
					① "회사"는 과오금이 발생한 경우 이용대금의 결제와 동일한 방법으로 과오금 전액을 환불하여야 합니다.
					다만, 동일한 방법으로 환불이 불가능할 때는 이를 사전에 고지합니다.{'\n '}② "회사"의 책임 있는 사유로
					과오금이 발생한 경우 "회사"는 계약비용, 수수료 등에 관계없이 과오금 전액을 환불합니다. 다만,
					"이용자"의 책임 있는 사유로 과오금이 발생한 경우, "회사"가 과오금을 환불하는 데 소요되는 비용은
					합리적인 범위 내에서 "이용자"가 부담하여야 합니다.{'\n '}③ 회사는 "이용자"가 주장하는 과오금에 대해
					환불을 거부할 경우에 정당하게 이용대금이 부과되었음을 입증할 책임을 집니다.{'\n '}④ "회사"는
					과오금의 환불절차를 디지털콘텐츠이용자보호지침에 따라 처리합니다.
				</SubText>
			</TextContainer>
			<TextContainer>
				<MainText>제32조(콘텐츠하자 등에 의한 이용자피해보상)</MainText>
				<SubText>
					{' '}
					"회사"는 콘텐츠하자 등에 의한 이용자피해보상의 기준·범위·방법 및 절차에 관한 사항을
					디지털콘텐츠이용자보호지침에 따라 처리합니다.
				</SubText>
			</TextContainer>
			<TextContainer>
				<MainText>제33조(면책조항)</MainText>
				<SubText>
					{' '}
					① "회사"는 천재지변 또는 이에 준하는 불가항력으로 인하여 "콘텐츠"를 제공할 수 없는 경우에는 "콘텐츠"
					제공에 관한 책임이 면제됩니다.{'\n '}② "회사"는 "이용자"의 귀책사유로 인한 콘텐츠이용의 장애에
					대하여는 책임을 지지 않습니다.{'\n '}③ "회사"는 "회원"이 "콘텐츠"와 관련하여 게재한 정보, 자료,
					사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.{'\n '}④ "회사"는 "이용자" 상호간
					또는 "이용자"와 제3자 간에 "콘텐츠"를 매개로 하여 발생한 분쟁 등에 대하여 책임을 지지 않습니다.
				</SubText>
			</TextContainer>
			<TextContainer>
				<MainText>제34조(분쟁의 해결)</MainText>
				<SubText>
					{' '}
					"회사"는 분쟁이 발생하였을 경우에 "이용자"가 제기하는 정당한 의견이나 불만을 반영하여 적절하고
					신속한 조치를 취합니다. 다만, 신속한 처리가 곤란한 경우에 "회사"는 "이용자"에게 그 사유와 처리일정을
					통보합니다.
				</SubText>
			</TextContainer>
		</>
	);
}

const TextContainer = styled.View`
	margin-bottom: 30px;
	padding-horizontal: 10px;
`;
const TitleText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: black;
`;

const MainText = styled.Text`
	margin-bottom: 20px;
	font-size: 15px;
	line-height: 20px;
	color: black;
	font-weight: bold;
`;

const SubText = styled.Text`
	font-size: 13px;
	color: black;
	line-height: 20px;
	margin-bottom: 10px;
`;
