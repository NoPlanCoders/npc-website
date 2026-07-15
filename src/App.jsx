import { useEffect, useMemo, useState } from "react";
import { CardStack } from "./components/CardStack.jsx";
import logoMark from "../assets/logo-mark.png";
import Thumb1 from "../assets/Thumb1.png";
import Thumb2 from "../assets/Thumb2.png";
import Thumb3 from "../assets/Thumb3.png";

const translations = {
  ja: {
    title: "NoPlanCoders",
    description: "NoPlanCodersはGitHubのorgです。作ったものを置いています。",
    mainNav: "メインナビゲーション",
    languageSwitch: "言語を選択",
    heroEyebrow: "GitHub org",
    heroCopy:
      "NoPlanCodersはGitHubのorgです。まだ何をするかは決めてません。作ったものをここに置いています。",
    primaryLinks: "リンク",
    githubButton: "GitHubを見る",
    reposButton: "リポジトリを見る",
    showcaseTitle: "リポジトリ",
    repoLoadingTitle: "読み込み中",
    repoLoadingCopy: "GitHubから取得しています。",
    allReposLink: "all view...",
    genericRepoDescription: "NoPlanCodersの公開リポジトリです。",
    repoMetaLabel: "の情報",
    starsLabel: "☆",
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
    mainNav: "Main navigation",
    languageSwitch: "Choose language",
    heroEyebrow: "GitHub org",
    heroCopy: "NoPlanCoders is a GitHub org. Nothing is fixed yet. We put things here as we make them.",
    primaryLinks: "Links",
    githubButton: "View GitHub",
    reposButton: "View repositories",
    showcaseTitle: "Repositories",
    repoLoadingTitle: "Loading",
    repoLoadingCopy: "Loading from GitHub.",
    allReposLink: "all view...",
    genericRepoDescription: "A public NoPlanCoders repository.",
    repoMetaLabel: "metadata",
    starsLabel: "⭐︎",
    updatedLabel: "Updated",
    publicLabel: "Public",
    repoDescriptions: {
      "npc-website": "NoPlanCoders site.",
      ".github": "GitHub settings.",
    },
  },
};

const supportedLanguages = Object.keys(translations);
const featuredRepoNames = ["npc-website","IdolCraft","Dodosk-Discord-Bot"];

const repoThumbnails = {
  "npc-website": Thumb1,
  "IdolCraft": Thumb2,
  "Dodosk-Discord-Bot": Thumb3
};

const fallbackRepos = [
  {
    name: "npc-website",
    full_name: "NoPlanCoders/npc-website",
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

const useCardSize = () => {
  const [size, setSize] = useState({ width: 420, height: 260 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 480) {
        setSize({ width: Math.min(300, vw - 64), height: 200 });
      } else if (vw < 700) {
        setSize({ width: 360, height: 230 });
      } else {
        setSize({ width: 420, height: 260 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
};

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const reducedMotion = useReducedMotion();
  const cardSize = useCardSize();
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

  // featuredRepoNames に書かれた名前のリポジトリだけを「注目」としてピックアップし、
  // 配列に書いた順番で並べる。一覧側からはその分を除外する。
  const featuredRepos = useMemo(
    () =>
      featuredRepoNames
        .map((name) => repos.find((repo) => repo.name === name))
        .filter(Boolean),
    [repos],
  );
  const remainingRepos = useMemo(
    () => repos.filter((repo) => !featuredRepoNames.includes(repo.name)),
    [repos],
  );

  const showcaseItems = useMemo(
    () =>
      featuredRepos.map((repo) => ({
        id: repo.name,
        title: repo.name,
        description: getRepoDescription(repo),
        href: repo.html_url,
         // repoThumbnailsに指定があればそれを優先、なければGitHubのOGP画像を使う
        imageSrc:
        repoThumbnails[repo.name] ||
        (repo.full_name
          ? `https://opengraph.githubassets.com/1/${repo.full_name}`
          : undefined),
      })
    ),
    [featuredRepos, language],
  );

  return (
    <>
      <header className="site-header">
          <a className="brand-logo" href="#top" aria-label="NoPlanCoders home">
            <img src={logoMark} width="72" height="72" alt=""/>
          </a>
          <p className="brand-title">NoPlanCorders</p>
           <a className="brand-subtitle"
            href="https://github.com/NoPlanCoders"
            rel="noreferrer"
            target="_blank"
            >
            {t.heroEyebrow}
          </a>
      </header>

      <main id="main" className="page-shell">

        <div className="lang-switch-row">
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
        </div>

        {!isLoading && showcaseItems.length > 0 && (
          <section className="showcase-section" aria-label={t.showcaseTitle}>
            <div className="section-header">
              <h2>{t.showcaseTitle}</h2>
            </div>
            <CardStack 
              items={showcaseItems}
              cardWidth={cardSize.width}
              cardHeight={cardSize.height}
              autoAdvance
            />
          </section>
        )}

        <section className="repo-section" id="repositories" aria-labelledby="repo-title">
          <div className="repo-grid" aria-live="polite">
            {isLoading ? (
              <article className="repo-card loading">
                <span className="repo-name">{t.repoLoadingTitle}</span>
                <p>{t.repoLoadingCopy}</p>
              </article>
            ) : (
              remainingRepos.slice(0, 6).map((repo) => {
                const languageName = repo.language || t.publicLabel;
                const stars = Number(repo.stargazers_count ?? 0);
                const metaLabel =
                  language === "ja" ? `${repo.name} ${t.repoMetaLabel}` : `${repo.name} ${t.repoMetaLabel}`;

                return (
                  <a className="repo-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}>
                    <span>
                      <span className="repo-name">{repo.name}</span>
                      <p class="repo-explain">{getRepoDescription(repo)}</p>
                    </span>
                    <span className="repo-meta" aria-label={metaLabel}>
                      <span>
                        {t.starsLabel} {stars}
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