import styled from 'styled-components/native';
import {MainViewContainer} from './policy-main';
import {PretendardBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {colors} from '../../utill/colors';
import {heightPercentage} from '../../utill/layout/responsive-size';
export default function Terms() {
	return (
		<MainViewContainer>
			<TextContainer>
				<PretendardBoldText size={20} lineHeight={24} color={colors.Black}>
					개인정보 처리방침
				</PretendardBoldText>
			</TextContainer>
			<TextContainer>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					나그네들 ('https://danim.me'이하 '다님')은(는) 「개인정보 보호법」 제30조에 따라 정보주체의
					개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
					개인정보 처리방침을 수립·공개합니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제1조(개인정보의 처리 목적)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					나그네들 ('https://danim.me'이하 '다님')은(는) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
					있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보
					보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
				</PretendardVariableText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					{' '}
					1. 홈페이지 회원가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격
					유지·관리, 각종 고지·통지 목적으로 개인정보를 처리합니다.{'\n '}
					2. 재화 또는 서비스 제공 서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 요금결제·정산을
					목적으로 개인정보를 처리합니다.{'\n '}
					3. 마케팅 및 광고에의 활용 이벤트 및 광고성 정보 제공 및 참여기회 제공 , 접속빈도 파악 또는 회원의
					서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제2조(개인정보의 처리 및 보유 기간)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 나그네들 은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
					동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. {'\n '}② 각각의 개인정보 처리 및
					보유 기간은 다음과 같습니다. {'\n '}
					1.홈페이지 회원가입 및 관리 홈페이지 회원가입 및 관리와 관련한 개인정보는 수집.이용에 관한
					동의일로부터 3년까지 위 이용목적을 위하여 보유.이용됩니다. {'\n '}
					보유근거 : 서비스 제공을 위한 인증 관련법령 : {'\n '}1{')'}대금결제 및 재화 등의 공급에 관한 기록 :
					5년 {'\n '}2{')'} 신용정보의 수집/처리 및 이용 등에 관한 기록
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제3조(처리하는 개인정보의 항목)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 나그네들 은(는) 다음의 개인정보 항목을 처리하고 있습니다. {'\n '}1 홈페이지 회원가입 및 관리
					필수항목 : 이름, 로그인ID 선택항목 : 접속 로그, 서비스 이용 기록
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제4조(개인정보의 파기절차 및 파기방법)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 나그네들 은(는) 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
					지체없이 해당 개인정보를 파기합니다.{'\n '}② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나
					처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당
					개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다. {'\n '}
					1. 법령 근거 :{'\n '}
					2. 보존하는 개인정보 항목 : 계좌정보, 거래날짜{'\n'}③ 개인정보 파기의 절차 및 방법은 다음과
					같습니다.{'\n '}
					1. 파기절차 나그네들 은(는) 파기 사유가 발생한 개인정보를 선정하고, 나그네들 의 개인정보
					보호책임자의 승인을 받아 개인정보를 파기합니다. {'\n '}
					2. 파기방법 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다. 전자적 파일
					형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제5조(개인정보의 안전성 확보조치에 관한 사항)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					나그네들 은(는) 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
					{'\n '}
					1. 개인정보에 대한 접근 제한 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의
					부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을
					이용하여 외부로부터의 무단 접근을 통제하고 있습니다.
					{'\n '}
					2. 개인정보의 암호화 이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알
					수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도
					보안기능을 사용하고 있습니다.
					{'\n '}
					3. 비인가자에 대한 출입 통제 개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해
					출입통제 절차를 수립, 운영하고 있습니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제6조(개인정보를 자동으로 수집하는 장치의 설치 운영 및 그 거부에 관한 사항)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 나그네들 은(는) 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는
					‘쿠키(cookie)’를 사용합니다.{'\n '}② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의
					컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
					{'\n '}
					가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어,
					보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.{'\n '}
					나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구{'>'}인터넷 옵션{'>'}개인정보 메뉴의 옵션
					설정을 통해 쿠키 저장을 거부 할 수 있습니다. 다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에
					어려움이 발생할 수 있습니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제7조(행태정보의 수집 이용 제공 및 거부 등에 관한 사항)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 개인정보처리자은(는) 서비스 이용과정에서 정보주체에게 최적화된 맞춤형 서비스 및 혜택, 온라인
					맞춤형 광고 등을 제공하기 위하여 행태정보를 수집·이용하고 있습니다.{'\n '}② 개인정보처리자은(는)
					다음과 같이 행태정보를 수집합니다.{'\n '}
					11. 행태정보의 수집·이용·제공 및 거부 등에 관한 사항 제공을 위해 수집하는 행태정보의 항목, 행태정보
					수집 방법, 행태정보 수집 목적, 보유·이용기간 및 이후 정보처리 방법을 입력하기 위한 표입니다.
					수집하는 행태정보의 항목 행태정보 수집 방법 행태정보 수집 목적 보유·이용기간 및 이후 정보처리 방법
					웹사이트 /앱서비스 방문이력 웹사이트/앱방문 시 자동 수집 트래픽관리 3년 온라인 맞춤형 광고 등을 위해
					제3자(온라인 광고사업자 등{')'}가 이용자의 행태정보를 수집·처리할수 있도록 허용한 경우{'\n '}③
					개인정보처리자은(는{')'} 다음과 같이 온라인 맞춤형 광고 사업자가 행태정보를 수집·처리하도록 허용하고
					있습니다.{'\n '}- 행태정보를 수집 및 처리하려는 광고 사업자 : ○○○, ○○○, ○○○, ○○○,{'\n '}- 행태정보
					수집 방법 : 이용자가 당사 웹사이트를 방문하거나 앱을 실행할 때 자동 수집 및 전송{'\n '}-
					수집·처리되는 행태정보 항목 : 이용자의 웹/앱 방문이력, 검색이력, 구매이력{'\n '}- 보유·이용기간 :
					00일{'\n '}④ 개인정보처리자은(는{')'} 온라인 맞춤형 광고 등에 필요한 최소한의 행태정보만을 수집하며,
					사상, 신념, 가족 및 친인척관계, 학력·병력, 기타 사회활동 경력 등 개인의 권리·이익이나 사생활을
					뚜렷하게 침해할 우려가 있는 민감한 행태정보를 수집하지 않습니다.{'\n '}⑤ 개인정보처리자은(는{')'} 만
					14세 미만임을 알고 있는 아동이나 만14세 미만의 아동을 주 이용자로 하는 온라인 서비스로부터 맞춤형
					광고 목적의 행태정보를 수집하지 않고, 만 14세 미만임을 알고 있는 아동에게는 맞춤형 광고를 제공하지
					않습니다.{'\n '}⑥ 개인정보처리자은(는{')'} 모바일 앱에서 온라인 맞춤형 광고를 위하여 광고식별자를
					수집·이용합니다. 정보주체는 모바일 단말기의 설정 변경을 통해 앱의 맞춤형 광고를 차단·허용할 수
					있습니다.{'\n '}‣ 스마트폰의 광고식별자 차단/허용{'\n '}
					(1{')'} (안드로이드{')'} ① 설정 → ② 개인정보보호 → ③ 광고 → ③ 광고 ID 재설정 또는 광고ID 삭제{'\n '}
					(2{')'} (아이폰{')'} ① 설정 → ② 개인정보보호 → ③ 추적 → ④ 앱이 추적을 요청하도록 허용 끔{'\n '}※
					모바일 OS 버전에 따라 메뉴 및 방법이 다소 상이할 수 있습니다.{'\n '}⑦ 정보주체는 웹브라우저의 쿠키
					설정 변경 등을 통해 온라인 맞춤형 광고를 일괄적으로 차단·허용할 수 있습니다. 다만, 쿠키 설정 변경은
					웹사이트 자동로그인 등 일부 서비스의 이용에 영향을 미칠 수 있습니다.{'\n '}‣ 웹브라우저를 통한
					맞춤형 광고 차단/허용{'\n '}
					(1) 인터넷 익스플로러(Windows 10용 Internet Explorer 11){'\n '}- Internet Explorer에서 도구 버튼을
					선택한 다음 인터넷 옵션을 선택{'\n '}- 개인 정보 탭을 선택하고 설정에서 고급을 선택한 다음 쿠키의
					차단 또는 허용을 선택{'\n '}
					(2) Microsoft Edge{'\n '}- Edge에서 오른쪽 상단 ‘…’ 표시를 클릭한 후, 설정을 클릭합니다.{'\n '}-
					설정 페이지 좌측의 ‘개인정보, 검색 및 서비스’를 클릭 후 「추적방지」 섹션에서 ‘추적방지’ 여부 및
					수준을 선택합니다.{'\n '}- ‘InPrivate를 검색할 때 항상 ""엄격"" 추적 방지 사용’ 여부를 선택합니다.
					{'\n '}- 아래 「개인정보」 섹션에서 ‘추적 안함 요청보내기’ 여부를 선택합니다.{'\n '}
					(3) 크롬 브라우저{'\n '}- Chrome에서 오른쪽 상단 ‘⋮’ 표시(chrome 맞춤설정 및 제어)를 클릭한 후, 설정
					표시를 클릭합니다.{'\n '}- 설정 페이지 하단에 ‘고급 설정 표시’를 클릭하고 「개인정보」 섹션에서
					콘텐츠 설정을 클릭합니다.{'\n '}- 쿠키 섹션에서 ‘타사 쿠키 및 사이트 데이터 차단’의 체크박스를
					선택합니다.{'\n '}
					52 | 개인정보 처리방침 작성지침 일반{'\n '}⑧ 정보주체는 아래의 연락처로 행태정보와 관련하여 궁금한
					사항과 거부권 행사, 피해 신고 접수 등을 문의할 수 있습니다.{'\n '}‣ 개인정보 보호 담당부서{'\n '}
					담당자 : 이태운{'\n '}
					연락처 : 010, tulee4734,
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제7조(추가적인 이용 제공 판단기준)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					나그네들 은(는) ｢개인정보 보호법｣ 제15조제3항 및 제17조제4항에 따라 ｢개인정보 보호법 시행령｣
					제14조의2에 따른 사항을 고려하여 정보주체의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다.
					이에 따라 나그네들 가(이) 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서 다음과 같은 사항을
					고려하였습니다.{'\n '}▶ 개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이
					있는지 여부{'\n '}▶ 개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한
					예측 가능성이 있는지 여부{'\n '}▶ 개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게
					침해하는지 여부{'\n '}▶ 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부{'\n '}※
					추가적인 이용·제공 시 고려사항에 대한 판단기준은 사업자/단체 스스로 자율적으로 판단하여 작성·공개함
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제8조(개인정보 보호책임자에 관한 사항)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 나그네들 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
					불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.{'\n '}▶
					개인정보 보호책임자{'\n '}
					성명 :이태운{'\n '}
					직책 :대표{'\n '}
					직급 :대표{'\n '}
					연락처 :01032223474, tulee3474@naver.com,{'\n '}※ 개인정보 보호 담당부서로 연결됩니다.{'\n '}②
					정보주체께서는 나그네들 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
					불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자로 문의하실 수 있습니다. 나그네들 은(는)
					정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제9조(정보주체의 권익침해에 대한 구제방법)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
					개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보침해의
					신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.{'\n '}
					1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr){'\n '}
					2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr){'\n '}
					3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr){'\n '}
					4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr){'\n '}
					「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지
					등)의 규정에 의한 요구에 대 하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의
					침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.{'\n '}※ 행정심판에
					대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기 바랍니다.
				</PretendardVariableText>
			</TextContainer>
			<TextContainer>
				<PretendardBoldText size={15} lineHeight={20} color={colors.Black} marginBottom={heightPercentage(20)}>
					제10조(개인 정보 처리방침 변경)
				</PretendardBoldText>
				<PretendardVariableText
					size={13}
					lineHeight={17}
					color={colors.Black}
					marginBottom={heightPercentage(10)}>
					① 이 개인정보처리방침은 2023년 1월 1부터 적용됩니다.
				</PretendardVariableText>
			</TextContainer>
		</MainViewContainer>
	);
}

const TextContainer = styled.View`
	margin-bottom: 30px;
	padding-horizontal: 10px;
`;
