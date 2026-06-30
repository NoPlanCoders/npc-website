const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#site-menu");
const repoList = document.querySelector("#repo-list");

toggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "メニューを開く");
  }
});

const fallbackRepos = [
  {
    name: "npc-website",
    description: "NoPlanCoders official website.",
    html_url: "https://github.com/NoPlanCoders/npc-website",
    language: "HTML",
    stargazers_count: 0,
    updated_at: new Date().toISOString(),
  },
];

const formatDate = (value) =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const escapeText = (value) => {
  const node = document.createElement("span");
  node.textContent = value ?? "";
  return node.innerHTML;
};

const renderRepos = (repos) => {
  if (!repoList) return;

  repoList.innerHTML = repos
    .slice(0, 6)
    .map((repo) => {
      const description = repo.description || "NoPlanCodersの公開リポジトリです。";
      const language = repo.language || "Public";
      const stars = Number(repo.stargazers_count ?? 0);

      return `
        <a class="repo-card" href="${escapeText(repo.html_url)}" target="_blank" rel="noreferrer">
          <span>
            <span class="repo-name">${escapeText(repo.name)}</span>
            <p>${escapeText(description)}</p>
          </span>
          <span class="repo-meta" aria-label="${escapeText(repo.name)} metadata">
            <span>${escapeText(language)}</span>
            <span>${stars} stars</span>
            <span>Updated ${formatDate(repo.updated_at)}</span>
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
    renderRepos(Array.isArray(repos) && repos.length ? repos : fallbackRepos);
  } catch (error) {
    console.warn(error);
    renderRepos(fallbackRepos);
  }
};

loadRepos();
