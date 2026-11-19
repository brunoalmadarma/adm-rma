(function () {
    console.log("⚡ [Consulta pública] Inicializando portal de rastreo público...");

    const API_PUBLIC = "/rma-app/api-rma/publico/consulta.php";

    const formConsulta = document.getElementById("formConsultaPublica");
    const inputTracking = document.getElementById("inputTracking");
    const panelResultado = document.getElementById("panelResultadoCaso");

    // Elementos de la ficha
    const txtNumeroCaso = document.getElementById("txtNumeroCaso");
    const badgeEstadoActual = document.getElementById("badgeEstadoActual");
    const txtClienteNombre = document.getElementById("txtClienteNombre");
    const txtEquipo = document.getElementById("txtEquipo");
    const txtMarcaModelo = document.getElementById("txtMarcaModelo");
    const txtNumeroSerie = document.getElementById("txtNumeroSerie");
    const txtTipoCaso = document.getElementById("txtTipoCaso");
    const txtFechaIngreso = document.getElementById("txtFechaIngreso");
    const txtFechaCierre = document.getElementById("txtFechaCierre");
    const txtDescripcionProblema = document.getElementById("txtDescripcionProblema");
    const txtDiagnosticoFinal = document.getElementById("txtDiagnosticoFinal");
    const timelineContenedor = document.getElementById("timelineContenedor");
    const btnImprimir = document.getElementById("btnImprimirComprobante");
    const panelCoincidencias = document.getElementById('panelCoincidenciasConsulta');
    const resultadosBody = document.querySelector('#tablaConsultaResultados tbody');

    let tokenImpresionActual = null;
    let ultimaConsulta = 0;

    function renderizarCoincidencias(casos) {
        resultadosBody.replaceChildren();
        document.getElementById('resumenCoincidenciasConsulta').textContent = `${casos.length} RMA encontrados. Elegí el equipo para ver su estado e historial.`;
        const fragmento = document.createDocumentFragment();
        casos.forEach(c => {
            const fila = document.createElement('tr');
            [c.numero_caso, c.cliente_nombre, [c.equipo, c.marca, c.modelo].filter(Boolean).join(' '), c.fecha_ingreso, c.estado_actual || 'Sin estado'].forEach(valor => {
                const celda = document.createElement('td');
                celda.textContent = valor || '—';
                fila.append(celda);
            });
            const acciones = document.createElement('td');
            const boton = document.createElement('button');
            boton.type = 'button'; boton.className = 'btn-ver-consulta';
            boton.textContent = 'Ver estado'; boton.dataset.caso = c.numero_caso;
            acciones.append(boton); fila.append(acciones); fragmento.append(fila);
        });
        resultadosBody.append(fragmento);
        panelCoincidencias.classList.remove('hidden');
        panelCoincidencias.scrollIntoView({behavior:'smooth'});
    }

    // ==========================================
    // 🔍 1. EJECUTAR CONSULTA PÚBLICA
    // ==========================================
    async function realizarConsulta(busqueda, conservarCoincidencias = false) {
        if (!busqueda || busqueda.trim() === "") return;
        const peticion = ++ultimaConsulta;
        tokenImpresionActual = null;
        btnImprimir.disabled = true;
        panelResultado.classList.add('hidden');
        if (!conservarCoincidencias) {
            panelCoincidencias.classList.add('hidden');
            resultadosBody.replaceChildren();
        }

        try {
            Swal.fire({
                title: 'CONSULTANDO BASE DE DATOS...',
                text: 'Espere mientras localizamos el activo',
                background: '#060b19',
                color: '#00f2ff',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const respuesta = await fetch(`${API_PUBLIC}?busqueda=${encodeURIComponent(busqueda.trim())}`);
            const data = await respuesta.json();
            if (peticion !== ultimaConsulta) return;

            Swal.close();

            if (data.status === 'success' && data.casos?.length > 1) {
                renderizarCoincidencias(data.casos);
                return;
            }

            if (data.status === "success" && data.caso) {
                const c = data.caso;
                tokenImpresionActual = c.token_impresion;
                btnImprimir.disabled = !tokenImpresionActual;

                // Llenar Ficha
                txtNumeroCaso.textContent = c.numero_caso;
                badgeEstadoActual.textContent = (c.estado_actual || 'Sin estado').toUpperCase();
                txtClienteNombre.textContent = c.cliente_nombre;
                txtEquipo.textContent = c.equipo;
                txtMarcaModelo.textContent = [c.marca, c.modelo].filter(Boolean).join(' ');
                txtNumeroSerie.textContent = c.numero_serie || 'NO ESPECIFICADO';
                txtTipoCaso.textContent = c.tipo_caso;
                txtFechaIngreso.textContent = c.fecha_ingreso;
                txtFechaCierre.textContent = c.fecha_cierre ? c.fecha_cierre : 'EN PROCESO TÉCNICO';
                txtDescripcionProblema.textContent = c.descripcion_problema || 'Sin descripción guardada';
                txtDiagnosticoFinal.textContent = c.diagnostico_final || 'Pendiente de evaluación en laboratorio';

                // Llenar Timeline
                renderizarTimeline(data.historial || []);

                // Mostrar Panel
                panelResultado.classList.remove("hidden");
                panelResultado.scrollIntoView({ behavior: 'smooth' });

            } else {
                panelResultado.classList.add("hidden");
                Swal.fire({
                    icon: 'error',
                    title: 'REGISTRO NO LOCALIZADO',
                    text: data.message || 'No se encontró ningún caso que coincida con el término ingresado.',
                    background: '#060b19',
                    color: '#ff3333',
                    confirmButtonColor: '#ff3333'
                });
            }
        } catch (error) {
            if (peticion !== ultimaConsulta) return;
            Swal.close();
            console.error("🔴 Error en consulta pública:", error);
            Swal.fire({
                icon: 'error',
                title: 'SYSTEM_OFFLINE',
                text: 'No se pudo comunicar con el servidor central de rastreo.',
                background: '#060b19',
                color: '#ff3333',
                confirmButtonColor: '#ff3333'
            });
        }
    }

    function renderizarTimeline(historial) {
        timelineContenedor.innerHTML = "";

        if (historial.length === 0) {
            timelineContenedor.innerHTML = `<div class="time-obs">Sin eventos registrados aún.</div>`;
            return;
        }

        historial.forEach((item, index) => {
            const esUltimo = index === 0;
            const elem = document.createElement("div");
            elem.className = `timeline-item ${esUltimo ? 'active' : ''}`;
            [['time-date', item.fecha], ['time-status', item.estado], ['time-obs', item.observacion || 'Cambio de estado registrado por el operador.']].forEach(([clase, texto]) => {
                const detalle = document.createElement('div');
                detalle.className = clase; detalle.textContent = texto || '';
                elem.append(detalle);
            });
            timelineContenedor.appendChild(elem);
        });
    }

    resultadosBody?.addEventListener('click', e => {
        const boton = e.target.closest('button[data-caso]');
        if (boton) realizarConsulta(boton.dataset.caso, true);
    });

    // Evento manual de formulario de búsqueda
    if (formConsulta) {
        formConsulta.addEventListener("submit", function (e) {
            e.preventDefault();
            realizarConsulta(inputTracking.value);
        });
    }

    // 🖨️ Abrir Comprobante de Impresión Oficial con Token Seguro
    if (btnImprimir) {
        btnImprimir.addEventListener("click", function () {
            if (tokenImpresionActual) {
                const urlVentana = `/rma-app/comprobante-caso.php?token=${encodeURIComponent(tokenImpresionActual)}`;
                window.open(urlVentana, '_blank', 'width=900,height=800,scrollbars=yes');
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'TOKEN_MISSING',
                    text: 'No se generó un token seguro para este comprobante.',
                    background: '#060b19',
                    color: '#ffca28'
                });
            }
        });
    }

    // ==========================================
    // ⚡ 2. AUTO-EJECUCIÓN SI VIENE PARÁMETRO POR URL (?busqueda=...)
    // ==========================================
    function autodetectUrlParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const term = urlParams.get('busqueda');

        if (term && term.trim() !== "") {
            inputTracking.value = term.trim();
            realizarConsulta(term.trim());
        }
    }

    // Esperar también los scripts de la plantilla antes de consultar desde un enlace.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autodetectUrlParam, {once:true});
    } else {
        autodetectUrlParam();
    }
})();
