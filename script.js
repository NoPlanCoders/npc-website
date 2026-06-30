const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#site-menu");
const repoList = document.querySelector("#repo-list");
const languageButtons = [...document.querySelectorAll("[data-lang]")];

const translations = {
  ja: {
    title: "NoPlanCoders | 公式サイト",
    description: "NoPlanCodersはGitHubの組織です。Webサイトや開発用ツールを作って公開しています。",
    skipLink: "本文へ移動",
    mainNav: "メインナビゲーション",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    languageSwitch: "言語を選択",
    navAbout: "概要",
    navWorks: "作っているもの",
    navRepos: "リポジトリ",
    navJoin: "参加",
    heroEyebrow: "GitHubの組織",
    heroCopy: "NoPlanCodersはGitHubの組織です。Webサイト、AI関連ツール、開発用ツールなどを作って公開しています。",
    primaryLinks: "主要リンク",
    githubButton: "GitHubを見る",
    reposButton: "公開リポジトリ",
    signalRow: "NoPlanCodersの活動領域",
    signalTypeLabel: "種類",
    signalType: "GitHub組織",
    signalFocusLabel: "内容",
    signalFocus: "Web / AI / ツール",
    signalUrlLabel: "URL",
    aboutKicker: "概要",
    aboutTitle: "NoPlanCodersについて",
    aboutCopy: "思いついたものを作って、GitHubに置いています。小さいものでも、使えそうなら公開します。",
    cardOneTitle: "まず作る",
    cardOneCopy: "細かく考えすぎず、まず動く形にします。",
    cardTwoTitle: "GitHubに置く",
    cardTwoCopy: "コードやメモは、できるだけGitHubで見られるようにします。",
    cardThreeTitle: "使えるようにする",
    cardThreeCopy: "見た目よりも、ちゃんと使えることを優先します。",
    worksKicker: "作っているもの",
    worksTitle: "作っているもの",
    worksCopy: "Webサイト、開発用ツール、AIを使った小さなツールなどを作っています。",
    stepThink: "考える",
    stepBuild: "作る",
    stepPublish: "公開する",
    stepFix: "直す",
    reposKicker: "リポジトリ",
    reposTitle: "公開中のリポジトリ",
    reposCopy: "NoPlanCodersの公開リポジトリを表示しています。",
    repoLoadingTitle: "リポジトリを読み込み中",
    repoLoadingCopy: "GitHubから情報を取得しています。",
    allReposLink: "すべてのリポジトリを見る",
    joinKicker: "参加",
    joinTitle: "参加する",
    joinCopy: "気になるリポジトリがあれば、IssueやPull Requestを送ってください。",
    githubShortButton: "GitHubへ",
    siteRepoButton: "このサイトのリポジトリ",
    genericRepoDescription: "NoPlanCodersの公開リポジトリです。",
    repoMetaLabel: "の情報",
    starsLabel: "スター",
    updatedLabel: "更新",
    publicLabel: "Public",
    repoDescriptions: {
      "npc-website": "NoPlanCoders公式サイトです。",
      ".github": "NoPlanCodersのGitHub設定用リポジトリです。",
    },
  },
  en: {
    title: "NoPlanCoders | Official Website",
    description: "NoPlanCoders is a GitHub organization. We build and publish websites and developer tools.",
    skipLink: "Skip to main content",
    mainNav: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageSwitch: "Choose language",
    navAbout: "About",
    navWorks: "Works",
    navRepos: "Repositories",
    navJoin: "Join",
    heroEyebrow: "GitHub organization",
    heroCopy: "NoPlanCoders is a GitHub organization. We build websites, AI tools, and developer tools.",
    primaryLinks: "Primary links",
    githubButton: "View GitHub",
    reposButton: "Public repositories",
    signalRow: "NoPlanCoders activity",
    signalTypeLabel: "Type",
    signalType: "GitHub org",
    signalFocusLabel: "Focus",
    signalFocus: "Web / AI / Tools",
    signalUrlLabel: "URL",
    aboutKicker: "About",
    aboutTitle: "About NoPlanCoders",
    aboutCopy: "We make things and put them on GitHub. If something seems useful, we publish it.",
    cardOneTitle: "Make first",
    cardOneCopy: "We avoid overthinking and make something that works first.",
    cardTwoTitle: "Put it on GitHub",
    cardTwoCopy: "We keep code and notes as visible as possible on GitHub.",
    cardThreeTitle: "Make it usable",
    cardThreeCopy: "We care more about working well than looking fancy.",
    worksKicker: "Works",
    worksTitle: "What we make",
    worksCopy: "We make websites, developer tools, and small AI tools.",
    stepThink: "Think",
    stepBuild: "Build",
    stepPublish: "Publish",
    stepFix: "Fix",
    reposKicker: "Repositories",
    reposTitle: "Public repositories",
    reposCopy: "Public repositories from NoPlanCoders are shown here.",
    repoLoadingTitle: "Loading repositories",
    repoLoadingCopy: "Loading data from GitHub.",
    allReposLink: "View all repositories",
    joinKicker: "Join",
    joinTitle: "Join",
    joinCopy: "If you find a repository you care about, send an Issue or Pull Request.",
    githubShortButton: "Open GitHub",
    siteRepoButton: "This site's repository",
    genericRepoDescription: "A public NoPlanCoders repository.",
    repoMetaLabel: "metadata",
    starsLabel: "stars",
    updatedLabel: "Updated",
    publicLabel: "Public",
    repoDescriptions: {
      "npc-website": "Official website for the NoPlanCoders GitHub organization.",
      ".github": "GitHub configuration repository for NoPlanCoders.",
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

function setMenuLabel() {
  if (!toggle) return;
  const key = nav?.classList.contains("is-open") ? "closeMenu" : "openMenu";
  toggle.setAttribute("aria-label", translations[currentLanguage][key]);
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
    const isActive = button.dataset.lang === lang;
    button.setAttribute("aria-pressed", String(isActive));
  });

  setMenuLabel();

  if (cachedRepos.length) {
    renderRepos(cachedRepos);
  }

  if (shouldStore) {
    localStorage.setItem("npc-language", lang);
    updateUrlLanguage(lang);
  }
}

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  toggle.setAttribute("aria-expanded", String(isOpen));
  setMenuLabel();
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    setMenuLabel();
  }
});

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
