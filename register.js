const form = document.getElementById("writersForgeForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    country: form.country.value,
    experience: form.experience.value,
    motivation: form.motivation.value,
    referral: form.referral.value
  };

  // Directly save to Google Sheets without payment
  saveToGoogleSheets(formData);
});

async function saveToGoogleSheets(data) {
  try {
    await fetch("https://script.google.com/macros/s/AKfycbw0VAhlwJjBkVf1T7iX1rk5JH66fa5XTw908BIP0uChJJs-oSKuyW9vLU6FVReSuGoJ/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    alert("Registration successful! Confirmation email sent.");
    form.reset();

  } catch (err) {
    alert("Registration failed. Please try again or contact support.");
  }
}
