'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = motionPreference.matches;
try { motionOff = localStorage.getItem('kt-motion') === 'off' || motionOff; } catch {}
let updateSceneMotion = () => {};
function setMotion(off) {
  motionOff = off;
  document.body.classList.toggle('motion-off', off);
  $('#motion-toggle').textContent = `Motion: ${off ? 'off' : 'on'}`;
  $('#motion-toggle').setAttribute('aria-pressed', String(off));
  try { localStorage.setItem('kt-motion', off ? 'off' : 'on'); } catch {}
  updateSceneMotion();
}
$('#motion-toggle').addEventListener('click', () => setMotion(!motionOff));
motionPreference.addEventListener('change', e => setMotion(e.matches));
setMotion(motionOff);
function updateClock() {
  $('#local-time').textContent = new Intl.DateTimeFormat('en-GB', { timeZone:'Africa/Addis_Ababa', hour:'2-digit',minute:'2-digit', hour12:false }).format(new Date());
}
updateClock(); setInterval(updateClock, 60000);
$('#copyright-year').textContent = new Date().getFullYear();

// A small, interactive illustration of the software-to-business process.
const universe = $('.build-universe');
const scenes = {
  code: {caption:'Thoughtful code. Reliable foundations.',terminal:'Building something useful'},
  product: {caption:'Useful products. Effortless experiences.',terminal:'Connecting interface + systems'},
  growth: {caption:'Listen. Iterate. Create lasting value.',terminal:'Learning from real-world feedback'}
};
const sceneButtons = $$('.scene-tabs button');
function selectScene(name) {
  universe.dataset.focus = name;
  sceneButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.scene === name)));
  $('.scene-description').textContent = scenes[name].caption;
  $('.terminal-text').textContent = scenes[name].terminal;
}
sceneButtons.forEach(button => button.addEventListener('click', () => selectScene(button.dataset.scene)));
let sceneVisible = true;
const sceneObserver = new IntersectionObserver(entries => {
  sceneVisible = entries[0].isIntersecting;
  updateSceneMotion();
}, {threshold:.05});
updateSceneMotion = () => {
  const paused = motionOff || !sceneVisible || document.hidden;
  document.body.classList.toggle('scene-paused',paused);
  $$('.build-connections').forEach(svg => { if(paused) svg.pauseAnimations(); else svg.unpauseAnimations(); });
  if(motionOff){universe.style.setProperty('--scene-x','0deg');universe.style.setProperty('--scene-y','0deg');}
};
sceneObserver.observe(universe);
updateSceneMotion();
document.addEventListener('visibilitychange',updateSceneMotion);
let pointerFrame = 0;
universe.addEventListener('pointermove', e => {
  if(motionOff || e.pointerType !== 'mouse' || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    const rect = universe.getBoundingClientRect();
    universe.style.setProperty('--scene-x',`${((e.clientX-rect.left)/rect.width-.5)*8}deg`);
    universe.style.setProperty('--scene-y',`${-((e.clientY-rect.top)/rect.height-.5)*7}deg`);
    pointerFrame=0;
  });
},{passive:true});
universe.addEventListener('pointerleave',()=>{
  if(pointerFrame)cancelAnimationFrame(pointerFrame);
  pointerFrame=0;
  universe.style.setProperty('--scene-x','0deg');universe.style.setProperty('--scene-y','0deg');
});

// Authentic project worlds, shared by the carousel, timeline, and immersive viewer.
const {projects, chapters, contracts, engagements} = window.PORTFOLIO;
const asset = name => `./assets/${name}`;
const tagMarkup = tags => tags.map(tag=>`<span class="glass-tag">${tag}</span>`).join('');
function visualMarkup(project, context='') {
  if(project.images) return `<div class="capture-frame ${project.id==='corksy'?'transparent-capture':''}"><span class="capture-chrome"><i></i><i></i><i></i><b>${project.name}</b></span><img src="${asset(project.images[0].src)}" alt="${project.images[0].alt}" loading="lazy" width="1440" height="1000"><span class="capture-glint" aria-hidden="true"></span></div><span class="capture-note">${project.images[0].caption}</span>`;
  return `<div class="engineering-record"><span class="record-label">PROJECT CONTRIBUTION</span><h4>${project.record[0]}</h4><div class="record-flow">${project.record.slice(1).map((step,i)=>`<div><b>0${i+1}</b><span>${step}</span><i aria-hidden="true">↗</i></div>`).join('')}</div><span class="record-note">${project.category}</span></div>`;
}
$('.project-track').innerHTML=projects.map(p=>`<article class="project-card" data-world="${p.world}" aria-label="${p.name}"><button class="project-art world-art" data-open="${p.id}" aria-label="Explore ${p.name}"><span class="project-overline">${p.category}</span><span class="world-orb" aria-hidden="true"></span><div class="project-capture">${visualMarkup(p)}</div><span class="world-enter">ENTER THE PROJECT <b>↗</b></span></button><div class="project-meta"><div><h3>${p.name}</h3><p>${p.description}</p><div class="project-tags">${tagMarkup(p.tags)}</div></div><button type="button" data-open="${p.id}" aria-label="Explore ${p.name}" class="project-open">↗</button></div></article>`).join('');
$('.project-dots').innerHTML=projects.map(p=>`<button aria-label="Show ${p.name}" aria-pressed="false"></button>`).join('');
$('#project-total').textContent=`01 — ${String(projects.length).padStart(2,'0')}`;
let projectIndex=0;
const cards=$$('.project-card');
function selectProject(index){
  projectIndex=(index+cards.length)%cards.length;
  const gap=parseFloat(getComputedStyle($('.project-track')).gap)||0;
  $('.project-track').style.transform=`translateX(${-projectIndex*(cards[0].getBoundingClientRect().width+gap)}px)`;
  $('#project-count').textContent=`${String(projectIndex+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  $('.work').dataset.world=projects[projectIndex].world;
  $$('.project-dots button').forEach((b,i)=>{b.classList.toggle('active',i===projectIndex);b.setAttribute('aria-pressed',String(i===projectIndex));});
  cards.forEach((c,i)=>{c.inert=i!==projectIndex;c.setAttribute('aria-hidden',String(i!==projectIndex));});
}
$('#prev-project').addEventListener('click',()=>selectProject(projectIndex-1));
$('#next-project').addEventListener('click',()=>selectProject(projectIndex+1));
$$('.project-dots button').forEach((b,i)=>b.addEventListener('click',()=>selectProject(i)));
$('.carousel').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();selectProject(projectIndex+(e.key==='ArrowRight'?1:-1));}});
let swipeStart, suppressProjectClick=false;
$('.carousel').addEventListener('pointerdown',e=>{swipeStart={x:e.clientX,y:e.clientY};});
$('.carousel').addEventListener('pointerup',e=>{if(!swipeStart)return;const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4){selectProject(projectIndex+(dx<0?1:-1));suppressProjectClick=true;setTimeout(()=>suppressProjectClick=false,0);}});
$('.carousel').addEventListener('click',e=>{if(suppressProjectClick){e.preventDefault();e.stopPropagation();}},true);
window.addEventListener('resize',()=>selectProject(projectIndex));
selectProject(0);
$('.engagement-grid').innerHTML=engagements.map((e,i)=>`<article class="engagement-card" id="engagement-${i}"><span class="engagement-number">${String(i+1).padStart(2,'0')} / ${e.role}</span><h3>${e.title}</h3><p>${e.text}</p><div class="project-tags">${tagMarkup(e.tags)}</div></article>`).join('');
$('.contract-list').innerHTML=contracts.map(c=>`<article class="contract"><div><span class="contract-status"><i class="live-dot"></i>${c.type} · ${c.date}</span><h3>${c.title}</h3><p>${c.copy}</p></div><div class="project-tags">${tagMarkup(c.tags)}</div><a href="https://www.upwork.com/freelancers/~011af220bdfdcacc6f" target="_blank" rel="noopener noreferrer" aria-label="View ${c.title} on Upwork">↗</a></article>`).join('');

const dialog=$('#project-dialog');
let openedProject, galleryIndex=0,returnFocus;
function showGallery(index){
  galleryIndex=(index+openedProject.images.length)%openedProject.images.length;
  const shot=openedProject.images[galleryIndex];
  $('.dialog-image-wrap').innerHTML=`<img src="${asset(shot.src)}" alt="${shot.alt}" width="1440" height="1000">`;
  $('#gallery-caption').textContent=`${galleryIndex+1} / ${openedProject.images.length} · ${shot.caption}`;
}
function openProject(id){
  openedProject=projects.find(p=>p.id===id);if(!openedProject)return;
  returnFocus=document.activeElement;
  dialog.dataset.world=openedProject.world;
  $('#dialog-title').textContent=openedProject.name;
  $('#dialog-category').textContent=openedProject.category;
  $('#dialog-description').textContent=openedProject.description;
  $('#dialog-contribution').textContent=openedProject.contribution;
  $('.dialog-tags').innerHTML=tagMarkup(openedProject.tags);
  $('#dialog-source').href=openedProject.url;
  $('#dialog-source').firstChild.textContent=openedProject.images?'Visit the project ':'View project source ';
  $('.gallery-controls').hidden=!openedProject.images;
  if(openedProject.images){showGallery(0);$('#gallery-prev').disabled=$('#gallery-next').disabled=openedProject.images.length<2;}
  else $('.dialog-image-wrap').innerHTML=visualMarkup(openedProject);
  document.body.classList.add('viewer-open');dialog.showModal();dialog.scrollTop=0;
}
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.open)));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');returnFocus?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
$('#gallery-prev').addEventListener('click',()=>showGallery(galleryIndex-1));
$('#gallery-next').addEventListener('click',()=>showGallery(galleryIndex+1));
dialog.addEventListener('keydown',e=>{if(openedProject.images&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();showGallery(galleryIndex+(e.key==='ArrowRight'?1:-1));}});

$('.year-nav').innerHTML=chapters.map((ch,i)=>`<button data-chapter="${i}"><span>${ch.year}</span><small>${ch.label}</small></button>`).join('');
$('.journey-accessible').innerHTML=chapters.map(ch=>`<h3>${ch.date} — ${ch.label}</h3><p>${ch.text}</p>`).join('');
$('.journey').style.setProperty('--chapter-count',chapters.length);
let activeChapter=-1;
function showChapter(i){
  if(i===activeChapter)return;activeChapter=i;
  const ch=chapters[i],project=projects.find(p=>p.id===ch.project);
  const world=project?.world||ch.world;
  const sticky=$('.journey-sticky');sticky.dataset.world=world;
  $('.year-background').textContent=ch.year;
  $('.world-backdrop').style.backgroundImage=project?.images?`url("${asset(project.images[0].src)}")`:'none';
  $('.chapter-number').textContent=`${String(i+1).padStart(2,'0')} / ${ch.date}`;
  $('.chapter-copy h3').innerHTML=ch.title;
  $('.chapter-copy p').textContent=ch.text;
  $('.chapter-tags').innerHTML=tagMarkup(ch.tags||project.tags);
  $('.journey-visual').innerHTML=project?visualMarkup(project):ch.engagement!==undefined?`<div class="engineering-record"><span class="record-label">${engagements[ch.engagement].role}</span><h4>${engagements[ch.engagement].title}</h4><div class="record-flow">${engagements[ch.engagement].tags.map((t,n)=>`<div><b>0${n+1}</b><span>${t}</span><i>↗</i></div>`).join('')}</div><span class="record-note">${ch.date}</span></div>`:`<div class="engineering-record"><span class="record-label">COMPLETED UPWORK ENGAGEMENT</span><h4>${ch.label}</h4><div class="record-flow">${contracts[ch.contract].tags.map((t,n)=>`<div><b>0${n+1}</b><span>${t}</span><i>↗</i></div>`).join('')}</div><span class="record-note">${ch.date}</span></div>`;
  const explore=$('.chapter-explore');explore.textContent=project?'Explore this project ↗':ch.engagement!==undefined?'More about my work ↗':'View on Upwork ↗';explore.onclick=()=>project?openProject(project.id):ch.engagement!==undefined?$(`#engagement-${ch.engagement}`).scrollIntoView({behavior:motionOff?'instant':'smooth'}):window.open('https://www.upwork.com/freelancers/~011af220bdfdcacc6f','_blank','noopener');
  $$('.year-nav button').forEach((b,n)=>{b.classList.toggle('active',n===i);if(n===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  const nav=$('.year-nav'),button=$$('.year-nav button')[i];
  nav.scrollTo({left:button.offsetLeft-nav.clientWidth/2+button.clientWidth/2,behavior:motionOff?'instant':'smooth'});
  if(!motionOff){$('.chapter-copy').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,easing:'ease-out'});$('.journey-visual').animate([{opacity:0,transform:'translateY(30px) scale(.95)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:750,easing:'ease-out'});}
}
let scrollPending=false;
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  $('.scroll-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;
  const j=$('.journey'),r=j.getBoundingClientRect();
  const p=Math.max(0,Math.min(1,-r.top/Math.max(1,j.offsetHeight-innerHeight)));
  showChapter(Math.min(chapters.length-1,Math.floor(p*chapters.length)));
  $('.timeline-meter span').style.transform=`scaleX(${p})`;scrollPending=false;
}
window.addEventListener('scroll',()=>{if(!scrollPending){requestAnimationFrame(updateScroll);scrollPending=true;}},{passive:true});
$$('.year-nav button').forEach((b,i)=>b.addEventListener('click',()=>{const j=$('.journey');window.scrollTo({top:j.getBoundingClientRect().top+scrollY+(j.offsetHeight-innerHeight)*(i+.35)/chapters.length,behavior:motionOff?'instant':'smooth'});}));
updateScroll();
