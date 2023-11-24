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
      className="bg-[#0005] hover:bg-[#FFF5]"
      href={url}
      style={{
        borderRadius: '100px',
        whiteSpace: 'nowrap',
        height: 'min-content',
        padding: '5px 17px',
        width: 'min-content',
        fontSize: '20px',
        transition: 'all',
        transitionDuration: '400ms',
      }}
    >
      {name}
    </Link>
  );
}
