const photos=[{n:6,c:'comercial',t:'Escritório · acabamentos e iluminação'},{n:1,c:'residencial',t:'Residência · ambiente integrado'},{n:3,c:'comercial',t:'Sala de reunião · vista do ambiente'},{n:2,c:'residencial',t:'Residência · paredes e teto'},{n:11,c:'execucao',t:'Reforma a seco · execução'},{n:10,c:'comercial',t:'Área de convivência · ambiente comercial'},{n:5,c:'residencial',t:'Quarto · cores e iluminação'},{n:4,c:'comercial',t:'Sala de reunião · acabamento'},{n:7,c:'comercial',t:'Escritório · espaço de trabalho'},{n:8,c:'comercial',t:'Escritório · vista geral'},{n:12,c:'execucao',t:'Divisórias · etapa de montagem'},{n:9,c:'comercial',t:'Edificação · vista externa'},{n:13,c:'comercial',t:'Circulação · ambiente interno'},{n:14,c:'execucao',t:'Reforma a seco · trabalho em andamento'}];
const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#lightbox');let lastPhoto;
function render(filter){gallery.scrollLeft=0;gallery.replaceChildren();photos.filter(p=>filter==='todos'||p.c===filter).forEach(p=>{const button=document.createElement('button');button.type='button';const img=document.createElement('img');img.src=`assets/obra-${p.n}.jpg`;img.alt=p.t;img.loading='lazy';const label=document.createElement('span');label.textContent=p.t+' ↗';button.append(img,label);button.addEventListener('click',()=>{if(suppressGalleryClick)return;lastPhoto=button;document.querySelector('#large').src=img.src;document.querySelector('#large').alt=p.t;document.querySelector('#caption').textContent=p.t;dialog.showModal()});gallery.append(button)})}
let suppressGalleryClick=false;render('todos');document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render(b.dataset.filter)}));
document.querySelector('#close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>lastPhoto?.focus());
document.querySelectorAll('[data-service]').forEach(a=>{a.href='https://api.whatsapp.com/send?phone=5511999359619&text='+encodeURIComponent('Olá, Cores de Betel! Gostaria de um orçamento para '+a.dataset.service+'.');a.target='_blank';a.rel='noopener'});
document.querySelector('#quote').addEventListener('submit',e=>{e.preventDefault();const name=document.querySelector('#name');if(!name.value.trim()){name.setCustomValidity('Informe seu nome.');name.reportValidity();return}const text=`Olá, Cores de Betel! Meu nome é ${name.value.trim()}. Gostaria de um orçamento para ${document.querySelector('#service').value.toLowerCase()}.\n${document.querySelector('#message').value.trim()}`;window.open('https://api.whatsapp.com/send?phone=5511999359619&text='+encodeURIComponent(text),'_blank','noopener')});document.querySelector('#name').addEventListener('input',e=>e.target.setCustomValidity(''));
let dragStartX=0,dragStartScroll=0,dragPointer=null;
gallery.addEventListener('dragstart',e=>e.preventDefault());
gallery.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dragPointer=e.pointerId;dragStartX=e.clientX;dragStartScroll=gallery.scrollLeft;suppressGalleryClick=false});
gallery.addEventListener('pointermove',e=>{if(dragPointer!==e.pointerId)return;const delta=e.clientX-dragStartX;if(Math.abs(delta)>6){suppressGalleryClick=true;gallery.classList.add('dragging');gallery.setPointerCapture(e.pointerId)}if(suppressGalleryClick){gallery.scrollLeft=dragStartScroll-delta;e.preventDefault()}});
function finishDrag(e){if(dragPointer!==e.pointerId)return;dragPointer=null;gallery.classList.remove('dragging');if(gallery.hasPointerCapture(e.pointerId))gallery.releasePointerCapture(e.pointerId);setTimeout(()=>{suppressGalleryClick=false},0)}
gallery.addEventListener('pointerup',finishDrag);gallery.addEventListener('pointercancel',finishDrag);window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
function moveGallery(direction){gallery.scrollBy({left:direction*(gallery.querySelector('button')?.offsetWidth+22||340),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
gallery.addEventListener('keydown',e=>{if(e.target===gallery&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1)}});
// Amostra automática: avanço lento, com pausa para observar e interagir.
let showcasePausedUntil=0,showcaseHovered=false,showcaseFocused=false,showcaseLastTime=0;
const showcaseMotion=matchMedia('(prefers-reduced-motion: reduce)');
function pauseShowcase(){}
gallery.addEventListener('mouseenter',()=>{showcaseHovered=true});

gallery.addEventListener('focusin',()=>{showcaseFocused=true});

gallery.addEventListener('pointerdown',pauseShowcase);
gallery.addEventListener('pointerup',pauseShowcase);
gallery.addEventListener('touchend',pauseShowcase,{passive:true});
gallery.addEventListener('wheel',pauseShowcase,{passive:true});
document.querySelectorAll('[data-filter],.gallery-arrows button').forEach(button=>button.addEventListener('click',pauseShowcase));
const showcaseObserver=new IntersectionObserver(entries=>{showcaseVisible=entries[0].isIntersecting},{threshold:.15});
let showcaseVisible=false;showcaseObserver.observe(gallery);
// Desativa o encaixe durante o movimento automático para preservar a fluidez.
gallery.classList.add('auto-showcase');
let showcaseStopped=false;
let showcasePosition=gallery.scrollLeft;

function animateShowcase(now){const elapsed=showcaseLastTime?Math.min(now-showcaseLastTime,50):0;showcaseLastTime=now;
if(showcaseVisible&&!document.hidden){const end=gallery.scrollWidth-gallery.clientWidth;if(end>1){showcasePosition+=elapsed*.045;if(showcasePosition>=end-1){showcasePosition=0}gallery.scrollLeft=showcasePosition}}else{showcasePosition=gallery.scrollLeft}
requestAnimationFrame(animateShowcase)}
requestAnimationFrame(animateShowcase);
// Abertura e fechamento suaves das perguntas frequentes.
document.querySelectorAll('.faq details').forEach(detail=>{const summary=detail.querySelector('summary');let animation=null;let desiredOpen=detail.open;summary.addEventListener('click',event=>{event.preventDefault();desiredOpen=!desiredOpen;const start=detail.getBoundingClientRect().height;if(animation){animation.cancel();animation=null}detail.style.height=start+'px';detail.style.overflow='hidden';detail.open=true;detail.classList.toggle('expanding',desiredOpen);summary.setAttribute('aria-expanded',String(desiredOpen));const style=getComputedStyle(detail);const closedHeight=summary.getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);detail.style.height='auto';const expandedHeight=detail.getBoundingClientRect().height;detail.style.height=start+'px';animation=detail.animate({height:[start+'px',(desiredOpen?expandedHeight:closedHeight)+'px']},{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});animation.onfinish=()=>{detail.open=desiredOpen;detail.style.height='';detail.style.overflow='';animation=null}})});
