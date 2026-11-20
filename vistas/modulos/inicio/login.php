<style>
  body.login-page {
    margin: 0;
    height: 100vh;
    background: radial-gradient(circle at top, #0b1220, #0f1a2b, #060a12);
    overflow: hidden;
    font-family: 'Segoe UI', sans-serif;

    background:
      linear-gradient(rgba(11, 18, 32, 0.75), rgba(11, 18, 32, 0.85)),
      url('vistas/img/fondo-microexpress.jfif') no-repeat center center fixed;
    background-size: cover;
  }

  body.login-page::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    /* Desactivado para que no tape la imagen de fondo */
    display: none;
  }

  body.login-page::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 20%, rgba(0, 140, 255, 0.15), transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(0, 255, 200, 0.08), transparent 40%);
    animation: floatBg 10s ease-in-out infinite alternate;
  }

  @keyframes floatBg {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.05);
    }
  }

  .login-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
  }

  /* Glass card */
  .login-container {
    width: 100%;
    max-width: 380px;
    padding: 40px;
    border-radius: 16px;

    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(0, 140, 255, 0.10);

    text-align: center;
    position: relative;
    z-index: 2;
  }

  /* LOGO */
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 22px;
  }

  .logo img {
    width: 100%;
    max-width: 260px;
    height: auto;
    object-fit: contain;

    filter: brightness(1.1) contrast(0.95) drop-shadow(0 0 18px rgba(0, 140, 255, 0.25));

    opacity: 0.92;

    mix-blend-mode: screen;

    transition: all 0.4s ease;
  }

  .logo img:hover {
    transform: scale(1.04);
    filter: brightness(1.2) contrast(1) drop-shadow(0 0 25px rgba(0, 140, 255, 0.4));
  }

  /* TEXTOS */
  .login-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .login-subtitle {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 25px;
  }

  /* INPUTS */
  .login-container input {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 12px;

    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    background: rgba(255, 255, 255, 0.05);
    color: white;

    outline: none;
    transition: 0.3s;
    box-sizing: border-box;
  }

  .login-container input:focus {
    border-color: rgba(0, 140, 255, 0.6);
    box-shadow: 0 0 10px rgba(0, 140, 255, 0.3);
  }

  .login-container label {
    display: block;
    text-align: left;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
  }

  /* BOTÓN */
  .login-container button {
    width: 100%;
    padding: 12px;

    border: none;
    border-radius: 10px;

    background: linear-gradient(135deg, #008cff, #00ffd0);
    color: #0b1220;

    font-weight: bold;
    letter-spacing: 1px;

    cursor: pointer;
    transition: 0.3s;
  }

  .login-container button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 140, 255, 0.25);
  }

  /* ACCESO PÚBLICO PARA CLIENTES */
  .cliente-divider {
    display: flex;
    align-items: center;
    margin: 20px 0 14px 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }

  .cliente-divider::before,
  .cliente-divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .cliente-divider span {
    padding: 0 10px;
  }

  .btn-consulta-cliente {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    border: 1px solid rgba(0, 255, 208, 0.45);
    background: rgba(0, 255, 208, 0.06);
    color: #00ffd0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-decoration: none;
    box-sizing: border-box;
    transition: 0.3s;
  }

  .btn-consulta-cliente:hover {
    background: rgba(0, 255, 208, 0.16);
    border-color: #00ffd0;
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 255, 208, 0.18);
  }

  /* ERROR */
  .alert {
    background: rgba(255, 0, 0, 0.15);
    color: #ffb3b3;
    border: 1px solid rgba(255, 0, 0, 0.3);
    font-size: 0.85rem;
  }
</style>

<div class="login-wrapper">

  <div class="login-container">

    <div class="logo">
      <img src="vistas/img/micrologo3.png">
    </div>

    <div class="login-title">SISTEMA RMA</div>

    <div class="login-subtitle">
      Servicio técnico y gestión inteligente
    </div>

    <?php if (!empty($error)): ?>
      <div class="alert">
        <?= $error ?>
      </div>
    <?php endif; ?>

    <form method="POST">

      <label>Usuario</label>
      <input type="text" id="usuario" name="usuario" required>

      <label>Contraseña</label>
      <input type="password" id="contrasena" name="contrasena" required>
      <button type="button" id="ingresarLogin">
        INGRESAR
      </button>
    </form>

    <div class="cliente-divider">
      <span>¿Sos cliente?; Consulta el estado de tu equipo en RMA aquí</span>
    </div>

    <a href="./" class="btn-consulta-cliente">
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      CONSULTAR ESTADO DE EQUIPO
    </a>

  </div>

</div>