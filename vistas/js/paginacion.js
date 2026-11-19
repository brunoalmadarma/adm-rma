(function () {
    'use strict';
    const tamanos = [5, 10, 20, 50];
    const estados = new WeakMap();
    let consecutivo = 0;

    function filasDatos(tabla) {
        return Array.from(tabla.tBodies).flatMap(cuerpo => Array.from(cuerpo.rows)).filter(fila =>
            fila.closest('table') === tabla && fila.cells.length > 0 &&
            !(fila.cells.length === 1 && fila.cells[0].colSpan > 1));
    }
    function cumpleFiltro(fila) {
        return !fila.hidden && fila.style.display !== 'none' &&
            !fila.classList.contains('hidden') && !fila.classList.contains('d-none');
    }
    function filasFiltradas(tabla) {
        return filasDatos(tabla).filter(cumpleFiltro);
    }
    function texto(elemento, valor) {
        if (elemento.textContent !== valor) elemento.textContent = valor;
    }
    function actualizar(tabla, reiniciar = false) {
        const estado = estados.get(tabla);
        if (!estado) return;
        const todas = filasDatos(tabla);
        const filas = todas.filter(cumpleFiltro);
        // Las recargas automáticas con los mismos registros conservan la página actual.
        const firma = JSON.stringify(filas.map(fila => fila.cells[0].textContent.trim()));
        if (reiniciar || firma !== estado.firma) estado.pagina = 1;
        estado.firma = firma;
        const paginas = Math.max(1, Math.ceil(filas.length / estado.tamano));
        estado.pagina = Math.max(1, Math.min(estado.pagina, paginas));
        estado.total = filas.length;
        estado.paginas = paginas;
        const inicio = (estado.pagina - 1) * estado.tamano;
        const elegibles = new Set(filas);
        const visibles = new Set(filas.slice(inicio, inicio + estado.tamano));
        todas.forEach(fila => fila.classList.toggle('rma-pagina-oculta', elegibles.has(fila) && !visibles.has(fila)));
        texto(estado.resumen, filas.length
            ? `Mostrando ${inicio + 1}–${Math.min(inicio + estado.tamano, filas.length)} de ${filas.length} registros`
            : '0 registros');
        estado.selector.value = String(estado.tamano);
        estado.ir.value = String(estado.pagina);
        estado.ir.max = String(paginas);
        estado.ir.disabled = filas.length === 0;
        texto(estado.paginasTexto, `de ${paginas}`);
        estado.primera.disabled = estado.anterior.disabled = estado.pagina === 1;
        estado.siguiente.disabled = estado.ultima.disabled = estado.pagina === paginas;
        tabla.dataset.rmaPagina = String(estado.pagina);
        tabla.dataset.rmaTamano = String(estado.tamano);
        tabla.dataset.rmaTotal = String(filas.length);
        tabla.dispatchEvent(new CustomEvent('rma:pagina', {bubbles:true, detail:{
            pagina:estado.pagina, tamano:estado.tamano, total:filas.length, paginas
        }}));
    }
    function inicializar(tabla) {
        if (estados.has(tabla) || !tabla.tHead || !tabla.tBodies.length || tabla.dataset.rmaPaginacion === 'no') return;
        if (!tabla.id) {
            do { tabla.id = 'rma-tabla-' + (++consecutivo); }
            while (document.querySelectorAll('#' + tabla.id).length > 1);
        }
        const clave = 'rma.paginacion.' + location.pathname + '.' + tabla.id;
        let tamano = 10;
        try { const guardado = Number(localStorage.getItem(clave)); if (tamanos.includes(guardado)) tamano = guardado; }
        catch (_) { /* La paginación también funciona sin almacenamiento del navegador. */ }
        const superior = document.createElement('div');
        superior.className = 'rma-paginacion rma-paginacion-superior';
        superior.dataset.tabla = tabla.id;
        const etiqueta = document.createElement('label');
        etiqueta.append('Filas por página ');
        const selector = document.createElement('select');
        selector.className = 'form-control rma-page-option';
        selector.setAttribute('aria-controls', tabla.id);
        selector.setAttribute('aria-label', 'Filas por página');
        tamanos.forEach(n => selector.add(new Option(String(n), String(n))));
        etiqueta.append(selector);
        const resumen = document.createElement('span');
        resumen.className = 'rma-paginacion-resumen';
        resumen.setAttribute('role', 'status');
        resumen.setAttribute('aria-live', 'polite');
        superior.append(etiqueta, resumen);

        const inferior = document.createElement('nav');
        inferior.className = 'rma-paginacion rma-paginacion-inferior';
        inferior.dataset.tabla = tabla.id;
        inferior.setAttribute('aria-label', 'Paginación de ' + (tabla.getAttribute('aria-label') || tabla.id));
        const boton = (nombre, accion) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'btn btn-default'; b.textContent = nombre;
            b.setAttribute('aria-controls', tabla.id);
            b.addEventListener('click', () => { accion(); actualizar(tabla); });
            return b;
        };
        const estado = {pagina:1, tamano, firma:null, selector, resumen, total:0, paginas:1};
        estados.set(tabla, estado);
        estado.primera = boton('Primera', () => { estado.pagina = 1; });
        estado.anterior = boton('Anterior', () => { estado.pagina--; });
        estado.siguiente = boton('Siguiente', () => { estado.pagina++; });
        estado.ultima = boton('Última', () => { estado.pagina = estado.paginas; });
        const paginaLabel = document.createElement('label');
        paginaLabel.append('Página ');
        estado.ir = document.createElement('input');
        estado.ir.type = 'number'; estado.ir.min = '1'; estado.ir.step = '1';
        estado.ir.className = 'form-control rma-page-option rma-paginacion-numero';
        estado.ir.setAttribute('aria-label', 'Ir a página');
        estado.ir.setAttribute('aria-controls', tabla.id);
        estado.paginasTexto = document.createElement('span');
        paginaLabel.append(estado.ir, estado.paginasTexto);
        inferior.append(estado.primera, estado.anterior, paginaLabel, estado.siguiente, estado.ultima);
        // Los controles quedan fuera del desplazamiento horizontal de la tabla.
        const contenedor = tabla.closest('.panel-cyber-body-table, .table-responsive');
        const referencia = contenedor && contenedor.querySelectorAll('table').length === 1 ? contenedor : tabla;
        referencia.before(superior); referencia.after(inferior);
        selector.addEventListener('change', () => {
            estado.tamano = tamanos.includes(Number(selector.value)) ? Number(selector.value) : 10;
            try { localStorage.setItem(clave, String(estado.tamano)); } catch (_) {}
            actualizar(tabla, true);
        });
        const ir = () => {
            const valor = Number(estado.ir.value);
            estado.pagina = Number.isFinite(valor) ? Math.trunc(valor) : 1;
            actualizar(tabla);
        };
        estado.ir.addEventListener('change', ir);
        estado.ir.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ir(); } });
        new MutationObserver(cambios => {
            const cambioFilas = cambios.some(c => c.type === 'attributes'
                ? c.target.tagName === 'TR'
                : c.target.tagName === 'TBODY' || c.target === tabla ||
                    [...c.addedNodes, ...c.removedNodes].some(n => n.nodeType === 1 && (n.tagName === 'TR' || n.tagName === 'TBODY')));
            if (cambioFilas) actualizar(tabla);
        }).observe(tabla, {childList:true, subtree:true, attributes:true, attributeFilter:['style','hidden']});
        actualizar(tabla);
    }
    window.rmaPaginacion = {
        filas:filasFiltradas,
        actualizar:(tabla, reiniciar = false) => actualizar(tabla, reiniciar)
    };
    document.querySelectorAll('table').forEach(inicializar);
    new MutationObserver(cambios => {
        cambios.forEach(c => c.addedNodes.forEach(n => {
            if (n.nodeType !== 1) return;
            if (n.matches('table')) inicializar(n);
            n.querySelectorAll('table').forEach(inicializar);
        }));
    }).observe(document.body, {childList:true, subtree:true});
})();
