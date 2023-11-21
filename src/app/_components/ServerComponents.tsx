import Link from 'next/link';
import { PiRadio } from 'react-icons/pi';

export function BrandTitleLogo({ title }: { title: string }) {
  return (
    <Link
      href={'/'}
      style={{
        fontFamily: 'Times New Roman, Times, serif',
        alignItems: 'center',
        fontSize: '35px',
        display: 'flex',
        gap: '20px',
      }}
    >
      <PiRadio style={{ fontSize: '45px' }} />
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{title}</span>
    </Link>
  );
}

export function NavLink({ url, name }: { url: string; name: string }) {
  return (
    <Link
      className="bg-[#FFF2] hover:bg-[#FFF4] transition duration-[400ms]"
      href={url}
      style={{
        borderRadius: '100px',
        padding: '3px 17px',
        fontSize: '20px',
        width:"min-content",
        whiteSpace: 'nowrap',
      }}
    >{name}</Link>
  );
}
