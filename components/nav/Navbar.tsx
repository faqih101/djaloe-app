'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/story', label: 'Story' },
    { href: '/origins', label: 'Origins' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} ref={navRef}>
      <div className="container">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="logo-btn">
            <div className="logo-wrap">
              <span className="logo-dash hidden-sm" />
              <span className="logo-txt">Djaloe</span>
              <span className="logo-txt">Coffee</span>
              <span className="logo-dash hidden-sm" />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`nav-a${isActive(l.href) ? ' active' : ''}`}>{l.label}</Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="nav-actions hidden-md">
            <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
              {dark
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </button>
            {session ? (
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                {(session.user as any).role === 'ADMIN' && (
                  <Link href="/admin" style={{ fontSize: '.6875rem', color: 'var(--primary)', letterSpacing: '.12em', textTransform: 'uppercase' }}>CMS</Link>
                )}
                <button className="btn-cta" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-cta">Login</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="show-md" style={{ alignItems: 'center', gap: '.5rem' }}>
            <button className="theme-btn" onClick={toggleTheme} aria-label="toggle theme">
              {dark
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              }
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                  : <><line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`mob-link${isActive(l.href) ? ' accent' : ''}`} onClick={() => setMenuOpen(false)}>{l.label}</Link>
        ))}
        {session ? (
          <>
            {(session.user as any).role === 'ADMIN' && (
              <Link href="/admin" className="mob-link accent" onClick={() => setMenuOpen(false)}>Admin CMS</Link>
            )}
            <button className="mob-link" style={{ color: '#ef4444', textAlign: 'left', letterSpacing: '.12em', textTransform: 'uppercase', fontSize: '.875rem' }}
              onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}>Logout</button>
          </>
        ) : (
          <Link href="/auth/login" className="mob-link accent" onClick={() => setMenuOpen(false)}>Login / Daftar</Link>
        )}
        <Link href="/contact" className="btn-cta" style={{ marginTop: '.75rem', textAlign: 'center', display: 'block', borderRadius: '9999px', padding: '.75rem 1.5rem' }} onClick={() => setMenuOpen(false)}>Visit Us</Link>
      </div>
    </nav>
  );
}
