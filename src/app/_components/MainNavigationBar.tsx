import { ConnectWalletButton } from './ClientComponents';
import { BrandTitleLogo, NavLink } from './ServerComponents';

interface IPageContent {
  title: string;
}

function MainNavigationBar() {
  const page_content: IPageContent = {
    title: 'On Chain Radio',
  };
  return (
    <div
      className="lg:flex h-[80px] sm:flex-row sm:h-min"
      style={{
        justifyContent: 'space-between',
        backdropFilter: 'blur(50px)',
        backgroundColor: '#fff1',
        paddingRight: '150px',
        alignItems: 'center',
        padding: '20px 50px',
        position: 'fixed',
        userSelect: 'none',
        color: 'white',
        width: '100%',
        gap: '20px',
        top: '0',
      }}
    >
      <BrandTitleLogo title={page_content.title} />
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <NavLink url="/" name="Home" />
      <NavLink url="/rooms" name="Rooms" />
      <NavLink url="/user" name="User" />
      <ConnectWalletButton />
    </div>
  );
}

export default MainNavigationBar;
