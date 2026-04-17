"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GitBranch, Star, GitFork, ExternalLink, Github } from "lucide-react";

interface GitHubUser {
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  Dart: "#00B4AB",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-5 animate-pulse">
      <div className="h-5 w-2/3 bg-white/10 rounded mb-3" />
      <div className="h-3 w-full bg-white/10 rounded mb-2" />
      <div className="h-3 w-4/5 bg-white/10 rounded mb-6" />
      <div className="flex items-center gap-4 mt-auto">
        <div className="h-3 w-16 bg-white/10 rounded" />
        <div className="h-3 w-10 bg-white/10 rounded" />
        <div className="h-3 w-10 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export default function GitHub() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const [userRes, reposRes, allReposRes] = await Promise.all([
          fetch("https://api.github.com/users/reachvivek"),
          fetch(
            "https://api.github.com/users/reachvivek/repos?sort=updated&per_page=6"
          ),
          fetch(
            "https://api.github.com/users/reachvivek/repos?per_page=100"
          ),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

        const userData: GitHubUser = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();
        const allRepos: GitHubRepo[] = allReposRes.ok ? await allReposRes.json() : reposData;

        const stars = allRepos.reduce((s, r) => s + r.stargazers_count, 0);

        setUser(userData);
        setRepos(reposData);
        setTotalStars(stars);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHub();
  }, []);

  return (
    <section id="github" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Open Source &amp; <span className="gradient-text">GitHub</span>
          </h2>
          <p className="mt-3 text-white/40 text-sm sm:text-base max-w-xl mx-auto">
            Shipping side projects, contributing to the community, and building
            in the open.
          </p>
        </motion.div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-8 text-center max-w-md mx-auto"
          >
            <Github className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">
              Unable to load GitHub data right now. Visit my profile directly.
            </p>
            <a
              href="https://github.com/reachvivek"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-gold text-sm hover:underline"
            >
              github.com/reachvivek
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}

        {/* Stats row */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-6 sm:gap-10 mb-12"
          >
            {loading ? (
              <div className="flex gap-6 sm:gap-10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 animate-pulse">
                    <div className="w-8 h-8 bg-white/10 rounded-full" />
                    <div>
                      <div className="h-5 w-8 bg-white/10 rounded mb-1" />
                      <div className="h-3 w-14 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {user?.public_repos ?? 0}
                    </p>
                    <p className="text-xs text-white/40">Public Repos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {totalStars}
                    </p>
                    <p className="text-xs text-white/40">Total Stars</p>
                  </div>
                </div>

                {(user?.followers ?? 0) > 0 && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Github className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {user?.followers}
                      </p>
                      <p className="text-xs text-white/40">Followers</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Repo grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : repos.map((repo, i) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="glass glass-hover card-lift rounded-xl p-5 flex flex-col group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-gold transition-colors truncate pr-2">
                        {repo.name}
                      </h3>
                      <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-gold/60 transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    <p className="text-xs text-white/35 leading-relaxed mb-4 line-clamp-2 flex-1">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-white/30">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                LANGUAGE_COLORS[repo.language] ?? "#8b8b8b",
                            }}
                          />
                          {repo.language}
                        </span>
                      )}

                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </span>
                      )}

                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {repo.forks_count}
                        </span>
                      )}

                      <span className="ml-auto">{timeAgo(repo.updated_at)}</span>
                    </div>
                  </motion.a>
                ))}
          </div>
        )}

        {/* CTA button */}
        {!error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <a
              href="https://github.com/reachvivek"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition-colors"
            >
              <Github className="w-4 h-4" />
              View GitHub Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
