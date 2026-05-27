import './App.scss'
import './styles/core.scss'
import { TopBar } from './components/Header/TopBar.jsx'
import MainContent from './components/MainContent.jsx'
import Login from './pages/Login/Login.jsx'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './services/firebaseConfig'


function App() {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
        if (usuario) {
          await usuario.reload();

          setUser({
            uid: usuario.uid,
            email: usuario.email,
            displayName: usuario.displayName || null,
          });
        } else {
          setUser(null);
        }

        setLoadingAuth(false);
      });

      return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
  }

  // ⛔ evita piscar tela
  if (loadingAuth) {
    return <div>Carregando...</div>
  }

  // 🔐 não logado
  if (!user) {
    return (
      <Login
        onLoginSuccess={(usuarioLogado) => {
          setUser(usuarioLogado)
        }}
        onCadastroSucesso={(usuarioAtualizado) => {
          setUser(usuarioAtualizado)
        }}
      />
    )
  }

  // ✅ logado
  return (
    <div className="app">
      <TopBar 
        user={user} 
        onLogout={handleLogout} 
      />

      <div className="app__layout">
        <MainContent />
      </div>
    </div>
  )
}

export default App