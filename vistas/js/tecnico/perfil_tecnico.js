(function () {
    console.log("⚡ [Taller] Inicializando Estación de Trabajo del Técnico...");

    const API_TECNICO = "../api-rma/tecnico/perfil_tecnico.php";

    const loader = document.getElementById("cyberLoaderTecnico");
    const idTecnico = document.getElementById("id_tecnico") ? document.getElementById("id_tecnico").value : null;

    const tablaProcesoBody = document.querySelector("#tablaMaquinasProceso tbody");
    const tablaDespachosBody = document.querySelector("#tablaDespachosRecientes tbody");
    const comprobantes = new Map();

    function fechaIngreso(valor) {
        if (!valor) return 'Sin fecha registrada';
        const partes = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/);
        return partes ? `${partes[3]}/${partes[2]}/${partes[1]}${partes[4] ? ' ' + partes[4] : ''}` : valor;
    }

    function mostrarLoader() {
        if (loader) {
            loader.style.display = "flex";
            loader.style.opacity = "1";
            loader.style.visibility = "visible";
        }
    }

    function ocultarLoader() {
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.visibility = "hidden";
                loader.style.display = "none";
            }, 300);
        }
    }

    async function cargarEstacionTecnico() {
        mostrarLoader();
        try {
            const res = await fetch(`${API_TECNICO}?action=consultar_estacion&id_tecnico=${idTecnico || ''}`);
            if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);

            const data = await res.json();

            if (data.status === "success") {
                comprobantes.clear();
                [...(data.casos_proceso || []), ...(data.casos_despachados || [])].forEach(c => comprobantes.set(c.numero_caso, c.link_comprobante));
                renderizarKPIs(data.kpis);
                renderizarMaquinasProceso(data.casos_proceso);
                renderizarDespachosRecientes(data.casos_despachados);
                poblarSelectsModal(data.estados_caso, []);
                const casoSel=document.getElementById('solicitudCaso'); if(casoSel) casoSel.innerHTML=(data.casos_proceso||[]).map(c=>`<option value="${c.id}">${escapeHtml(c.numero_caso)} - ${escapeHtml(c.equipo)}</option>`).join('');
            } else {
                console.error("🔴 Error API Perfil Técnico:", data.message);
            }
        } catch (err) {
            console.error("🔴 Error de conexión en Estación de Trabajo:", err);
        } finally {
            ocultarLoader();
        }
    }

    function renderizarKPIs(k) {
        if (!k) return;
        if (document.getElementById("kpiAsignadas")) document.getElementById("kpiAsignadas").textContent = k.asignadas || 0;
        if (document.getElementById("kpiSubColaDetalle")) document.getElementById("kpiSubColaDetalle").textContent = `${k.en_diagnostico || 0} en diag. · ${k.en_reparacion || 0} en rep.`;

        if (document.getElementById("kpiReparadosHoy")) document.getElementById("kpiReparadosHoy").textContent = k.reparados_hoy || 0;

        const badgeMeta = document.getElementById("badgeMetaProd");
        if (badgeMeta) {
            if (k.reparados_hoy >= 5) {
                badgeMeta.textContent = "CUOTA ALCANZADA";
                badgeMeta.style.color = "var(--neon-green-dark)";
                badgeMeta.style.borderColor = "var(--neon-green-dark)";
            } else {
                badgeMeta.textContent = "EN PROGRESO";
                badgeMeta.style.color = "var(--neon-yellow-dark)";
                badgeMeta.style.borderColor = "var(--neon-yellow-dark)";
            }
        }

        if (document.getElementById("kpiTasaExito")) document.getElementById("kpiTasaExito").textContent = `${k.tasa_exito || 100}%`;
        if (document.getElementById("kpiReingresosMeta")) document.getElementById("kpiReingresosMeta").textContent = `${k.reingresos || 0} reingresos este mes`;

        if (document.getElementById("kpiTrabadas")) document.getElementById("kpiTrabadas").textContent = k.ordenes_trabadas || 0;
    }

    function renderizarMaquinasProceso(casos) {
        if (!tablaProcesoBody) return;
        tablaProcesoBody.innerHTML = "";

        if (!casos || casos.length === 0) {
            tablaProcesoBody.innerHTML = `<tr><td colspan="7" class="font-mono text-center">No tenés casos asignados</td></tr>`;
            return;
        }

        casos.forEach(c => {
            const tr = document.createElement("tr");

            let badgeClass = "status-1";
            const estado = String(c.estado_nombre || 'Sin estado');
            if (estado.toLowerCase().includes("reparación") || estado.toLowerCase().includes("taller")) badgeClass = "status-default";
            if (estado.toLowerCase().includes("espera") || estado.toLowerCase().includes("proveedor")) badgeClass = "status-external";

            tr.innerHTML = `
                <td class="t-cyan font-mono">${escapeHtml(c.numero_caso)}</td>
                <td><strong>${escapeHtml([c.equipo, c.marca, c.modelo].filter(Boolean).join(' '))}</strong></td>
                <td>${escapeHtml(c.cliente_nombre || 'Sin cliente registrado')}</td>
                <td class="font-mono">${escapeHtml(fechaIngreso(c.fecha_ingreso))}</td>
                <td><span class="badge-status-cyber ${badgeClass}">${escapeHtml(estado)}</span></td>
                <td class="text-truncate-tec" title="${escapeHtml(c.descripcion_problema)}">${escapeHtml(c.descripcion_problema)}</td>
                <td class="text-right">
                    <button type="button" class="btn-terminal-view" data-fotos-caso="${c.id}">Ver fotos</button>
                    <button type="button" class="btn-terminal-edit" data-gestionar title="Procesar Orden">⚙️</button>
                    <button type="button" class="btn-terminal-view" data-comprobante title="Imprimir Ticket">🖨️</button>
                </td>
            `;

            tr.querySelector('[data-gestionar]').addEventListener('click', () => abrirGestionTrabajo(c.id, c.numero_caso, c.id_estado_actual, c.diagnostico_final));
            tr.querySelector('[data-comprobante]').addEventListener('click', () => imprimirTicketEquipo(c.numero_caso));
            tablaProcesoBody.appendChild(tr);
        });
    }

    function renderizarDespachosRecientes(casos) {
        if (!tablaDespachosBody) return;
        tablaDespachosBody.innerHTML = "";

        if (!casos || casos.length === 0) {
            tablaDespachosBody.innerHTML = `<tr><td colspan="6" class="font-mono text-center">No hay envíos recientes</td></tr>`;
            return;
        }

        casos.forEach(c => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td class="t-cyan font-mono">${escapeHtml(c.numero_caso)}</td>
                <td><strong>${escapeHtml([c.equipo, c.marca, c.modelo].filter(Boolean).join(' '))}</strong><br><small class="green-accent">${escapeHtml(c.diagnostico_final || 'Reparación / Cierre Confirmado')}</small></td>
                <td>${escapeHtml(c.cliente_nombre || 'Sin cliente registrado')}</td>
                <td class="font-mono">${escapeHtml(fechaIngreso(c.fecha_ingreso))}</td>
                <td class="font-mono">${escapeHtml(c.fecha_cierre)}</td>
                <td class="text-right">
                    <button type="button" class="btn-terminal-view" onclick="reimprimirEtiquetaRma('${c.numero_caso}')" title="Reimprimir QR">📷</button>
                </td>
            `;

            tablaDespachosBody.appendChild(tr);
        });
    }

    function poblarSelectsModal(estados, stock) {
        const selectEst = document.getElementById("selectEstadoRma");
        const selectIns = document.getElementById("selectInsumoTaller");

        if (selectEst && estados) {
            selectEst.innerHTML = estados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }

        if (selectIns && stock) {
            selectIns.innerHTML = `<option value="">-- Sin insumos adicionales --</option>` +
                stock.map(s => `<option value="${s.id}">${s.nombre} (Stock: ${s.cantidad} u. | ₲ ${parseFloat(s.precio_venta).toLocaleString('es-PY')})</option>`).join('');
        }
    }

    window.abrirGestionTrabajo = function (idCaso, numCaso, idEstadoActual, diagFinal) {
        document.getElementById('modalIdRma').value = idCaso;
        document.getElementById('modalNumCasoRma').value = numCaso;
        document.getElementById('modalTituloRma').textContent = `// [ACTUALIZAR DIAGNÓSTICO / ORDEN: ${numCaso}]`;

        const selEst = document.getElementById('selectEstadoRma');
        if (selEst && idEstadoActual) selEst.value = idEstadoActual;

        const txtDiag = document.getElementById('txtDetalleTecnico');
        if (txtDiag) txtDiag.value = diagFinal || '';

        document.getElementById('modalGestionTrabajo').style.display = 'flex';
    };

    window.cerrarModalGestion = function () {
        document.getElementById('modalGestionTrabajo').style.display = 'none';
    };

    window.imprimirTicketEquipo = function (numCaso) {
        const url = comprobantes.get(numCaso);
        if (url) window.open(url, '_blank', 'noopener,width=900,height=800,scrollbars=yes');
    };

    window.reimprimirEtiquetaRma = function (numCaso) {
        Swal.fire({
            icon: 'info',
            title: '[IMPRESORA TÉRMICA]',
            text: `Reimprimiendo etiqueta adhesiva QR para chasis: ${numCaso}`,
            confirmButtonColor: '#7e22ce'
        });
    };

    // EVENTOS DE BOTONES GLOBAL Y GUARDADO
    document.getElementById("btnGuardarAvanceTecnico")?.addEventListener("click", async function () {
        const idCaso = document.getElementById('modalIdRma').value;
        const idEstado = document.getElementById('selectEstadoRma').value;
        const idInsumo = '';
        const diagnostico = document.getElementById('txtDetalleTecnico').value.trim();

        if (!diagnostico) {
            Swal.fire({ icon: 'warning', title: 'Campo Requerido', text: 'Ingresa un detalle o reporte técnico del avance.' });
            return;
        }

        mostrarLoader();
        try {
            const formData = new FormData();
            formData.append("action", "guardar_avance");
            formData.append("id_caso", idCaso);
            formData.append("id_estado", idEstado);
            formData.append("id_insumo", idInsumo);
            formData.append("diagnostico", diagnostico);
            formData.append("id_tecnico", idTecnico || '');

            const res = await fetch(API_TECNICO, { method: "POST", body: formData, headers: {'X-CSRF-TOKEN':window.rmaCsrf} });
            const data = await res.json();

            if (data.status === "success") {
                Swal.fire({ icon: 'success', title: 'Avance Consolidado', text: 'El caso fue actualizado en el laboratorio.', timer: 1500, showConfirmButton: false });
                cerrarModalGestion();
                cargarEstacionTecnico();
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message });
            }
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Error de Red', text: 'No se pudo guardar el avance.' });
        } finally {
            ocultarLoader();
        }
    });

    document.getElementById('btnSolicitarRemision')?.addEventListener('click',()=>window.location.href='nuevaRemision');

    function escapeHtml(str) {
        return String(str ?? '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    const pollDom = setInterval(() => {
        if (document.getElementById("tablaMaquinasProceso")) {
            clearInterval(pollDom);
            cargarEstacionTecnico();
        }
    }, 100);
})();
