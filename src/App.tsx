import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import AppRoutes from './routes/AppRoutes';

// Configuração para desenvolvimento - desabilita verificação de certificado
if (import.meta.env.DEV) {
  // Isso ajuda com certificados SSL auto-assinados em desenvolvimento
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;