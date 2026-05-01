import { useMemo } from 'react';

// --- Seeded pseudo-random generator ---
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return Math.floor(dayOfYear / 7);
}

function getResetDay() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const resetDate = new Date(now);
  resetDate.setDate(now.getDate() + daysUntilMonday);
  return resetDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
}

// --- Fake name prefixes ---
const PREFIXES = [
  'NeuroUser', 'CogniPro', 'BrainFit', 'MindAce', 'Neura',
  'SynapseX', 'CortexFan', 'MemoryPro', 'ThinkFast', 'BrainWave',
  'NeuroPulse', 'CogniSharp', 'MindFlow', 'AxonStar', 'Dendrita',
  'FocusPro', 'LogicBrain', 'NeuroZen', 'BrainStorm', 'CerebroMax',
  'SynapTic', 'MindSpark', 'NeuroEdge', 'CogniFlux', 'BrainCore',
];

function generateFakeUsers(seed, count = 20) {
  const rng = seededRandom(seed);
  const users = [];

  for (let i = 0; i < count; i++) {
    const prefixIdx = Math.floor(rng() * PREFIXES.length);
    const suffix = Math.floor(rng() * 900) + 100;
    const name = `${PREFIXES[prefixIdx]}_${suffix}`;
    const xp = Math.floor(rng() * 4500) + 500;
    const level = Math.min(20, Math.floor(xp / 250) + 1);
    const streak = Math.floor(rng() * 30) + 1;
    const testsCompleted = Math.floor(rng() * 80) + 5;

    users.push({ name, xp, level, streak, testsCompleted, isUser: false });
  }

  return users;
}

// --- Medal colors ---
const MEDAL_COLORS = {
  1: { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', text: '#7C5C00', border: '#FFD700', emoji: '\uD83E\uDD47' },
  2: { bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', text: '#555', border: '#C0C0C0', emoji: '\uD83E\uDD48' },
  3: { bg: 'linear-gradient(135deg, #CD7F32, #A0652F)', text: '#5C3A1E', border: '#CD7F32', emoji: '\uD83E\uDD49' },
};

// --- Avatar color palette ---
const AVATAR_COLORS = [
  '#2D6A4F', '#D4A853', '#52B788', '#95D5B2', '#E8C97A',
  '#40916C', '#1B4332', '#74C69D', '#B7E4C7', '#A68A3E',
];

const styles = {
  container: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #1B4332, var(--accent))',
    padding: '22px 24px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  resetBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: 'rgba(255,255,255,.12)',
    border: '1px solid rgba(255,255,255,.15)',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 11,
    color: 'rgba(255,255,255,.7)',
    fontWeight: 500,
  },
  list: {
    padding: '8px 0',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 20px',
    transition: 'background .15s',
    borderBottom: '1px solid var(--border)',
  },
  rowHighlight: {
    background: 'var(--accent-light)',
    borderLeft: '3px solid var(--accent)',
  },
  rank: {
    width: 32,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--text-dim)',
    flexShrink: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  nameUser: {
    color: 'var(--accent-dark)',
  },
  levelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--accent)',
    background: 'var(--accent-light)',
    borderRadius: 6,
    padding: '1px 7px',
    marginTop: 2,
  },
  statsCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  xpText: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--accent)',
  },
  streakText: {
    fontSize: 11,
    color: 'var(--text-dim)',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 20px',
    color: 'var(--text-dim)',
    fontSize: 18,
    letterSpacing: 4,
    fontWeight: 700,
  },
  userPositionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    background: 'var(--accent-light)',
    borderLeft: '3px solid var(--accent)',
    borderTop: '1px solid var(--border)',
  },
};

export default function Leaderboard({ profile, userName = 'Tu' }) {
  const weekNum = getWeekNumber();
  const resetDay = getResetDay();

  const { displayList, userRank, userInTop } = useMemo(() => {
    const seed = weekNum * 16807;
    const fakeUsers = generateFakeUsers(seed, 20);

    // Create user entry from real profile
    const userEntry = {
      name: userName,
      xp: profile?.xp || 0,
      level: profile?.level || 1,
      streak: profile?.streak || 0,
      testsCompleted: profile?.testsCompleted || 0,
      isUser: true,
    };

    // Merge user into list and sort by XP descending
    const allUsers = [...fakeUsers, userEntry].sort((a, b) => b.xp - a.xp);

    // Find user rank (1-indexed)
    const rank = allUsers.findIndex((u) => u.isUser) + 1;
    const inTop = rank <= 20;

    // Take top 20 for display
    const top20 = allUsers.slice(0, 20);

    return { displayList: top20, userRank: rank, userInTop: inTop };
  }, [weekNum, profile, userName]);

  const userEntry = {
    name: userName,
    xp: profile?.xp || 0,
    level: profile?.level || 1,
    streak: profile?.streak || 0,
    testsCompleted: profile?.testsCompleted || 0,
    isUser: true,
  };

  function renderRow(user, rank, isBottom = false) {
    const medal = MEDAL_COLORS[rank];
    const isUser = user.isUser;
    const avatarColor = AVATAR_COLORS[rank % AVATAR_COLORS.length];
    const initial = user.name.charAt(0).toUpperCase();

    return (
      <div
        key={`${rank}-${user.name}`}
        style={{
          ...styles.row,
          ...(isUser ? styles.rowHighlight : {}),
          ...(isBottom ? styles.userPositionRow : {}),
          ...(rank <= 3 && !isBottom
            ? { background: medal ? `${medal.bg.includes('linear') ? '' : medal.bg}` : undefined }
            : {}),
        }}
      >
        {/* Rank */}
        <div style={styles.rank}>
          {medal && rank <= 3 ? (
            <span style={{ fontSize: 20 }}>{medal.emoji}</span>
          ) : (
            <span>{rank}</span>
          )}
        </div>

        {/* Avatar */}
        <div
          style={{
            ...styles.avatar,
            background: isUser ? 'var(--accent)' : avatarColor,
            border: isUser ? '2px solid var(--accent-dark)' : 'none',
          }}
        >
          {initial}
        </div>

        {/* Name + Level */}
        <div style={styles.nameCol}>
          <div style={{ ...styles.name, ...(isUser ? styles.nameUser : {}) }}>
            {user.name}
            {isUser && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  background: 'var(--accent)',
                  color: '#fff',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                TU
              </span>
            )}
          </div>
          <div style={styles.levelBadge}>Nv.{user.level}</div>
        </div>

        {/* Stats */}
        <div style={styles.statsCol}>
          <div style={styles.xpText}>{user.xp.toLocaleString()} XP</div>
          <div style={styles.streakText}>
            <span style={{ color: '#E76F51' }}>&#128293;</span>
            {user.streak}d
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={{ fontSize: 22 }}>&#127942;</span>
          Clasificacion Semanal
        </div>
        <div style={styles.resetBadge}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Reinicio: {resetDay}
        </div>
      </div>

      {/* Leaderboard list */}
      <div style={styles.list}>
        {displayList.map((user, i) => renderRow(user, i + 1))}

        {/* If user is NOT in top 20, show separator + user position */}
        {!userInTop && (
          <>
            <div style={styles.separator}>&#183;&#183;&#183;</div>
            {renderRow(userEntry, userRank, true)}
          </>
        )}
      </div>
    </div>
  );
}
