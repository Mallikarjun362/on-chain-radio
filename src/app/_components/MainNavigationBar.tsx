import { ConnectWalletButton, HoverMenuButtom } from "./ClientComponents";
import { BrandTitleLogo, NavLink } from "./ServerComponents";

interface IPageContent {
  title: string;
}

function MainNavigationBar() {
  const page_content: IPageContent = {
    title: "On Chain Radio",
  };
  const primary_links: any = {
    // AUDIO
    Home: "/",
    Upload: "/upload",
    Streaming: "/streaming",
    Upcoming: "/upcoming",
    Profile: "/profile",
    // ROOMS
    "Join Rooms": "/join-rooms",
    "Create Rooms": "/create-rooms",
    Governance: "#",
  };
  return (
    <div
      className="flex lg:flex-row lg:align-middle lg:justify-between"
      style={{
        justifyContent: "space-between",
        backdropFilter: "blur(19px)",
        backgroundColor: "#0008",
        paddingRight: "150px",
        alignItems: "center",
        padding: "20px 50px",
        userSelect: "none",
        position: "sticky",
        width: "100vw",
        gap: "30px",
        zIndex: 3,
        top: "0",
      }}
    >
      <BrandTitleLogo title={page_content.title} />
      <div
        className="hidden lg:flex"
        style={{
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        {Object.keys(primary_links).map((val: any, idx) => (
          <NavLink url={primary_links[val]} name={val} key={idx} />
        ))}
        <ConnectWalletButton />
      </div>
      <HoverMenuButtom primary_links={primary_links}/>
    </div>
  );
}

export default MainNavigationBar;
