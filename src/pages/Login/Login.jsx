import { useState } from "react";
import {
  loginComGoogle,
  loginComEmail,
  cadastrarComEmail,
} from "../../services/auth";
import "./Login.scss";
import eyeIcon from "../../assets/login/eye.svg";
import eyeSlashIcon from "../../assets/login/eye-slash.svg";

function traduzErroFirebase(code) {
  switch (code) {
    case "auth/invalid-credential":
      return "E-mail ou senha inválidos.";
    case "auth/user-not-found":
      return "Usuário não encontrado.";
    case "auth/wrong-password":
      return "Senha incorreta.";
    case "auth/email-already-in-use":
      return "Este email já está em uso.";
    case "auth/invalid-email":
      return "Email inválido.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "Login cancelado.";
    default:
      return "Erro ao autenticar. Tente novamente.";
  }
}

export default function Login({ onLoginSuccess, onCadastroSucesso }) {
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    senha: "",
  });

  const [touched, setTouched] = useState(false);
  const [isCadastro, setIsCadastro] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");

  const handleToggleMode = () => {
    setIsCadastro((prev) => !prev);

    setFirstName("");
    setLastName("");
    setEmail("");
    setSenha("");
    setErro("");
    setTouched(false);

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      senha: "",
    });
  };

    const handleGoogle = async () => {
    setLoading(true);
    setErro("");

    try {
        const user = await loginComGoogle();

        if (onLoginSuccess) {
        onLoginSuccess({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        });
        }
    } catch (error) {
        setErro(traduzErroFirebase(error.code));
    } finally {
        setLoading(false);
    }
    };

  const validarCampos = () => {
    const novosErros = {
      firstName: "",
      lastName: "",
      email: "",
      senha: "",
    };

    if (!email) {
      novosErros.email = "Informe o email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
      if (!emailRegex.test(email)) {
        novosErros.email = "Email inválido.";
      }
    }

    if (!senha) {
      novosErros.senha = "Informe a senha.";
    } else if (senha.length < 6) {
      novosErros.senha = "Senha deve ter no mínimo 6 caracteres.";
    }

    if (isCadastro) {
      if (!firstName.trim()) {
        novosErros.firstName = "Informe o nome.";
      }
      if (!lastName.trim()) {
        novosErros.lastName = "Informe o sobrenome.";
      }
    }

    setErrors(novosErros);
    return Object.values(novosErros).some((e) => e !== "");
  };

  const handleEmail = async () => {
    setTouched(true);
    setErro("");

    const temErro = validarCampos();
    if (temErro) return;

    setLoading(true);

    try {
      if (isCadastro) {
        const nomeCompleto = `${firstName.trim()} ${lastName.trim()}`;

        const usuarioCadastrado = await cadastrarComEmail(
          email,
          senha,
          nomeCompleto
        );

        if (onCadastroSucesso) {
          onCadastroSucesso({
            uid: usuarioCadastrado.uid,
            email: usuarioCadastrado.email,
            displayName: nomeCompleto,
          });
        }
      } else {
        const user = await loginComEmail(email, senha);

        if (onLoginSuccess) {
          onLoginSuccess({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        }
      }
    } catch (error) {
      const mensagemTraduzida = traduzErroFirebase(error.code);

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/weak-password"
      ) {
        setErrors((prev) => ({ ...prev, senha: mensagemTraduzida }));
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/email-already-in-use" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-credential"
      ) {
        setErrors((prev) => ({ ...prev, email: mensagemTraduzida }));
      } else {
        setErro(mensagemTraduzida);
      }
    } finally {
      setLoading(false);
    }
  };

  let buttonText = "Entrar";
  if (loading) buttonText = "Carregando...";
  else if (isCadastro) buttonText = "Cadastrar";

  return (
    <div className="login">
      <div className="login-card">
        <h2 className="login-title">Controle de Estoque</h2>

        <p className="login-subtitle">
          {isCadastro ? "Crie sua conta" : "Faça login para continuar"}
        </p>

        {isCadastro && (
          <div className="personal-info">
            <div>
              <input
                type="text"
                placeholder="Nome"
                className="login-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {touched && errors.firstName && (
                <span className="input-error">{errors.firstName}</span>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Sobrenome"
                className="login-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {touched && errors.lastName && (
                <span className="input-error">{errors.lastName}</span>
              )}
            </div>
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {touched && errors.email && (
            <span className="input-error">{errors.email}</span>
          )}
        </div>

        <div className="password-wrapper">
          <div className="password-label">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <img
                src={showPassword ? eyeSlashIcon : eyeIcon}
                alt="toggle senha"
              />
            </button>
          </div>

          {touched && errors.senha && (
            <span className="input-error">{errors.senha}</span>
          )}
        </div>

        <button
          className="login-button"
          onClick={handleEmail}
          disabled={loading}
        >
          {buttonText}
        </button>

        <p className="login-toggle">
          {isCadastro ? "Já tem conta?" : "Não tem conta?"}

          <button
            type="button"
            className="login-toggle-btn"
            onClick={handleToggleMode}
          >
            {isCadastro ? " Fazer login" : " Criar conta"}
          </button>
        </p>

        <div className="divider">
          <span>ou</span>
        </div>

        <button
          className="login-button google"
          onClick={handleGoogle}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar com Google"}
        </button>

        {erro && <p className="login-error">{erro}</p>}
      </div>
    </div>
  );
}