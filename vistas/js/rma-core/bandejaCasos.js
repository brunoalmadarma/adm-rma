(function () {
    console.log("⚡ [Casos RMA] Sistema de Bandeja de Casos Inicializado...");

    const API_URL = "../api-rma/rma-core/casos/bandejaCasos.php";
    const buscador = document.getElementById("cyberBuscador");
    const tbody = document.getElementById("tbodyCasos");

    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let peticion=0,temporizador;
    async function listarCasos(busqueda = "") {
        const actual=++peticion;
        try {
            const res = await fetch(`${API_URL}?action=listar_bandeja&buscar=${encodeURIComponent(busqueda)}&desde=${document.getElementById("filtroDesde").value}&hasta=${document.getElementById("filtroHasta").value}`);
            const data = await res.json();
            if(actual!==peticion)return;

            if (data.status !== "success") {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ff3333;">[ERROR]: ${data.message}</td></tr>`;
                return;
            }

            tbody.innerHTML = "";
            document.getElementById("contadorCasos").textContent = `Casos: ${data.casos.length}`;

            if (data.casos.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#506690;">No se encontraron casos</td></tr>`;
                return;
            }

            data.casos.forEach(original => {
                const c=Object.fromEntries(Object.entries(original).map(([k,v])=>[k,esc(v)]));
                const tr = document.createElement("tr");

                const badgeClass = c.id_estado_actual == 1 ? "status-1" : "status-default";
                const fechaFormateada = new Date(c.fecha_ingreso).toLocaleDateString('es-ES');
                const barcodeUrl = c.barcode_url;

                tr.innerHTML = `
                    <td class="text-neon-cyan font-weight-bold"><a href="${c.link_secure}" title="${c.link_secure}">${c.numero_caso}</a><br><img loading="lazy" src="${c.qr_url}" title="${c.link_secure}" alt="QR del caso ${c.numero_caso}" width="64" height="64"><img loading="lazy" src="${barcodeUrl}" title="${c.link_secure} | Código: ${c.numero_caso}" alt="Código de barras" width="120" height="35"></td>
                    <td>${fechaFormateada}</td>
                    <td style="text-transform:uppercase;">${c.cliente_nombre}</td>
                    <td style="text-transform:uppercase;">${c.equipo} <span style="color:#506690;">(${c.marca})</span></td>
                    <td style="color:#ffca28;">${c.numero_serie}</td>
                    <td><span class="badge-status-cyber ${badgeClass}">${c.estado_nombre.toUpperCase()}</span></td>
                    <td style="text-align:center; display: flex; gap: 8px; justify-content: center;">
                        <button type="button" class="btn-cyber-action" data-fotos-caso="${c.id}">Ver fotos</button>
                        <a class="btn-cyber-action" href="taller?caso=${c.id}">Diagnóstico</a><a class="btn-cyber-action" href="historialEstado?caso=${c.numero_caso}">Línea de tiempo</a>
                        <button class="btn-cyber-action btn-open-pop" data-link="${c.link_secure}">
                            Ver comprobante
                        </button>
                        <button class="btn-cyber-action btn-cyber-reprint btn-execute-reprint" 
                                data-caso="${c.numero_caso}" 
                                data-qr="${c.qr_url}" 
                                data-barcode="${barcodeUrl}">
                            ⚡ Reimprimir etiqueta
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            bindBandejaButtons();

        } catch (err) {
            tbody.innerHTML='<tr><td colspan="7">No se pudo cargar el listado. Intentá nuevamente.</td></tr>';
        }
    }

    function bindBandejaButtons() {
        document.querySelectorAll(".btn-open-pop").forEach(btn => {
            btn.onclick = () => {
                const urlSecure = btn.dataset.link;
                const ancho = (screen.width - 850) / 2;
                const alto = (screen.height - 700) / 2;

                window.open(
                    urlSecure,
                    'ComprobanteRMA',
                    `width=850,height=700,left=${ancho},top=${alto},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
                );
            };
        });

        document.querySelectorAll(".btn-execute-reprint").forEach(btn => {
            btn.onclick = () => {
                const numeroCaso = btn.dataset.caso;
                const qrUrl = btn.dataset.qr;
                const barcodeUrl = btn.dataset.barcode;

                const ventanaImpresion = window.open('', '_blank', 'height=500,width=400');

                ventanaImpresion.document.write(`
                    <html>
                    <head>
                        <title>Reimprimir Etiqueta ${numeroCaso}</title>
                        <style>
                            body { margin: 0; padding: 10px; font-family: 'Courier New', monospace; text-align: center; background: #fff; color: #000; }
                            .ticket-title { font-size: 14px; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 1px; }
                            .ticket-qr { width: 130px; height: 130px; margin-bottom: 5px; }
                            .ticket-barcode { width: 160px; height: 45px; object-fit: contain; }
                            @page { size: auto; margin: 0mm; }
                        </style>
                    </head>
                    <body>
                        <h3 class="ticket-title">${numeroCaso}</h3>
                        <img src="${qrUrl}" class="ticket-qr" alt="QR" />
                        <br>
                        <img src="${barcodeUrl}" class="ticket-barcode" alt="BARCODE" />
                        <script>
                            window.onload = function() { 
                                window.print(); 
                                setTimeout(function() { window.close(); }, 500); 
                            }
                        <\/script>
                    </body>
                    </html>
                `);
                ventanaImpresion.document.close();
            };
        });
    }

    buscador?.addEventListener("input", (e) => {
        clearTimeout(temporizador);temporizador=setTimeout(()=>listarCasos(e.target.value.trim()),220);
    });

    document.getElementById("btnLimpiarFiltro").onclick = () => {
        buscador.value = "";
        document.getElementById('filtroDesde').value='';document.getElementById('filtroHasta').value='';
        listarCasos("");
    };

    buscador?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(temporizador);listarCasos(buscador.value.trim());}});
    ['filtroDesde','filtroHasta'].forEach(id=>document.getElementById(id).addEventListener('change',()=>listarCasos(buscador.value.trim())));
    const initBandeja = setInterval(() => {
        if (document.getElementById("cyberBuscador")) {
            clearInterval(initBandeja);
            listarCasos("");
        }
    }, 100);

})();