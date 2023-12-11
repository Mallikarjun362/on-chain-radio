import { ConnectWalletButton } from './ClientComponents';
import { BrandTitleLogo, NavLink } from './ServerComponents';

interface IPageContent {
  title: string;
}

function MainNavigationBar() {
  const page_content: IPageContent = {
    title: 'On Chain Radio',
  };
  const primary_links: any = {
    // AUDIO
    Home: '/',
    Upload: '/upload',
    Streaming: '/streaming',
    Upcoming: '/upcoming',
    Profile: '/profile',
    // ROOMS
    'Join Rooms': '/join-rooms',
    'Create Rooms': '/create-rooms',
    Governance: '#',
  };
  return (
    <div
      className="flex flex-col h-min | lg:flex lg:flex-row lg:align-middle lg:justify-between "
      style={{
        backdropFilter: 'blur(80px)',
        backgroundColor: '#fff1',
        paddingRight: '150px',
        padding: '20px 50px',
        position: 'sticky',
        userSelect: 'none',
        width: '100vw',
        gap: '30px',
        top: '0',
      }}
    >
      <BrandTitleLogo title={page_content.title} />
      <div
        style={{
          alignItems: 'center',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '15px',
        }}
      >
        {Object.keys(primary_links).map((val: any, idx) => (
          <NavLink url={primary_links[val]} name={val} key={idx} />
        ))}
        <ConnectWalletButton />
      </div>
    </div>
  );
}

export default MainNavigationBar;
