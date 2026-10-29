'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const url=process.env.PORTFOLIO_URL||'http://127.0.0.1:18771';
 const results=[];fs.mkdirSync('/tmp/portfolio-review',{recursive:true});
 for(const width of (process.argv.includes('--resilience-only')?[]:[320,375,390,768,1024,1440,1920])){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  await page.locator('.project-directory summary').evaluate(e=>e.click());
  await page.waitForFunction(()=>document.querySelectorAll('.project-directory article').length===29);
  assert.equal(await page.locator('.project-directory article').count(),29);
  await page.locator('.project-directory summary').evaluate(e=>e.click());
  await page.locator('#motion-toggle').evaluate(e=>e.click());
  assert(await page.locator('body').evaluate(e=>e.classList.contains('motion-off')),'system motion must remain authoritative');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>!document.querySelector('#motion-toggle').disabled);
  assert.equal(await page.locator('#motion-toggle').isDisabled(),false);
  await page.locator('#motion-toggle').evaluate(e=>e.click());
  assert.equal(await page.evaluate(()=>localStorage.getItem('kt-motion')),'off');
  await page.emulateMedia({reducedMotion:'reduce'});await page.emulateMedia({reducedMotion:'no-preference'});
  assert(await page.locator('body').evaluate(e=>e.classList.contains('motion-off')),'manual off survives preference changes');
  for(const theme of ['dark','light']){
   await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if([390,1440].includes(width)){await page.screenshot({path:`/tmp/portfolio-review/hero-${width}-${theme}.png`});}
  }
  await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.querySelector('#work').scrollIntoView({behavior:'instant'})});
  await page.waitForFunction(()=>document.querySelector('.nav a[href="#work"]').getAttribute('aria-current')==='location');
  assert.equal(await page.locator('.nav a[href="#work"]').getAttribute('aria-current'),'location');
  await page.evaluate(()=>{for(const button of document.querySelectorAll('.project-card .project-open')){button.focus();button.click();if(!document.querySelector('#project-dialog').open)throw Error('Dialog did not open');document.querySelector('.dialog-close').click();if(document.activeElement!==button)throw Error('Focus was not restored')}});
  await page.locator('.project-open').first().focus();await page.keyboard.press('Enter');
  assert(await page.locator('#project-dialog').evaluate(e=>e.open));
  if(width===1440)await page.screenshot({path:'/tmp/portfolio-review/project-dialog.png'});
  await page.locator('.dialog-close').click();
  await page.locator('.project-directory summary').click();assert(await page.locator('.project-directory').evaluate(e=>e.open));await page.locator('.project-directory summary').click();
  await page.locator('.year-nav button').last().click();
  if(width<=640)assert.equal(await page.locator('.year-nav button').last().getAttribute('aria-current'),'step');
  await page.setViewportSize({width:900,height:390});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.setViewportSize({width,height:900});
  if([390,1440].includes(width))for(const [name,selector]of [['work','#work'],['journey','#journey'],['about','#about'],['toolbox','#toolbox'],['contact','#contact']]){
   await page.locator(selector).evaluate(async e=>{e.scrollIntoView({block:'start',behavior:'instant'});for(const img of e.querySelectorAll('img')){img.loading='eager';await img.decode().catch(()=>{})}});await page.screenshot({path:`/tmp/portfolio-review/${name}-${width}.png`});
  }
  assert.deepEqual(errors,[]);results.push({width,overflow:false,systemMotion:true,manualMotion:true,projects:29,dialogFocus:true,errors});await page.close();
 }
 // Complete project descriptions and real source links remain reachable without any script.
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(url);await nojs.locator('.project-directory summary').click();assert.equal(await nojs.locator('.project-directory article').count(),29);assert(await nojs.locator('.project-directory article a').first().isVisible());assert(await nojs.locator('a[href="mailto:kaleabtaye@gmail.com"]').first().count());assert(await nojs.locator('.journey-accessible').isVisible());assert(await nojs.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await nojs.screenshot({path:'/tmp/portfolio-review/no-script.png'});await nojs.close();
 const failure=await browser.newPage({reducedMotion:'reduce'});await failure.route('**/assets/corksy-product.webp',route=>route.abort());await failure.goto(url);await failure.locator('.project-open').first().evaluate(e=>e.click());await failure.locator('.asset-fallback').waitFor();assert(await failure.locator('#dialog-contribution').textContent());assert(await failure.locator('#dialog-source').getAttribute('href'));await failure.close();
 const blocked=await browser.newPage();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('Storage unavailable')}})});const errors=[];blocked.on('pageerror',e=>errors.push(e.message));await blocked.goto(url);assert.equal(await blocked.locator('.project-card').count(),29);assert.deepEqual(errors,[]);await blocked.close();
 await browser.close();fs.writeFileSync('/tmp/portfolio-review/verification.json',JSON.stringify({results,noScript:true,imageFailure:true,storageUnavailable:true},null,2));console.log(process.argv.includes('--resilience-only') ? 'PASS resilience verification: no-script content and wrapping, image failure, denied storage' : 'PASS refinement verification: 7 widths, 14 theme layouts, 203 dialog/focus cycles, reduced motion, rotation, no-script content, image failure and denied storage');
})().catch(e=>{console.error(e);process.exit(1)});
