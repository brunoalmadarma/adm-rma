<?php
function rmaFlujoTrabajo(string $ruta,int $rol): void {
    $labels=['dashboard'=>'Inicio','usuarios'=>'Usuarios','roles'=>'Roles','perfil'=>'Mi perfil','configuracion'=>'Parámetros','nuevoCaso'=>'Registrar RMA','bandejaCasos'=>'Bandeja de casos','taller'=>'Diagnóstico','proveedoresRma'=>'Flujo externo','historialEstado'=>'Historial','clientes'=>'Clientes','proveedores'=>'Proveedores','notificaciones'=>'Comunicaciones','remisiones'=>'Remisiones','dashboardInventario'=>'Stock central','stockCatalogo'=>'Insumos RMA','stockAlertas'=>'Stock crítico','stockAsignaciones'=>'Asignaciones','stockMovimientos'=>'Movimientos','stockInternoRma'=>'Stock interno RMA','bajasStock'=>'Bajas de stock','slaProcesos'=>'Tiempos de ciclo','performanceTecnico'=>'Rendimiento técnico','confiabilidadProducto'=>'Análisis de fallas','auditoriaProveedores'=>'Auditoría de proveedores','recurrenciaClientes'=>'Fidelización','perfil_tecnico'=>'Estación de trabajo','nuevaRemision'=>'Solicitar remisión'];
    $grupos=[['dashboard','usuarios','roles','perfil','configuracion','nuevoCaso'],['nuevoCaso','bandejaCasos','taller','proveedoresRma','historialEstado','remisiones'],['clientes','proveedores','notificaciones','bandejaCasos'],['remisiones','dashboardInventario','stockInternoRma','stockCatalogo','stockAlertas','stockAsignaciones','stockMovimientos','bajasStock'],['slaProcesos','performanceTecnico','confiabilidadProducto','auditoriaProveedores','recurrenciaClientes','dashboard']];
    if($rol===1)$grupos=[['perfil_tecnico','nuevoCaso','bandejaCasos','taller','proveedoresRma','historialEstado','nuevaRemision','remisiones','stockInternoRma','bajasStock'],['clientes','proveedores','notificaciones'],['slaProcesos','performanceTecnico']];
    if($rol===5)$grupos=[$grupos[3]];
    $links=[];
    foreach($grupos as $g){$i=array_search($ruta,$g,true);if($i!==false){if($i>0)$links[]=['Anterior: '.$labels[$g[$i-1]],$g[$i-1]];if($i<count($g)-1)$links[]=['Siguiente: '.$labels[$g[$i+1]],$g[$i+1]];break;}}
    if(!$links)return;
    echo '<nav aria-label="Flujo de trabajo" style="margin:0 20px 16px;padding:12px;background:#fff;border:1px solid #cbd5e1;border-radius:8px;display:flex;gap:12px;flex-wrap:wrap">';
    foreach($links as [$label,$url])echo '<a class="btn btn-default" href="'.$url.'">'.htmlspecialchars($label,ENT_QUOTES,'UTF-8').'</a>';
    echo '</nav>';
}
