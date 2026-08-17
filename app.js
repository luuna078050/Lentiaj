const state={inventory:[{name:'Яйца',qty:'6 шт.',icon:'🥚'},{name:'Помидоры',qty:'3 шт.',icon:'🍅'},{name:'Сыр',qty:'200 г',icon:'🧀'},{name:'Курица',qty:'500 г',icon:'🍗'},{name:'Сливки',qty:'200 мл',icon:'🥛'}],shopping:[{name:'Шампиньоны',qty:'300 г',icon:'🍄'},{name:'Картофель',qty:'1 кг',icon:'🥔'},{name:'Лук',qty:'2 шт.',icon:'🧅'}]};
const recipes=[
{name:'Омлет с овощами',time:'15 мин',ready:true,need:[],icon:'🍳'},
{name:'Курица с сыром',time:'30 мин',ready:true,need:[],icon:'🍗'},
{name:'Запеканка',time:'35 мин',ready:true,need:[],icon:'🥘'},
{name:'Паста с курицей и грибами',time:'25 мин',ready:false,need:['Шампиньоны','Сливки'],icon:'🍝'},
{name:'Картофель с курицей',time:'40 мин',ready:false,need:['Картофель','Лук'],icon:'🥔'}];
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
function renderRecipes(){
 $('#readyRecipes').innerHTML=recipes.filter(r=>r.ready).map(card).join('');
 $('#buyRecipes').innerHTML=recipes.filter(r=>!r.ready).map(card).join('');
 $('#readyCount').textContent=recipes.filter(r=>r.ready).length;
 $$('.recipe .cook').forEach(b=>b.onclick=()=>toast('Отлично. Открываем рецепт: '+b.dataset.name));
}
function card(r){return `<article class="recipe"><div class="recipe-top"><div><h3>${r.icon} ${r.name}</h3><p>${r.ready?'Всё необходимое уже есть дома.':'Не хватает: '+r.need.join(', ')+'.'}</p></div></div><div class="recipe-actions"><small>⏱ ${r.time}</small>${r.ready?`<button class="outline cook" data-name="${r.name}">Приготовить</button>`:`<span class="buy-label">Требуется докупить</span>`}</div></article>`}
function renderInventory(){ $('#inventoryList').innerHTML=state.inventory.map((x,i)=>`<div class="inventory-row"><span class="food-icon">${x.icon}</span><div class="row-main"><strong>${x.name}</strong><small>${x.qty}</small></div><button class="remove" data-i="${i}">×</button></div>`).join(''); $$('.remove').forEach(b=>b.onclick=()=>{state.inventory.splice(+b.dataset.i,1);renderInventory();toast('Продукт удалён')}); }
function renderShopping(){ $('#shoppingList').innerHTML=state.shopping.map((x,i)=>`<label class="shopping-row"><input type="checkbox" data-i="${i}"><span class="food-icon">${x.icon}</span><div class="row-main"><strong>${x.name}</strong><small>${x.qty}</small></div></label>`).join('');$('#shoppingCount').textContent=state.shopping.length;}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function modal(html){$('#modalContent').innerHTML=html;$('#modal').classList.remove('hidden')}
$('#closeModal').onclick=()=>$('#modal').classList.add('hidden');$('#modal').onclick=e=>{if(e.target.id==='modal')e.currentTarget.classList.add('hidden')};
$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+t.dataset.screen).classList.add('active')});
$('#scanBtn').onclick=()=>modal(`<h2>Сканирование продуктов</h2><p>Камера в этой тестовой версии имитируется. Реальное компьютерное зрение подключим следующим этапом.</p><button class="primary full" id="simulateScan">Запустить тестовое распознавание</button>`);
$('#modalContent').onclick=e=>{if(e.target.id==='simulateScan'){state.inventory.push({name:'Авокадо',qty:'1 шт.',icon:'🥑'});renderInventory();$('#modal').classList.add('hidden');toast('Нашёл продукт: авокадо');}};
$('#addProduct').onclick=()=>modal(`<h2>Добавить продукт</h2><button class="choice" data-add="🍎 Яблоки">🍎 Яблоки</button><button class="choice" data-add="🥕 Морковь">🥕 Морковь</button><button class="choice" data-add="🍞 Хлеб">🍞 Хлеб</button>`);
$('#modalContent').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const [icon,name]=b.dataset.add.split(' ');state.inventory.push({name,qty:'1 шт.',icon});renderInventory();$('#modal').classList.add('hidden');toast('Добавлено: '+name)});
$('#aperitifBtn').onclick=()=>modal(`<h2>У меня есть аперитивчик 🥂</h2><p>Выбери, что сегодня есть.</p><button class="choice" data-drink="🥂 Шампанское">🥂 Шампанское</button><button class="choice" data-drink="🍷 Вино">🍷 Вино</button><button class="choice" data-drink="🍹 Другой напиток">🍹 Другой напиток</button>`);
$('#modalContent').addEventListener('click',e=>{const b=e.target.closest('[data-drink]');if(!b)return;const drink=b.dataset.drink;modal(`<h2>${drink}</h2><p>Подбираю закуску из того, что уже есть дома.</p><div class="hint">Например: сыр, овощи и курица. Если чего-то не хватает — добавлю это в список покупок.</div><button class="primary full" id="closeChoice">Показать варианты</button>`);});
$('#whereBuy').onclick=()=>toast('Поиск магазинов — следующий модуль тестовой версии');
$('#voiceTop').onclick=()=>{if('webkitSpeechRecognition' in window||'SpeechRecognition' in window){toast('Голосовой режим готов к подключению');}else{toast('Голосовой ввод недоступен в этом браузере')}};
renderRecipes();renderInventory();renderShopping();
