import {
  Activity, ArrowLeft, ArrowRight, Award, BarChart3, Bird, BookOpen, BookText,
  Brain, BrainCog, Calendar, Car, Check, CircleDot, Clipboard, Clock,
  Compass, Crown, Diamond, Dna, Eye, FileText, Flame, Gauge,
  GraduationCap, Grid3x3, Handshake, Hash, Heart, Layers, Lightbulb, Link,
  Map, Medal, MessageCircle, Microscope, Moon, Palette, Pencil, Puzzle,
  RefreshCw, Rocket, Search, Settings, Shield, Smile, Sparkles, Star,
  Stethoscope, Sunrise, Target, Timer, Trophy, Users, Wind, X, Zap,
} from 'lucide-react';

// Direct reference map for tree-shaking
const ICONS = {
  Activity, ArrowLeft, ArrowRight, Award, BarChart3, Bird, BookOpen, BookText,
  Brain, BrainCog, Calendar, Car, Check, CircleDot, Clipboard, Clock,
  Compass, Crown, Diamond, Dna, Eye, FileText, Flame, Gauge,
  GraduationCap, Grid3x3, Handshake, Hash, Heart, Layers, Lightbulb, Link,
  Map, Medal, MessageCircle, Microscope, Moon, Palette, Pencil, Puzzle,
  RefreshCw, Rocket, Search, Settings, Shield, Smile, Sparkles, Star,
  Stethoscope, Sunrise, Target, Timer, Trophy, Users, Wind, X, Zap,
};

// Combined emoji → lucide icon name mapping
const EMOJI_MAP = {
  // Test card icons
  "🧠": "BrainCog", "🔢": "Hash", "🧩": "Puzzle", "💭": "MessageCircle",
  "⚡": "Zap", "📖": "BookOpen", "💚": "Heart", "🚗": "Car",
  "🎯": "Target", "🔍": "Search", "💪": "Shield", "😊": "Smile",
  "🎓": "GraduationCap", "🗂": "Layers", "🤔": "Lightbulb",
  "💬": "MessageCircle", "⚙️": "Settings", "😴": "Moon",
  "🏃": "Gauge", "👁": "Eye", "📅": "Calendar",
  "🔄": "RefreshCw", "🎨": "Palette", "🗺": "Map",
  "⏱": "Clock", "🧬": "Dna", "📚": "BookText",
  // Level icons
  "🌱": "CircleDot", "📘": "BookOpen", "🧭": "Compass", "🔬": "Microscope",
  "♟️": "Target", "🏅": "Medal", "🦉": "Bird", "⭐": "Star", "👑": "Crown",
  // Achievement icons
  "🎬": "Clipboard", "✋": "Handshake", "🔟": "Hash", "🏆": "Trophy",
  "💎": "Diamond", "💫": "Sparkles", "🔥": "Flame", "🌋": "Rocket",
  "☄️": "Wind", "🌈": "Grid3x3", "🐦": "Sunrise", "🎖️": "Award",
  // Category icons
  "✦": "Grid3x3",
  // Misc icons
  "📝": "Pencil", "📋": "Clipboard", "📊": "BarChart3",
  "🤝": "Handshake", "🔗": "Link", "💡": "Lightbulb",
  "🏠": "Compass", "🛤️": "Compass", "🥊": "Shield",
  "☕": "Clock", "🎧": "Eye", "🏓": "Gauge", "🎮": "Gauge",
  "💤": "Moon", "📱": "Target", "📵": "X",
  "🧘": "Activity", "🥗": "Heart", "🧮": "Hash",
  "🎵": "Activity", "🌍": "Map", "🔁": "RefreshCw",
  "🧹": "Settings", "📈": "BarChart3", "🏥": "Stethoscope",
  "📓": "FileText", "📐": "Puzzle", "🐟": "Activity",
  "🌡️": "Gauge", "🔑": "Settings", "🗣️": "MessageCircle",
  "📺": "Eye", "🌿": "Heart", "🌙": "Moon",
  "👆": "ArrowRight", "🔇": "X", "🔤": "BookText",
  "🔔": "Zap", "🪞": "Eye", "✍️": "Pencil",
  "💻": "Settings", "🎭": "RefreshCw", "🗺️": "Map",
  "👀": "Eye", "🌳": "Heart", "🧑‍🏫": "Users",
  "👂": "Activity", "⏸️": "Clock", "🫁": "Activity",
  "🌟": "Star", "🐢": "Clock",
  "🏎️": "Rocket", "🤖": "Settings", "🧐": "Search",
  "🤗": "Smile", "🆘": "Stethoscope", "🌊": "RefreshCw",
  "🦎": "RefreshCw", "🏔️": "Shield", "🦅": "Star",
  "🚨": "Stethoscope", "⏰": "Clock", "🧓": "Activity",
  "✅": "Check", "⚠️": "Stethoscope", "🚀": "Rocket",
  "✨": "Sparkles",
  // For programmatic icon names (from data files that already use icon strings)
  "brain": "Brain", "brain-cog": "BrainCog", "zap": "Zap", "heart": "Heart",
  "graduation-cap": "GraduationCap", "grid": "Grid3x3", "trophy": "Trophy",
  "flame": "Flame", "bar-chart": "BarChart3", "clipboard": "Clipboard",
  "target": "Target", "diamond": "Diamond", "pencil": "Pencil",
  "check": "Check", "x": "X", "arrow-left": "ArrowLeft",
  "arrow-right": "ArrowRight", "stethoscope": "Stethoscope",
  "hash": "Hash", "puzzle": "Puzzle", "message-circle": "MessageCircle",
  "timer": "Timer", "search": "Search", "shield": "Shield",
  "smile": "Smile", "book-open": "BookOpen", "car": "Car",
  "activity": "Activity", "eye": "Eye", "calendar": "Calendar",
  "refresh-cw": "RefreshCw", "palette": "Palette", "map": "Map",
  "clock": "Clock", "dna": "Dna", "book-text": "BookText",
  "moon": "Moon", "gauge": "Gauge", "cog": "Settings",
  "layers": "Layers", "lightbulb": "Lightbulb", "link": "Link",
  "star": "Star", "crown": "Crown", "medal": "Medal",
  "award": "Award", "compass": "Compass", "microscope": "Microscope",
  "owl": "Bird", "sunrise": "Sunrise", "wind": "Wind",
  "rocket": "Rocket", "sparkles": "Sparkles", "circle-dot": "CircleDot",
  "users": "Users", "file-text": "FileText", "handshake": "Handshake",
};

export function Icon({ name, size = 20, color = "currentColor", ...props }) {
  const lucideName = EMOJI_MAP[name];
  if (lucideName) {
    const LucideIcon = ICONS[lucideName];
    if (LucideIcon) {
      return <LucideIcon size={size} color={color} strokeWidth={1.8} {...props} />;
    }
  }
  // Fallback: circle with first char
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <text x="12" y="16" textAnchor="middle" fontSize="10" fill={color} stroke="none" fontFamily="system-ui">
        {(name || "?")[0]}
      </text>
    </svg>
  );
}

// Shorthand function matching the monolith's I(emoji, size, color) API
export function I(emoji, size = 20, color = "currentColor") {
  return <Icon name={emoji} size={size} color={color} />;
}

export default Icon;
