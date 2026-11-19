<div class="content-wrapper stock-interno-page">
    <section class="content-header">
        <h1>Stock interno RMA</h1>
        <p>Existencias en depósito RMA, productos entregados a cada caso y movimientos desde depósito central.</p>
    </section>
    <section class="content">
        <div class="stock-interno-toolbar">
            <label for="stockInternoBuscar">Buscar producto, código, caso o responsable
                <input id="stockInternoBuscar" type="search" class="form-control" placeholder="Ej.: SSD, RMA-2026-0733">
            </label>
            <button id="stockInternoActualizar" type="button" class="btn btn-primary">Actualizar stock</button>
            <a href="perfil_tecnico" class="btn btn-default">Volver al inicio</a>
        </div>
        <p id="stockInternoEstado" role="status" aria-live="polite">Cargando stock interno…</p>
        <div id="stockInternoContenido" hidden>
            <h2>Existencias por ubicación</h2>
            <p id="stockInternoResumen" class="alert alert-info"></p>
            <p>Las unidades sin caso figuran en depósito RMA, pero no tienen una asignación vigente registrada. Los saldos negativos requieren revisión de los movimientos.</p>
            <div class="box"><div class="box-body table-responsive" tabindex="0" role="region" aria-label="Existencias por ubicación">
                <table class="table table-striped" id="tablaStockInterno"><thead><tr>
                    <th scope="col">Código</th><th scope="col">Producto / insumo</th><th scope="col">Depósito central</th>
                    <th scope="col">Depósito RMA</th><th scope="col">Asignado a casos</th><th scope="col">Sin caso</th>
                </tr></thead><tbody></tbody></table>
            </div></div>
            <h2>Stock entregado a cada RMA</h2>
            <div class="box"><div class="box-body table-responsive" tabindex="0" role="region" aria-label="Stock entregado a cada RMA">
                <table class="table table-striped" id="tablaStockInternoCasos"><thead><tr>
                    <th scope="col">Código</th><th scope="col">Producto / insumo</th><th scope="col">Caso RMA</th>
                    <th scope="col">Cliente</th><th scope="col">Técnico</th><th scope="col">Entregado</th>
                    <th scope="col">Devuelto</th><th scope="col">Bajas</th><th scope="col">Saldo en RMA</th><th scope="col">Último movimiento</th>
                </tr></thead><tbody></tbody></table>
            </div></div>
            <h2>Movimientos de depósito ↔ RMA</h2>
            <p>El histórico conserva las entregas antiguas, incluso cuando no se registró el caso o el saldo por ubicación.</p>
            <div class="box"><div class="box-body table-responsive" tabindex="0" role="region" aria-label="Movimientos de depósito a RMA">
                <table class="table table-striped" id="tablaStockInternoMovimientos"><thead><tr>
                    <th scope="col">Registro</th><th scope="col">Fecha</th><th scope="col">Movimiento</th><th scope="col">Producto / insumo</th>
                    <th scope="col">Cantidad</th><th scope="col">Central antes</th><th scope="col">Central después</th>
                    <th scope="col">RMA antes</th><th scope="col">RMA después</th><th scope="col">Caso / referencia</th>
                    <th scope="col">Responsable</th><th scope="col">Motivo</th>
                </tr></thead><tbody></tbody></table>
            </div></div>
        </div>
    </section>
</div>
<style>
.stock-interno-page{padding:15px 20px;color:#172b43;min-height:80vh}.stock-interno-page h1{font-size:26px}.stock-interno-page h2{font-size:20px;margin-top:26px}.stock-interno-toolbar{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;margin-bottom:18px}.stock-interno-toolbar label{flex:1 1 280px;max-width:550px;margin:0}.stock-interno-toolbar input{margin-top:6px}.stock-interno-page .box-body{padding:15px}.stock-interno-page table{width:100%;font-size:14px}.stock-interno-page th,.stock-interno-page td{padding:10px;vertical-align:top}.stock-interno-page th{white-space:nowrap}.stock-interno-page td{min-width:90px}.stock-interno-page td:nth-child(2){min-width:160px}.stock-interno-page .saldo-revisar{color:#a12622;font-weight:700}.stock-interno-page [hidden]{display:none!important}
</style>
<script src="vistas/js/inventario/stockInternoRma.js?v=<?= filemtime(__DIR__ . '/../../js/inventario/stockInternoRma.js') ?>"></script>
