import { useEffect } from 'react';

const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#db2777;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="512" height="512" rx="128" ry="128" fill="url(#grad)" />
  <path d="M220 350h-45V162h45v188zm-22.5-214c-15 0-26-10.5-26-25s11-25 26-25 26 10.5 26 25-11 25-26 25zm134.5 214h-45V228c0-26.5 0-60-38-60-38.5 0-44.5 28.5-44.5 58v124h-45V162h43v26h1.5c6-11 20.5-28 51.5-28 55 0 65 36 65 83v107z" fill="white" />
</svg>
`;

export function Favicon() {
  useEffect(() => {
    const setFavicon = () => {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = `data:image/svg+xml;utf8,${encodeURIComponent(faviconSvg)}`;
      document.getElementsByTagName('head')[0].appendChild(link);
    };

    setFavicon();
  }, []);

  return null;
}
