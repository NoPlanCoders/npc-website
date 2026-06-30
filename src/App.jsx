import { useEffect, useMemo, useState } from "react";
import Plasma from "./Plasma.jsx";
import logoMark from "../assets/logo-mark.png";

const translations = {
  ja: {
    title: "NoPlanCoders",
    description: "NoPlanCodersはGitHubのorgです。作ったものを置いています。",
    skipLink: "本文へ移動",
    mainNav: "メインナビゲーション",
    languageSwitch: "言語を選択",
    heroEyebrow: "GitHub org",
    heroCopy:
      "NoPlanCodersはGitHubのorgです。まだ何をするかは決めてません。作ったものをここに置いています。",
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

const getInitialLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  const stored = localStorage.getItem("npc-language");

  if (supportedLanguages.includes(fromUrl)) return fromUrl;
  if (supportedLanguages.includes(stored)) return stored;
  return navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
};

const updateUrlLanguage = (lang) => {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url);
};

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
};

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const reducedMotion = useReducedMotion();
  const t = translations[language];

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.title;
    document
      .querySelectorAll("meta[data-i18n-meta='description']")
      .forEach((element) => element.setAttribute("content", t.description));
  }, [language, t.description, t.title]);

  useEffect(() => {
    let cancelled = false;

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

        const data = await response.json();
        if (!cancelled) {
          setRepos(Array.isArray(data) && data.length ? data : fallbackRepos);
        }
      } catch (error) {
        console.warn(error);
        if (!cancelled) {
          setRepos(fallbackRepos);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadRepos();

    return () => {
      cancelled = true;
    };
  }, []);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("npc-language", nextLanguage);
    updateUrlLanguage(nextLanguage);
  };

  const getRepoDescription = (repo) =>
    t.repoDescriptions[repo.name] || repo.description || t.genericRepoDescription;

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>

      <div className="plasma-layer" aria-hidden="true">
        {!reducedMotion && (
          <Plasma
            color="#8fe7d0"
            speed={0.28}
            direction="pingpong"
            scale={1.55}
            opacity={0.18}
            mouseInteractive
          />
        )}
      </div>

      <header className="site-header">
        <nav className="nav-shell" aria-label={t.mainNav}>
          <a className="brand" href="#top" aria-label="NoPlanCoders home">
            <img src={logoMark} width="36" height="36" alt="" />
            <span>NoPlanCoders</span>
          </a>

          <div className="nav-actions">
            <div className="lang-switch" role="group" aria-label={t.languageSwitch}>
              {supportedLanguages.map((lang) => (
                <button
                  className="lang-option"
                  type="button"
                  key={lang}
                  aria-pressed={language === lang}
                  onClick={() => changeLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <a className="text-button" href="https://github.com/NoPlanCoders" rel="noreferrer" target="_blank">
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main id="main" className="page-shell">
        <section className="intro" id="top" aria-labelledby="hero-title">
          <img className="intro-logo" src={logoMark} width="84" height="84" alt="" />
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1 id="hero-title">NoPlanCoders</h1>
          <p className="intro-copy">{t.heroCopy}</p>
          <div className="intro-actions" aria-label={t.primaryLinks}>
            <a className="button primary" href="https://github.com/NoPlanCoders" rel="noreferrer" target="_blank">
              {t.githubButton}
            </a>
            <a className="button secondary" href="#repositories">
              {t.reposButton}
            </a>
          </div>
        </section>

        <section className="repo-section" id="repositories" aria-labelledby="repo-title">
          <div className="section-header">
            <h2 id="repo-title">{t.reposTitle}</h2>
            <p>{t.reposCopy}</p>
          </div>

          <div className="repo-grid" aria-live="polite">
            {isLoading ? (
              <article className="repo-card loading">
                <span className="repo-name">{t.repoLoadingTitle}</span>
                <p>{t.repoLoadingCopy}</p>
              </article>
            ) : (
              repos.slice(0, 6).map((repo) => {
                const languageName = repo.language || t.publicLabel;
                const stars = Number(repo.stargazers_count ?? 0);
                const metaLabel =
                  language === "ja" ? `${repo.name} ${t.repoMetaLabel}` : `${repo.name} ${t.repoMetaLabel}`;

                return (
                  <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}>
                    <span>
                      <span className="repo-name">{repo.name}</span>
                      <p>{getRepoDescription(repo)}</p>
                    </span>
                    <span className="repo-meta" aria-label={metaLabel}>
                      <span>{languageName}</span>
                      <span>
                        {stars} {t.starsLabel}
                      </span>
                      <span>
                        {t.updatedLabel} {dateFormatter.format(new Date(repo.updated_at))}
                      </span>
                    </span>
                  </a>
                );
              })
            )}
          </div>

          <a className="plain-link" href="https://github.com/NoPlanCoders?tab=repositories" rel="noreferrer" target="_blank">
            {t.allReposLink}
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <span>NoPlanCoders</span>
        <span>GitHub / Vercel</span>
      </footer>
    </>
  );
}

export default App;
