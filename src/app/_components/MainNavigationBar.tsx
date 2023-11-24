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
  };
  return (
    <div
      className="lg:flex lg:flex-row lg:align-middle lg:justify-between | flex flex-col h-min "
      style={{
        backdropFilter: 'blur(50px)',
        backgroundColor: '#fff1',
        paddingRight: '150px',
        padding: '10px 50px',
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
          gap: '20px',
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
