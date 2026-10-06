
// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const mainNav = document.querySelector('#header nav');
const currentYearElement = document.getElementById('current-year');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMinimize = document.getElementById('chatbot-minimize');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInputField = document.getElementById('chatbot-input-field');
const chatbotSendButton = document.getElementById('chatbot-send');
const contactForm = document.getElementById('contactForm');

// Footer year
if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();

// Smooth scroll + close mobile menu on nav click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.id === 'more-contact-link' || this.id === 'proj-contact-link') return;
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const targetElement = document.getElementById(targetId.slice(1));
    if (!targetElement) return;

    e.preventDefault();
    window.scrollTo({
      top: Math.max(0, window.scrollY + targetElement.getBoundingClientRect().top - header.getBoundingClientRect().height - 12),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });

    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Header scroll state
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  mainNav.classList.toggle('open', isOpen);
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#menu-toggle') && !e.target.closest('#nav-links')) {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720 && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    mainNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Scroll reveal
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.section-head, .about-body, .skill-node, .project-row, .involvement-card, .hero-photo-card, .featured-cert'
  );
  elements.forEach(el => el.classList.add('reveal'));

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { elements.forEach(el => el.classList.add('in-view')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// Chatbot knowledge base
let lastAssistantAnswer = null;
function findChatbotResponse(input) {
 lastAssistantAnswer = window.PortfolioAssistant.answer(input);
 return lastAssistantAnswer.text;
}

chatbotToggle.addEventListener('click', () => {
  chatbotContainer.classList.toggle('open');
  if (chatbotContainer.classList.contains('minimized')) {
    chatbotContainer.classList.remove('minimized');
    chatbotMinimize.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
  }
});

chatbotMinimize.addEventListener('click', () => {
  chatbotContainer.classList.toggle('minimized');
  chatbotMinimize.innerHTML = chatbotContainer.classList.contains('minimized')
    ? '<i class="fa-solid fa-chevron-up"></i>'
    : '<i class="fa-solid fa-chevron-down"></i>';
});

function sendChatbotMessage() {
  const message = chatbotInputField.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatbotInputField.value = '';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    typingIndicator.appendChild(dot);
  }
  chatbotMessages.appendChild(typingIndicator);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  setTimeout(() => {
    chatbotMessages.removeChild(typingIndicator);
    addMessage(findChatbotResponse(message), 'bot');
  }, 900);
}

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  const now = new Date();
  timeDiv.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);
  if (sender === 'bot' && lastAssistantAnswer?.source) {
    const source = document.createElement('button');
    source.type = 'button'; source.className = 'assistant-source';
    const target = lastAssistantAnswer.source;
    source.textContent = target === 'projects' ? 'Explore projects' : target === 'credentials' ? 'View credentials' : target === 'education' ? 'View education' : 'View portfolio source';
    source.addEventListener('click', () => {
      if (target === 'projects') openProjectsOverlay();
      else if (target === 'credentials' || target === 'education') {
        openOverlay();
        requestAnimationFrame(() => aboutOverlay.querySelector(target === 'credentials' ? '.cert-grid' : '.edu-progress').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
      } else document.querySelector(target)?.scrollIntoView({behavior: slideshowMotion.matches ? 'auto' : 'smooth'});
      chatbotContainer.classList.remove('open');
    });
    messageDiv.appendChild(source);
  }
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSendButton.addEventListener('click', sendChatbotMessage);
chatbotInputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatbotMessage();
});

// Contact form
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        submitBtn.textContent = 'Message sent ✓';
        contactForm.reset();
      } else {
        submitBtn.textContent = 'Something went wrong  -  try again';
      }
    } catch (err) {
      submitBtn.textContent = 'Network error  -  try again';
    }

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2800);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});

const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  heroPhoto.addEventListener('error', () => {
    heroPhoto.parentElement.classList.add('image-missing');
    heroPhoto.style.opacity = '0';
  });
}


// About: View More overlay
const aboutOverlay = document.getElementById('about-overlay');
const openAboutMore = document.getElementById('open-about-more');
const closeAboutMore = document.getElementById('close-about-more');
const eduFill = document.getElementById('edu-fill');
const moreContactLink = document.getElementById('more-contact-link');

function openOverlay(){
  aboutOverlay.classList.add('open');
  aboutOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock-scroll');
  aboutOverlay.scrollTo({top: 0, behavior: 'instant'});
  requestAnimationFrame(() => { if (eduFill) eduFill.style.width = '84%'; });
}
function closeOverlay(){
  aboutOverlay.classList.remove('open');
  aboutOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock-scroll');
}

if (openAboutMore) openAboutMore.addEventListener('click', openOverlay);
if (closeAboutMore) closeAboutMore.addEventListener('click', closeOverlay);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.querySelector('dialog[open]') && aboutOverlay.classList.contains('open')) closeOverlay();
});
if (moreContactLink) {
  moreContactLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeOverlay();
    setTimeout(() => {
      const target = document.querySelector('#contact');
      if (target) window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header.getBoundingClientRect().height - 12), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }, 200);
  });
}

document.querySelectorAll('.edu-year').forEach(year => {
  year.querySelector('.edu-year-head').addEventListener('click', () => {
    year.classList.toggle('open');
  });
});
const eduYears = document.querySelectorAll('.edu-year');
if (eduYears.length) eduYears[eduYears.length - 1].classList.add('open');


// Projects: View All overlay
const projectsOverlay = document.getElementById('projects-overlay');
const openProjectsMore = document.getElementById('open-projects-more');
const closeProjectsMore = document.getElementById('close-projects-more');
const projContactLink = document.getElementById('proj-contact-link');

function openProjectsOverlay(){
  projectsOverlay.classList.add('open');
  projectsOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock-scroll');
  projectsOverlay.scrollTo({top: 0, behavior: 'instant'});
}
function closeProjectsOverlay(){
  projectsOverlay.classList.remove('open');
  projectsOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock-scroll');
}

if (openProjectsMore) openProjectsMore.addEventListener('click', openProjectsOverlay);
if (closeProjectsMore) closeProjectsMore.addEventListener('click', closeProjectsOverlay);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.querySelector('dialog[open]') && projectsOverlay.classList.contains('open')) closeProjectsOverlay();
});
if (projContactLink) {
  projContactLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeProjectsOverlay();
    setTimeout(() => {
      const target = document.querySelector('#contact');
      if (target) window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header.getBoundingClientRect().height - 12), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }, 200);
  });
}


// Document viewers and small project previews, added to the original layout.
const cvViewer = document.getElementById('cv-dialog');
const certificateViewer = document.getElementById('certificate-dialog');
function showDocument(dialog) { dialog.showModal(); document.body.classList.add('cv-open'); }
[cvViewer, certificateViewer].forEach(dialog => {
 dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
 dialog.addEventListener('close', () => document.body.classList.remove('cv-open'));
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
 });
});
function showCV() {
 const frame = cvViewer.querySelector('iframe');
 if (!frame.getAttribute('src')) frame.src = frame.dataset.src;
 showDocument(cvViewer);
}
document.getElementById('view-cv').addEventListener('click', showCV);
document.getElementById('cv-preview').addEventListener('click', showCV);
document.querySelectorAll('.cert-card').forEach(card => {
 const source = card.querySelector('img');
 const title = card.querySelector('h4').textContent;
 const button = document.createElement('button');
 button.className = 'certificate-view';
 button.textContent = 'View certificate';
 button.setAttribute('aria-label', `View ${title} certificate`);
 card.querySelector('.cert-card-body').appendChild(button);
 button.addEventListener('click', () => {
  document.getElementById('certificate-title').textContent = title;
  const image = document.getElementById('certificate-image');
  image.src = source.src; image.alt = source.alt;
  document.getElementById('certificate-original').href = source.src;
 document.getElementById('certificate-original').textContent = 'Open full-size certificate';
  showDocument(certificateViewer);
 });
});
// Keep expanded profiles keyboard-accessible and return focus to their trigger.
[[aboutOverlay, openAboutMore, closeAboutMore], [projectsOverlay, openProjectsMore, closeProjectsMore]].forEach(([overlay, trigger, closeButton]) => {
 overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true');
 overlay.setAttribute('aria-label', overlay === aboutOverlay ? 'Full profile' : 'All projects');
 const observer = new MutationObserver(() => {
  const open = overlay.classList.contains('open');
  overlay.inert = !open;
  document.querySelector('main').inert = open;
  document.getElementById('header').inert = open;
  document.querySelector('.footer').inert = open;
  document.querySelector('.chatbot').inert = open;
  if (open) closeButton.focus(); else trigger.focus();
 });
 overlay.inert = true;
 observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
 overlay.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const items = Array.from(overlay.querySelectorAll('a,button,input,textarea,[tabindex="0"]')).filter(e => e.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
 });
});

// Featured credentials reuse the original certificate documents.
function showCertificate(index) {
 const card = document.querySelectorAll('.cert-card')[index];
 const source = card.querySelector('img');
 document.getElementById('certificate-title').textContent = card.querySelector('h4').textContent;
 const image = document.getElementById('certificate-image');
 image.src = source.src; image.alt = source.alt;
 document.getElementById('certificate-original').href = source.src;
 document.getElementById('certificate-original').textContent = 'Open full-size certificate';
 showDocument(certificateViewer);
}
document.querySelectorAll('[data-certificate]').forEach(button => {
 button.addEventListener('click', () => showCertificate(Number(button.dataset.certificate)));
});
document.getElementById('open-certifications').addEventListener('click', () => {
 openOverlay();
 requestAnimationFrame(() => document.querySelector('.cert-grid').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
});
const screenshotGalleries = window.PORTFOLIO_PROJECTS;
const galleryViewer = document.getElementById('gallery-dialog');
galleryViewer.setAttribute('tabindex', '-1');
const galleryImage = document.getElementById('gallery-image');
let galleryKey = 'campus';
let galleryIndex = 0;
function updateGallery() {
 const focusedControl = document.activeElement;
 const gallery = screenshotGalleries[galleryKey];
 const image = gallery.images[galleryIndex];
 galleryImage.src = image[0]; galleryImage.alt = `${gallery.title}: ${image[1]}`;
 document.getElementById('gallery-title').textContent = `${gallery.title} / Screenshots`;
 document.getElementById('gallery-caption').textContent = `${galleryIndex+1} / ${gallery.images.length} - ${image[1]}`;
 document.getElementById('gallery-source').textContent = gallery.note;
 document.getElementById('gallery-prev').disabled = galleryIndex === 0;
 document.getElementById('gallery-next').disabled = galleryIndex === gallery.images.length - 1;
 if (focusedControl && focusedControl.disabled && galleryViewer.open) galleryViewer.focus();
}
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
 galleryKey = button.dataset.gallery; galleryIndex = 0; updateGallery(); showDocument(galleryViewer);
}));
document.getElementById('gallery-prev').addEventListener('click', () => { if (galleryIndex > 0) { galleryIndex--; updateGallery(); } });
document.getElementById('gallery-next').addEventListener('click', () => { if (galleryIndex < screenshotGalleries[galleryKey].images.length - 1) { galleryIndex++; updateGallery(); } });
galleryViewer.querySelector('.dialog-close').addEventListener('click', () => galleryViewer.close());
galleryViewer.addEventListener('close', () => document.body.classList.remove('cv-open'));
galleryViewer.addEventListener('keydown', event => {
 if (event.key === 'ArrowLeft' && galleryIndex > 0) { event.preventDefault(); galleryIndex--; updateGallery(); }
 if (event.key === 'ArrowRight' && galleryIndex < screenshotGalleries[galleryKey].images.length-1) { event.preventDefault(); galleryIndex++; updateGallery(); }
});
galleryViewer.addEventListener('click', event => {
 if (event.target !== galleryViewer) return;
 const rect = galleryViewer.getBoundingClientRect();
 if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) galleryViewer.close();
});
// A quiet scroll indicator, updated at most once per animation frame.
const readingProgress = document.querySelector('.reading-progress');
let progressQueued = false;
window.addEventListener('scroll', () => {
 if (progressQueued) return;
 progressQueued = true;
 requestAnimationFrame(() => {
  const distance = document.documentElement.scrollHeight-window.innerHeight;
  readingProgress.style.width = `${distance>0?100*window.scrollY/distance:0}%`;
  progressQueued = false;
 });
}, {passive:true});


// Separate detail cards reveal into the opposite side of each alternating row.
const timelineMobile = window.matchMedia('(max-width: 720px)');
document.querySelectorAll('.timeline-pair').forEach(card => {
 const picture = card.querySelector('.project-showcase, .featured-cert-image');
 const panel = card.querySelector('.detail-panel');
 const toggle = card.querySelector('.picture-details-toggle');
 const title = card.querySelector('.timeline-visual-footer h3').textContent;
 let pinned = false;
 let hovering = false;
 let focused = false;
 function render() {
  const open = timelineMobile.matches || pinned || hovering || focused;
  card.classList.toggle('details-open', open);
  panel.inert = !open;
  panel.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} details for ${title}`);
  toggle.querySelector('span').textContent = open ? 'Close details' : 'Explore details';
 }
 picture.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse') return;
  hovering = true; render();
 });
 card.addEventListener('pointerleave', () => { hovering = false; render(); });
 card.addEventListener('focusin', () => { focused = true; render(); });
 card.addEventListener('focusout', event => {
  if (card.contains(event.relatedTarget)) return;
  focused = false; render();
 });
 toggle.addEventListener('click', () => {
  pinned = !pinned; focused = false; hovering = false;
  render();
 });
 card.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  pinned = false; hovering = false; focused = false;
  if (panel.contains(document.activeElement)) {
   toggle.focus(); focused = false;
  }
  render();
 });
 timelineMobile.addEventListener('change', () => { pinned = false; focused = false; hovering = false; render(); });
 render();
});

// Automatic previews share their image lists with the full-size galleries.
const slideshowMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const projectSlideshows = [];
document.querySelectorAll('.project-showcase[data-gallery]').forEach((picture, order) => {
 const key = picture.dataset.gallery;
 const project = screenshotGalleries[key];
 const device = picture.querySelector('.showcase-device');
 const originalImage = device.querySelector('img');
 const stage = document.createElement('span');
 stage.className = 'autoplay-stage';
 const layers = [originalImage, document.createElement('img')];
 layers.forEach((image, index) => {
  image.className = 'autoplay-layer' + (index === 0 ? ' is-current' : '');
  image.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  stage.appendChild(image);
 });
 device.appendChild(stage);
 const card = picture.closest('.timeline-pair');
 const bar = document.createElement('div');
 bar.className = 'slideshow-controls';
 bar.setAttribute('role', 'group');
 bar.setAttribute('aria-label', `${project.title} slideshow controls`);
 bar.innerHTML = '<button class="slideshow-prev" aria-label="Previous slide"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><span class="slideshow-count"></span><span class="slideshow-dots" aria-hidden="true"></span><button class="slideshow-next" aria-label="Next slide"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button><button class="slideshow-pause"><i class="fa-solid fa-pause" aria-hidden="true"></i></button>';
 card.querySelector('.timeline-visual').insertBefore(bar, card.querySelector('.timeline-visual-footer'));
 const count = bar.querySelector('.slideshow-count');
 const dots = bar.querySelector('.slideshow-dots');
 project.images.forEach(() => { const dot = document.createElement('i'); dots.appendChild(dot); });
 const pause = bar.querySelector('.slideshow-pause');
 pause.classList.add('slideshow-compact-pause');
 card.querySelector('.timeline-visual-footer').appendChild(pause);
 bar.hidden = true;
 let current = 0;
 let activeLayer = 0;
 let transitioning = false;
 let queuedSlide = null;
 let userPaused = false;
 let visible = !('IntersectionObserver' in window);
 let timer;
 function controls() {
  const paused = userPaused || slideshowMotion.matches;
  pause.setAttribute('aria-label', paused ? `Play ${project.title} slideshow` : `Pause ${project.title} slideshow`);
  pause.setAttribute('aria-pressed', String(paused));
  pause.innerHTML = `<i class="fa-solid fa-${paused ? 'play' : 'pause'}" aria-hidden="true"></i>`;
  count.textContent = `${String(current+1).padStart(2,'0')} / ${String(project.images.length).padStart(2,'0')}`;
  Array.from(dots.children).forEach((dot,index) => dot.classList.toggle('active', index===current));
  picture.dataset.slideIndex = String(current);
 }
 async function changeSlide(index) {
  if (transitioning) { queuedSlide = index; return; }
  if (index===current) return;
  transitioning = true;
  const next = (index+project.images.length)%project.images.length;
  const incoming = layers[1-activeLayer];
  incoming.src = project.images[next][0];
  incoming.alt = `${project.title}: ${project.images[next][1]}`;
  try { await incoming.decode(); }
  catch { transitioning = false; return; }
  const outgoing = layers[activeLayer];
  outgoing.classList.remove('is-current');
  outgoing.setAttribute('aria-hidden','true');
  incoming.classList.add('is-current');
  incoming.setAttribute('aria-hidden','false');
  activeLayer = 1-activeLayer;
  current = next;
  controls();
  window.setTimeout(() => {
   transitioning = false;
   if (queuedSlide !== null) { const requested = queuedSlide; queuedSlide = null; changeSlide(requested); }
  }, slideshowMotion.matches ? 0 : 1150);
 }
 function restart() {
  window.clearInterval(timer);
  if (userPaused || slideshowMotion.matches || project.images.length<2) return;
  timer = window.setInterval(() => {
   // Hovering does not pause autoplay; conserve resources while offscreen or hidden.
   if (visible && !document.hidden && !document.querySelector('dialog[open]')) changeSlide(current+1);
  }, 4400 + order*180);
 }
 layers[0].src=project.images[0][0];
 layers[0].alt=`${project.title}: ${project.images[0][1]}`;
 // Preload the next screen so the first transition has no network delay.
 const preload = new Image(); preload.src=project.images[1][0];
 bar.querySelector('.slideshow-prev').addEventListener('click', () => { changeSlide(current-1); restart(); });
 bar.querySelector('.slideshow-next').addEventListener('click', () => { changeSlide(current+1); restart(); });
 pause.addEventListener('click', () => {
  if (slideshowMotion.matches) { changeSlide(current+1); return; }
  userPaused=!userPaused; controls(); restart();
 });
 slideshowMotion.addEventListener('change', () => { controls(); restart(); });
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { visible=entries[0].isIntersecting; }, {threshold:.05});
  observer.observe(picture);
 }
 controls(); restart();
 projectSlideshows.push({key, next:()=>changeSlide(current+1)});
});

// Reveal profile content as it enters the full-profile scroll area.
if ('IntersectionObserver' in window) {
 const profileObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('profile-visible');
   profileObserver.unobserve(entry.target);
  });
 }, {root: aboutOverlay, threshold: .08});
 aboutOverlay.querySelectorAll('.more-section, .who-card, .cert-card, .potential-row').forEach((item, index) => {
  item.classList.add('profile-reveal');
  item.style.transitionDelay = `${item.matches('.who-card, .cert-card') ? (index % 2) * 70 : 0}ms`;
  profileObserver.observe(item);
 });
}

// Side-by-side archive visuals: page turns, shared screenshot lists and manual controls.
const archiveExtras = {
 durban: {title:'DurbanFix',images:[['assets/durban-report-flow.svg','Guest reporting / workflow diagram'],['assets/durban-tracking-flow.svg','Report tracking / workflow diagram']]},
 network: {title:'Enterprise Cisco Network Topology',images:[['assets/network.png','Packet Tracer topology'],['assets/network-architecture.svg','Three-tier architecture / workflow diagram']]}
};
document.querySelectorAll('[data-archive]').forEach(card => {
 const key = card.dataset.archive;
 const project = screenshotGalleries[key] || archiveExtras[key];
 const visual = card.querySelector('.archive-visual');
 visual.innerHTML = '<div class="archive-visual-label"><span>PROJECT VISUALS</span><span class="archive-count"></span></div><button type="button" class="archive-pages" aria-label="Open project visual"><img class="archive-page is-active" alt=""><img class="archive-page" alt=""></button><p class="archive-caption"></p><div class="archive-controls" role="group" aria-label="Slideshow controls"><button type="button" class="archive-prev" aria-label="Previous visual">&larr;</button><button type="button" class="archive-pause" aria-pressed="false">Pause slideshow</button><button type="button" class="archive-next" aria-label="Next visual">&rarr;</button></div>';
 const pages = visual.querySelectorAll('.archive-page');
 const stage = visual.querySelector('.archive-pages');
 const pause = visual.querySelector('.archive-pause');
 let index=0,layer=0,busy=false,paused=false,visible=false;
 function render() {
  visual.querySelector('.archive-count').textContent=`${index+1} / ${project.images.length}`;
  visual.querySelector('.archive-caption').textContent=project.images[index][1];
  pause.textContent=paused?'Play slideshow':'Pause slideshow';
  pause.setAttribute('aria-pressed',String(paused));
  stage.setAttribute('aria-label',`Open ${project.title}: ${project.images[index][1]}`);
  card.dataset.archiveIndex=String(index);
 }
 pages[0].src=project.images[0][0];pages[0].alt=project.images[0][1];render();
 async function turn(step) {
  if(busy)return;
  busy=true;
  const next=(index+step+project.images.length)%project.images.length;
  const incoming=pages[1-layer],outgoing=pages[layer];
  incoming.src=project.images[next][0];incoming.alt=project.images[next][1];
  try{await incoming.decode();}catch{busy=false;return;}
  stage.classList.toggle('archive-backward',step<0);
  outgoing.classList.remove('is-active');outgoing.classList.add('is-turning');
  incoming.classList.add('is-active');
  layer=1-layer;index=next;render();
  setTimeout(()=>{outgoing.classList.remove('is-turning');busy=false;},slideshowMotion.matches?0:850);
 }
 visual.querySelector('.archive-prev').addEventListener('click',()=>turn(-1));
 visual.querySelector('.archive-next').addEventListener('click',()=>turn(1));
 pause.addEventListener('click',()=>{paused=!paused;render();});
 stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();turn(event.key==='ArrowLeft'?-1:1);}});
 stage.addEventListener('click',()=>{
  if(!screenshotGalleries[key])screenshotGalleries[key]={...project,note:'Repository topology and/or portfolio workflow diagrams. Diagrams illustrate documented workflows and are not app screenshots.'};
  galleryKey=key;galleryIndex=index;updateGallery();showDocument(galleryViewer);
 });
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{root:projectsOverlay,threshold:.15}).observe(visual);else visible=true;
 setInterval(()=>{if(visible&&projectsOverlay.classList.contains('open')&&!paused&&!slideshowMotion.matches&&!document.hidden&&!document.querySelector('dialog[open]'))turn(1);},5200);
});
