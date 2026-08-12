import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AdminInbox } from './components/AdminInbox';
import './index.css';

function Root() {
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash.replace(/^#/, '') === 'admin',
  );

  useEffect(() => {
    const onHash = () => {
      setIsAdmin(window.location.hash.replace(/^#/, '') === 'admin');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (isAdmin) {
    return (
      <AdminInbox
        onBack={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
