import {
    Calculate as CalculateIcon, PersonOutline as PersonalDetailsIcon, MonetizationOn as FinancialDetailsIcon, 
    AppRegistration as RegistrationDetailsIcon, Lock as TermsOfUseIcon,
    Email as ContactUsIcon, Share as ShareIcon, Logout as LogoutIcon, 
    StarBorder as MedaltIcon, Rule as MissDataIcon,
    KeyboardArrowDown as ArrowDownIcon, KeyboardArrowUp as ArrowUpIcon, Done as OKIcon, Close as CancelIcon,
    CheckCircle as SuccessIcon, Error as ErrorIcon, Warning as WarningIcon, Message as MessageIcon, Close as CloseIcon,  
    Menu as MenuIcon, MoreVert as MoreIcon,
} from '@mui/icons-material'


const LoadingIcon = ({ onClick }) => { return (<svg onClick={onClick} aria-label="Loading..." className="loading" role="img" viewBox="0 0 100 100"><rect className="xwn9dsr" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect><rect className="xwn9dsr" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect></svg>) }
const CartIcon = ({ onClick }) => {  return (<svg onClick={onClick} viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="false" focusable="false" data-spm-anchor-id="a2g0o.detail.header.i0.3facDi4kDi4khL"><path d="M277.333333 938.666667a64 64 0 1 0 0-128 64 64 0 0 0 0 128z m469.333334 0a64 64 0 1 0 0-128 64 64 0 0 0 0 128zM13.610667 103.936a32 32 0 0 1 42.453333-15.658667 174.293333 174.293333 0 0 1 99.626667 133.717334l0.213333 1.984 711.808 0.021333a74.666667 74.666667 0 0 1 74.538667 70.570667l0.128 4.096a74.666667 74.666667 0 0 1-0.384 7.466666l-0.469334 3.733334-57.152 376.533333a96 96 0 0 1-90.346666 81.493333l-4.565334 0.106667H236.010667a96 96 0 0 1-94.869334-81.28l-0.597333-4.522667-44.416-415.978666-0.426667-1.237334a31.872 31.872 0 0 1-1.109333-5.909333L94.442667 256c0-1.045333 0.042667-2.069333 0.149333-3.072l0.064-0.554667-1.877333-17.493333a110.293333 110.293333 0 0 0-58.965334-86.272l-4.544-2.218667a32 32 0 0 1-15.658666-42.453333zM204.16 675.413333a32 32 0 0 0 28.8 28.458667l3.029333 0.149333h553.450667a32 32 0 0 0 31.061333-24.32l0.576-2.88 57.152-376.533333a10.666667 10.666667 0 0 0-8.64-12.096l-1.92-0.170667-704.874666-0.021333 41.386666 387.413333z"></path></svg>) }
const RollbackIcons = ({ onClick }) => {  return (<svg onClick={onClick} className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1lrr7yx-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AutorenewIcon"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6m6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26"></path></svg>) }


export {
    CalculateIcon,
    PersonalDetailsIcon,
    FinancialDetailsIcon,
    RegistrationDetailsIcon,
    TermsOfUseIcon,
    ContactUsIcon,
    ShareIcon,
    LogoutIcon,
    MedaltIcon,
    MissDataIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    OKIcon,
    CancelIcon,
    RollbackIcons,

    SuccessIcon,
    ErrorIcon,
    WarningIcon,
    MessageIcon,
    CloseIcon,
    MenuIcon,
    MoreIcon,
    LoadingIcon,
    CartIcon
}

export const IconSizes = { 
    Small: { fontSize: 20 },
    Medium: { fontSize: 25 },
    Large: { fontSize: 30 },
}
