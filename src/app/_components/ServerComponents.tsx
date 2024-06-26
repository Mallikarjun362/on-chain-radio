import Link from "next/link";
import { PiRadio } from "react-icons/pi";

export function BrandTitleLogo({ title }: { title: string }) {
  return (
    <Link
      href={"/"}
      style={{
        fontFamily: "Times New Roman, Times, serif",
        alignItems: "center",
        display: "flex",
        gap: "10px",
      }}
    >
      <PiRadio style={{ fontSize: "45px" }} />
      <span
        style={{ display: "block", fontSize: "30px", whiteSpace: "nowrap" }}
      >
        {title}
      </span>
    </Link>
  );
}

export function NavLink({ url, name }: { url: string; name: string }) {
  return (
    <Link
      className="bg-[#FFF2] hover:bg-[#FFF5] hover:border-[#FFF] border-[#FFF2]"
      href={url}
      style={{
        borderRadius: "100px",
        borderWidth: "2px",
        whiteSpace: "nowrap",
        height: "min-content",
        padding: "5px 17px",
        width: "min-content",
        fontSize: "20px",
        transition: "all",
        transitionDuration: "400ms",
      }}
    >
      {name}
    </Link>
  );
}
