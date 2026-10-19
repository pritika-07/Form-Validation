
const form = document.querySelector("#signup-form");
const formContent = document.querySelector("#form-content");
const successPanel = document.querySelector("#success-panel");

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const terms = document.querySelector("#terms");

const strengthBar = document.querySelector("#strength-bar");
const strengthText = document.querySelector("#strength-text");
const feedback = document.querySelector("#form-feedback");

// Connect each field to its error message.
const errorElements = {
  fullName: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  password: document.querySelector("#password-error"),
  confirmPassword: document.querySelector("#confirm-error"),
  terms: document.querySelector("#terms-error")
};

// Display an error or mark a field as valid.
function setError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message && input.value.trim() !== "");
  input.setAttribute("aria-invalid", String(Boolean(message)));
}

// Clear a field's error state.
function clearError(input, errorElement) {
  errorElement.textContent = "";
  input.classList.remove("invalid", "valid");
  input.removeAttribute("aria-invalid");
}

// Validate the name.
function validateName() {
  const name = fullName.value.trim();

  if (!name) {
    setError(fullName, errorElements.fullName, "Your name can't be empty.");
    return false;
  }

  if (name.length < 2) {
    setError(fullName, errorElements.fullName, "Enter at least 2 characters.");
    return false;
  }

  if (name.length > 60) {
    setError(fullName, errorElements.fullName, "Keep your name under 60 characters.");
    return false;
  }

  setError(fullName, errorElements.fullName, "");
  return true;
}

// Validate email format.
function validateEmail() {
  const value = email.value.trim();

  // Practical format check for this frontend exercise.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    setError(email, errorElements.email, "We need an email address.");
    return false;
  }

  if (!emailPattern.test(value)) {
    setError(email, errorElements.email, "That email doesn't look right yet.");
    return false;
  }

  setError(email, errorElements.email, "");
  return true;
}

// Return a score based on password characteristics.
function getPasswordStrength(value) {
  if (!value) {
    return { score: 0, label: "—" };
  }

  let score = 0;

  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 2) return { score, label: "WEAK" };
  if (score <= 3) return { score, label: "FAIR" };
  if (score === 4) return { score, label: "STRONG" };

  return { score, label: "EXCELLENT" };
}

// Update the live strength indicator as the user types.
function updatePasswordStrength() {
  const result = getPasswordStrength(password.value);
  const percentage = (result.score / 5) * 100;

  strengthBar.style.width = `${percentage}%`;
  strengthText.textContent = `PASSWORD STRENGTH: ${result.label}`;

  if (result.score <= 2) {
    strengthBar.style.backgroundColor = "#ff7048";
  } else if (result.score <= 3) {
    strengthBar.style.backgroundColor = "#e9c46a";
  } else {
    strengthBar.style.backgroundColor = "#d7ff38";
  }
}

// Require at least 8 characters, uppercase, lowercase,
// a number, and a special character.
function validatePassword() {
  const value = password.value;

  if (!value) {
    setError(password, errorElements.password, "Create a password first.");
    return false;
  }

  if (value.length < 8) {
    setError(password, errorElements.password, "Use at least 8 characters.");
    return false;
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
    setError(password, errorElements.password, "Add both uppercase and lowercase letters.");
    return false;
  }

  if (!/\d/.test(value)) {
    setError(password, errorElements.password, "Add at least one number.");
    return false;
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    setError(password, errorElements.password, "Add at least one special character.");
    return false;
  }

  setError(password, errorElements.password, "");
  return true;
}

// Check that both password entries match.
function validateConfirmPassword() {
  if (!confirmPassword.value) {
    setError(
      confirmPassword,
      errorElements.confirmPassword,
      "Type your password again."
    );
    return false;
  }

  if (confirmPassword.value !== password.value) {
    setError(
      confirmPassword,
      errorElements.confirmPassword,
      "Those passwords don't match."
    );
    return false;
  }

  setError(confirmPassword, errorElements.confirmPassword, "");
  return true;
}

// The user must tick the agreement checkbox.
function validateTerms() {
  if (!terms.checked) {
    errorElements.terms.textContent = "Tick the box before joining.";
    return false;
  }

  errorElements.terms.textContent = "";
  return true;
}

// Validate fields as the user interacts with them.
fullName.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);

password.addEventListener("input", () => {
  updatePasswordStrength();
  validatePassword();

  if (confirmPassword.value) {
    validateConfirmPassword();
  }
});

confirmPassword.addEventListener("input", validateConfirmPassword);

terms.addEventListener("change", validateTerms);

// Toggle password visibility.
const togglePassword = document.querySelector("#toggle-password");

togglePassword.addEventListener("click", () => {
  const isHidden = password.type === "password";

  password.type = isHidden ? "text" : "password";
  confirmPassword.type = isHidden ? "text" : "password";

  togglePassword.textContent = isHidden ? "HIDE" : "SHOW";
  togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  togglePassword.setAttribute("aria-pressed", String(isHidden));
});

// Handle form submission.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  feedback.textContent = "";

  const nameIsValid = validateName();
  const emailIsValid = validateEmail();
  const passwordIsValid = validatePassword();
  const confirmIsValid = validateConfirmPassword();
  const termsAreValid = validateTerms();

  const isValid =
    nameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmIsValid &&
    termsAreValid;

  if (!isValid) {
    feedback.textContent = "NOT QUITE. Fix the marked fields and try again.";

    const firstInvalid = form.querySelector(".invalid");

    if (firstInvalid) {
      firstInvalid.focus();
    } else if (!terms.checked) {
      terms.focus();
    }

    return;
  }

  // Frontend demo only: no account or server request is created.
  document.querySelector("#success-message").textContent =
    `You're on the list, ${fullName.value.trim()}. Your demo form passed every check.`;

  formContent.hidden = true;
  successPanel.hidden = false;
  successPanel.focus();
});

// Return to the form so it can be tested again.
document.querySelector("#reset-form").addEventListener("click", () => {
  form.reset();

  Object.keys(errorElements).forEach((key) => {
    errorElements[key].textContent = "";
  });

  [fullName, email, password, confirmPassword].forEach((input) => {
    input.classList.remove("invalid", "valid");
    input.removeAttribute("aria-invalid");
  });

  password.type = "password";
  confirmPassword.type = "password";
  togglePassword.textContent = "SHOW";
  togglePassword.setAttribute("aria-label", "Show password");
  togglePassword.setAttribute("aria-pressed", "false");

  strengthBar.style.width = "0";
  strengthText.textContent = "PASSWORD STRENGTH: —";
  strengthBar.style.backgroundColor = "#ff7048";
  feedback.textContent = "";

  successPanel.hidden = true;
  formContent.hidden = false;
  fullName.focus();
});
