import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "";
const IMG = "https://image.tmdb.org/t/p/";
const poster = (path, size = "w500") => (path ? `${IMG}${size}${path}` : "");
const titleOf = (item) => item?.title || item?.name || "Untitled";
const yearOf = (item) =>
  (item?.release_date || item?.first_air_date || "").slice(0, 4);
const mediaOf = (item) =>
  item?.media_type || item?.type || (item?.first_air_date ? "tv" : "movie");
const ratingOf = (item) => {
  const value = Number(item?.vote_average);
  return item?.vote_average !== null &&
    item?.vote_average !== undefined &&
    item?.vote_average !== "" &&
    Number.isFinite(value) &&
    value > 0
    ? value.toFixed(1)
    : null;
};

async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

function Icon({ name }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z" />
      </>
    ),
    bookmark: (
      <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" />
    ),
    heart: (
      <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    play: <path d="m8 5 12 7-12 7z" fill="currentColor" stroke="none" />,
    star: (
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    ),
    close: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.star}
    </svg>
  );
}

function PosterArtwork({ item }) {
  const sources = [
    item?.poster_path ? poster(item.poster_path) : null,
    item?.backdrop_path ? poster(item.backdrop_path) : null,
  ].filter(Boolean);
  const [sourceIndex, setSourceIndex] = useState(0);
  useEffect(() => {
    setSourceIndex(0);
  }, [item?.id, item?.poster_path, item?.backdrop_path]);
  const source = sources[sourceIndex];
  if (!source)
    return (
      <div className="poster-fallback">
        <span>CINEVERSE</span>
        <strong>{titleOf(item)}</strong>
      </div>
    );
  return (
    <img
      src={source}
      alt={titleOf(item)}
      loading="lazy"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}

function MovieCard({ item, onOpen, rank, compact = false }) {
  const type = mediaOf(item);
  const itemWithType = { ...item, media_type: type };
  return (
    <button
      className={`movie-card ${compact ? "compact" : ""}`}
      onClick={() => onOpen(itemWithType)}
      type="button"
    >
      <div className="poster-wrap">
        <PosterArtwork item={item} />
        <span className={`poster-score ${ratingOf(item) ? "" : "unrated"}`}>
          {ratingOf(item) ? (
            <>
              <Icon name="star" />
              {ratingOf(item)}
            </>
          ) : (
            "NR"
          )}
        </span>
        {rank && <span className="rank-number">{rank}</span>}
        <span className="card-hover">
          <span className="play-circle">
            <Icon name="play" />
          </span>
          <span>View details</span>
        </span>
      </div>
      <div className="movie-card-meta">
        <div>
          <strong>{titleOf(item)}</strong>
          <small>
            {yearOf(item) || "New release"} <i>•</i>{" "}
            {type === "tv" ? "Series" : "Movie"}
          </small>
        </div>
        <span className="tiny-arrow">↗</span>
      </div>
    </button>
  );
}

function Section({ title, eyebrow, items, onOpen, action, compact = false }) {
  if (!items?.length) return null;
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
        </div>
        {action && (
          <button className="text-action" onClick={action}>
            View all <Icon name="arrow" />
          </button>
        )}
      </div>
      <div className="movie-rail">
        {items.map((item, index) => (
          <MovieCard
            key={`${mediaOf(item)}-${item.id}`}
            item={item}
            onOpen={onOpen}
            rank={title === "Trending now" ? index + 1 : null}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}

function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register")
        await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      onSuccess(result.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="auth-panel">
        <button className="icon-button modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <div className="brand-mark large">
          C<span>V</span>
        </div>
        <span className="eyebrow">YOUR CINEMA, CURATED</span>
        <h2>{mode === "login" ? "Welcome back." : "Join the experience."}</h2>
        <p className="muted">
          {mode === "login"
            ? "Sign in to pick up where you left off."
            : "Create an account and build your personal cinema."}
        </p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Username
              <input
                required
                minLength="3"
                maxLength="20"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Your screen name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength="8"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </label>
          {error && <div className="inline-error">{error}</div>}
          <button className="primary-button full" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "New to CineVerse?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function DetailModal({
  item,
  token,
  user,
  library,
  onClose,
  onLibraryChange,
  onAuth,
  onRefreshLibrary,
}) {
  const type = ["movie", "tv"].includes(item?.media_type)
    ? item.media_type
    : ["movie", "tv"].includes(item?.mediaType)
      ? item.mediaType
      : mediaOf(item);
  const [details, setDetails] = useState({ ...item, media_type: type });
  const [ratings, setRatings] = useState({
    averageRating: null,
    ratingCount: 0,
    ratings: [],
  });
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState("");
  const [newReview, setNewReview] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [openReviewMenu, setOpenReviewMenu] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inWatch = library.watchList.some(
    (x) => Number(x.tmdbId) === Number(item.id) && x.mediaType === type,
  );
  const inFav = library.favourites.some(
    (x) => Number(x.tmdbId) === Number(item.id) && x.mediaType === type,
  );
  const myExistingRating = ratings.ratings?.find(
    (x) => x.user?._id === user?._id,
  );

  const load = useCallback(async () => {
    try {
      const [d, r, v] = await Promise.all([
        api(`/api/movies/${item.id}?type=${type}`),
        api(`/api/ratings/${type}/${item.id}`).catch(() => ({
          ratings: [],
          averageRating: null,
          ratingCount: 0,
        })),
        api(`/api/reviews/${type}/${item.id}`).catch(() => ({ reviews: [] })),
      ]);
      setDetails({ ...d, media_type: type });
      setRatings(r);
      setReviews(v.reviews || []);
      const own = (r.ratings || []).find((x) => x.user?._id === user?._id);
      if (own?.rating !== undefined) setMyRating(String(own.rating));
      // Keep all reviews visible; users can have multiple reviews for the same title.
      setOpenReviewMenu(null);
    } catch (err) {
      setError(err.message);
    }
  }, [item.id, type, user?._id]);
  useEffect(() => {
    load();
  }, [load]);

  const toggleLibrary = async (kind, currently) => {
    if (!token) return onAuth();
    setBusy(true);
    setError("");
    setNotice("");
    const path =
      kind === "watchlist"
        ? "/api/library/watchlist"
        : "/api/library/favourites";
    try {
      await api(currently ? `${path}/${type}/${item.id}` : path, {
        token,
        method: currently ? "DELETE" : "POST",
        ...(!currently
          ? { body: JSON.stringify({ tmdbId: item.id, mediaType: type }) }
          : {}),
      });
      await onRefreshLibrary();
      setNotice(
        currently ? "Removed from your library." : "Saved to your library.",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const saveRating = async () => {
    if (!token) return onAuth();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(`/api/ratings/${type}/${item.id}/rate`, {
        token,
        method: "POST",
        body: JSON.stringify({ rating: Number(myRating) }),
      });
      setNotice("Your rating has been saved.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const publishReview = async (e) => {
    e.preventDefault();
    if (!token) return onAuth();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(`/api/reviews/${type}/${item.id}`, {
        token,
        method: "POST",
        body: JSON.stringify({ review: newReview }),
      });
      setNewReview("");
      setNotice("Your review has been published.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const beginEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditDraft(review.review);
    setOpenReviewMenu(null);
  };

  const saveEditedReview = async (reviewId) => {
    if (!token) return onAuth();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(`/api/reviews/${type}/${item.id}/${reviewId}`, {
        token,
        method: "PATCH",
        body: JSON.stringify({ review: editDraft }),
      });
      setEditingReviewId(null);
      setEditDraft("");
      setNotice("Your review has been updated.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!token) return onAuth();
    if (!window.confirm("Delete this review? This action cannot be undone."))
      return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(`/api/reviews/${type}/${item.id}/${reviewId}`, {
        token,
        method: "DELETE",
      });
      setOpenReviewMenu(null);
      if (editingReviewId === reviewId) setEditingReviewId(null);
      setNotice("Your review was deleted.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const backdrop =
    poster(details.backdrop_path, "w1280") ||
    poster(details.poster_path, "w780");
  return (
    <div
      className="modal-backdrop detail-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <article className="detail-modal">
        <button className="icon-button modal-close" onClick={onClose}>
          <Icon name="close" />
        </button>
        <div
          className="detail-hero"
          style={
            backdrop
              ? {
                  backgroundImage: `linear-gradient(90deg,#10111b 5%,rgba(16,17,27,.88) 42%,rgba(16,17,27,.2)),linear-gradient(0deg,#10111b,transparent 60%),url(${backdrop})`,
                }
              : {}
          }
        >
          <div className="detail-copy">
            <span className="eyebrow">
              {type === "tv" ? "SERIES" : "FEATURE FILM"} <i>•</i>{" "}
              {yearOf(details) || yearOf(item)}
            </span>
            <h2>{titleOf(details)}</h2>
            <div className="detail-stats">
              <span>
                {ratingOf(details) ? (
                  <>
                    <Icon name="star" /> {ratingOf(details)} TMDB
                  </>
                ) : (
                  "Not rated on TMDB"
                )}
              </span>
              <span>
                {details.runtime
                  ? `${details.runtime} min`
                  : details.number_of_seasons
                    ? `${details.number_of_seasons} seasons`
                    : "Now showing"}
              </span>
              <span>
                {details.genres
                  ?.slice(0, 3)
                  .map((g) => g.name)
                  .join(" · ")}
              </span>
            </div>
            <p>
              {details.overview ||
                "Discover the story, explore the cast, and add this title to your personal collection."}
            </p>
            <div className="detail-actions">
              <button
                className={`secondary-button ${inWatch ? "active" : ""}`}
                disabled={busy}
                onClick={() => toggleLibrary("watchlist", inWatch)}
              >
                <Icon name="bookmark" />
                {inWatch ? "In watchlist" : "Add to watchlist"}
              </button>
              <button
                className={`secondary-button ${inFav ? "active" : ""}`}
                disabled={busy}
                onClick={() => toggleLibrary("favourites", inFav)}
              >
                <Icon name="heart" />
                {inFav ? "Favorited" : "Add to favourites"}
              </button>
            </div>
          </div>
        </div>
        <div className="detail-body">
          <div className="detail-columns">
            <section className="detail-box">
              <span className="eyebrow">COMMUNITY SCORE</span>
              <div className="community-score">
                {ratings.averageRating ?? "—"}
                <small>/10</small>
              </div>
              <p className="muted">{ratings.ratingCount || 0} member ratings</p>
              <div className="rating-control">
                <label htmlFor="rating-select">Your rating</label>
                <select
                  id="rating-select"
                  value={myRating}
                  onChange={(e) => setMyRating(e.target.value)}
                >
                  <option value="">Choose a score</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i} / 10
                    </option>
                  ))}
                </select>
                <button
                  className="primary-button"
                  disabled={!myRating || busy}
                  onClick={saveRating}
                >
                  Save rating
                </button>
              </div>
            </section>
            <section className="detail-box review-compose">
              <span className="eyebrow">WRITE A REVIEW</span>
              <form onSubmit={publishReview}>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  minLength="5"
                  maxLength="150"
                  placeholder="Share a new thought about this title… (5–150 characters)"
                  required
                />
                <div className="compose-bottom">
                  <small>{newReview.length}/150</small>
                  <button
                    className="primary-button"
                    disabled={busy || newReview.trim().length < 5}
                  >
                    Publish review
                  </button>
                </div>
              </form>
            </section>
          </div>
          {(notice || error) && (
            <div className={error ? "inline-error" : "inline-success"}>
              {error || notice}
            </div>
          )}
          <section className="reviews-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">WHAT PEOPLE THINK</span>
                <h3>
                  Community reviews <span>{reviews.length}</span>
                </h3>
              </div>
            </div>
            {reviews.length ? (
              <div className="review-list">
                {reviews.map((r) => {
                  const isMine = Boolean(user?._id && r.user?._id === user._id);
                  const isEditing = editingReviewId === r._id;
                  return (
                    <div className="review-item" key={r._id}>
                      <div className="review-avatar">
                        {(r.user?.username || "C").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="review-content">
                        <div className="review-author-line">
                          <div>
                            <strong>
                              {r.user?.username || "CineVerse member"}
                            </strong>
                            <small>
                              {new Date(r.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          {isMine && (
                            <div className="review-menu-wrap">
                              <button
                                type="button"
                                className="review-more-button"
                                aria-label="Review options"
                                title="Review options"
                                onClick={() =>
                                  setOpenReviewMenu(
                                    openReviewMenu === r._id ? null : r._id,
                                  )
                                }
                              >
                                <span>••••</span>
                              </button>
                              {openReviewMenu === r._id && (
                                <div className="review-menu">
                                  <button
                                    type="button"
                                    onClick={() => beginEditReview(r)}
                                  >
                                    Edit review
                                  </button>
                                  <button
                                    type="button"
                                    className="danger-text"
                                    onClick={() => deleteReview(r._id)}
                                  >
                                    Delete review
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="review-edit-form">
                            <textarea
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              minLength="5"
                              maxLength="150"
                              autoFocus
                            />
                            <div className="compose-bottom">
                              <small>{editDraft.length}/150</small>
                              <div>
                                <button
                                  type="button"
                                  className="quiet-button"
                                  onClick={() => {
                                    setEditingReviewId(null);
                                    setEditDraft("");
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="primary-button"
                                  disabled={busy || editDraft.trim().length < 5}
                                  onClick={() => saveEditedReview(r._id)}
                                >
                                  Save changes
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>{r.review}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="muted empty-state">
                No reviews yet. Be the first to share your thoughts.
              </p>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("cineverse_token") || "",
  );
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState({ watchList: [], favourites: [] });
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [tv, setTv] = useState([]);
  const [activeView, setActiveView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("movie");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const refreshLibrary = useCallback(async () => {
    if (!token) {
      setLibrary({ watchList: [], favourites: [] });
      return;
    }
    try {
      const data = await api("/api/library", { token });
      setLibrary({
        watchList: data.watchList || [],
        favourites: data.favourites || [],
      });
    } catch {
      setLibrary({ watchList: [], favourites: [] });
    }
  }, [token]);

  useEffect(() => {
    api("/api/movies/trending")
      .then((data) => setTrending(data.results || []))
      .catch((err) => setError(err.message));
    api("/api/movies/search?query=popular&type=movie")
      .then((data) => setPopular(data.results || []))
      .catch(() => {});
    api("/api/movies/search?query=popular&type=tv")
      .then((data) => setTv(data.results || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLibrary({ watchList: [], favourites: [] });
      return;
    }
    api("/api/auth/me", { token })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("cineverse_token");
        setToken("");
        setUser(null);
      });
    refreshLibrary();
  }, [token, refreshLibrary]);

  const openAuth = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };
  const authSuccess = async (newToken) => {
    localStorage.setItem("cineverse_token", newToken);
    setToken(newToken);
    setAuthOpen(false);
    try {
      const me = await api("/api/auth/me", { token: newToken });
      setUser(me.user);
    } catch {}
  };
  const logout = () => {
    localStorage.removeItem("cineverse_token");
    setToken("");
    setUser(null);
    setLibrary({ watchList: [], favourites: [] });
    setActiveView("home");
  };
  const runSearch = async (e) => {
    e?.preventDefault();
    if (!search.trim()) return;
    setActiveView("search");
    setSearching(true);
    setError("");
    try {
      const data = await api(
        `/api/movies/search?query=${encodeURIComponent(search.trim())}&type=${searchType}`,
      );
      setResults(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const libraryItems = useMemo(
    () => (activeView === "watchlist" ? library.watchList : library.favourites),
    [activeView, library],
  );
  const viewTitle =
    activeView === "watchlist" ? "Your watchlist" : "Your favourites";
  const renderLibrary = async () => {
    const items = libraryItems;
    const resolved = await Promise.all(
      items.map(async (entry) => {
        try {
          return await api(
            `/api/movies/${entry.tmdbId}?type=${entry.mediaType}`,
          );
        } catch {
          return null;
        }
      }),
    );
    return resolved
      .map((item, index) =>
        item ? { ...item, media_type: items[index].mediaType } : null,
      )
      .filter(Boolean);
  };
  const [resolvedLibrary, setResolvedLibrary] = useState([]);
  useEffect(() => {
    if (activeView !== "watchlist" && activeView !== "favourites") return;
    let live = true;
    renderLibrary().then((items) => {
      if (live) setResolvedLibrary(items);
    });
    return () => {
      live = false;
    };
  }, [activeView, library]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (view) => {
    setActiveView(view);
    setMobileNav(false);
    setError("");
  };
  const allHero = trending[0];
  const heroImage = allHero
    ? poster(allHero.backdrop_path || allHero.poster_path, "original")
    : "";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-mark">
            C<span>V</span>
          </span>
          <span>
            CINE<span>VERSE</span>
          </span>
        </button>
        <nav className={mobileNav ? "nav-links open" : "nav-links"}>
          <button
            className={activeView === "home" ? "nav-link active" : "nav-link"}
            onClick={() => go("home")}
          >
            <Icon name="home" /> Discover
          </button>
          <button
            className={
              activeView === "watchlist" ? "nav-link active" : "nav-link"
            }
            onClick={() => go("watchlist")}
          >
            <Icon name="bookmark" /> Watchlist
          </button>
          <button
            className={
              activeView === "favourites" ? "nav-link active" : "nav-link"
            }
            onClick={() => go("favourites")}
          >
            <Icon name="heart" /> Favourites
          </button>
        </nav>
        <div className="top-actions">
          <form className="search-box" onSubmit={runSearch}>
            <Icon name="search" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, series…"
            />
            <select
              aria-label="Search type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="movie">Movies</option>
              <option value="tv">Series</option>
            </select>
          </form>
          {user ? (
            <div className="user-menu">
              <span className="user-avatar">
                {(user.username || "U").slice(0, 1).toUpperCase()}
              </span>
              <span>{user.username}</span>
              <button className="icon-button" title="Sign out" onClick={logout}>
                <Icon name="logout" />
              </button>
            </div>
          ) : (
            <button className="sign-in" onClick={openAuth}>
              Sign in <Icon name="arrow" />
            </button>
          )}
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <main>
        {activeView === "home" && (
          <>
            <section
              className="hero"
              style={
                heroImage
                  ? {
                      backgroundImage: `linear-gradient(90deg,#0c0d16 2%,rgba(12,13,22,.91) 34%,rgba(12,13,22,.15) 100%),linear-gradient(0deg,#0c0d16 0%,transparent 45%),url(${heroImage})`,
                    }
                  : {}
              }
            >
              <div className="hero-content">
                <div className="hero-kicker">
                  <span className="live-dot" /> CURATED FOR YOUR NEXT OBSESSION{" "}
                  <i>•</i> WEEKLY TRENDING
                </div>
                <h1>
                  {allHero ? titleOf(allHero) : "Stories worth staying up for."}
                </h1>
                <div className="hero-tags">
                  <span>
                    {allHero ? mediaOf(allHero).toUpperCase() : "CINEMA"}
                  </span>
                  <span>{yearOf(allHero) || "NEW & NOTEWORTHY"}</span>
                  <span>TMDB {allHero ? ratingOf(allHero) : "PICKS"}</span>
                </div>
                <p>
                  {allHero?.overview ||
                    "Discover your next favourite film, keep your watchlist close, and share the stories that stay with you."}
                </p>
                <div className="hero-buttons">
                  <button
                    className="primary-button"
                    onClick={() => allHero && setSelected(allHero)}
                  >
                    <Icon name="play" /> Explore title
                  </button>
                  <button
                    className="glass-button"
                    onClick={() => allHero && setSelected(allHero)}
                  >
                    <Icon name="plus" /> Discover more
                  </button>
                </div>
              </div>
              <div className="hero-bottom">
                <span>
                  <b>01</b> / 04
                </span>
                <div className="hero-progress">
                  <i />
                </div>
                <span>THE CINEVERSE EDIT</span>
              </div>
              <div className="hero-glow" />
            </section>
            <div className="home-content">
              <div className="welcome-strip">
                <div>
                  <span className="eyebrow">A UNIVERSE OF STORIES</span>
                  <h2>
                    Find your next <em>favourite.</em>
                  </h2>
                </div>
                <p>
                  One place for the films you love, the shows you follow, and
                  the stories you want to remember.
                </p>
              </div>
              <Section
                title="Trending now"
                eyebrow="THE WORLD IS WATCHING"
                items={trending.slice(0, 12)}
                onOpen={setSelected}
              />
              <Section
                title="Popular movies"
                eyebrow="CROWD FAVOURITES"
                items={popular.slice(0, 12)}
                onOpen={setSelected}
              />
              <Section
                title="Popular series"
                eyebrow="YOUR NEXT BINGE"
                items={tv.slice(0, 12).map((x) => ({ ...x, media_type: "tv" }))}
                onOpen={setSelected}
              />
            </div>
          </>
        )}
        {activeView === "search" && (
          <div className="page-content">
            <div className="page-heading">
              <span className="eyebrow">DISCOVERY ENGINE</span>
              <h1>Search results</h1>
              <p>
                Showing {searchType === "movie" ? "movies" : "series"} for{" "}
                <strong>“{search}”</strong>
              </p>
            </div>
            {searching ? (
              <div className="loading-state">Searching the universe…</div>
            ) : error ? (
              <div className="empty-state">{error}</div>
            ) : results.length ? (
              <div className="poster-grid">
                {results.map((item) => (
                  <MovieCard
                    key={item.id}
                    item={{ ...item, media_type: searchType }}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No titles found. Try another search.
              </div>
            )}
          </div>
        )}
        {(activeView === "watchlist" || activeView === "favourites") && (
          <div className="page-content">
            <div className="page-heading">
              <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
              <h1>{viewTitle}</h1>
              <p>
                {activeView === "watchlist"
                  ? "All the stories you want to watch next."
                  : "The titles that earned a place in your heart."}
              </p>
            </div>
            {!token ? (
              <div className="empty-card">
                <div className="empty-symbol">
                  <Icon
                    name={activeView === "watchlist" ? "bookmark" : "heart"}
                  />
                </div>
                <h3>Your collection starts here.</h3>
                <p>Sign in to save titles and access your library anywhere.</p>
                <button className="primary-button" onClick={openAuth}>
                  Sign in to continue
                </button>
              </div>
            ) : resolvedLibrary.length ? (
              <div className="poster-grid">
                {resolvedLibrary.map((item) => (
                  <MovieCard
                    key={`${item.id}-${mediaOf(item)}`}
                    item={item}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-card">
                <div className="empty-symbol">
                  <Icon
                    name={activeView === "watchlist" ? "bookmark" : "heart"}
                  />
                </div>
                <h3>Nothing here. Yet.</h3>
                <p>Explore titles and save the ones you want to keep close.</p>
                <button className="primary-button" onClick={() => go("home")}>
                  Explore movies
                </button>
              </div>
            )}
          </div>
        )}
        <footer className="footer">
          <div className="brand">
            <span className="brand-mark">
              C<span>V</span>
            </span>
            <span>
              CINE<span>VERSE</span>
            </span>
          </div>
          <p>Your universe. Your stories. Your CineVerse.</p>
          <small>Movie data and images provided by TMDB.</small>
        </footer>
      </main>

      {selected && (
        <DetailModal
          item={selected}
          token={token}
          user={user}
          library={library}
          onClose={() => setSelected(null)}
          onRefreshLibrary={refreshLibrary}
          onAuth={() => {
            setSelected(null);
            openAuth();
          }}
        />
      )}
      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={authSuccess}
        />
      )}
      <div className="toast-error" aria-live="polite">
        {error && activeView === "home" ? error : ""}
      </div>
    </div>
  );
}

export default App;
