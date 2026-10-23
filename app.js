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
  if(project.images) return `<div class="capture-frame ${project.id==='corksy'?'transparent-capture':''}"><span class="capture-chrome"><i></i><i></i><i></i><b>${project.visualTitle||project.name}</b></span><img src="${asset(project.images[0].src)}" alt="${project.images[0].alt}" loading="lazy" width="1440" height="1000"><span class="capture-glint" aria-hidden="true"></span></div><span class="capture-note">${project.images[0].caption}</span>`;
  return `<div class="engineering-record"><span class="record-label">PROJECT CONTRIBUTION</span><h4>${project.record[0]}</h4><div class="record-flow">${project.record.slice(1).map((step,i)=>`<div><b>0${i+1}</b><span>${step}</span><i aria-hidden="true">↗</i></div>`).join('')}</div><span class="record-note">${project.category}</span></div>`;
}
$('.project-track').innerHTML=projects.map(p=>`<article class="project-card" data-world="${p.world}" aria-label="${p.name}"><button class="project-art world-art" data-open="${p.id}" aria-label="Explore ${p.name}"><span class="project-overline">${p.category}</span><span class="world-orb" aria-hidden="true"></span><div class="project-capture">${visualMarkup(p)}</div><span class="world-enter">ENTER THE PROJECT <b>↗</b></span></button><div class="project-meta"><div><h3>${p.name}</h3><p>${p.description}</p><div class="project-tags">${tagMarkup(p.tags.slice(0,4))}</div></div><button type="button" data-open="${p.id}" aria-label="Explore ${p.name}" class="project-open">↗</button></div></article>`).join('');
$('.project-dots').innerHTML=projects.map(p=>`<button aria-label="Show ${p.name}" aria-pressed="false"></button>`).join('');
$('#project-total').textContent=`01 — ${String(projects.length).padStart(2,'0')}`;
$('#catalogue-count').textContent=projects.length;
$('#project-picker').innerHTML=projects.map((p,index)=>`<option value="${index}">${p.name}</option>`).join('');
let projectIndex=0;
const cards=$$('.project-card'), carousel=$('.carousel');
const projectOffset=index=>cards[index].offsetLeft-cards[0].offsetLeft;
function nearestProject(left=carousel.scrollLeft){
  return cards.reduce((best,card,index)=>Math.abs(projectOffset(index)-left)<Math.abs(projectOffset(best)-left)?index:best,0);
}
function syncProject(index){
  projectIndex=index;
  $('#project-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
  $('.work').dataset.world=projects[index].world;
  $('#project-picker').value=String(index);
  $$('.project-dots button').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});
  const dots=$('.project-dots'),active=dots.children[index];
  dots.scrollTo({left:active.offsetLeft-dots.clientWidth/2+active.clientWidth/2,behavior:motionOff?'instant':'smooth'});
}
let projectDestination=null, projectWheelTarget=null;
function selectProject(index,immediate=false){
  clearTimeout(projectWheelTimer);
  carousel.classList.remove('is-wheeling');
  projectWheelTarget=null;
  const target=(index+cards.length)%cards.length;
  projectDestination=immediate||motionOff?null:target;
  syncProject(target);
  carousel.scrollTo({left:projectOffset(target),behavior:immediate||motionOff?'instant':'smooth'});
}
$('#prev-project').addEventListener('click',()=>selectProject((projectDestination??projectIndex)-1));
$('#next-project').addEventListener('click',()=>selectProject((projectDestination??projectIndex)+1));
$('#project-picker').addEventListener('change',event=>selectProject(Number(event.target.value)));
$$('.project-dots button').forEach((button,index)=>button.addEventListener('click',()=>selectProject(index)));
carousel.addEventListener('keydown',event=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();
  selectProject(event.key==='Home'?0:event.key==='End'?cards.length-1:(projectDestination??projectIndex)+(event.key==='ArrowRight'?1:-1));
});
let projectScrollFrame=0;
carousel.addEventListener('scroll',()=>{
  if(projectScrollFrame)return;
  projectScrollFrame=requestAnimationFrame(()=>{
    if(projectDestination!==null&&Math.abs(carousel.scrollLeft-projectOffset(projectDestination))<2)projectDestination=null;
    if(projectDestination===null)syncProject(nearestProject());
    const max=carousel.scrollWidth-carousel.clientWidth;
    $('.project-scroll-meter span').style.transform=`scaleX(${max>0?Math.max(0,Math.min(1,carousel.scrollLeft/max)):0})`;
    projectScrollFrame=0;
  });
},{passive:true});
function interruptProjectScroll(){
  if(projectDestination===null&&projectWheelTarget===null)return;
  clearTimeout(projectWheelTimer);
  carousel.scrollTo({left:carousel.scrollLeft,behavior:'instant'});
  projectDestination=null;projectWheelTarget=null;
  carousel.classList.remove('is-wheeling');
}
carousel.addEventListener('pointerdown',interruptProjectScroll,{passive:true});
// A vertical mouse wheel travels through the rail; its ends return control to the page.
let projectWheelTimer;
carousel.addEventListener('wheel',event=>{
  if(event.ctrlKey)return;
  if(event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY){interruptProjectScroll();return;}
  const delta=event.deltaY*(event.deltaMode===1?20:event.deltaMode===2?carousel.clientWidth:1);
  const max=carousel.scrollWidth-carousel.clientWidth;
  if(max<1||(delta<0&&carousel.scrollLeft<=1)||(delta>0&&carousel.scrollLeft>=max-1))return;
  event.preventDefault();
  projectDestination=null;
  carousel.classList.add('is-wheeling');
  projectWheelTarget=Math.max(0,Math.min(max,(projectWheelTarget??carousel.scrollLeft)+delta));
  carousel.scrollTo({left:projectWheelTarget,behavior:motionOff?'instant':'smooth'});
  clearTimeout(projectWheelTimer);
  projectWheelTimer=setTimeout(()=>{
    selectProject(nearestProject(projectWheelTarget??carousel.scrollLeft));
  },240);
},{passive:false});
window.addEventListener('resize',()=>selectProject(projectIndex,true));
selectProject(0,true);
$('.engagement-grid').innerHTML=engagements.map((e,i)=>`<article class="engagement-card" id="engagement-${i}"><span class="engagement-number">${String(i+1).padStart(2,'0')} / ${e.role}</span><h3>${e.title}</h3><p>${e.text}</p><div class="project-tags">${tagMarkup(e.tags)}</div></article>`).join('');
$('.contract-list').innerHTML=contracts.map(c=>`<article class="contract"><div><span class="contract-status"><i class="live-dot"></i>${c.type} · ${c.date}</span><h3>${c.title}</h3><p>${c.copy}</p>${c.sourceName?`<small class="contract-source">Published in ${c.sourceName}’s Upwork history · shared work</small>`:''}</div><div class="project-tags">${tagMarkup(c.tags)}</div><a href="${c.source||'https://www.upwork.com/freelancers/~011af220bdfdcacc6f'}" target="_blank" rel="noopener noreferrer" aria-label="View ${c.title} on Upwork">↗</a></article>`).join('');

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
  const facts=$('.project-facts');facts.hidden=!openedProject.role;
  facts.innerHTML=openedProject.role?`<div><dt>Role</dt><dd>${openedProject.role}</dd></div><div><dt>Published period</dt><dd>${openedProject.period}</dd></div><div><dt>Status</dt><dd>${openedProject.status}</dd></div>`:'';
  const phases=$('.project-contracts');phases.hidden=!openedProject.contracts;
  phases.innerHTML=openedProject.contracts?`<h3>Published contract records</h3>${openedProject.contracts.map(c=>`<div><strong>${c.title}</strong><span>${c.date}</span><small>Shared · Completed</small></div>`).join('')}`:'';
  $('.dialog-tags').innerHTML=tagMarkup(openedProject.tags);
  $('#dialog-source').href=openedProject.url;
  $('#dialog-source').firstChild.textContent=openedProject.linkLabel||(openedProject.images?'Visit the project ':'View project source ');
  $('.gallery-reference').textContent=openedProject.referenceNote||'';
  $('.gallery-reference').hidden=!openedProject.referenceNote;
  $('.project-source-links').hidden=!openedProject.links;
  $('.project-source-links').innerHTML=openedProject.links?`<span>Original site navigation · currently offline</span><div>${openedProject.links.map(link=>`<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} ↗</a>`).join('')}</div>`:'';
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

// Browse the verified toolbox without changing the page's scroll position.
const toolCollections = $$('[data-tool-group]');
const toolFilters = $$('[data-tool-filter]');
$('.tool-filters').hidden = false;
toolFilters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.toolFilter;
  toolFilters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let visibleTools = 0, visibleCollections = 0;
  toolCollections.forEach(group => {
    group.hidden = filter !== 'all' && group.dataset.toolGroup !== filter;
    if (!group.hidden) {
      visibleTools += group.querySelectorAll('.tech-card').length;
      visibleCollections++;
      if (!motionOff) group.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});
    }
  });
  $('.tool-results').textContent = filter === 'all'
    ? `Showing all ${visibleTools} tools across ${visibleCollections} collections`
    : `Showing ${visibleTools} tools in ${button.textContent.trim()}`;
}));

// Two identical groups keep the logo loop seamless, with one accessible list.
const trusted = $('.trusted');
const trustedClone = $('.trusted-logos').cloneNode(true);
trustedClone.classList.add('trusted-clone');
trustedClone.setAttribute('aria-hidden', 'true');
trustedClone.inert = true;
$('.trusted-track').append(trustedClone);
let trustedPaused = false;
function updateTrustedMotion() {
  const button = $('#trusted-motion');
  trusted.dataset.paused = String(trustedPaused);
  button.disabled = motionOff;
  button.setAttribute('aria-pressed', String(trustedPaused));
  button.setAttribute('aria-label', motionOff ? 'Company logo animation is off' : `${trustedPaused ? 'Resume' : 'Pause'} company logo animation`);
  button.innerHTML = motionOff ? 'Motion off' : `<span aria-hidden="true">${trustedPaused ? '▷' : 'Ⅱ'}</span> ${trustedPaused ? 'Resume' : 'Pause'} motion`;
}
$('#trusted-motion').addEventListener('click', () => {
  trustedPaused = !trustedPaused;
  updateTrustedMotion();
});
$('#motion-toggle').addEventListener('click', updateTrustedMotion);
motionPreference.addEventListener('change', updateTrustedMotion);
updateTrustedMotion();

// A project URL opens its complete record for sharing and direct navigation.
const linkedProject=new URLSearchParams(location.search).get('project');
if(linkedProject&&projects.some(project=>project.id===linkedProject))openProject(linkedProject);
