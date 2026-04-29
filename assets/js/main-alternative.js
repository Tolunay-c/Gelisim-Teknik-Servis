const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobilePanel = document.querySelector('[data-mobile-panel]');
const panelClose = document.querySelector('[data-panel-close]');
const panelLinks = document.querySelectorAll('.mobile-nav a, .mobile-panel .btn');

function setMenu(open) {
  if (!menuButton || !mobilePanel) return;
  document.body.classList.toggle('menu-open', open);
  mobilePanel.classList.toggle('is-open', open);
  mobilePanel.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
}

menuButton?.addEventListener('click', () => setMenu(!mobilePanel.classList.contains('is-open')));
panelClose?.addEventListener('click', () => setMenu(false));
mobilePanel?.addEventListener('click', (event) => {
  if (event.target === mobilePanel) setMenu(false);
});
panelLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => observer.observe(item));

const form = document.querySelector('[data-contact-form]');
const messages = {
  fullName: 'Ad soyad en az 3 karakter olmalıdır.',
  phoneNumber: 'Telefon 0 ile başlayan 11 haneli formatta olmalıdır.',
  serviceType: 'Lütfen servis türü seçiniz.',
  faultMessage: 'Arıza açıklaması en az 10 karakter olmalıdır.'
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = form.querySelectorAll('input, select, textarea');
  let firstInvalid = null;

  fields.forEach((field) => {
    const error = form.querySelector(`[data-error-for="${field.id}"]`);
    if (!field.checkValidity()) {
      if (error) error.textContent = messages[field.id] || 'Bu alanı kontrol ediniz.';
      firstInvalid ??= field;
    } else if (error) {
      error.textContent = '';
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  form.querySelector('[data-form-success]')?.classList.add('is-visible');
  form.reset();
});