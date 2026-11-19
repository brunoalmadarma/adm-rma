(function(){
 const tablas={tablaUsuarios:'Gestión de usuarios',tablaClientes:'Directorio de clientes',tablaProveedores:'Directorio de proveedores',tablaLogistica:'Flujo externo de garantías',tablaRemisiones:'Notas de remisión',tablaStockInventario:'Stock central',tablaStock:'Insumos del taller RMA',tablaAlertas:'Stock crítico',tablaOperaciones:'Operaciones de inventario',tablaConsumos:'Insumos aplicados a RMA',tablaSlaCasos:'Tiempos de ciclo',tablaPerformanceTecnicos:'Rendimiento técnico',tablaConfiabilidadModelos:'Análisis de fallas',tablaAuditoriaProveedores:'Auditoría de proveedores',tablaRecurrenciaClientes:'Fidelización de clientes'};
 if(document.getElementById('tbodyCasos'))document.getElementById('tbodyCasos').closest('table').dataset.rmaReporte='Bandeja de casos';
 function contenido(table,titulo,scope,group){
  const heads=[...table.querySelectorAll('thead tr:last-child th')];
  const indices=heads.map((h,i)=>({i,t:h.textContent.trim()})).filter(o=>!/^acci[oó]n|^opciones|^gesti[oó]n$/i.test(o.t));
  const filas=window.rmaPaginacion?window.rmaPaginacion.filas(table):[...table.querySelectorAll('tbody tr')].filter(tr=>tr.offsetParent!==null);
  let trs=filas.filter(tr=>tr.cells.length===heads.length&&![...tr.cells].some(c=>c.colSpan>1));
  if(scope==='seleccion')trs=trs.filter(tr=>tr.querySelector('.rma-row-check')?.checked);
  if(!trs.length)throw new Error(scope==='seleccion'?'Seleccioná al menos un registro.':'No hay registros para exportar.');
  const datosFilas=trs.map(tr=>indices.map(({i})=>tr.cells[i].textContent.replace(/\s*\n\s*/g,' ').trim()));
  const filtros=[...document.querySelectorAll('.content-wrapper input:not([type=file]):not([type=hidden]):not([type=checkbox]):not(.rma-page-option),.content-wrapper select:not(.rma-export-option):not(.rma-page-option)')].filter(el=>el.offsetParent!==null&&el.value).map(el=>el.tagName==='SELECT'?el.selectedOptions[0]?.textContent:el.value).join(' · ');
  const result=[];
  const subtotal=(label,rows)=>{
   const r=Array(indices.length).fill('');r[0]=label+' ('+rows.length+' registros)';
   indices.forEach((col,j)=>{if(j>0&&/^(cantidad|stock|existencia|total unidades)/i.test(col.t)){const nums=rows.map(row=>Number(row[j].replace(',','.')));if(nums.every(Number.isFinite))r[j]=String(nums.reduce((a,b)=>a+b,0));}});
   return r;
  };
  if(group!==''){
   const gi=indices.findIndex(o=>o.i===Number(group));const groups=new Map();
   datosFilas.forEach(row=>{const key=row[gi]||'Sin dato';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);});
   [...groups.keys()].sort((a,b)=>a.localeCompare(b,'es')).forEach(key=>{
    const rows=groups.get(key),header=Array(indices.length).fill('');header[0]=indices[gi].t+': '+key;result.push(header,...rows,subtotal('Subtotal '+key,rows));
   });
  }else result.push(...datosFilas);
  result.push(subtotal('TOTAL GENERAL',datosFilas));
  return {titulo:(titulo+' | '+(scope==='seleccion'?'Selección':'Filtrado')+(filtros?' | Filtros: '+filtros:'')).slice(0,200),columnas:indices.map(o=>o.t),filas:result,total_registros:datosFilas.length};
 }
 function descargar(blob,nombre){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=nombre;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 function csvCell(v){let s=String(v);if(/^[\s]*[=+@\-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
 document.querySelectorAll('table').forEach(table=>{
  const titulo=tablas[table.id]||table.dataset.rmaReporte;if(!titulo)return;
  const toolbar=document.createElement('div');toolbar.className='rma-export-toolbar';toolbar.style.cssText='display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0 15px';
  const scope=document.createElement('select');scope.className='rma-export-option form-control';scope.style.width='auto';scope.setAttribute('aria-label','Registros a exportar');scope.add(new Option('Todos los registros filtrados','filtrado'));scope.add(new Option('Sólo registros seleccionados','seleccion'));toolbar.appendChild(scope);
  const group=document.createElement('select');group.className='rma-export-option form-control';group.style.width='auto';group.setAttribute('aria-label','Agrupar exportación');group.add(new Option('Sin agrupación',''));
  table.querySelectorAll('thead tr:last-child th').forEach((h,i)=>{if(!/^acci[oó]n|^opciones|^gesti[oó]n$/i.test(h.textContent.trim()))group.add(new Option('Agrupar por '+h.textContent.trim(),String(i)));});toolbar.appendChild(group);
  const firstHead=table.querySelector('thead tr:last-child th');
  const all=document.createElement('input');all.type='checkbox';all.className='rma-all-check';all.setAttribute('aria-label','Seleccionar todos los registros visibles');firstHead?.prepend(all);
  const preparar=()=>{table.querySelectorAll('tbody tr').forEach(tr=>{if(tr.cells.length!==table.querySelectorAll('thead tr:last-child th').length||[...tr.cells].some(c=>c.colSpan>1)||tr.querySelector('.rma-row-check'))return;const check=document.createElement('input');check.type='checkbox';check.className='rma-row-check';check.setAttribute('aria-label','Seleccionar '+tr.cells[0].textContent.trim());check.addEventListener('click',e=>e.stopPropagation());tr.cells[0].prepend(check);});all.checked=false;all.indeterminate=false;};
  preparar();new MutationObserver(preparar).observe(table.tBodies[0],{childList:true});
  all.addEventListener('change',()=>table.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelector('.rma-row-check');if(c&&tr.offsetParent!==null)c.checked=all.checked;}));
  const actualizarSeleccion=()=>{const checks=[...table.querySelectorAll('.rma-row-check')].filter(c=>c.closest('tr').offsetParent!==null);all.checked=checks.length>0&&checks.every(c=>c.checked);all.indeterminate=!all.checked&&checks.some(c=>c.checked);};
  table.addEventListener('change',e=>{if(e.target.matches('.rma-row-check'))actualizarSeleccion();});
  table.addEventListener('rma:pagina',actualizarSeleccion);
  ['CSV','PDF'].forEach(formato=>{const btn=document.createElement('button');btn.type='button';btn.className='btn btn-default';btn.textContent='Exportar '+formato;toolbar.appendChild(btn);btn.onclick=async()=>{btn.disabled=true;try{
   const d=contenido(table,titulo,scope.value,group.value),name=(table.id||'bandeja')+'-'+new Date().toISOString().slice(0,10)+'.'+formato.toLowerCase();
   if(formato==='CSV'){descargar(new Blob(['\uFEFF'+[[d.titulo],d.columnas,...d.filas].map(row=>row.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),name);return;}
   const r=await fetch('../api-rma/reportes.php',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':window.rmaCsrf},body:JSON.stringify(d)});
   if(!r.ok||!r.headers.get('Content-Type')?.includes('application/pdf')){const e=await r.json().catch(()=>({}));throw new Error(e.message||'No se pudo exportar.');}
   descargar(await r.blob(),name);
  }catch(e){estado.textContent=e.message;estado.style.color='#b91c1c';}finally{btn.disabled=false;}};});
  const estado=document.createElement('span');estado.textContent='Seleccioná filas y agrupación. Incluye subtotales y total general.';estado.style.cssText='font-size:12px;color:#475569';estado.setAttribute('role','status');toolbar.appendChild(estado);table.before(toolbar);
 });
})();
