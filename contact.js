/* ========= CONFIG =========
 Replace FORM_ENDPOINT with your real endpoint (Formspree etc.)
 Example Formspree: https://formspree.io/f/xyzz... 
 If left empty, the form will "simulate" sending.
===========================*/
const FORM_ENDPOINT = ""; // <-- mettre ici mon endpoint

// short helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* Elements */
const form = $('#gloryForm');
const sendBtn = $('#sendBtn');
const modal = $('#modal');
const modalContent = $('#modalContent');
const modalOk = $('#modalOk');
const modalShare = $('#modalShare');
const backendLabel = $('#backendLabel');
const badgesBox = $('#badges');
const gaugeBar = $('#gaugeBar');

backendLabel.textContent = FORM_ENDPOINT ? 'Formspree' : 'Simu';

/* ========== SUBJECT SPINNER ========== */
const spinSubject = $('#spinSubject');
const subject = $('#subject');
const subjects = ["Quête épique","Signalement secret","Proposition pédagogique","Demande de potion","Réclamation drôle","Gloire immédiate"];

spinSubject.addEventListener('click', ()=> {
  let i=0; const rounds=12;
  const int = setInterval(()=>{
    subject.value = subjects[i % subjects.length];
    i++;
    if(i>rounds){ clearInterval(int); subject.classList.add('spinDone'); setTimeout(()=>subject.classList.remove('spinDone'),400) }
  }, 60);
});

/* ========== HINT & VOICE (text feedback) ========== */
const hintName = $('#hintName');
const hintEmail = $('#hintEmail');
const hintMessage = $('#hintMessage');

$('#name').addEventListener('input', (e)=> {
  const v = e.target.value.trim();
  if(v.length < 3) hintName.textContent = "Deux lettres ? Même Idéfix a plus de syllabes !";
  else hintName.textContent = "Nom accepté — le village note ta bravoure.";
  updateGauge();
});
$('#email').addEventListener('input', (e)=> {
  const v = e.target.value.trim();
  if(v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) hintEmail.textContent = "Ce parchemin n'est pas lisible par nos hiboux.";
  else hintEmail.textContent = "Parchemin OK.";
  updateGauge();
});
$('#message').addEventListener('input', (e)=> {
  const v = e.target.value;
  if(v.length < 8) hintMessage.textContent = "Formule trop courte... ajoute un peu de poésie.";
  else hintMessage.textContent = "Potion en préparation...";
  updateGauge();
});

/* ========== GAUGE ========== */
function updateGauge(){
  let score=0;
  if($('#name').value.trim().length>=3) score+=25;
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#email').value.trim())) score+=30;
  if($('#subject').value.trim().length>0) score+=15;
  if($('#message').value.trim().length>=8) score+=30;
  gaugeBar.style.width = Math.max(6, score) + '%';
  // badges
  badgesBox.innerHTML = '';
  if(score>=80) badgesBox.innerHTML = `<div class="badge">Courageux·se + Totem</div>`;
  else if(score>=50) badgesBox.innerHTML = `<div class="badge">Apprenti·e Résistant·e</div>`;
}

/* initial gauge */
updateGauge();

/* ========== BUTTON ESCAPE (fun) ========== */
const sendRectBuffer = {x:0,y:0};
function randomOffset(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
const container = document.body;
let sendHovering=false;
sendBtn.addEventListener('mousemove', (ev)=>{
  // do nothing (we manage proximity below)
});
container.addEventListener('mousemove', (ev)=>{
  const b = sendBtn.getBoundingClientRect();
  const dx = ev.clientX - (b.left + b.width/2);
  const dy = ev.clientY - (b.top + b.height/2);
  const dist = Math.sqrt(dx*dx + dy*dy);
  // if cursor is too close (<110px) and gauge < 90, move button
  const gaugeVal = parseInt(gaugeBar.style.width);
  if(dist < 120 && gaugeVal < 90){
    sendBtn.style.transform = `translate(${randomOffset(-120,120)}px, ${randomOffset(-30,30)}px)`;
    sendBtn.style.transition = 'transform 220ms ease';
  } else {
    sendBtn.style.transform = 'translate(0,0)';
    sendBtn.style.transition = 'transform 300ms ease';
  }
});

/* ========== EASTER EGGS via typing ========== */
let typedHistory = '';
subject.addEventListener('input',(e)=> checkEaster(e.target.value));
$('#message').addEventListener('input',(e)=> checkEaster(e.target.value));

function checkEaster(text){
  const t = text.toLowerCase();
  if(t.includes('gloire')) triggerConfetti();
  if(t.includes('potion')) playBubble();
  if(t.includes('serieux')) toggleSeriousMode(true);
  // revert serious mode if removed
  if(!t.includes('serieux')) toggleSeriousMode(false);
  typedHistory += text.slice(-1);
  if(typedHistory.length>100) typedHistory=typedHistory.slice(-80);
}

/* serious mode */
let serious=false;
function toggleSeriousMode(on){
  if(on && !serious){
    serious=true;
    document.body.style.filter = 'grayscale(100%)';
    $('#hintName').textContent = "Mode sérieux activé.";
  } else if(!on && serious){
    serious=false;
    document.body.style.filter = '';
    $('#hintName').textContent = "Mode fun restauré.";
  }
}

/* ========== Confetti simple ========== */
function triggerConfetti(){
  const confetti = $('#confetti');
  for(let i=0;i<30;i++){
    const span = document.createElement('span');
    span.className='confettiPiece';
    span.textContent = ['✨','🎉','🟡','🔵','🟣'][Math.floor(Math.random()*5)];
    span.style.left = Math.random()*100 + 'vw';
    span.style.top = (Math.random()*10 - 10) + 'vh';
    span.style.fontSize = randomOffset(16,30)+'px';
    confetti.appendChild(span);
    setTimeout(()=>span.remove(), 2400);
  }
}

/* bubble sound with WebAudio */
function playBubble(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.8);
  }catch(e){ /* ignore on old browsers */ }
}

/* ========== SUBMIT HANDLING (works with Formspree or simule) ========== */
form.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  // validate
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const subjectVal = $('#subject').value.trim();
  const messageVal = $('#message').value.trim();
  if(!name || !email || !subjectVal || !messageVal){
    showModal("Erreur — tous les champs requis.", "Complète tous les rituels pour envoyer la missive.");
    return;
  }
  // show sending animation
  sendBtn.disabled = true; sendBtn.textContent = "Envoi...";
  try{
    if(FORM_ENDPOINT){
      // real send via fetch (Formspree expects form data)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subjectVal);
      formData.append('message', messageVal);
      const res = await fetch(FORM_ENDPOINT, {method:'POST', body: formData});
      if(res.ok) {
        onSendSuccess();
      } else {
        throw new Error('Erreur serveur');
      }
    } else {
      // simulate network
      await new Promise(r => setTimeout(r, 900 + Math.random()*700));
      // small chance to "win" — simulate winner for demo
      const winner = Math.random() < 0.06; // 6% demo chance
      onSendSuccess(winner);
    }
  }catch(err){
    showModal("Échec d'envoi", "Le druide a perdu la missive. Réessaie ou configure un endpoint réel.");
  } finally {
    sendBtn.disabled = false; sendBtn.textContent = "Envoyer la missive";
  }
});

function onSendSuccess(winner=false){
  // solemn popup animation
  const html = winner
    ? `<h2>🎺 Félicitations ! 🎺</h2>
       <p>Ta missive a été reçue par le Grand Conseil.</p>
       <p><strong>Tu as remporté la carte Illicado de 15€ !</strong></p>
       <p>Nous t'enverrons un message de confirmation par email.</p>`
    : `<h2>Message envoyé</h2>
       <p>La missive a traversé les nuées et atteint le village.</p>
       <p>Si tu es l'élu·e, nous t'enverrons le message sacré : <em>"Félicitations, vous avez gagné !"</em></p>`;
  showModal("Le destin est scellé", html, winner);
  // extra effects
  triggerConfetti();
  playVictoryTune(winner);
}

/* ========== Modal helpers ========== */
function showModal(title, body, winner=false){
  modalContent.innerHTML = `<div style="font-size:18px;font-weight:800;margin-bottom:6px">${title}</div><div style="color:var(--muted)">${body}</div>`;
  modal.classList.remove('hidden');
  // bind ok
  modalOk.onclick = ()=>{ modal.classList.add('hidden'); if(winner) alert('Vérifie ta boîte mail (simu demo).'); }
  modalShare.onclick = ()=>{ navigator.share ? navigator.share({title:'J’ai envoyé ma missive !',text:'Je viens d’envoyer ma participation au Formulaire de la Gloire.'}) : alert('Partage non supporté sur ce navigateur.'); }
}

/* ========== Tiny victory sound ========== */
function playVictoryTune(winner=false){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    const now = ctx.currentTime;
    if(winner){
      // short triad
      playNote(ctx, 660, now, 0.12);
      playNote(ctx, 880, now+0.12, 0.12);
      playNote(ctx, 990, now+0.24, 0.22);
    } else {
      playNote(ctx, 440, now, 0.18);
    }
  }catch(e){}
}
function playNote(ctx,f,when,dur){
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(f, when);
  o.type='sine';
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(0.12, when+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, when+dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(when); o.stop(when+dur+0.02);
}

/* ========== init: catch enter on inputs to not submit accidentally ========== */
$$('input,textarea').forEach(el=>{
  el.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter' && el.tagName.toLowerCase() !== 'textarea') e.preventDefault();
  });
});
