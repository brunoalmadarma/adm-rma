<div class="public-portal-wrapper">

    <!-- BARRA SUPERIOR GLASS / HUD -->
    <header class="public-navbar">
        <div class="brand-container">
            <img src="vistas/img/micrologo3.png" alt="MicroExpress" class="navbar-logo-img">
            <div class="brand-title">
                <h1>MICROEXPRESS</h1>
                <span class="sub-brand">SERVICE & SUPPORT HUB</span>
            </div>
        </div>
        <div class="header-actions">
            <a href="index.php?ruta=login" class="btn-staff-login">
                <i class="fa fa-user-secret"></i> Acceso del personal
            </a>
        </div>
    </header>

    <main class="portal-container">

        <!-- HERO SEARCH SECTION -->
        <section class="search-hero-card glass-panel-neon">
            <span class="hero-badge">TRACKING_DE_CASOS_RMA_v1.0</span>
            <h2>CONSULTA EL ESTADO DE TU EQUIPO EN TALLER</h2>
            <p>Ingresá tu número de RMA, número de serie, nombre del cliente o C.I.</p>

            <form id="formConsultaPublica" class="search-form" autocomplete="off" onsubmit="return false;">
                <div class="search-input-wrapper">
                    <i class="fa fa-search search-icon-hud"></i>
                    <input type="text" id="inputTracking" class="cyber-search-input"
                        placeholder="N° DE RMA, SERIE, NOMBRE O C.I." aria-label="Número de RMA, serie, nombre del cliente o C.I." required>
                    <button type="submit" id="btnBuscarCaso" class="btn-search-trigger">
                        RASTREAR EQUIPO
                    </button>
                </div>
            </form>
        </section>

        <section id="panelCoincidenciasConsulta" class="result-section hidden" aria-label="Casos encontrados">
            <div class="cyber-panel-card glass-panel-neon border-neon-cyan">
                <h3>Casos encontrados</h3>
                <p id="resumenCoincidenciasConsulta" role="status"></p>
                <div class="table-responsive consulta-resultados-scroll" tabindex="0" role="region" aria-label="Resultados de la consulta">
                    <table id="tablaConsultaResultados" class="consulta-resultados">
                        <thead><tr><th scope="col">RMA</th><th scope="col">Cliente</th><th scope="col">Equipo</th><th scope="col">Ingreso</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- CONTENEDOR DE RESULTADOS DEL CASO (Oculto hasta buscar) -->
        <section id="panelResultadoCaso" class="result-section hidden">

            <!-- TARJETA CABECERA DE ESTADO -->
            <div class="cyber-panel-card glass-panel-neon border-neon-cyan mb-4">
                <div class="result-header-flex">
                    <div>
                        <span class="node-label">CÓDIGO DE SEGUIMIENTO</span>
                        <h3 id="txtNumeroCaso" class="t-cyan font-mono m-0">RMA-0000</h3>
                    </div>
                    <div class="text-right">
                        <span class="node-label">ESTADO ACTUAL EN TALLER</span>
                        <div id="badgeEstadoActual" class="badge-status-lg status-1">-</div>
                    </div>
                </div>
            </div>

            <div class="portal-grid-two">

                <!-- DETALLES DEL EQUIPO Y CLIENTE -->
                <div class="cyber-panel-card glass-panel-neon border-neon-blue">
                    <div class="panel-cyber-header">
                        <h4><span class="cyan-accent">//</span> ESPECIFICACIONES DEL ACTIVO</h4>
                    </div>
                    <div class="spec-list font-mono mt-3">
                        <div class="spec-item">
                            <span class="spec-label">CLIENTE:</span>
                            <span id="txtClienteNombre" class="spec-value text-white">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">EQUIPO:</span>
                            <span id="txtEquipo" class="spec-value text-white">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">MARCA / MODELO:</span>
                            <span id="txtMarcaModelo" class="spec-value text-white">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">NÚMERO DE SERIE:</span>
                            <span id="txtNumeroSerie" class="spec-value t-cyan">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">TIPO DE SERVICIO:</span>
                            <span id="txtTipoCaso" class="spec-value">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">FECHA INGRESO:</span>
                            <span id="txtFechaIngreso" class="spec-value">-</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">FECHA CIERRE / ENTREGA:</span>
                            <span id="txtFechaCierre" class="spec-value green-accent">-</span>
                        </div>
                    </div>

                    <hr class="cyber-hr">

                    <div class="problem-box">
                        <span class="node-label">SÍNTOMA / PROBLEMA REPORTADO:</span>
                        <p id="txtDescripcionProblema" class="desc-text">-</p>
                    </div>

                    <div class="problem-box mt-3">
                        <span class="node-label text-yellow">// DIAGNÓSTICO DEL TÉCNICO:</span>
                        <p id="txtDiagnosticoFinal" class="desc-text text-white font-mono">-</p>
                    </div>

                    <div class="text-center mt-4">
                        <button type="button" id="btnImprimirComprobante" class="btn-print-receipt">
                            <i class="fa fa-print"></i> [IMPRIMIR_COMPROBANTE_PDF]
                        </button>
                    </div>
                </div>

                <!-- LÍNEA DE TIEMPO / TIMELINE DE HISTORIAL DE ESTADOS -->
                <div class="cyber-panel-card glass-panel-neon border-neon-purple">
                    <div class="panel-cyber-header">
                        <h4><span class="purple-accent">//</span> LÍNEA DE TIEMPO DEL PROCESO</h4>
                    </div>

                    <div class="timeline-container mt-3 font-mono" id="timelineContenedor">
                        <!-- Carga dinámica del historial de estados -->
                    </div>
                </div>

            </div>
        </section>

    </main>

</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');

    .consulta-resultados-scroll { max-width:100%; overflow-x:auto; }
    .consulta-resultados { width:100%; border-collapse:collapse; font-size:14px; color:#e2e8f0; }
    .consulta-resultados th, .consulta-resultados td { padding:12px 10px; text-align:left; border-bottom:1px solid #ffffff24; vertical-align:middle; }
    .consulta-resultados th { color:#b6eaf7; font-weight:600; }
    .consulta-resultados td:first-child, .consulta-resultados td:nth-child(4) { white-space:nowrap; }
    .consulta-resultados td:nth-child(3) { min-width:170px; }
    .btn-ver-consulta { border:1px solid #22d3ee; color:#a5f3fc; background:#0891b226; border-radius:6px; padding:8px 12px; min-height:38px; white-space:nowrap; }
    .btn-ver-consulta:hover { background:#0891b24d; }
    .public-portal-wrapper .rma-paginacion-inferior { color:#e2e8f0; }

    :root {
        --bg-dark-base: #0b1220;
        --glass-bg: rgba(255, 255, 255, 0.06);
        --glass-border: rgba(255, 255, 255, 0.12);
        --text-primary: #ffffff;
        --text-muted: rgba(255, 255, 255, 0.65);

        --neon-blue: #008cff;
        --neon-cyan: #00ffd0;
        --neon-purple: #a855f7;
        --neon-yellow: #fbbf24;
    }

    html,
    body,
    .wrapper,
    .content-wrapper,
    .public-portal-wrapper {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100vh !important;
        background-color: #0b1220 !important;
        background-image:
            linear-gradient(rgba(11, 18, 32, 0.78), rgba(11, 18, 32, 0.88)),
            url('vistas/img/fondo-microexpress.jfif') !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-attachment: fixed !important;
        background-size: cover !important;
        color: var(--text-primary) !important;
        font-family: 'Segoe UI', 'Rajdhani', sans-serif !important;
    }

    .public-portal-wrapper {
        position: relative;
        overflow-x: hidden;
        padding-bottom: 60px !important;
    }

    .public-portal-wrapper::before {
        content: "" !important;
        display: block !important;
        position: fixed;
        inset: 0;
        background:
            radial-gradient(circle at 20% 20%, rgba(0, 140, 255, 0.15), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 200, 0.08), transparent 40%);
        animation: floatBg 10s ease-in-out infinite alternate;
        pointer-events: none;
        z-index: 0;
    }

    @keyframes floatBg {
        from { transform: scale(1); }
        to { transform: scale(1.05); }
    }

    /* HEADER GLASSMORPHISM */
    .public-navbar {
        position: relative;
        z-index: 2;
        background: rgba(11, 18, 32, 0.65) !important;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--glass-border);
        box-shadow: 0 4px 30px rgba(0, 140, 255, 0.08);
        padding: 14px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .brand-container {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .navbar-logo-img {
        height: 36px;
        width: auto;
        object-fit: contain;
        filter: brightness(1.1) drop-shadow(0 0 12px rgba(0, 140, 255, 0.35));
        mix-blend-mode: screen;
    }

    .brand-title h1 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        letter-spacing: 1.5px;
    }

    .sub-brand {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.68rem;
        color: var(--neon-cyan);
        letter-spacing: 2px;
        display: block;
    }

    .btn-staff-login {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.85);
        padding: 8px 16px;
        border-radius: 10px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.8rem;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .btn-staff-login:hover {
        color: #ffffff;
        border-color: rgba(0, 140, 255, 0.6);
        background: rgba(0, 140, 255, 0.15);
        box-shadow: 0 0 15px rgba(0, 140, 255, 0.25);
        text-decoration: none;
    }

    /* PORTAL CONTAINER */
    .portal-container {
        position: relative;
        z-index: 2;
        max-width: 1050px;
        margin: 55px auto 0 auto;
        padding: 0 20px;
    }

    /* TARJETAS GLASS */
    .search-hero-card,
    .cyber-panel-card {
        background: var(--glass-bg) !important;
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        box-shadow: 0 0 40px rgba(0, 140, 255, 0.10);
        position: relative;
        overflow: hidden;
    }

    .search-hero-card {
        padding: 45px 40px;
        text-align: center;
    }

    .hero-badge {
        display: inline-block;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.72rem;
        color: var(--neon-cyan);
        border: 1px solid rgba(0, 255, 208, 0.4);
        padding: 3px 12px;
        border-radius: 20px;
        margin-bottom: 16px;
        background: rgba(0, 255, 208, 0.08);
        letter-spacing: 1px;
    }

    .search-hero-card h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 1px;
        margin: 0 0 10px 0;
    }

    .search-hero-card p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 28px;
    }

    .search-hero-card p strong {
        color: var(--neon-cyan);
    }

    .search-form {
        max-width: 680px;
        margin: 0 auto;
    }

    .search-input-wrapper {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 12px;
        padding: 5px;
        transition: all 0.3s ease;
    }

    .search-input-wrapper:focus-within {
        border-color: rgba(0, 140, 255, 0.65);
        box-shadow: 0 0 18px rgba(0, 140, 255, 0.3);
        background: rgba(255, 255, 255, 0.08);
    }

    .search-icon-hud {
        color: rgba(255, 255, 255, 0.55);
        margin-left: 15px;
        font-size: 1.05rem;
    }

    .cyber-search-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #ffffff;
        padding: 12px 15px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.95rem;
    }

    .cyber-search-input::placeholder {
        color: rgba(255, 255, 255, 0.45);
    }

    .cyber-search-input:focus {
        outline: none;
    }

    .btn-search-trigger {
        border: none;
        border-radius: 9px;
        background: linear-gradient(135deg, #008cff, #00ffd0);
        color: #0b1220;
        padding: 12px 24px;
        font-weight: bold;
        font-size: 0.88rem;
        letter-spacing: 1px;
        cursor: pointer;
        transition: 0.3s;
        white-space: nowrap;
    }

    .btn-search-trigger:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 140, 255, 0.35);
    }

    /* RESULT SECTION */
    .result-section { margin-top: 30px; }
    .hidden { display: none !important; }
    .cyber-panel-card { padding: 25px; }
    .border-neon-cyan { border-left: 4px solid var(--neon-cyan); }
    .border-neon-blue { border-left: 4px solid var(--neon-blue); }
    .border-neon-purple { border-left: 4px solid var(--neon-purple); }

    .result-header-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .node-label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.72rem;
        color: var(--text-muted);
        display: block;
        margin-bottom: 4px;
        letter-spacing: 0.5px;
    }

    .badge-status-lg {
        padding: 6px 16px;
        border-radius: 8px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.9rem;
        font-weight: bold;
        display: inline-block;
        border: 1px solid;
    }

    .status-1 {
        background: rgba(0, 255, 208, 0.12);
        color: var(--neon-cyan);
        border-color: rgba(0, 255, 208, 0.4);
    }

    .portal-grid-two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    @media (max-width: 850px) {
        .portal-grid-two { grid-template-columns: 1fr; }
        .public-navbar { padding: 14px 20px; }
        .search-input-wrapper { flex-direction: column; gap: 8px; padding: 10px; }
        .search-icon-hud { display: none; }
        .cyber-search-input { width: 100%; text-align: center; }
        .btn-search-trigger { width: 100%; }
    }

    .panel-cyber-header h4 {
        font-size: 1rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        letter-spacing: 0.5px;
    }

    .cyan-accent { color: var(--neon-cyan); font-weight: bold; }
    .purple-accent { color: var(--neon-purple); font-weight: bold; }
    .green-accent { color: var(--neon-cyan); font-weight: bold; }
    .text-yellow { color: var(--neon-yellow); font-weight: bold; }

    .spec-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 0.88rem;
    }

    .spec-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 6px;
    }

    .spec-label { color: var(--text-muted); }
    .spec-value { color: #ffffff; font-weight: bold; }
    .text-white { color: #ffffff !important; }
    .t-cyan { color: var(--neon-cyan) !important; font-weight: bold; }

    .cyber-hr {
        border: 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        margin: 18px 0;
    }

    .desc-text {
        background: rgba(255, 255, 255, 0.04);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 0.88rem;
        margin: 6px 0 0 0;
        color: #ffffff;
    }

    .btn-print-receipt {
        background: rgba(168, 85, 247, 0.15);
        border: 1px solid rgba(168, 85, 247, 0.5);
        color: #e9d5ff;
        padding: 10px 20px;
        font-family: 'Share Tech Mono', monospace;
        font-weight: bold;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-print-receipt:hover {
        background: var(--neon-purple);
        color: #ffffff;
        box-shadow: 0 0 18px rgba(168, 85, 247, 0.4);
    }

    /* TIMELINE STYLES */
    .timeline-container {
        position: relative;
        padding-left: 20px;
        border-left: 2px solid rgba(255, 255, 255, 0.15);
    }

    .timeline-item {
        position: relative;
        margin-bottom: 20px;
    }

    .timeline-item::before {
        content: '';
        position: absolute;
        left: -26px;
        top: 4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--neon-purple);
        box-shadow: 0 0 8px var(--neon-purple);
    }

    .timeline-item.active::before {
        background: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
    }

    .time-date {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .time-status {
        font-weight: bold;
        color: #ffffff;
        font-size: 0.95rem;
        margin: 2px 0;
    }

    .time-obs {
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.75);
    }

    .m-0 { margin: 0 !important; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .font-mono { font-family: 'Share Tech Mono', monospace; }
</style>

<script src="vistas/js/publico/consulta.js?v=<?= filemtime(__DIR__ . '/../../js/publico/consulta.js') ?>"></script>
