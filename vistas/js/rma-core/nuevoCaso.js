(function () {
    console.log("⚡ [Casos RMA] Protocolo de Registro Inicial Activo...");

    const API_URL = "../api-rma/rma-core/casos/casos.php";

    let bloqueandoSubmit = false;
    let linkPdfGlobal = "";

    const form = document.getElementById("formNuevoCaso");

    // Modal Nativo
    const modalOverlay = document.getElementById("modalCasoOverlay");
    const btnCerrarModalX = document.getElementById("btnCerrarModalX");
    const btnImprimirEtiqueta = document.getElementById("btnImprimirEtiqueta");
    const btnVerComprobantePop = document.getElementById("btnVerComprobantePop");

    function abrirModal() {
        if (modalOverlay) modalOverlay.style.display = "flex";
    }

    function cerrarModal() {
        if (modalOverlay) modalOverlay.style.display = "none";
    }

    if (btnCerrarModalX) btnCerrarModalX.addEventListener("click", cerrarModal);

    // Cargar listas iniciales
    async function inicializarComponentes() {
        try {
            const catalogos=await (await fetch(`${API_URL}?action=aux_catalogos`)).json();
            if(catalogos.status!=='success')throw new Error(catalogos.message||'No se pudieron cargar los catálogos');
            [['selectEquipo','equipos','equipo'],['selectMarca','marcas','marca']].forEach(([id,key,def])=>{
                const select=document.getElementById(id);select.replaceChildren();
                catalogos[key].forEach(nombre=>select.add(new Option(nombre,nombre)));
                select.value=catalogos.predeterminado[def];
            });
            if(document.getElementById('nuevoCasoTecnico')) {
                const d=await (await fetch(`${API_URL}?action=aux_tecnicos`)).json();
                const select=document.getElementById('nuevoCasoTecnico');
                select.innerHTML='<option value="">Seleccioná un técnico</option>';
                (d.tecnicos||[]).forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.nombre;select.appendChild(o);});
            }
            const resClientes = await fetch(`${API_URL}?action=aux_clientes`);
            const dataClientes = await resClientes.json();
            if (dataClientes.status === "success") {
                const selectClie = document.getElementById("selectCliente");
                selectClie.innerHTML = '<option value="">Seleccione un cliente</option>';
                dataClientes.clientes.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c.id;
                    opt.textContent = `[ID: ${c.id}] - ${c.nombre.toUpperCase()} (${c.cedula})`;
                    selectClie.appendChild(opt);
                });
            }

            const resTipos = await fetch(`${API_URL}?action=aux_tipos`);
            const dataTipos = await resTipos.json();
            if (dataTipos.status === "success") {
                const selectTipos = document.getElementById("selectTipoCaso");
                selectTipos.innerHTML = '<option value="">[SELECCIONE CLASIFICACIÓN]</option>';
                dataTipos.tipos.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t.id;
                    opt.textContent = `Tipo: ${t.nombre.toUpperCase()}`;
                    selectTipos.appendChild(opt);
                });
            }

            const resCorrelativo = await fetch(`${API_URL}?action=obtener_proximo_numero`);
            const dataCorr = await resCorrelativo.json();
            if (dataCorr.status === "success") {
                document.getElementById("numeroCasoAuto").value = dataCorr.proximo_numero;
            }

        } catch (err) {
            console.error("❌ Error cargando la telemetría inicial de componentes:", err);
        }
    }

    // Submit del Formulario
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (bloqueandoSubmit) return;
            bloqueandoSubmit = true;

            const datosFormulario = new FormData(form);

            try {
                Swal.fire({
                    title: "PROCESANDO...",
                    text: "Registrando caso de RMA en el sistema",
                    background: '#ffffff',
                    color: '#0f172a',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                const res = await fetch(`${API_URL}?action=guardar`, {
                    method: "POST",
                    headers: {"X-CSRF-TOKEN":window.rmaCsrf},
                    body: datosFormulario
                });

                const r = await res.json();
                Swal.close();

                if (r.status === "success") {
                    const barcodeUrl = r.barcode_url;
                    linkPdfGlobal = r.link_pdf;

                    // Inyectar valores al Modal Nativo
                    document.getElementById("lblNumeroCaso").textContent = r.numero_caso;
                    document.getElementById("ticketNumeroCaso").textContent = r.numero_caso;
                    document.getElementById("ticketQrImg").src = r.qr_url;
                    document.getElementById("ticketBarcodeImg").src = barcodeUrl;
                    document.getElementById("ticketQrImg").title=r.link_pdf;
                    document.getElementById("ticketBarcodeImg").title=r.link_pdf+' | Código: '+r.numero_caso;

                    let fotosBtn=document.getElementById('nuevoCasoVerFotos');
                    if(!fotosBtn){fotosBtn=document.createElement('button');fotosBtn.type='button';fotosBtn.id='nuevoCasoVerFotos';fotosBtn.className='btn btn-default';fotosBtn.textContent='Ver fotos guardadas';document.getElementById('btnVerComprobantePop').after(fotosBtn);}
                    fotosBtn.dataset.fotosCaso=r.id_caso;
                    abrirModal();

                    // Limpiar Formulario y recargar datos
                    form.reset();
                    const displayFile = document.getElementById('fileNameDisplay');
                    if (displayFile) displayFile.textContent = '';
                    inicializarComponentes();

                } else {
                    Swal.fire({
                        icon: "error",
                        title: "FALLO DE REGISTRO",
                        text: r.message,
                        background: '#ffffff',
                        color: '#dc2626'
                    });
                }

            } catch (err) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: "ERROR DE CONEXIÓN",
                    text: "No se pudo comunicar con el servidor.",
                    background: '#ffffff',
                    color: '#dc2626'
                });
                console.error(err);
            }

            bloqueandoSubmit = false;
        });
    }

    // Eventos de los botones dentro del Modal Nativo
    if (btnImprimirEtiqueta) {
        btnImprimirEtiqueta.onclick = () => {
            const contenido = document.getElementById("ticket-impresion").innerHTML;
            const ventanaImpresion = window.open('', '_blank', 'height=500,width=400');
            ventanaImpresion.document.write(`
                <html>
                <head>
                    <title>Imprimir Etiqueta RMA</title>
                    <style>
                        body { margin: 0; padding: 10px; font-family: 'Courier New', monospace; text-align: center; background: #fff; color: #000; }
                        h3 { font-size: 14px; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 1px; }
                        img { max-width: 100%; height: auto; }
                        @page { size: auto; margin: 0mm; }
                    </style>
                </head>
                <body>
                    ${contenido}
                    <script>
                        window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
                    <\/script>
                </body>
                </html>
            `);
            ventanaImpresion.document.close();
        };
    }

    if (btnVerComprobantePop) {
        btnVerComprobantePop.onclick = () => {
            if (!linkPdfGlobal) return;
            const posicionAncho = (screen.width - 850) / 2;
            const posicionAlto = (screen.height - 700) / 2;

            window.open(
                linkPdfGlobal,
                'ComprobanteRMA',
                `width=850,height=700,left=${posicionAncho},top=${posicionAlto},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
            );
        };
    }

    const verificarExistencia = setInterval(() => {
        if (document.getElementById("formNuevoCaso")) {
            clearInterval(verificarExistencia);
            inicializarComponentes();
        }
    }, 100);

})();
