
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic", offset: 60 });



    (function () {
      const btn = document.getElementById("hamburgerBtn");
      const menu = document.getElementById("mobileMenu");
      const backdrop = document.getElementById("mobileMenuBackdrop");
      const closeBtn = document.getElementById("mobileMenuClose");
      const links = menu.querySelectorAll("a");

      function openMenu() {
        menu.classList.add("is-open");
        backdrop.classList.add("is-open");
        btn.classList.add("is-active");
        btn.setAttribute("aria-expanded", "true");
        menu.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }

      function closeMenu() {
        menu.classList.remove("is-open");
        backdrop.classList.remove("is-open");
        btn.classList.remove("is-active");
        btn.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      btn.addEventListener("click", function () {
        if (menu.classList.contains("is-open")) closeMenu();
        else openMenu();
      });
      closeBtn.addEventListener("click", closeMenu);
      backdrop.addEventListener("click", closeMenu);
      links.forEach((a) => a.addEventListener("click", closeMenu));
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
      });
    })();

    /* ---------- FORM VALIDATION ---------- */
    (function () {
      const form = document.getElementById("contactForm");
      if (!form) return;

      const fields = form.querySelectorAll("input, select, textarea");
      const successBox = document.getElementById("formSuccess");
      const msgInput = document.getElementById("message");
      const msgCount = document.getElementById("msgCount");

      // Karakter sayacı
      if (msgInput && msgCount) {
        msgInput.addEventListener("input", function () {
          msgCount.textContent = msgInput.value.length;
        });
      }

      function getErrorMessage(field) {
        const v = field.validity;
        if (v.valueMissing) return field.dataset.errorRequired || "Bu alan boş bırakılamaz.";
        if (v.typeMismatch) return field.dataset.errorTypemismatch || "Geçersiz format.";
        if (v.tooShort) return field.dataset.errorMinlength || "Çok kısa.";
        if (v.patternMismatch) return field.dataset.errorPattern || "Geçersiz format.";
        return "";
      }

      function showError(field) {
        const errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
        const group = field.closest(".form-group");
        const msg = getErrorMessage(field);
        if (msg) {
          if (errorEl) errorEl.textContent = msg;
          if (group) group.classList.add("has-error");
          field.setAttribute("aria-invalid", "true");
        } else {
          clearError(field);
        }
      }

      function clearError(field) {
        const errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
        const group = field.closest(".form-group");
        if (errorEl) errorEl.textContent = "";
        if (group) group.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
      }

      // Her field için: blur sonrası validate, input sırasında hata varsa düzeltirken sil
      fields.forEach(function (field) {
        field.addEventListener("blur", function () {
          if (!field.checkValidity()) showError(field);
          else clearError(field);
        });
        field.addEventListener("input", function () {
          if (field.closest(".form-group").classList.contains("has-error")) {
            if (field.checkValidity()) clearError(field);
            else showError(field);
          }
        });
        field.addEventListener("change", function () {
          if (field.checkValidity()) clearError(field);
          else showError(field);
        });
      });

      // Submit
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        let firstInvalid = null;
        let isValid = true;

        fields.forEach(function (field) {
          if (!field.checkValidity()) {
            showError(field);
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          } else {
            clearError(field);
          }
        });

        if (!isValid) {
          if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }

        // Başarı durumu — backend'e bağlanınca burayı fetch/AJAX ile değiştir
        successBox.classList.add("is-visible");
        form.reset();
        if (msgCount) msgCount.textContent = "0";
        setTimeout(function () {
          successBox.classList.remove("is-visible");
        }, 5000);
      });
    })();
