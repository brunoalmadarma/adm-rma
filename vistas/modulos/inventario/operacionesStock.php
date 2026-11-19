<?php
$opTecnico=(int)($_SESSION['id_rol']??0)===1;
$opAsignar=$ruta==='stockAsignaciones';
$opBajas=$ruta==='bajasStock';
?>
<div class="content-wrapper operaciones-page" data-tecnico="<?= $opTecnico?'1':'0' ?>" data-vista="<?= $opAsignar?'asignaciones':($opBajas?'bajas':'movimientos') ?>">
 <section class="content-header"><h1><?= $opAsignar?'Asignaciones en taller':($opBajas?'Bajas de stock':'Movimientos Central ↔ RMA') ?></h1>
 <p><?= $opAsignar?'Registrá los productos entregados a cada RMA y consultá los insumos aplicados.':($opBajas?'Registrá pérdidas o fallas con su informe y responsable.':'Consultá los traslados y devoluciones, con cantidades, caso y responsable.') ?></p></section>
 <section class="content">
 <div id="opMensaje" role="status" hidden class="alert"></div>
 <div class="op-toolbar"><label>Buscar <input id="opBuscar" class="form-control" placeholder="Caso, producto, responsable o motivo"></label>
 <label>Tipo <select id="opFiltro" class="form-control"><option value="">Todos</option></select></label>
 <button id="opNuevo" class="btn btn-primary"><?= $opAsignar?'Asignar producto a RMA':($opBajas?'Registrar baja':'Registrar traslado / devolución') ?></button>
 <?php if($opAsignar):?><button id="opInsumo" class="btn btn-default">Aplicar insumo a RMA</button><?php endif; ?>
 <button id="opActualizar" class="btn btn-default">Actualizar</button></div>
 <p id="opResumen" class="alert alert-info"></p>
 <div class="box"><div class="box-body table-responsive"><table id="tablaOperaciones" class="table table-striped"><thead><tr><th>Registro</th><th>Fecha</th><th>Tipo</th><th>Producto / Insumo</th><th>Código</th><th>Cantidad</th><th>Stock antes</th><th>Stock después</th><th>En RMA antes</th><th>En RMA después</th><th>Caso RMA</th><th>Técnico</th><th>Responsable</th><th>Motivo / informe</th></tr></thead><tbody></tbody></table></div></div>
 <?php if($opAsignar):?><h2>Insumos aplicados a reparaciones</h2><div class="box"><div class="box-body table-responsive"><table id="tablaConsumos" class="table"><thead><tr><th>ID</th><th>Caso RMA</th><th>Insumo</th><th>SKU</th><th>Cantidad</th><th>Técnico</th><th>Fecha</th><th>Observación</th></tr></thead><tbody></tbody></table></div></div><?php endif; ?>
 </section>
</div>
<dialog id="opDialog" class="op-dialog"><form id="opForm"><h3 id="opTitulo">Registrar operación</h3>
 <label>Operación<select id="opTipo" class="form-control" required></select></label>
 <label>Inventario<select id="opFuente" class="form-control"><option value="central">Stock central</option><option value="insumos">Insumos de taller RMA</option></select></label>
 <label>Caso RMA<select id="opCaso" class="form-control"><option value="">Sin caso (depósito)</option></select></label>
 <label>Producto / insumo<select id="opStock" class="form-control" required></select></label>
 <label>Cantidad<input id="opCantidad" class="form-control" type="number" min="1" max="100000" step="1" required value="1"></label>
 <label id="opCausaLabel">Causa<select id="opCausa" class="form-control"><option value="PERDIDA_DEPOSITO">Pérdida en depósito</option><option value="FALLA_TECNICA">Falla técnica</option></select></label>
 <label>Motivo / informe<textarea id="opMotivo" class="form-control" rows="4" maxlength="2000" required></textarea></label>
 <p id="opError" role="alert" class="text-danger"></p><div class="op-toolbar"><button id="opGuardar" class="btn btn-primary">Confirmar operación</button><button id="opCancelar" class="btn btn-default" type="button">Cancelar</button></div>
 </form></dialog>
<style>
.operaciones-page{padding:15px 20px;color:#0f172a;min-height:80vh}.op-toolbar{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:18px}.op-dialog{border:1px solid #cbd5e1;border-radius:10px;padding:24px;width:min(620px,95vw);max-height:90vh;overflow:auto;color:#0f172a}.op-dialog::backdrop{background:#0f172a99}.op-dialog label{display:block;margin-bottom:12px}.op-dialog .form-control{display:block;width:100%;padding:9px;border:1px solid #cbd5e1;border-radius:5px;min-height:38px;box-sizing:border-box}.operaciones-page td{white-space:normal;min-width:75px}.operaciones-page td:last-child{min-width:200px;white-space:pre-wrap}.operaciones-page .box-body{overflow:auto;padding:15px}.operaciones-page table{width:100%;font-size:13px}.operaciones-page th,.operaciones-page td{padding:10px;border-bottom:1px solid #e2e8f0}.operaciones-page h1{font-size:26px}
</style>
<script src="vistas/js/inventario/operacionesStock.js?v=<?= filemtime(__DIR__.'/../../js/inventario/operacionesStock.js') ?>"></script>
