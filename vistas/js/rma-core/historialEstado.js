(function () {
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    console.log("⚡ [Casos RMA] Controlador de Historial Lineal Activo...");

    const API_URL = "../api-rma/rma-core/casos/historialEstado.php";
    const buscador = document.getElementById("buscadorHistorial");
    const container = document.getElementById("timelineContainer");
    const hudResumen = document.getElementById("hudResumenCaso");

    async function cargarHistorialCaso(numeroCaso) {
        if (!numeroCaso) {
            resetearPantallaHistorial();
            return;
        }

        try {
            const res = await fetch(`${API_URL}?action=obtener_timeline&numero_caso=${encodeURIComponent(numeroCaso)}`);
            const data = await res.json();

            if (data.status !== "success") {
                hudResumen.style.display = "none";
                container.innerHTML = `<div style="text-align:center; color:#ff3333; padding:20px;">[FALLO]: ${data.message}</div>`;
                return;
            }

            hudResumen.style.display = "block";
            document.getElementById("hudNumero").textContent = data.info_caso.numero_caso;
            document.getElementById("hudEquipo").textContent = `${data.info_caso.equipo} ${data.info_caso.marca}`;
            document.getElementById("hudSerie").textContent = data.info_caso.numero_serie;
            document.getElementById("hudCliente").textContent = data.info_caso.cliente_nombre;

            container.innerHTML = "";

            data.timeline.forEach(original => {
                const t=Object.fromEntries(Object.entries(original).map(([k,v])=>[k,esc(v)]));
                const node = document.createElement("div");
                node.className = "timeline-node-item";

                if (t.id_estado == 1) node.classList.add("node-status-1");
                if (t.id_estado == 4) node.classList.add("node-status-final");

                const fechaObj = new Date(t.fecha);
                const fechaF = fechaObj.toLocaleDateString('es-ES');
                const horaF = fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                node.innerHTML = `
                    <div class="timeline-node-block">
                        <div class="node-meta-row">
                            <div>Fecha: <span style="color:#fff;">${fechaF} - ${horaF} HS</span></div>
                            <div class="node-state-badge">Estado: ${t.estado_nombre}</div>
                        </div>
                        <div class="node-observation">${t.observacion}</div>
                        <div style="font-size:0.75rem; color:#506690; margin-top:8px; text-align:right;">
                            OPERADOR ASIGNADO: <span class="node-operator">${(t.usuario_nombre||'Sistema').toUpperCase()}</span>
                        </div>
                    </div>
                `;
                container.appendChild(node);
            });

        } catch (err) {
            console.error("Fallo de mapeo logarítmico en timeline:", err);
            container.innerHTML = `<div style="text-align:center; color:#ff3333; padding:20px;">No se pudo cargar la información</div>`;
        }
    }

    function resetearPantallaHistorial() {
        if (buscador) buscador.value = "";
        if (hudResumen) hudResumen.style.display = "none";
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; color: #506690; padding: 40px 0;">
                    [ INGRESE O ESCANEE UN NÚMERO DE CASO VÁLIDO PARA DESPLEGAR LOS REGISTROS TEMPORALES ]
                </div>`;
        }
    }

    buscador?.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val.length >= 12 || val.length === 0) {
            cargarHistorialCaso(val);
        }
    });

    buscador?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            cargarHistorialCaso(e.target.value.trim());
        }
    });

    document.getElementById("btnResetHistorial").onclick = () => {
        resetearPantallaHistorial();
    };

    const casoInicial=new URLSearchParams(location.search).get('caso');
    if(casoInicial){buscador.value=casoInicial;cargarHistorialCaso(casoInicial);}
    else fetch('../api-rma/rma-core/casos/bandejaCasos.php?action=listar_bandeja').then(r=>r.json()).then(d=>{
        const ejemplos=document.createElement('div');ejemplos.className='rma-timeline-examples';ejemplos.textContent='Consultar ejemplos de evolución: ';
        (d.casos||[]).filter(c=>c.numero_caso.startsWith('RMA-2026-')).slice(0,5).forEach(c=>{const b=document.createElement('button');b.type='button';b.className='btn btn-default';b.textContent=c.numero_caso;b.onclick=()=>{buscador.value=c.numero_caso;cargarHistorialCaso(c.numero_caso);};ejemplos.appendChild(b);});buscador.parentElement.after(ejemplos);
    }).catch(()=>{});
})();