/* ── Data ── */
    const reviews = [
      {
        score: "10",
        service: "Bathroom & Kitchen Plumbing",
        posted: "1 day ago",
        title: "Reliable Straightforward Service",
        body: "A very easy experience, prompt service and very reliable. From the first phone call all very straight forward. Would absolutely recommend to anyone needing plumbing work done.",
        verified: true,
        location: "GU21",
        reviewer: null,
      },
      {
        score: "10",
        service: "Plumbing Repairs",
        posted: "1 day ago",
        title: "In my outhouse the cold water feed to my washing machine had burst",
        body: "I was able to call very late in the evening and spoke to a helpful lady who immediately booked a plumber for the next day. When the plumber arrived he was extremely helpful and fixed the issue quickly and professionally.",
        verified: true,
        location: "LN2",
        reviewer: { initials: "R", name: "Lloyd C" },
      },
      {
        score: "9.33",
        service: "Plumber",
        posted: "1 day ago",
        title: "Problem with toilet flush",
        body: "Work carried out very efficiently. The engineer was polite, tidy and clearly knew what he was doing. Everything was left clean and the problem was resolved on the first visit.",
        verified: false,
        location: "OX3",
        reviewer: null,
      },
      {
        score: "10",
        service: "Boiler Service",
        posted: "2 days ago",
        title: "Annual boiler service — quick and professional",
        body: "Engineer arrived within the agreed window, serviced the boiler and gave us a clear health report on its condition. Great value and friendly service from start to finish.",
        verified: true,
        location: "SW1A",
        reviewer: { initials: "M", name: "Maria T" },
      },
      {
        score: "9.75",
        service: "Emergency Plumber",
        posted: "3 days ago",
        title: "Burst pipe sorted within hours",
        body: "Called at 7am about a burst pipe and had an engineer on site by 10am. He was calm, efficient and explained everything clearly before starting the repair. Outstanding emergency service.",
        verified: true,
        location: "BS8",
        reviewer: null,
      },
      {
        score: "10",
        service: "Central Heating",
        posted: "4 days ago",
        title: "New radiators fitted — no fuss at all",
        body: "Had three new radiators fitted across the house. The team was on time, cleaned up after themselves and took the time to balance the whole system properly. Really thorough job.",
        verified: true,
        location: "M14",
        reviewer: { initials: "J", name: "James W" },
      },
    ];

    /* ── State ── */
    const INTERVAL = 4000; // ms per slide
    const VISIBLE = getVisibleCount();

    let current = 0;
    let autoTimer = null;
    let progressStart = null;
    let progressFrame = null;
    let paused = false;
    const total = reviews.length; // total pages (1 card shift per step)

    function getVisibleCount() {
      if (window.innerWidth <= 520) return 1;
      if (window.innerWidth <= 780) return 2;
      return 3;
    }

    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('dotsContainer');
    const progressFill = document.getElementById('progressFill');
    const pauseHint = document.getElementById('pauseHint');
    const wrapper = document.getElementById('carouselWrapper');

    /* ── Build cards ── */
    function buildCards() {
      track.innerHTML = '';
      reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
          <div class="card-header">
            <div class="score-badge">${r.score}</div>
            <div class="card-meta">
              <span class="card-service">${r.service}</span>
              <span class="card-posted">Posted ${r.posted}</span>
            </div>
          </div>
          <div class="card-title">${r.title}</div>
          <div class="card-body">${r.body}</div>
          <div class="card-footer">
            <div class="footer-left">
              ${r.verified ? `
              <span class="verified">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Verified reviewer
              </span>` : ''}
              <span class="job-location">Job location: ${r.location}</span>
            </div>
            ${r.reviewer ? `
            <div class="reviewer-info">
              <div class="reviewer-avatar">${r.reviewer.initials}</div>
              <span class="reviewer-name">${r.reviewer.name}</span>
            </div>` : ''}
          </div>
        `;
        track.appendChild(card);
      });
    }

    /* ── Build dots ── */
    function buildDots() {
      dotsContainer.innerHTML = '';
      const pageCount = total - getVisibleCount() + 1;
      for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === current ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    /* ── Render position ── */
    function render() {
      const cardEl = track.querySelector('.review-card');
      if (!cardEl) return;
      const gap = 20;
      const cardW = cardEl.getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${current * cardW}px)`;

      // Dots
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    /* ── Navigate ── */
    function maxIndex() {
      return Math.max(0, total - getVisibleCount());
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      render();
      resetProgress();
    }

    function next() { goTo(current < maxIndex() ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : maxIndex()); }

    /* ── Progress bar ── */
    function resetProgress() {
      cancelAnimationFrame(progressFrame);
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      if (!paused) startProgress();
    }

    function startProgress() {
      progressStart = performance.now();
      function tick(now) {
        const elapsed = now - progressStart;
        const pct = Math.min((elapsed / INTERVAL) * 100, 100);
        progressFill.style.width = pct + '%';
        if (pct < 100) {
          progressFrame = requestAnimationFrame(tick);
        } else {
          next();
        }
      }
      progressFrame = requestAnimationFrame(tick);
    }

    /* ── Pause on hover ── */
    wrapper.addEventListener('mouseenter', () => {
      paused = true;
      cancelAnimationFrame(progressFrame);
      // Freeze the fill at current position — note time elapsed
      const elapsed = performance.now() - (progressStart || performance.now());
      // Store remaining width so we can resume smoothly
      const currentPct = parseFloat(progressFill.style.width) || 0;
      progressFill.dataset.frozenPct = currentPct;
      pauseHint.textContent = 'Paused';
    });

    wrapper.addEventListener('mouseleave', () => {
      paused = false;
      pauseHint.textContent = 'Auto-playing · hover to pause';
      // Resume from frozen position
      const frozenPct = parseFloat(progressFill.dataset.frozenPct) || 0;
      const remaining = (1 - frozenPct / 100) * INTERVAL;
      progressStart = performance.now() - (frozenPct / 100 * INTERVAL);
      cancelAnimationFrame(progressFrame);
      function tick(now) {
        const elapsed = now - progressStart;
        const pct = Math.min((elapsed / INTERVAL) * 100, 100);
        progressFill.style.width = pct + '%';
        if (pct < 100) {
          progressFrame = requestAnimationFrame(tick);
        } else {
          next();
        }
      }
      progressFrame = requestAnimationFrame(tick);
    });

    /* ── Arrow buttons ── */
    document.getElementById('prevBtn').addEventListener('click', () => { paused = false; prev(); });
    document.getElementById('nextBtn').addEventListener('click', () => { paused = false; next(); });

    /* ── Keyboard ── */
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { paused = false; prev(); }
      if (e.key === 'ArrowRight') { paused = false; next(); }
    });

    /* ── Touch / swipe ── */
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { paused = false; dx < 0 ? next() : prev(); }
    }, { passive: true });

    /* ── Resize ── */
    window.addEventListener('resize', () => {
      buildDots();
      render();
    });

    /* ── Init ── */
    buildCards();
    buildDots();
    render();
    startProgress();
