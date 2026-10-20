import { useCallback } from 'react';
import { getJson } from '../services/restApi';
import { useRestApi } from '../hooks/useRestApi';

const REPOSITORY_API_URL = 'https://api.github.com/repos/dipakrathod-dev/clientflow-dashboard';

function RepositoryLoadingState() {
  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading repository status">
      <div className="h-5 w-44 rounded bg-slate-800" />
      <div className="h-4 w-3/4 rounded bg-slate-800/70" />
      <div className="flex gap-3">
        <div className="h-8 w-20 rounded-lg bg-slate-800" />
        <div className="h-8 w-20 rounded-lg bg-slate-800" />
        <div className="h-8 w-20 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

function RepositoryErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-start gap-3" role="alert">
      <p className="text-sm text-slate-400">We could not load the repository status.</p>
      <p className="text-xs text-rose-300/90">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20"
      >
        Try again
      </button>
    </div>
  );
}

export default function GitHubRepositoryCard() {
  const fetchRepository = useCallback(
    (signal) =>
      getJson(REPOSITORY_API_URL, {
        signal,
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }),
    [],
  );

  const { data: repository, loading, error, execute } = useRestApi(fetchRepository);

  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      aria-labelledby="repository-status-heading"
      aria-busy={loading}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Open source activity</p>
          <h2 id="repository-status-heading" className="mt-1 text-lg font-semibold text-white">
            ClientFlow repository
          </h2>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-400">
          GitHub
        </span>
      </div>

      {loading ? <RepositoryLoadingState /> : null}

      {!loading && error ? <RepositoryErrorState message={error.message} onRetry={() => void execute()} /> : null}

      {!loading && !error && !repository ? (
        <div className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm text-slate-400">
          Repository status is not available yet.
        </div>
      ) : null}

      {!loading && !error && repository ? (
        <div className="space-y-4">
          <div>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-base font-medium text-slate-100 transition hover:text-violet-300"
            >
              {repository.full_name}
            </a>
            <p className="mt-1 text-sm text-slate-400">
              {repository.description || 'No repository description provided.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-lg bg-slate-800 px-3 py-2">★ {repository.stargazers_count} stars</span>
            <span className="rounded-lg bg-slate-800 px-3 py-2">⑂ {repository.forks_count} forks</span>
            <span className="rounded-lg bg-slate-800 px-3 py-2">{repository.language || 'Mixed'} codebase</span>
          </div>
          <p className="text-xs text-slate-500">
            Updated {new Date(repository.pushed_at).toLocaleDateString()}
          </p>
        </div>
      ) : null}
    </section>
  );
}
