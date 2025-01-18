import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

function LoadClerkScript() {
  const { getToken } = useAuth();

  useEffect(() => {
    const loadScript = async () => {
      const token = await getToken();
      const script = document.createElement('script');
      script.src = 'https://clerk.datafortress.shop/npm/@clerk/clerk-js@5/dist/clerk.browser.js';
      script.async = true;
      script.onload = () => {
        // Script yüklendiğinde çalışacak kod
      };
      script.onerror = () => {
        console.error('Script yüklenirken hata oluştu.');
      };
      script.setAttribute('Authorization', `Bearer ${token}`);
      document.head.appendChild(script);
    };

    loadScript();
  }, [getToken]);

  return null;
}

export default LoadClerkScript;
