const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

// Fix missing Russian UI labels from the previous test build.
Object.assign(LANGS.ru.t,{tag:'Не хочешь думать — не думай.',hero:'Открой холодильник —',hero2:'Ленивец решит.',sub:'Не хочешь выбирать — не выбирай.',greet:'Привет. А ну-ка, покажи закрома.',show:'Покажи холодильник или добавь продукты вручную.',time:'Время',cameraDenied:'Не удалось открыть камеру. Проверь разрешение браузера.',takePhoto:'Сделать снимок',testcam:'Разреши доступ к камере, чтобы Ленивец увидел продукты.',testscan:'Запустить тестовое распознавание',nothingFound:'Не понял команду. Скажи: «покажи, что у меня есть», «добавь яйца», «удали сыр» или «открой камеру».',voiceAction:'Команда выполнена.'});

const state={inventory:[{name:'Яйца',qty:'6 шт.',icon:'🥚'},{name:'Помидоры',qty:'3 шт.',icon:'🍅'},{name:'Сыр',qty:'200 г',icon:'🧀'},{name:'Курица',qty:'500 г',icon:'🍗'},{name:'Сливки',qty:'200 мл',icon:'🥛'}],shopping:[{name:'Шампиньоны',qty:'300 г',icon:'🍄'},{name:'Картофель',qty:'1 кг',icon:'🥔'},{name:'Лук',qty:'2 шт.',icon:'🧅'}]};
let recipes=[{name:'Омлет с овощами',time:'15 мин',need:['яйца','помидоры','сыр'],icon:'🍳'},{name:'Курица с сыром',time:'30 мин',need:['курица','сыр'],icon:'🍗'},{name:'Запеканка',time:'35 мин',need:['яйца','сыр'],icon:'🥘'},{name:'Паста с курицей и грибами',time:'25 мин',need:['курица','шампиньоны','сливки'],icon:'🍝'},{name:'Картофель с курицей',time:'40 мин',need:['курица','картофель','лук'],icon:'🥔'},{name:'Домашний майонез',time:'10 мин',need:['яйца','масло','горчица','лимон'],icon:'🥣'}];
const norm=s=>String(s).toLowerCase().replace(/ё/g,'е').trim();
const have=n=>state.inventory.some(x=>norm(x.name).includes(norm(n))||norm(n).includes(norm(x.name)));
function recalc(){recipes=recipes.map(r=>({...r,ready:r.need.every(have)}))}
function card(r){return `<article class="recipe"><h3>${r.icon} ${r.name}</h3><p>${r.ready?t('all'):`${t('missing')} ${r.need.filter(x=>!have(x)).join(', ')}.`}</p><div class="recipe-actions"><small>⏱ ${r.time}</small>${r.ready?`<button class="outline cook" data-name="${r.name}">${t('open')}</button>`:`<span class="buy-label">${t('buy')}</span>`}</div></article>`}
function renderRecipes(){recalc();$('#readyRecipes').innerHTML=recipes.filter(r=>r.ready).map(card).join('');$('#buyRecipes').innerHTML=recipes.filter(r=>!r.ready).map(card).join('');$('#readyCount').textContent=recipes.filter(r=>r.ready).length;$('#allRecipes').innerHTML=recipes.map(card).join('')+`<button class="primary full" id="publishRecipeBtn">＋ ${t('publishAdd')}</button>`;$('#recipeCount').textContent=recipes.length;$$('.cook').forEach(b=>b.onclick=()=>openRecipe(b.dataset.name));$('#publishRecipeBtn')?.addEventListener('click',openPublishForm)}
function openRecipe(name){const r=recipes.find(x=>x.name===name);modal(`<h2>${r.icon} ${r.name}</h2><p><b>${t('time')}:</b> ${r.time}</p><div class="hint">${t('all')}</div><button class="primary full" id="recipeDone">${t('ok')}</button>`)}
function openPublishForm(){modal(`<h2>${t('publishAdd')}</h2><label>${t('name')}<input class="text-input" id="newName"></label><label>${t('ingredients')}<input class="text-input" id="newIngredients" placeholder="eggs, cheese, flour"></label><button class="primary full" id="publishNow">${t('publish')}</button>`)}
function renderInventory(){$('#inventoryList').innerHTML=state.inventory.map((x,i)=>`<div class="inventory-row"><span class="food-icon">${x.icon}</span><div class="row-main"><strong>${x.name}</strong><small>${x.qty}</small></div><button class="remove" data-i="${i}">×</button></div>`).join('');$$('.remove').forEach(b=>b.onclick=()=>{state.inventory.splice(+b.dataset.i,1);renderInventory();renderRecipes();toast(t('removed'))})}
function renderShopping(){$('#shoppingList').innerHTML=state.shopping.map(x=>`<label class="shopping-row"><input type="checkbox"><span class="food-icon">${x.icon}</span><div class="row-main"><strong>${x.name}</strong><small>${x.qty}</small></div></label>`).join('');$('#shoppingCount').textContent=state.shopping.length}
function addProduct(name,icon='🍎',qty='1 шт.'){if(have(name)){toast(`${name}: уже есть`);return}state.inventory.push({name,icon,qty});renderInventory();renderRecipes();toast(t('added')+' '+name)}

// The previous build used a fake scanner that always inserted an avocado. It is gone.
let cameraStream=null;
function stopCamera(){if(cameraStream){cameraStream.getTracks().forEach(track=>track.stop());cameraStream=null}}
function closeCamera(){stopCamera();closeModal()}
async function openCamera(){
  modal(`<h2>📷 ${t('what')}</h2><div id="cameraBox"><video id="cameraVideo" autoplay playsinline muted style="width:100%;border-radius:18px;background:#111;display:block"></video><button class="primary full" id="takePhoto">📸 ${t('takePhoto')}</button><button class="outline full" id="closeCameraBtn">${t('ok')}</button></div>`);
  const video=$('#cameraVideo');
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
    cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
    video.srcObject=cameraStream;
    await video.play();
  }catch(e){
    stopCamera();
    $('#cameraBox').innerHTML=`<div class="hint">${t('cameraDenied')}</div><button class="primary full" id="closeCameraBtn">${t('ok')}</button>`;
  }
}
function capturePhoto(){
  const video=$('#cameraVideo');if(!video||!video.videoWidth){toast(t('cameraDenied'));return}
  const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);
  const image=canvas.toDataURL('image/jpeg',.88);
  stopCamera();
  $('#cameraBox').innerHTML=`<img src="${image}" alt="Снимок" style="width:100%;border-radius:18px;display:block"><div class="hint">Снимок получен. В этой версии камера уже настоящая; автоматическое определение продуктов через ИИ ещё не подключено.</div><button class="primary full" id="closeCameraBtn">${t('ok')}</button>`;
}

// Voice commands now perform actions instead of merely echoing what was heard.
const voiceAliases={
 ru:{show:['посмотри','покажи','что у меня есть','закром'],camera:['камера','открой камеру','включи камеру','сфотографируй'],products:['продукты','мои продукты'],recipes:['рецепт','рецепты','что приготовить'],add:['добавь','добавить'],remove:['удали','удалить']},
 en:{show:['show me','what do i have','pantry','look'],camera:['camera','open camera','take a photo'],products:['products','my products'],recipes:['recipe','recipes','what can i cook'],add:['add'],remove:['remove','delete']},
 pl:{show:['pokaż','co mam','zapasy'],camera:['kamera','otwórz kamerę'],products:['produkty','moje produkty'],recipes:['przepis','przepisy'],add:['dodaj'],remove:['usuń']}
};
const productAliases=[['яйца','Яйца','🥚'],['яйцо','Яйца','🥚'],['помидоры','Помидоры','🍅'],['помидор','Помидоры','🍅'],['сыр','Сыр','🧀'],['курицу','Курица','🍗'],['курица','Курица','🍗'],['сливки','Сливки','🥛'],['авокадо','Авокадо','🥑'],['картофель','Картофель','🥔'],['лук','Лук','🧅'],['грибы','Шампиньоны','🍄'],['шампиньоны','Шампиньоны','🍄'],['яйца','Яйца','🥚']];
function includesAny(s,arr){return (arr||[]).some(x=>s.includes(norm(x)))}
function findProduct(text){const s=norm(text);return productAliases.find(x=>s.includes(norm(x[0])))}
function handleVoice(text){
  const s=norm(text),lang=document.documentElement.lang||'ru',a=voiceAliases[lang]||voiceAliases.ru;
  const p=findProduct(s);
  if(includesAny(s,a.camera)){toast(t('voiceAction'));openCamera();return}
  if(includesAny(s,a.add)){if(p){addProduct(p[1],p[2]);return}toast(t('nothingFound'));return}
  if(includesAny(s,a.remove)){if(p){const i=state.inventory.findIndex(x=>norm(x.name)===norm(p[1]));if(i>=0){state.inventory.splice(i,1);renderInventory();renderRecipes();toast(t('removed')+' '+p[1]);}else toast('Такого продукта нет');return}toast(t('nothingFound'));return}
  if(includesAny(s,a.show)){showScreen('inventory');toast(t('voiceAction'));return}
  if(includesAny(s,a.products)){showScreen('inventory');return}
  if(includesAny(s,a.recipes)){showScreen('home');renderRecipes();toast(t('voiceAction'));return}
  toast(t('heard')+' «'+text+'»');
}
function startLazy(){if(Voice.supported){Voice.speak(t('greet'));setTimeout(()=>Voice.start(handleVoice),700);return}modal(`<h2>${t('greet')}</h2><p>${t('voiceoff')}</p>`)}

function modal(h){$('#modalContent').innerHTML=h;$('#modal').classList.remove('hidden')}
function closeModal(){stopCamera();$('#modal').classList.add('hidden')}
function toast(v){const e=$('#toast');e.textContent=v;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function showScreen(id){$$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));$$('.screen').forEach(x=>x.classList.toggle('active',x.id===id))}

$('#languageButton').onclick=()=>openLanguagePicker();
$('#closeModal').onclick=closeModal;
$('#modal').onclick=e=>{if(e.target.id==='modal')closeModal()};
$$('.tab').forEach(x=>x.onclick=()=>showScreen(x.dataset.screen));
$('#lazyBtn').onclick=startLazy;
$('#voiceTop').onclick=()=>Voice.start(handleVoice);
$('#scanBtn').onclick=openCamera;
$('#addProduct').onclick=()=>modal(`<h2>${t('add')}</h2><button class="choice" data-add="Яблоки|🍎">🍎 Яблоки</button><button class="choice" data-add="Морковь|🥕">🥕 Морковь</button><button class="choice" data-add="Хлеб|🍞">🍞 Хлеб</button><button class="choice" data-add="Лимон|🍋">🍋 Лимон</button>`);
$('#aperitifBtn').onclick=()=>modal(`<h2>${t('aper')} 🥂</h2><p>${t('drink')}</p><button class="choice">🥂</button><button class="choice">🍷</button><button class="choice">🍹</button>`);
$('#whereBuy').onclick=()=>findNearbyShops($('#shops'));
$('#modalContent').addEventListener('click',async e=>{
 if(e.target.id==='takePhoto'){capturePhoto();return}
 if(e.target.id==='closeCameraBtn'){closeCamera();return}
 if(e.target.id==='recipeDone'){closeModal();return}
 const lang=e.target.closest('[data-lang]');if(lang){setLanguage(lang.dataset.lang);closeModal();return}
 const add=e.target.closest('[data-add]');if(add){const[n,i]=add.dataset.add.split('|');addProduct(n,i);closeModal();return}
 if(e.target.id==='publishNow'){const name=$('#newName').value.trim(),ingredients=$('#newIngredients').value.split(',').map(x=>x.trim()).filter(Boolean);if(!name||!ingredients.length){toast(t('fill'));return}const result=await publishRecipe({name,time:'20 мин',icon:'🍽️',ingredients,tags:['user']});if(result.ok){closeModal();toast(t('published'));recipes=result.recipes.map(r=>({...r,need:r.ingredients||[],ready:(r.ingredients||[]).every(have)}));renderRecipes()}else toast(result.error)}
});

(async()=>{const shared=await loadSharedLibrary();if(shared.length){recipes=shared.map(r=>({...r,ready:r.ingredients?.every(have)||false,need:r.ingredients||[],time:r.time||'—',icon:r.icon||'🍽️'}));renderRecipes()}})();
renderRecipes();renderInventory();renderShopping();renderLanguage();
