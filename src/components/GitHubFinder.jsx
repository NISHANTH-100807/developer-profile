import { useEffect, useState } from 'react';

const HISTORY_KEY = 'githubFinderHistory';

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((name) => typeof name === 'string').slice(0, 6) : [];
  } catch { return []; }
}

export default function GitHubFinder() {
  const [username, setUsername] = useState('');
  const [searchedUsername, setSearchedUsername] = useState('');
  const [requestId, setRequestId] = useState(0);
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(readHistory);

  useEffect(() => {
    if (!searchedUsername) return undefined;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError('');
    setProfile(null);
    setRepositories([]);

    async function loadProfile() {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(searchedUsername)}`, { signal: controller.signal }),
          fetch(`https://api.github.com/users/${encodeURIComponent(searchedUsername)}/repos?sort=updated&per_page=10`, { signal: controller.signal }),
        ]);
        if (!profileResponse.ok) {
          if (profileResponse.status === 404) throw new Error(`No GitHub user named “${searchedUsername}” was found.`);
          if (profileResponse.status === 403 || profileResponse.status === 429) throw new Error('GitHub API rate limit reached. Please wait a minute and try again.');
          throw new Error('GitHub could not load this profile. Please try again.');
        }
        const user = await profileResponse.json();
        if (!reposResponse.ok) throw new Error('The profile loaded, but its repositories could not be fetched. Please try again.');
        const repos = await reposResponse.json();
        if (!active) return;
        setProfile(user);
        setRepositories(repos);
        setHistory((current) => {
          const next = [user.login, ...current.filter((name) => name.toLowerCase() !== user.login.toLowerCase())].slice(0, 6);
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* Search remains usable if storage is unavailable. */ }
          return next;
        });
      } catch (requestError) {
        if (active && requestError.name !== 'AbortError') setError(requestError.message || 'Network error. Check your connection and try again.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => { active = false; controller.abort(); };
  }, [searchedUsername, requestId]);

  function search(event) {
    event.preventDefault();
    const cleanName = username.trim().replace(/^@/, '');
    if (!cleanName) { setError('Enter a GitHub username to search.'); setProfile(null); setSearchedUsername(''); setRequestId((id) => id + 1); return; }
    setUsername(cleanName);
    setError('');
    setSearchedUsername(cleanName);
    setRequestId((id) => id + 1);
  }

  return <section id="github-finder" className="section github-section">
    <div className="section-heading"><p>EXPLORE THE COMMUNITY</p><h2>GitHub Profile Finder</h2><span className="finder-intro">Look up a developer and explore their latest public work.</span></div>
    <div className="finder-card">
      <form className="finder-search" onSubmit={search} role="search">
        <label className="visually-hidden" htmlFor="github-username">GitHub username</label>
        <span aria-hidden="true" className="search-at">@</span>
        <input id="github-username" type="search" autoComplete="off" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter a GitHub username" aria-describedby="finder-hint" />
        <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>
      <p id="finder-hint" className="finder-hint">Search by username, for example <button type="button" className="inline-link" onClick={() => setUsername('octocat')}>octocat</button>.</p>
      {history.length > 0 && <div className="search-history"><span>Recent searches</span>{history.map((name) => <button type="button" key={name} onClick={() => { setUsername(name); setSearchedUsername(name); setRequestId((id) => id + 1); }}>{name}</button>)}</div>}
      {loading && <div className="finder-state" role="status"><span className="finder-spinner" />Loading GitHub profile…</div>}
      {error && !loading && <div className="finder-state finder-error" role="alert">{error}</div>}
      {!profile && !loading && !error && <div className="finder-empty"><span aria-hidden="true">⌕</span><p>Search for a username to see their profile and repositories.</p></div>}
      {profile && !loading && <div className="finder-results">
        <article className="profile-result">
          <img className="finder-avatar" src={profile.avatar_url} alt={`${profile.login}'s GitHub avatar`} />
          <div className="profile-details"><p className="finder-kicker">GITHUB PROFILE</p><h3>{profile.name || profile.login}</h3><a className="profile-handle" href={profile.html_url} target="_blank" rel="noopener noreferrer">@{profile.login} <span aria-hidden="true">↗</span></a>
            <p className="profile-bio">{profile.bio || 'This user has not added a bio yet.'}</p>
            <div className="profile-stats"><div><strong>{profile.public_repos}</strong><span>Repositories</span></div><div><strong>{profile.followers}</strong><span>Followers</span></div><div><strong>{profile.following}</strong><span>Following</span></div></div>
            <a className="primary-btn profile-visit" href={profile.html_url} target="_blank" rel="noopener noreferrer">View GitHub Profile <span aria-hidden="true">↗</span></a>
          </div>
        </article>
        <div className="repository-area"><div className="repository-heading"><div><p className="finder-kicker">RECENTLY UPDATED</p><h3>Public repositories</h3></div><span>{repositories.length} shown</span></div>
          {repositories.length ? <div className="repository-grid">{repositories.map((repo) => <article className="repository-card" key={repo.id}><div className="repo-title"><h4><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name} <span aria-hidden="true">↗</span></a></h4><span className="repo-star" aria-label={`${repo.stargazers_count} stars`}>★ {repo.stargazers_count}</span></div><p>{repo.description || 'No description provided.'}</p><div className="repo-meta">{repo.language && <span><i className="language-dot" />{repo.language}</span>}<a href={repo.html_url} target="_blank" rel="noopener noreferrer">Open repository</a></div></article>)}</div> : <p className="finder-hint">This profile has no public repositories yet.</p>}
        </div>
      </div>}
    </div>
  </section>;
}
