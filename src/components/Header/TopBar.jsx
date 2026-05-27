import './TopBar.scss'

export const TopBar = ({ user, onLogout }) => (
  <header className="top-menu">
    <span className="logo-item">Controle de Estoque</span>

    <div className="options-menu">
        <div className="name-user">
            {user.displayName && (
                <>
                Olá, <strong>{user.displayName}</strong>
                </>
            )}
        </div>

        <button className="logout-link" onClick={onLogout}>
            Sair
        </button>
    </div>
  </header>
)