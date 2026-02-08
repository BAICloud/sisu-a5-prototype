const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-screen]");
const navLinks = document.querySelectorAll("[data-nav]");
const toast = document.getElementById("toast");

const conflictDetail = document.getElementById("conflict-detail");
const conflictItems = document.querySelectorAll(".conflict-item");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const registerBtn = document.querySelector(".register-btn");
const confirmedTab = document.getElementById("tab-confirmed");

const searchInput = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const searchStatus = document.getElementById("search-status");
const searchResults = document.getElementById("search-results");
const resultsEmpty = document.getElementById("results-empty");
const previewPanel = document.getElementById("plan-preview");

const suggestionOptions = [
  "UI Construction D",
  "Artificial Intelligence D",
  "Emergent User Interfaces D",
];

const conflictData = {
  "entry-year": {
    title: "Entry year at Aalto",
    issue: "Missing mandatory course: Academic Skills (1 cr).",
    fix: "Add Academic Skills to Period I or mark completed.",
    impact: "Resolves mandatory requirement and removes conflict.",
    related: "Related: SCI-E1011 Academic Skills.",
  },
  innovation: {
    title: "Innovation & Entrepreneurship",
    issue: "15 cr selected outside the required structure.",
    fix: "Move Product Development Project V to Innovation module.",
    impact: "Aligns credits with module rules.",
    related: "Related: MEC-E3001 Product Development Project V.",
  },
};

const showScreen = (screenId) => {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${screenId}`);
  });
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
};

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.screen));
});

navLinks.forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.nav));
});

conflictItems.forEach((item) => {
  item.addEventListener("click", () => {
    const data = conflictData[item.dataset.conflict];
    conflictDetail.innerHTML = `
      <div class="panel-title">${data.title}</div>
      <p><strong>Issue:</strong> ${data.issue}</p>
      <p><strong>Recommended fix:</strong> ${data.fix}</p>
      <p class="muted">${data.impact}</p>
      <p class="muted">${data.related}</p>
      <div class="action-row">
        <button class="primary" data-apply>Apply fix</button>
        <button class="ghost" data-view>View in plan</button>
      </div>
    `;

    const applyBtn = conflictDetail.querySelector("[data-apply]");
    const viewBtn = conflictDetail.querySelector("[data-view]");

    applyBtn.addEventListener("click", () => {
      const status = item.querySelector(".status");
      status.textContent = "Resolved";
      status.classList.remove("danger");
      status.classList.add("success");
      item.classList.add("resolved");
      applyBtn.textContent = "Applied";
      applyBtn.disabled = true;
      showToast("Conflict resolved");
    });

    viewBtn.addEventListener("click", () => showToast("Opened in timeline"));
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === `tab-${tab.dataset.tab}`);
    });
  });
});

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const card = registerBtn.closest(".task-card");
    registerBtn.textContent = "Registered";
    registerBtn.classList.add("disabled");
    registerBtn.disabled = true;
    card.classList.add("success");
    const heading = card.querySelector("h3");
    if (!heading.querySelector(".badge")) {
      const badge = document.createElement("span");
      badge.className = "badge success";
      badge.textContent = "Confirmed";
      heading.appendChild(badge);
    }
    confirmedTab.innerHTML = "";
    confirmedTab.appendChild(card);
    showToast("Registration submitted");
  });
}

const renderSuggestions = (value) => {
  const matches = suggestionOptions.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );
  if (matches.length === 0) {
    suggestions.classList.add("hidden");
    suggestions.innerHTML = "";
    return;
  }
  suggestions.classList.remove("hidden");
  suggestions.innerHTML = matches
    .map((match) => `<button type="button">${match}</button>`)
    .join("");
  suggestions.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      searchInput.value = btn.textContent;
      suggestions.classList.add("hidden");
    });
  });
};

searchInput.addEventListener("input", (event) => {
  const value = event.target.value.trim();
  if (value.length >= 2) {
    renderSuggestions(value);
  } else {
    suggestions.classList.add("hidden");
  }
});

searchBtn.addEventListener("click", () => {
  const value = searchInput.value.trim();
  if (value.length < 3) {
    searchStatus.textContent = "Enter at least 3 characters.";
    searchStatus.classList.remove("loading");
    searchResults.classList.add("hidden");
    resultsEmpty.classList.add("hidden");
    return;
  }
  searchStatus.textContent = "Searching...";
  searchStatus.classList.add("loading");
  searchResults.classList.add("hidden");
  resultsEmpty.classList.add("hidden");
  const hasResults = suggestionOptions.some((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );
  setTimeout(() => {
    searchStatus.classList.remove("loading");
    if (hasResults) {
      searchStatus.textContent = "2 results found";
      searchResults.classList.remove("hidden");
    } else {
      searchStatus.textContent = "No results found";
      resultsEmpty.classList.remove("hidden");
    }
  }, 700);
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchStatus.textContent = "";
  searchResults.classList.add("hidden");
  suggestions.classList.add("hidden");
  resultsEmpty.classList.add("hidden");
});

document.querySelectorAll(".preview-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".result-card");
    const title = card.querySelector("h3").textContent;
    previewPanel.innerHTML = `
      <div class="panel-title">Plan preview</div>
      <p><strong>${title}</strong></p>
      <p class="muted">Potential overlap with "Creative Digital Concept Design".</p>
      <div class="action-row">
        <button class="ghost" data-resolve>Resolve conflict</button>
      </div>
    `;
    previewPanel.querySelector("[data-resolve]").addEventListener("click", () => {
      showScreen("conflicts");
    });
  });
});

document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    showToast("Added to plan");
    previewPanel.innerHTML = `
      <div class="panel-title">Plan preview</div>
      <p class="muted">New conflict detected after adding this course.</p>
      <div class="action-row">
        <button class="primary" data-resolve>Fix conflict</button>
      </div>
    `;
    previewPanel.querySelector("[data-resolve]").addEventListener("click", () => {
      showScreen("conflicts");
    });
  });
});
