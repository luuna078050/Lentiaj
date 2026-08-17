async function findNearbyShops(container){
  container.innerHTML='<div class="hint">📍 Определяю ваше местоположение…</div>';
  if(!navigator.geolocation){container.innerHTML='<div class="hint">Геолокация не поддерживается. Откройте приложение в современном браузере.</div>';return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    const {latitude,longitude}=pos.coords;
    const query=`[out:json][timeout:12];(node[shop~"supermarket|convenience"](around:3500,${latitude},${longitude});way[shop~"supermarket|convenience"](around:3500,${latitude},${longitude}););out center tags;`;
    try{
      const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:query,headers:{'Content-Type':'text/plain'}});
      if(!res.ok)throw new Error('network');
      const data=await res.json();
      const shops=(data.elements||[]).map(x=>{const lat=x.lat??x.center?.lat,lon=x.lon??x.center?.lon,t=x.tags||{};return {name:t.name||'Магазин рядом',lat,lon,brand:t.brand||''};}).filter(x=>x.lat&&x.lon).slice(0,8);
      if(!shops.length){container.innerHTML='<div class="hint">Рядом не нашёл магазинов в открытой карте.</div>';return;}
      shops.sort((a,b)=>distance(latitude,longitude,a.lat,a.lon)-distance(latitude,longitude,b.lat,b.lon));
      container.innerHTML=shops.map(s=>{const d=distance(latitude,longitude,s.lat,s.lon);return `<div class="shop-row"><div><strong>🛒 ${escapeHtml(s.name)}</strong><small>${d<1?(d*1000).toFixed(0)+' м':d.toFixed(1)+' км'}${s.brand?' · '+escapeHtml(s.brand):''}</small></div><a class="outline" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}">Маршрут</a></div>`}).join('');
    }catch(e){container.innerHTML='<div class="hint">Не удалось получить магазины сейчас. Проверь интернет и повтори поиск.</div>';}
  },()=>{container.innerHTML='<div class="hint">Чтобы показать магазины рядом, разреши доступ к геолокации.</div>'},{enableHighAccuracy:true,timeout:10000,maximumAge:300000});
}
function distance(lat1,lon1,lat2,lon2){const R=6371,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
