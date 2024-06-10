import styled from 'styled-components/native';
import Home from '../../../public/home.svg';
import Place from '../../../public/place.svg';
import Cancel from '../../../public/cancel.svg';
import Check from '../../../public/check.svg';
import Right from '../../../public/right.svg';
import AirPlain from '../../../public/airplain.svg';
import Calendar from '../../../public/calendar.svg';
import Community from '../../../public/community.svg';
import Profile from '../../../public/profile.svg';
import Picture from '../../../public/picture.svg';
import Start from '../../../public/start.svg';
import Coffee from '../../../public/coffee.svg';
import MapIcon from '../../../public/map-view.svg';
import DanimText from '../../../public/danim-text.svg';
import LoginLogo from '../../../public/login-logo.svg';
import AppleLogo from '../../../public/logo-apple.svg';
import GoogleLogo from '../../../public/logo-google.svg';
import KakaoLogo from '../../../public/logo-kakao.svg';

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
import Plus from '../../../public/plus.svg';
import Good from '../../../public/good.svg';
import Minus from '../../../public/minus.svg';
import Flag from '../../../public/flag.svg';

import Spring from '../../../public/spring.svg';
import Summer from '../../../public/summer.svg';
import Fall from '../../../public/fall.svg';
import Winter from '../../../public/winter.svg';
import NoteList from '../../../public/note-list.svg';
import Copy from '../../../public/copy.svg';
import Camera from '../../../public/camera.svg';
import Coin from '../../../public/coin.svg';
import DanimLogo from '../../../public/danim-logo.svg';
import Heart from '../../../public/heart.svg';
import EmptyHeart from '../../../public/emptyHeart.svg';
import MessageSquare from '../../../public/message-square.svg';
import Pencil from '../../../public/pencil.svg';
import ReviewPencil from '../../../public/review-pencil.svg';
import Maps from '../../../public/maps.svg';
import TravlePencil from '../../../public/travlePenceil.svg';
import MoreHorizontal from '../../../public/more-horizontal.svg';

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
export const SvgPicture = styled(Picture)<{color?: string}>`
	color: color;
`;
export const SvgStart = styled(Start)<{color?: string}>`
	color: color;
`;
export const SvgMapIcon = styled(MapIcon)<{color?: string}>`
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
export const SVGRightAdd = styled(RightAdd)<{color?: string; transform?: number}>`
	color: color;
	transform: rotate(${props => (props.transform == null ? 0 : props.transform)}deg);
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
export const SVGPlus = styled(Plus)<{color?: string; rotate?: number}>`
	color: color;
	transform: rotate(${props => props.rotate ?? 0}deg);
`;
export const SVGGood = styled(Good)<{color?: string}>`
	color: color;
`;
export const SVGMinus = styled(Minus)<{color?: string}>`
	color: color;
`;
export const SVGFlag = styled(Flag)<{color?: string}>`
	color: color;
`;

export const SVGSpring = styled(Spring)<{color?: string}>`
	color: color;
`;
export const SVGSummer = styled(Summer)<{color?: string}>`
	color: color;
`;
export const SVGFall = styled(Fall)<{color?: string}>`
	color: color;
`;
export const SVGWinter = styled(Winter)<{color?: string}>`
	color: color;
`;
export const SVGNoteList = styled(NoteList)<{color?: string}>`
	color: color;
`;
export const SVGCopy = styled(Copy)<{color?: string}>`
	color: color;
`;
export const SVGCamera = styled(Camera)<{color?: string}>`
	color: color;
`;
export const SVGCoin = styled(Coin)<{color?: string}>`
	color: color;
`;
export const SVGDanimLogo = styled(DanimLogo)<{color?: string}>`
	color: color;
`;
export const SVGHeart = styled(Heart)<{color?: string}>`
	color: color;
`;
export const SVGMessageSquare = styled(MessageSquare)<{color?: string}>`
	color: color;
`;
export const SVGPencil = styled(Pencil)<{color?: string}>`
	color: color;
`;
export const SVGReviewPencil = styled(ReviewPencil)<{color?: string}>`
	color: color;
`;
export const SVGMaps = styled(Maps)<{color?: string}>`
	color: color;
`;
export const SVGTravlePencil = styled(TravlePencil)<{color?: string}>`
	color: color;
`;
export const SVGEmptyHeart = styled(EmptyHeart)<{color?: string}>`
	color: color;
`;
export const SVGMoreHorizontal = styled(MoreHorizontal)<{color?: string}>`
	color: color;
`;
