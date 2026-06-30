/* ===== INIT LUCIDE ICONS ===== */
lucide.createIcons();

/* ===== SIDEBAR TOGGLE ===== */
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
overlay?.addEventListener('click', closeSidebar);

/* Mark active nav link */
const currentPath = location.pathname.split('/').pop() || 'dashboard.html';
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

/* ===== DROPDOWNS ===== */
document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const id = btn.dataset.dropdownToggle;
    const menu = document.getElementById(id);
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    if (!isOpen) menu.classList.add('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
});

/* ===== MODALS ===== */
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.openModal;
    document.getElementById(id)?.classList.add('open');
  });
});
document.querySelectorAll('[data-close-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay')?.classList.remove('open');
  });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});
document.getElementById('bookAppointmentForm')?.addEventListener('submit', e => {
  e.preventDefault();
  e.target.closest('.modal-overlay').classList.remove('open');
  e.target.reset();
});

/* ===== BAR CHART ===== */
const revenueChart = document.getElementById('revenueChart');
if (revenueChart) {
  const data = [
    { day: 'Mon', val: 5200 },
    { day: 'Tue', val: 7800 },
    { day: 'Wed', val: 6100 },
    { day: 'Thu', val: 9400 },
    { day: 'Fri', val: 8200 },
    { day: 'Sat', val: 11200 },
    { day: 'Sun', val: 4300 },
  ];
  const max = Math.max(...data.map(d => d.val));

  revenueChart.style.cssText = `
    height: 180px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding-top: 12px;
  `;

  data.forEach(d => {
    const pct = (d.val / max) * 100;
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      height: 100%;
      justify-content: flex-end;
    `;

    const bar = document.createElement('div');
    bar.style.cssText = `
      width: 100%;
      height: ${pct}%;
      background: linear-gradient(to top, #7C6FE0, #9B8FEB);
      border-radius: 6px 6px 0 0;
      min-height: 4px;
      transition: opacity 0.15s;
      cursor: pointer;
    `;
    bar.title = `$${d.val.toLocaleString()}`;
    bar.addEventListener('mouseenter', () => bar.style.opacity = '0.75');
    bar.addEventListener('mouseleave', () => bar.style.opacity = '1');

    const label = document.createElement('span');
    label.textContent = d.day;
    label.style.cssText = `
      font-size: 11px;
      color: #5A5E72;
      font-family: inherit;
    `;

    wrap.appendChild(bar);
    wrap.appendChild(label);
    revenueChart.appendChild(wrap);
  });
}

/* ===== LOGIN PAGE: PASSWORD TOGGLE ===== */
const togglePass = document.getElementById('togglePass');
const passwordInput = document.getElementById('password');
togglePass?.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePass.setAttribute('data-lucide', isHidden ? 'eye-off' : 'eye');
  lucide.createIcons();
});

/* ===== LOGIN PAGE: FORM SUBMIT ===== */
document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  window.location.href = 'dashboard.html';
});

/* ===== MINI CALENDAR ===== */
let calDate = new Date(2026, 5, 1); // June 2026

const eventDays = [3, 7, 10, 12, 14, 17, 18, 20, 22, 24, 25, 27];

function renderCal(date) {
  const grid = document.getElementById('calGrid');
  const label = document.getElementById('calLabel');
  if (!grid || !label) return;

  grid.innerHTML = '';
  const today = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();

  label.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  days.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-label';
    el.textContent = d;
    grid.appendChild(el);
  });

  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const prevTotal = new Date(y, m, 0).getDate();

  for (let i = 0; i < first; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = prevTotal - first + 1 + i;
    grid.appendChild(el);
  }

  for (let d = 1; d <= total; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
    if (isToday) el.classList.add('today');
    if (eventDays.includes(d)) el.classList.add('has-event');
    grid.appendChild(el);
  }

  const remaining = 42 - first - total;
  for (let d = 1; d <= remaining; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    grid.appendChild(el);
  }
}

renderCal(calDate);

document.querySelectorAll('.mini-cal-head button').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    calDate.setMonth(calDate.getMonth() + (i === 0 ? -1 : 1));
    renderCal(calDate);
  });
});
