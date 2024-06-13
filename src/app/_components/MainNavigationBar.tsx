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
      className="lg:flex-row lg:align-middle lg:justify-between lg:pl-[30px] lg:pr-[50px] | p-[10px] pt-[20px] pb-[20px]"
      style={{
        justifyContent: "space-between",
        backdropFilter: "blur(19px)",
        backgroundColor: "#0008",
        alignItems: "center",
        userSelect: "none",
        position: "sticky",
        display: "flex",
        width: "100vw",
        zIndex: 10, // It works
        right: 0,
        left: 0,
        top: 0,
      }}
    >
      <BrandTitleLogo title={page_content.title} />
      <div style={{ width: "30px" }}></div>
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
      <HoverMenuButtom primary_links={primary_links}>
        {Object.keys(primary_links).map((val: any, idx) => (
          <NavLink url={primary_links[val]} name={val} key={idx} />
        ))}
      </HoverMenuButtom>
    </div>
  );
}

export default MainNavigationBar;
