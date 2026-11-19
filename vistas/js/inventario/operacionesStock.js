(function(){
 const root=document.querySelector('.operaciones-page'), vista=root.dataset.vista, tecnico=root.dataset.tecnico==='1';
 const $=id=>document.getElementById(id), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
 const api='../api-rma/inventario/operaciones.php', asig='../api-rma/inventario/stock-asignaciones.php';
 const nombres={CENTRAL_RMA:'Central → RMA',RMA_CENTRAL:'RMA → Central',BAJA_CENTRAL:'Baja en central',BAJA_RMA:'Baja en RMA',BAJA_INSUMO:'Baja de insumo'};
 let registros=[], consumos=[], aux=null, consumo=false, ocupado=false;
 async function request(url,body){const r=await fetch(url,body?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':window.rmaCsrf},body:JSON.stringify(body)}:{cache:'no-store'});const d=await r.json();if(!r.ok||d.status!=='success')throw new Error(d.message||'No se pudo completar la operación.');return d;}
 function mensaje(t,error=false){$('opMensaje').hidden=false;$('opMensaje').className='alert '+(error?'alert-danger':'alert-success');$('opMensaje').textContent=t;}
 function render(){
  const term=$('opBuscar').value.toLowerCase().trim(), tipo=$('opFiltro').value;
  const rows=registros.filter(o=>(!tipo||o.tipo===tipo)&&Object.values(o).join(' ').toLowerCase().includes(term));
  $('tablaOperaciones').querySelector('tbody').innerHTML=rows.map(o=>'<tr>'+[o.registro,o.fecha,nombres[o.tipo]||o.tipo,o.nombre,o.codigo||o.codigo_sku,o.cantidad,o.stock_anterior,o.stock_nuevo,o.rma_anterior??'—',o.rma_nuevo??'—',o.numero_caso||'Depósito',o.tecnico_nombre||'—',o.usuario_nombre,o.motivo].map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')||'<tr><td colspan="14">No hay operaciones para estos filtros.</td></tr>';
  $('opResumen').textContent=rows.length+' operaciones · '+rows.reduce((s,o)=>s+Number(o.cantidad),0)+' unidades movidas'+(vista==='movimientos'?' · Solo traslados y devoluciones Central ↔ RMA.':'');
  if(vista==='asignaciones'){
   const filtrados=consumos.filter(o=>Object.values(o).join(' ').toLowerCase().includes(term));
   $('tablaConsumos').querySelector('tbody').innerHTML=filtrados.map(o=>'<tr>'+[o.id,o.numero_caso,o.insumo_nombre,o.codigo_sku,o.cantidad,o.tecnico_nombre,o.fecha_aplicacion,o.observacion].map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('')||'<tr><td colspan="8">No hay insumos aplicados para esta búsqueda.</td></tr>';
  }
 }
 async function cargar(){try{const d=await request(api+'?action=listar');registros=d.central.map(o=>({...o,registro:'C-'+o.id}));if(vista==='movimientos')registros=registros.filter(o=>['CENTRAL_RMA','RMA_CENTRAL'].includes(o.tipo)).concat(d.historial||[]);if(vista==='asignaciones')registros=registros.filter(o=>['CENTRAL_RMA','RMA_CENTRAL','BAJA_RMA'].includes(o.tipo));if(vista==='bajas')registros=registros.filter(o=>o.tipo.startsWith('BAJA')).concat(d.bajas.map(o=>({...o,registro:'I-'+o.id,tipo:'BAJA_INSUMO'})));render();
  if(vista==='asignaciones'){const a=await request(asig+'?action=listar');consumos=a.asignaciones;render();}
 }catch(e){mensaje(e.message,true);}}
 function stock(){const fuente=$('opFuente').value;let items=fuente==='central'?aux.central:aux.insumos;$('opStock').innerHTML='<option value="">Seleccioná un ítem</option>'+items.map(p=>'<option value="'+p.id+'">'+esc((p.codigo||p.codigo_sku||'')+' · '+p.nombre+' · '+(fuente==='central'?'Central: '+p.cantidad+' / RMA: '+p.stock_rma:'Disponible: '+p.cantidad))+'</option>').join('');}
 function modo(){const tipo=$('opTipo').value;const baja=tipo.startsWith('BAJA');$('opFuente').disabled=consumo||tipo==='BAJA_INSUMO'||!baja;if(consumo||tipo==='BAJA_INSUMO')$('opFuente').value='insumos';else $('opFuente').value='central';$('opCaso').required=tecnico||tipo!=='BAJA_CENTRAL';$('opCausaLabel').hidden=!baja;$('opMotivo').maxLength=consumo?255:2000;stock();}
 async function abrir(insumo=false){consumo=insumo;$('opForm').reset();$('opError').textContent='';try{aux=await request(api+'?action=auxiliares');$('opCaso').innerHTML='<option value="">Sin caso (depósito)</option>'+aux.casos.map(c=>'<option value="'+c.id+'">'+esc(c.numero_caso+' · '+c.equipo)+'</option>').join('');
 let tipos=insumo?['APLICAR_INSUMO']:(vista==='bajas'?(tecnico?['BAJA_RMA','BAJA_INSUMO']:['BAJA_CENTRAL','BAJA_RMA','BAJA_INSUMO']):(vista==='asignaciones'?['CENTRAL_RMA']:['CENTRAL_RMA','RMA_CENTRAL']));
 $('opTipo').innerHTML=tipos.map(t=>'<option value="'+t+'">'+esc(nombres[t]||'Aplicar insumo a reparación')+'</option>').join('');$('opTitulo').textContent=insumo?'Aplicar insumo al RMA':'Registrar operación';modo();$('opDialog').showModal();}catch(e){mensaje(e.message,true);}}
 $('opNuevo').onclick=()=>abrir();$('opInsumo')?.addEventListener('click',()=>abrir(true));$('opTipo').onchange=modo;$('opFuente').onchange=stock;
 $('opCancelar').onclick=()=>{if(!ocupado)$('opDialog').close();};$('opDialog').addEventListener('cancel',e=>{if(ocupado)e.preventDefault();});
 $('opForm').addEventListener('submit',async e=>{e.preventDefault();if(ocupado)return;ocupado=true;$('opGuardar').disabled=true;$('opError').textContent='';try{
 let body={tipo:$('opTipo').value,fuente:$('opFuente').value,id_caso:$('opCaso').value||0,id_stock:$('opStock').value,cantidad:$('opCantidad').value,motivo:$('opMotivo').value.trim(),causa:$('opCausa').value};
 let url=api+'?action=guardar';if(consumo){url=asig+'?action=guardar';body={...body,id_tecnico:aux.casos.find(c=>String(c.id)===String(body.id_caso))?.id_tecnico,observacion:body.motivo};}
 const d=await request(url,body);$('opDialog').close();mensaje(d.message);await cargar();
 }catch(err){$('opError').textContent=err.message;}finally{ocupado=false;$('opGuardar').disabled=false;}});
 const filtros=vista==='bajas'?['BAJA_CENTRAL','BAJA_RMA','BAJA_INSUMO']:['CENTRAL_RMA','RMA_CENTRAL'];
 if(vista==='asignaciones')filtros.push('BAJA_RMA');
 filtros.forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=nombres[t];$('opFiltro').appendChild(o);});
 $('opBuscar').oninput=render;$('opFiltro').onchange=render;$('opActualizar').onclick=cargar;cargar();
})();
