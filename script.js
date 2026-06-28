/* ==========================================================================
   SHANE HICKS — SYSTEM PORTFOLIO
   Main Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. HUD CORNER INJECTION (signature frame device)
  --------------------------------------------------------- */
  document.querySelectorAll('.hud-frame').forEach(el => {
    ['tl','tr','bl','br'].forEach(pos => {
      const span = document.createElement('span');
      span.className = 'hud-corner ' + pos;
      el.appendChild(span);
    });
  });

  /* ---------------------------------------------------------
     1. LOADER SEQUENCE
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  const loaderLogs = document.getElementById('loaderLogs');
  const loaderFill = document.getElementById('loaderFill');
  const loaderEnter = document.getElementById('loaderEnter');

  const logLines = [
    'SYSTEM INITIALIZING...',
    'LOADING ASSETS...',
    'LOADING SKILLS DATABASE...',
    'LOADING EXPERIENCE LOG...',
    'CONNECTING TO PRIMUS TECH LABS...',
    'PORTFOLIO READY.'
  ];

  let logIndex = 0;
  function printNextLog(){
    if(logIndex >= logLines.length){
      loaderFill.style.width = '100%';
      loaderEnter.classList.add('ready');
      return;
    }
    const div = document.createElement('div');
    div.textContent = logLines[logIndex];
    loaderLogs.appendChild(div);
    loaderFill.style.width = `${Math.round(((logIndex+1)/logLines.length)*100)}%`;
    logIndex++;
    setTimeout(printNextLog, 420);
  }
  printNextLog();

  function enterSite(){
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    setTimeout(() => loader.remove(), 700);
  }
  loaderEnter.addEventListener('click', enterSite);
  // safety auto-enter in case user never clicks
  setTimeout(() => { if(!loader.classList.contains('hidden')) { /* leave it, wait for user click */ } }, 8000);

  /* ---------------------------------------------------------
     2. LIVE HUD CLOCK / COORDINATES
  --------------------------------------------------------- */
  const hudClock = document.getElementById('hudClock');
  if(hudClock){
    function updateClock(){
      const now = new Date();
      const time = now.toLocaleTimeString('en-GB', { hour12:false });
      hudClock.innerHTML =
        `LOC <span>13.08N_80.27E</span><br>SYS_TIME <span>${time}</span><br>STATUS <span>ONLINE</span>`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---------------------------------------------------------
     3. PARTICLE BACKGROUND
  --------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = window.innerWidth < 700 ? 35 : 70;
    for(let i=0;i<COUNT;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.6+0.4,
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25,
        a: Math.random()*0.5+0.2
      });
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = canvas.width;
        if(p.x > canvas.width) p.x = 0;
        if(p.y < 0) p.y = canvas.height;
        if(p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(0,200,255,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------------
     4. TYPEWRITER — hero roles
  --------------------------------------------------------- */
  const roleEl = document.getElementById('heroRole');
  const roles = [
    'Founder Primus Tech Labs',
    'Full Stack Web Developer',
    'Prompt Engineer',
    'CSE Student',
    'Transforming ideas into reality'
  ];
  if(roleEl){
    let r = 0, c = 0, deleting = false;
    function typeLoop(){
      const word = roles[r];
      if(!deleting){
        c++;
        roleEl.textContent = word.slice(0,c);
        if(c === word.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
      } else {
        c--;
        roleEl.textContent = word.slice(0,c);
        if(c === 0){ deleting = false; r = (r+1) % roles.length; }
      }
      setTimeout(typeLoop, deleting ? 30 : 65);
    }
    typeLoop();
  }

  /* ---------------------------------------------------------
     5. NAVBAR — hide on scroll down, show on scroll up, active link
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if(current > lastScroll && current > 160){
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScroll = current;

    let activeId = sections[0] ? sections[0].id : '';
    sections.forEach(sec => {
      if(current >= sec.offsetTop - 160) activeId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === activeId);
    });
  });

  /* ---------------------------------------------------------
     6. MOBILE MENU
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  if(navToggle){
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinksWrap.classList.toggle('open');
    });
    navLinksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksWrap.classList.remove('open');
    }));
  }

  /* ---------------------------------------------------------
     7. SCROLL REVEAL
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     8. ANIMATED COUNTERS (status panel)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target/40));
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = target; return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------
     9. SKILL BARS
  --------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.dataset.pct + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(el => skillObserver.observe(el));

  /* ---------------------------------------------------------
     10. TESTIMONIAL SLIDER
  --------------------------------------------------------- */
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if(track){
    const cards = track.children.length;
    let index = 0;
    const dots = [];
    for(let i=0;i<cards;i++){
      const dot = document.createElement('button');
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }
    function goTo(i){
      index = i;
      track.style.transform = `translateX(-${i*100}%)`;
      dots.forEach((d,di) => d.classList.toggle('active', di===i));
    }
    setInterval(() => { goTo((index+1)%cards); }, 6000);
  }

  /* ---------------------------------------------------------
     11. CONTACT FORM → WHATSAPP
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const WHATSAPP_NUMBER = '918807349337'; // country code + number, no symbols

  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const type = contactForm.projectType.value;
      const budget = contactForm.budget.value;
      const message = contactForm.message.value.trim();

      const text =
`SYSTEM TRANSMISSION // NEW MISSION REQUEST
----------------------------------
Name: ${name}
Email: ${email}
Project Type: ${type}
Budget: ${budget}
----------------------------------
Message:
${message}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      contactForm.reset();
    });
  }

});

