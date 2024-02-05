import styled from 'styled-components/native';
import Home from '../../../public/home.svg';
import Place from '../../../public/place.svg';
import Cancel from '../../../public/cancel.svg';
import Check from '../../../public/check.svg';
import Map from '../../../public/map.svg';
import Right from '../../../public/right.svg';
import AirPlain from '../../../public/airplain.svg';
import Calendar from '../../../public/calendar.svg';
import Community from '../../../public/community.svg';
import Profile from '../../../public/profile.svg';
// import RightAdd from '../../../public/rightAdd.svg';
import Picture from '../../../public/picture.svg';
import MileStone from '../../../public/milestone.svg';
import Review from '../../../public/review.svg';
import Start from '../../../public/start.svg';
import Coffee from '../../../public/coffee.svg';
import MapIcon from '../../../public/map-view.svg';
import DanimText from '../../../public/danim-text.svg';
import LoginLogo from '../../../public/login-logo.svg';
import AppleLogo from '../../../public/logo-apple.svg';
import GoogleLogo from '../../../public/logo-google.svg';
import KakaoLogo from '../../../public/logo-kakao.svg';
import GuestLogo from '../../../public/ic-guest.svg';

import Call from '../../../public/call.svg';
import Location from '../../../public/location.svg';
import Infos from '../../../public/infos.svg';
import Share from '../../../public/share.svg';
import Help from '../../../public/ic_help.svg';
import RightAdd from '../../../public/right-add.svg';
import RegionRecommend from '../../../public/region-recommend.svg';
import CalendarRecommend from '../../../public/calendar-recommend.svg';
import HomeUp from '../../../public/home-up.svg';
import HomeDown from '../../../public/home-down.svg';

export const SvgHome = styled(Home)<{color: string; marginRight?: number}>`
	color: color;
	margin: 0px ${props => props.marginRight ?? 0}px 0px 0px;
`;
export const SvgPlace = styled(Place)<{color: string; marginRight?: number}>`
	color: color;
	margin: 0px ${props => props.marginRight ?? 0}px 0px 0px;
`;
export const SvgCancel = styled(Cancel)<{color: string}>`
	color: color;
`;
export const SvgCheck = styled(Check)<{color: string}>`
	color: color;
`;
export const SvgMap = styled(Map)<{color?: string}>`
	color: color;
`;
export const SvgRight = styled(Right)<{color?: string; transform?: number}>`
	color: color;
	transform: rotate(${props => (props.transform == null ? 0 : props.transform)}deg);
`;
export const SvgAirplain = styled(AirPlain)<{color?: string}>`
	color: color;
`;
export const SvgCalendar = styled(Calendar)<{color?: string}>`
	color: color;
`;
export const SvgCommunity = styled(Community)<{color?: string}>`
	color: color;
`;
export const SvgProfile = styled(Profile)<{color?: string}>`
	color: color;
`;
// export const SvgRightAdd = styled(RightAdd)<{color?: string}>`
// 	color: color;
// `;
export const SvgPicture = styled(Picture)<{color?: string}>`
	color: color;
`;
export const SvgMilestone = styled(MileStone)<{color?: string}>`
	color: color;
`;
export const SvgReview = styled(Review)<{color?: string}>`
	color: color;
`;
export const SvgStart = styled(Start)<{color?: string}>`
	color: color;
`;
export const SvgCoffee = styled(Coffee)<{color?: string}>`
	color: color;
`;
export const SvgMapIcon = styled(MapIcon)<{color?: string}>`
	color: color;
`;
export const SvgDanimText = styled(DanimText)<{color?: string}>`
	color: color;
`;
export const SvgLoginLogo = styled(LoginLogo)<{color?: string}>`
	color: color;
`;
export const SvgKakao = styled(KakaoLogo)<{color?: string}>`
	color: color;
`;
export const SvgGoogle = styled(GoogleLogo)<{color?: string}>`
	color: color;
`;
export const SvgApple = styled(AppleLogo)<{color?: string}>`
	color: color;
`;
export const SvgGuest = styled(GuestLogo)<{color?: string}>`
	color: color;
`;
export const SvgLocation = styled(Location)<{color?: string}>`
	color: color;
`;
export const SvgCall = styled(Call)<{color?: string}>`
	color: color;
`;
export const SvgInfos = styled(Infos)<{color?: string}>`
	color: color;
`;
export const SvgShare = styled(Share)<{color?: string}>`
	color: color;
`;
export const SVGHelp = styled(Help)<{color?: string}>`
	color: color;
`;
export const SVGRightAdd = styled(RightAdd)<{color?: string}>`
	color: color;
`;
export const SVGRegionRecommend = styled(RegionRecommend)<{color?: string; transform?: boolean}>`
	color: color;
	transform: scaleX(${props => (props.transform ? -1 : 1)});
`;
export const SVGCalendarRecommend = styled(CalendarRecommend)<{color?: string}>`
	color: color;
`;
export const SVGHomeUp = styled(HomeUp)<{color?: string}>`
	color: color;
`;
export const SVGHomeDown = styled(HomeDown)<{color?: string}>`
	color: color;
`;
