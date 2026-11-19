(function () {
    const $ = id => document.getElementById(id);
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
    const nombres = {CENTRAL_RMA:'Depósito central → Depósito RMA', RMA_CENTRAL:'Depósito RMA → Depósito central', BAJA_RMA:'Baja en depósito RMA', ENTREGA_TECNICO:'Entrega a taller (histórico)', INGRESO_RMA:'Ingreso RMA (histórico)', SALIDA_RMA:'Salida RMA (histórico)'};
    let datos = {stock:[], asignaciones:[], movimientos:[]};
    let cargando = false;
    function fecha(v) {
        const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})(.*)$/);
        return m ? `${m[3]}/${m[2]}/${m[1]}${m[4]}` : v;
    }
    function tabla(id, filas, columnas) {
        $(id).querySelector('tbody').innerHTML = filas.map(f => '<tr>' + columnas.map(col => {
            const v = typeof col === 'function' ? col(f) : f[col];
            return `<td${typeof v === 'number' && v < 0 ? ' class="saldo-revisar"' : ''}>${esc(v ?? '—')}</td>`;
        }).join('') + '</tr>').join('') || `<tr><td colspan="${columnas.length}">No hay registros para esta búsqueda.</td></tr>`;
    }
    function render() {
        const q = $('stockInternoBuscar').value.trim().toLocaleLowerCase('es');
        const coincide = f => Object.values(f).join(' ').toLocaleLowerCase('es').includes(q);
        const asignaciones = datos.asignaciones.filter(coincide);
        // Una búsqueda de caso también encuentra sus productos en el resumen físico.
        const productosCaso = new Set(asignaciones.map(a => a.producto_id));
        const stock = datos.stock.filter(f => coincide(f) || productosCaso.has(f.id));
        tabla('tablaStockInterno', stock, ['codigo','nombre','deposito_central','deposito_rma','asignado_casos','sin_caso']);
        tabla('tablaStockInternoCasos', asignaciones, ['codigo','nombre','numero_caso','cliente_nombre','tecnico_nombre','entregadas','devueltas','bajas','saldo',f => fecha(f.ultimo_movimiento)]);
        tabla('tablaStockInternoMovimientos', datos.movimientos.filter(coincide), ['registro', f => fecha(f.fecha), f => nombres[f.tipo] || f.tipo, f => `${f.codigo} · ${f.nombre}`, 'cantidad','central_antes','central_despues','rma_antes','rma_despues', f => f.numero_caso || 'Sin caso registrado','responsable','motivo']);
        const total = key => stock.reduce((n, p) => n + p[key], 0);
        $('stockInternoResumen').textContent = `${stock.length} productos · ${total('deposito_rma')} unidades en depósito RMA · ${total('asignado_casos')} asignadas a casos · ${total('sin_caso')} sin caso. Los saldos por ubicación corresponden al producto completo.`;
    }
    async function cargar() {
        if (cargando) return;
        cargando = true;
        $('stockInternoActualizar').disabled = true;
        $('stockInternoContenido').hidden = true;
        $('stockInternoEstado').className = '';
        $('stockInternoEstado').textContent = 'Cargando stock interno…';
        try {
            const r = await fetch('../api-rma/inventario/stock-interno-rma.php', {cache:'no-store'});
            const d = await r.json();
            if (!r.ok || d.status !== 'success') throw new Error(d.message || 'No se pudo consultar el stock.');
            datos = d;
            render();
            $('stockInternoContenido').hidden = false;
            $('stockInternoEstado').textContent = `Actualizado a las ${new Date().toLocaleTimeString('es-PY')}.`;
        } catch (e) {
            $('stockInternoEstado').className = 'alert alert-danger';
            $('stockInternoEstado').textContent = `${e.message} Podés volver a intentar con Actualizar stock.`;
        } finally {
            cargando = false;
            $('stockInternoActualizar').disabled = false;
        }
    }
    $('stockInternoBuscar').addEventListener('input', render);
    $('stockInternoActualizar').addEventListener('click', cargar);
    cargar();
})();
