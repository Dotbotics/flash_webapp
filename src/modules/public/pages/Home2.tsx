import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_IMAGES = {
  sunset: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    "https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=400&q=80",
    "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80",
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&q=80",
  ],
  birthday: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
    "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=400&q=80",
    "https://images.unsplash.com/photo-1488591216781-2bae8e3f2bb4?w=400&q=80",
  ],
  meeting: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80",
  ],
  presentation: [
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80",
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&q=80",
  ],
};

const TYPING_PHRASES = [
  "sunset photo from Goa trip",
  "presentation we showed to Tesla team",
  "video from dad's birthday cake moment",
  "invoice from Amazon last November",
  "beach photo from Maldives holiday",
  "team meeting recording from Friday",
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useTypingAnimation(phrases: string[], typingSpeed = 60, eraseSpeed = 30, pauseMs = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    if (isTyping) {
      if (displayed.length < currentPhrase.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentPhrase.slice(0, displayed.length + 1));
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setIsTyping(false), pauseMs);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, eraseSpeed);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isTyping, phraseIdx, phrases, typingSpeed, eraseSpeed, pauseMs]);

  return displayed;
}

function getImages(query: string) {
  const q = query.toLowerCase();
  for (const key of Object.keys(MOCK_IMAGES)) {
    if (q.includes(key)) return MOCK_IMAGES[key as keyof typeof MOCK_IMAGES];
  }
  if (q.length > 2) return MOCK_IMAGES.default;
  return [];
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  .home2-root *, .home2-root *::before, .home2-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home2-root {
    --orange: #fb5b15;
    --red: #dc2312;
    --dark: #141414;
    --dark2: #1c1c1c;
    --dark3: #262626;
    --glass: rgba(255,255,255,0.05);
    --glass-border: rgba(255,255,255,0.09);
    --text: #f0ede8;
    --muted: rgba(240,237,232,0.45);
    --glow: rgba(251,91,21,0.35);

    font-family: 'Space Grotesk', sans-serif;
    background: var(--dark);
    color: var(--text);
    overflow-x: hidden;
    min-height: 100vh;
  }

  .home2-root .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    background: rgba(20,20,20,0.7);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--glass-border);
  }
  .home2-root .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 20px; font-weight: 700; letter-spacing: -0.5px;
  }
  .home2-root .nav-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--orange), var(--red));
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .home2-root .nav-links { display: flex; gap: 32px; }
  .home2-root .nav-links a {
    color: var(--muted); text-decoration: none; font-size: 14px;
    font-weight: 500; transition: color 0.2s;
  }
  .home2-root .nav-links a:hover { color: var(--text); }
  .home2-root .nav-cta {
    background: linear-gradient(135deg, var(--orange), var(--red));
    color: white; border: none; padding: 10px 22px;
    border-radius: 24px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: opacity 0.2s, transform 0.2s;
  }
  .home2-root .nav-cta:hover { opacity: 0.88; transform: scale(1.02); }

  .home2-root .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative;
    overflow: hidden;
  }
  .home2-root .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(120deg, #fb5b15 0%, #dc2312 40%, #262626 100%);
    opacity: 0.15;
    z-index: 0;
  }
  .home2-root .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .home2-root .blob-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(251,91,21,0.18) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: float1 8s ease-in-out infinite;
  }
  .home2-root .blob-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(220,35,18,0.15) 0%, transparent 70%);
    bottom: 0; right: -80px;
    animation: float2 10s ease-in-out infinite;
  }
  .home2-root .blob-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(251,91,21,0.12) 0%, transparent 70%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: float3 6s ease-in-out infinite;
  }
  @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
  @keyframes float3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.15)} }

  .home2-root .grain-overlay {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 128px;
  }

  .home2-root .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--glass); border: 1px solid var(--glass-border);
    padding: 6px 16px; border-radius: 24px;
    font-size: 12px; font-weight: 500; color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 28px;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s ease both;
  }
  .home2-root .badge-dot {
    width: 6px; height: 6px;
    background: var(--orange); border-radius: 50%;
    animation: pulse-dot 2s ease infinite;
  }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

  .home2-root .hero-headline {
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -2px;
    margin-bottom: 16px;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.1s ease both;
  }
  .home2-root .hero-headline span {
    background: linear-gradient(135deg, var(--orange), var(--red));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .home2-root .hero-subline {
    font-size: clamp(15px, 2vw, 19px);
    color: var(--muted);
    margin-bottom: 48px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 300;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.2s ease both;
    min-height: 28px;
  }
  .home2-root .cursor {
    display: inline-block;
    width: 2px; height: 1em;
    background: var(--orange);
    vertical-align: middle;
    margin-left: 2px;
    animation: blink 0.9s step-end infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .home2-root .search-wrap {
    width: 100%; max-width: 680px;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.3s ease both;
    margin-bottom: 40px;
  }
  .home2-root .search-bar {
    width: 100%;
    height: 64px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 40px;
    display: flex; align-items: center;
    padding: 0 20px;
    gap: 14px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .home2-root .search-bar:focus-within {
    border-color: rgba(251,91,21,0.5);
    box-shadow: 0 0 0 4px rgba(251,91,21,0.1), 0 8px 40px rgba(0,0,0,0.4);
  }
  .home2-root .search-icon { color: var(--muted); font-size: 18px; flex-shrink: 0; }
  .home2-root .search-input {
    flex: 1;
    background: none; border: none; outline: none;
    color: var(--text);
    font-size: 16px; font-family: inherit;
    font-weight: 400;
  }
  .home2-root .search-input::placeholder { color: var(--muted); }
  .home2-root .search-btn {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--orange), var(--red));
    border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    font-size: 18px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .home2-root .search-btn:hover { transform: scale(1.1); box-shadow: 0 0 20px var(--glow); }

  .home2-root .results-grid {
    width: 100%; max-width: 800px;
    position: relative; z-index: 1;
    animation: fadeUp 0.8s 0.4s ease both;
  }
  .home2-root .results-label {
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    color: var(--muted); text-align: left;
    margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .home2-root .results-label::before { content:''; width:16px; height:1px; background:var(--orange); }
  .home2-root .img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .home2-root .img-card {
    aspect-ratio: 4/3;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1px solid var(--glass-border);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: imgAppear 0.4s ease both;
  }
  .home2-root .img-card:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,91,21,0.3);
    z-index: 2;
  }
  .home2-root .img-card img { width: 100%; height: 100%; object-fit: cover; }
  .home2-root .img-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .home2-root .img-card:hover .img-card-overlay { opacity: 1; }
  @keyframes imgAppear {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  .home2-root .section { padding: 96px 24px; position: relative; z-index: 1; }
  .home2-root .section-inner { max-width: 1100px; margin: 0 auto; }
  .home2-root .section-tag {
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    color: var(--orange); letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 12px;
  }
  .home2-root .section-title {
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 700; letter-spacing: -1.5px;
    line-height: 1.1; margin-bottom: 16px;
  }
  .home2-root .section-sub { font-size: 16px; color: var(--muted); max-width: 520px; line-height: 1.6; }

  .home2-root .divider {
    width: 100%; height: 1px;
    background: linear-gradient(to right, transparent, var(--glass-border), transparent);
  }

  .home2-root .memory-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; margin-top: 48px;
  }
  .home2-root .memory-card {
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 20px; padding: 28px;
    backdrop-filter: blur(20px); cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    position: relative; overflow: hidden;
  }
  .home2-root .memory-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(251,91,21,0.25);
    border-color: rgba(251,91,21,0.25);
  }
  .home2-root .memory-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(251,91,21,0.06), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .home2-root .memory-card:hover::before { opacity: 1; }
  .home2-root .memory-query { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--orange); margin-bottom: 16px; }
  .home2-root .memory-label { font-size: 16px; font-weight: 600; margin-bottom: 16px; line-height: 1.3; }
  .home2-root .memory-preview { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .home2-root .memory-thumb { aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border); }
  .home2-root .memory-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .home2-root .how-flow {
    display: flex; align-items: flex-start;
    gap: 0; margin-top: 64px; position: relative;
  }
  .home2-root .how-step { flex: 1; text-align: center; position: relative; padding: 0 20px; }
  .home2-root .how-step::after {
    content: ''; position: absolute;
    top: 40px; right: -20px;
    width: 40px; height: 1px;
    background: linear-gradient(to right, var(--orange), transparent);
    z-index: 1;
  }
  .home2-root .how-step:last-child::after { display: none; }
  .home2-root .how-icon-wrap {
    width: 80px; height: 80px; background: var(--glass);
    border: 1px solid var(--glass-border); border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; margin: 0 auto 20px;
    backdrop-filter: blur(12px);
    transition: border-color 0.3s, box-shadow 0.3s;
    position: relative; z-index: 2;
  }
  .home2-root .how-step:hover .how-icon-wrap {
    border-color: rgba(251,91,21,0.4);
    box-shadow: 0 0 30px var(--glow);
  }
  .home2-root .how-step-num { font-size: 10px; font-family: 'JetBrains Mono', monospace; color: var(--orange); letter-spacing: 2px; margin-bottom: 8px; }
  .home2-root .how-step-title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .home2-root .how-step-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .home2-root .how-sources { display: flex; justify-content: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .home2-root .source-pill {
    background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border);
    border-radius: 20px; padding: 4px 12px;
    font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--muted);
  }

  .home2-root .use-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; margin-top: 48px;
  }
  .home2-root .use-card {
    background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 20px; padding: 36px 28px;
    backdrop-filter: blur(20px);
    transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
    position: relative; overflow: hidden;
  }
  .home2-root .use-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 28px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(251,91,21,0.3);
    border-color: rgba(251,91,21,0.3);
  }
  .home2-root .use-card-icon { font-size: 36px; margin-bottom: 20px; }
  .home2-root .use-card-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
  .home2-root .use-card-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .home2-root .use-card-glow {
    position: absolute; width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(251,91,21,0.12), transparent 70%);
    bottom: -60px; right: -60px; pointer-events: none;
  }

  .home2-root .cta-section {
    padding: 120px 24px; text-align: center;
    position: relative; overflow: hidden;
    background: linear-gradient(180deg, transparent, rgba(251,91,21,0.06));
  }
  .home2-root .cta-title {
    font-size: clamp(30px, 5vw, 58px);
    font-weight: 700; letter-spacing: -2px;
    line-height: 1.1; margin-bottom: 20px;
  }
  .home2-root .cta-sub {
    font-size: 16px; color: var(--muted);
    margin-bottom: 40px; max-width: 440px;
    margin-left: auto; margin-right: auto; line-height: 1.6;
  }
  .home2-root .cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, var(--orange), var(--red));
    color: white; border: none;
    padding: 18px 40px; border-radius: 40px;
    font-size: 17px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    letter-spacing: -0.3px;
  }
  .home2-root .cta-btn:hover {
    opacity: 0.9; transform: scale(1.04);
    box-shadow: 0 16px 50px var(--glow);
  }
  .home2-root .cta-bg-circle {
    position: absolute; width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(251,91,21,0.08), transparent 60%);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .home2-root .footer {
    border-top: 1px solid var(--glass-border);
    padding: 32px 48px;
    display: flex; align-items: center;
    justify-content: space-between;
    position: relative; z-index: 1;
  }
  .home2-root .footer-logo { font-size: 15px; font-weight: 700; }
  .home2-root .footer-copy { font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }

  @media (max-width: 768px) {
    .home2-root .navbar { padding: 14px 20px; }
    .home2-root .nav-links { display: none; }
    .home2-root .img-grid { grid-template-columns: repeat(2, 1fr); }
    .home2-root .how-flow { flex-direction: column; gap: 40px; }
    .home2-root .how-step::after { display: none; }
    .home2-root .footer { flex-direction: column; gap: 12px; text-align: center; }
  }
  @media (max-width: 480px) {
    .home2-root .img-grid { grid-template-columns: 1fr; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <div className="nav-logo-icon">⚡</div>
        FlashIndex
      </div>
      <div className="nav-links">
        <a href="#how">How it works</a>
        <a href="#use-cases">Use cases</a>
        <a href="#demo">Demo</a>
      </div>
      <button className="nav-cta">Get Early Access</button>
    </nav>
  );
}

function HeroSearchDemo() {
  const typedText = useTypingAnimation(TYPING_PHRASES);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const imgs = getImages(query);
      setImages(imgs);
      setShowResults(imgs.length > 0);
    } else {
      setShowResults(false);
    }
  }, [query]);

  return (
    <section className="hero" id="demo">
      <div className="hero-bg" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="hero-badge">
        <span className="badge-dot" />
        AI-Powered Memory Search · Now in Beta
      </div>

      <h1 className="hero-headline">
        Find anything<br />
        <span>you remember.</span>
      </h1>

      <p className="hero-subline">
        "{typedText}"<span className="cursor" />
      </p>

      <div className="search-wrap">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Describe what you remember..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn">⚡</button>
        </div>
      </div>

      {showResults ? (
        <div className="results-grid">
          <div className="results-label">
            {images.length} results for "{query}"
          </div>
          <div className="img-grid">
            {images.map((src, i) => (
              <div key={src} className="img-card" style={{ animationDelay: `${i * 60}ms` }}>
                <img src={src} alt={`result ${i + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                <div className="img-card-overlay" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="results-grid" style={{ opacity: 0.28, pointerEvents: "none" }}>
          <div className="results-label">Try typing: sunset · birthday · meeting · presentation · beach</div>
          <div className="img-grid">
            {MOCK_IMAGES.default.map((src, i) => (
              <div key={src} className="img-card" style={{ animationDelay: `${i * 80}ms` }}>
                <img src={src} alt={`placeholder ${i + 1}`} loading="lazy" referrerPolicy="no-referrer" />
                <div className="img-card-overlay" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MemoryExamples() {
  const examples = [
    {
      query: "sunset photo from Goa beach trip",
      label: "That perfect golden hour shot from Goa",
      images: MOCK_IMAGES.sunset.slice(0, 3),
    },
    {
      query: "presentation we showed to Tesla team",
      label: "The Tesla pitch deck from Q3 review",
      images: MOCK_IMAGES.presentation.slice(0, 3),
    },
    {
      query: "video from dad's birthday cake moment",
      label: "Dad blowing out the birthday candles",
      images: MOCK_IMAGES.birthday.slice(0, 3),
    },
  ];

  return (
    <section className="section" id="examples">
      <div className="section-inner">
        <div className="section-tag">Memory Search</div>
        <h2 className="section-title">Just describe the memory.<br />We'll find it.</h2>
        <p className="section-sub">
          No need to remember filenames or folders. Describe what you remember — FlashIndex does the rest.
        </p>
        <div className="memory-cards">
          {examples.map((ex, i) => (
            <div className="memory-card" key={i}>
              <div className="memory-query">→ "{ex.query}"</div>
              <div className="memory-label">{ex.label}</div>
              <div className="memory-preview">
                {ex.images.map((src, j) => (
                  <div className="memory-thumb" key={j}>
                    <img src={src} alt={`memory preview ${j}`} loading="lazy" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "☁️",
      num: "01",
      title: "Connect Sources",
      desc: "Link your Google Drive, Dropbox, SharePoint, and more in seconds.",
      extra: (
        <div className="how-sources">
          {["Google Drive", "Dropbox", "SharePoint"].map((s) => (
            <span className="source-pill" key={s}>{s}</span>
          ))}
        </div>
      ),
    },
    {
      icon: "🧠",
      num: "02",
      title: "Describe the Memory",
      desc: "Type what you remember in plain language — no keywords needed.",
    },
    {
      icon: "⚡",
      num: "03",
      title: "Instant Results",
      desc: "FlashIndex surfaces the exact file, photo, or document in milliseconds.",
    },
  ];

  return (
    <section className="section" id="how">
      <div className="divider" />
      <div className="section-inner" style={{ paddingTop: 96 }}>
        <div className="section-tag">How It Works</div>
        <h2 className="section-title">Three steps to<br />find anything.</h2>
        <div className="how-flow">
          {steps.map((step, i) => (
            <div className="how-step" key={i}>
              <div className="how-icon-wrap">{step.icon}</div>
              <div className="how-step-num">STEP {step.num}</div>
              <div className="how-step-title">{step.title}</div>
              <div className="how-step-desc">{step.desc}</div>
              {step.extra}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      icon: "🖼️",
      title: "Personal",
      desc: "Find any photo, video, or document from your personal cloud — by describing the moment, not the filename.",
    },
    {
      icon: "👥",
      title: "Teams",
      desc: "Search across shared team drives instantly. No more 'where did you save that deck?' moments.",
    },
    {
      icon: "🏢",
      title: "Enterprise",
      desc: "Unlock institutional knowledge. Surface the right document from thousands of files in seconds.",
    },
  ];

  return (
    <section className="section" id="use-cases">
      <div className="divider" />
      <div className="section-inner" style={{ paddingTop: 96 }}>
        <div className="section-tag">Use Cases</div>
        <h2 className="section-title">Built for everyone<br />who forgets file names.</h2>
        <div className="use-cards">
          {cases.map((c, i) => (
            <div className="use-card" key={i}>
              <div className="use-card-icon">{c.icon}</div>
              <div className="use-card-title">{c.title}</div>
              <div className="use-card-desc">{c.desc}</div>
              <div className="use-card-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-bg-circle" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="section-tag" style={{ marginBottom: 20 }}>Ready to Search?</div>
        <h2 className="cta-title">
          Your memory is enough.<br />
          <span style={{
            background: "linear-gradient(135deg, #fb5b15, #dc2312)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            FlashIndex does the rest.
          </span>
        </h2>
        <p className="cta-sub">
          Join thousands already finding their files faster — no more endless scrolling or forgotten filenames.
        </p>
        <button className="cta-btn">⚡ Try FlashIndex Free</button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">⚡ FlashIndex</div>
      <div className="footer-copy">© 2025 FlashIndex · All rights reserved.</div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export function Home2() {
  return (
    <div className="home2-root">
      <style>{styles}</style>
      <div className="grain-overlay" />
      <Navbar />
      <HeroSearchDemo />
      <MemoryExamples />
      <HowItWorks />
      <UseCases />
      <CTASection />
      <Footer />
    </div>
  );
}
