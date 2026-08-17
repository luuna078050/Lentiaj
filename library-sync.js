async function loadSharedLibrary(){try{const r=await fetch('./library.json',{cache:'no-store'});if(!r.ok)throw new Error();return (await r.json()).recipes||[]}catch(e){return []}}
