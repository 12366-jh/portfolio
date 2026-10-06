/* 个人作品集 · 交互脚本 */

/* ---------- 1. 移动端菜单开合 ---------- */
(function () {
  var toggle = document.getElementById('mToggle');
  var menu = document.getElementById('mMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  });

  // 点击菜单项后自动收起
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // 点击菜单外部区域时收起
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
})();

/* ---------- 2. 导航滚动高亮 ---------- */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  if (!links.length) return;

  var sections = links
    .map(function (link) { return document.getElementById(link.dataset.target); })
    .filter(Boolean);

  function update() {
    var pos = window.scrollY + 140; // 提前一段距离进入高亮
    var currentId = '';

    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });

    // 滚动到页面底部时固定点亮最后一个
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      currentId = sections[sections.length - 1].id;
    }

    links.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.target === currentId);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---------- 3. 滚动渐入动画 ---------- */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // 不支持 IntersectionObserver 时直接全部显示
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
})();

/* ---------- 4. 深浅色主题切换 ---------- */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  var KEY = 'portfolio-theme';

  function apply(theme) {
    var isDark = theme === 'dark';

    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    if (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? '切换到浅色主题' : '切换到深色主题');
    }
  }

  // 读取用户上一次的选择；localStorage 不可用时回退为浅色主题
  var saved = null;
  try { saved = window.localStorage.getItem(KEY); } catch (e) { saved = null; }
  apply(saved === 'dark' ? 'dark' : 'light');

  if (!btn) return;

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { window.localStorage.setItem(KEY, next); } catch (e) { /* 忽略写入失败 */ }
  });
})();
