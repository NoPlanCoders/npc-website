const repoList = document.querySelector("#repo-list");
const languageButtons = [...document.querySelectorAll("[data-lang]")];

const translations = {
  ja: {
    title: "NoPlanCoders",
    description: "NoPlanCodersはGitHubのorgです。作ったものを置いています。",
    skipLink: "本文へ移動",
    mainNav: "メインナビゲーション",
    languageSwitch: "言語を選択",
    heroEyebrow: "GitHub org",
    heroCopy: "NoPlanCodersはGitHubのorgです。まだ何をするかは決めてません。作ったものをここに置いています。",
    primaryLinks: "リンク",
    githubButton: "GitHubを見る",
    reposButton: "リポジトリを見る",
    reposTitle: "リポジトリ",
    reposCopy: "GitHubで公開しているものです。",
    repoLoadingTitle: "読み込み中",
    repoLoadingCopy: "GitHubから取得しています。",
    allReposLink: "GitHubですべて見る",
    genericRepoDescription: "NoPlanCodersの公開リポジトリです。",
    repoMetaLabel: "の情報",
    starsLabel: "スター",
    updatedLabel: "更新",
    publicLabel: "Public",
    repoDescriptions: {
      "npc-website": "NoPlanCodersのサイトです。",
      ".github": "GitHub用の設定です。",
    },
  },
  en: {
    title: "NoPlanCoders",
    description: "NoPlanCoders is a GitHub org. We put things here as we make them.",
    skipLink: "Skip to main content",
    mainNav: "Main navigation",
    languageSwitch: "Choose language",
    heroEyebrow: "GitHub org",
    heroCopy: "NoPlanCoders is a GitHub org. Nothing is fixed yet. We put things here as we make them.",
    primaryLinks: "Links",
    githubButton: "View GitHub",
    reposButton: "View repositories",
    reposTitle: "Repositories",
    reposCopy: "Things published on GitHub.",
    repoLoadingTitle: "Loading",
    repoLoadingCopy: "Loading from GitHub.",
    allReposLink: "View all on GitHub",
    genericRepoDescription: "A public NoPlanCoders repository.",
    repoMetaLabel: "metadata",
    starsLabel: "stars",
    updatedLabel: "Updated",
    publicLabel: "Public",
    repoDescriptions: {
      "npc-website": "NoPlanCoders site.",
      ".github": "GitHub settings.",
    },
  },
};

const supportedLanguages = Object.keys(translations);
let currentLanguage = getInitialLanguage();
let cachedRepos = [];

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  const stored = localStorage.getItem("npc-language");

  if (supportedLanguages.includes(fromUrl)) return fromUrl;
  if (supportedLanguages.includes(stored)) return stored;
  return navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function updateUrlLanguage(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url);
}

function applyLanguage(lang, shouldStore = false) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.title = translations[lang].title;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key] ?? "";
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    element.setAttribute("aria-label", translations[lang][key] ?? "");
  });

  document.querySelectorAll("[data-i18n-meta='description']").forEach((element) => {
    element.setAttribute("content", translations[lang].description);
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });

  if (cachedRepos.length) {
    renderRepos(cachedRepos);
  }

  if (shouldStore) {
    localStorage.setItem("npc-language", lang);
    updateUrlLanguage(lang);
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    if (supportedLanguages.includes(lang)) {
      applyLanguage(lang, true);
    }
  });
});

const fallbackRepos = [
  {
    name: "npc-website",
    description: "",
    html_url: "https://github.com/NoPlanCoders/npc-website",
    language: "HTML",
    stargazers_count: 0,
    updated_at: new Date().toISOString(),
  },
];

const formatDate = (value) =>
  new Intl.DateTimeFormat(currentLanguage === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const escapeText = (value) => {
  const node = document.createElement("span");
  node.textContent = value ?? "";
  return node.innerHTML;
};

const getRepoDescription = (repo) => {
  const translated = translations[currentLanguage].repoDescriptions[repo.name];
  return translated || repo.description || translations[currentLanguage].genericRepoDescription;
};

const renderRepos = (repos) => {
  if (!repoList) return;

  repoList.innerHTML = repos
    .slice(0, 6)
    .map((repo) => {
      const description = getRepoDescription(repo);
      const language = repo.language || translations[currentLanguage].publicLabel;
      const stars = Number(repo.stargazers_count ?? 0);
      const metaLabel =
        currentLanguage === "ja"
          ? `${repo.name} ${translations[currentLanguage].repoMetaLabel}`
          : `${repo.name} ${translations[currentLanguage].repoMetaLabel}`;

      return `
        <a class="repo-card" href="${escapeText(repo.html_url)}" target="_blank" rel="noreferrer">
          <span>
            <span class="repo-name">${escapeText(repo.name)}</span>
            <p>${escapeText(description)}</p>
          </span>
          <span class="repo-meta" aria-label="${escapeText(metaLabel)}">
            <span>${escapeText(language)}</span>
            <span>${stars} ${escapeText(translations[currentLanguage].starsLabel)}</span>
            <span>${escapeText(translations[currentLanguage].updatedLabel)} ${formatDate(repo.updated_at)}</span>
          </span>
        </a>
      `;
    })
    .join("");
};

const loadRepos = async () => {
  try {
    const response = await fetch("https://api.github.com/orgs/NoPlanCoders/repos?sort=updated&per_page=6", {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repos = await response.json();
    cachedRepos = Array.isArray(repos) && repos.length ? repos : fallbackRepos;
    renderRepos(cachedRepos);
  } catch (error) {
    console.warn(error);
    cachedRepos = fallbackRepos;
    renderRepos(cachedRepos);
  }
};

applyLanguage(currentLanguage);
loadRepos();
