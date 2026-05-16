import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { login as apiLogin, register as apiRegister } from '../api';
import './LoginPage.css';

/* ── Floating particle canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#a78bfa', '#818cf8', '#38bdf8', '#34d399', '#f472b6', '#fbbf24'];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ── Eye icon ── */
const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

/* ── Checkmark icon ── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="check-icon">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Main component ── */
export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState({});
  const [strength, setStrength] = useState(0);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'password') calcStrength(value);
  };

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 6) s++;
    if (val.length >= 10) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength] || '';
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength] || '';

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '' });
    setStrength(0);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await apiLogin(form.email, form.password);
      } else {
        if (!form.name) { setError('Full name is required'); setLoading(false); return; }
        data = await apiRegister(form.name, form.email, form.password);
        setSuccess('Account created! Signing you in…');
      }
      setTimeout(() => login(data.token, data.user), mode === 'register' ? 800 : 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '📊', title: 'Smart Analytics', desc: 'Real-time lead & conversion tracking' },
    { icon: '👥', title: 'Lead Pipeline', desc: 'Organize your entire customer journey' },
    { icon: '📈', title: 'Growth Metrics', desc: 'Monitor KPIs and business performance' },
    { icon: '⚡', title: 'Instant Setup', desc: 'Up and running in under 5 minutes' },
  ];

  const stats = [
    { value: '1K+', label: 'Users' },
    { value: '50K+', label: 'Leads' },
    { value: '95%', label: 'Success' },
  ];

  return (
    <div className="lp-root">
      <ParticleCanvas />

      {/* ── LEFT PANEL ── */}
      <div className="lp-left">
        <div className="lp-left-inner">
          {/* Brand */}
          <div className="lp-brand-row">
            <div className="lp-brand-logo">
              <span>CRM</span>
              <div className="lp-logo-ring" />
            </div>
            <div>
              <h2 className="lp-brand-name">Mini CRM</h2>
              <p className="lp-brand-sub">Your Complete Lead Solution</p>
            </div>
          </div>

          {/* Headline */}
          <div className="lp-headline">
            <h1>
              Manage leads<br />
              <span className="lp-gradient-text">smarter & faster</span>
            </h1>
            <p>Everything you need to track, nurture, and close deals — all in one place.</p>
          </div>

          {/* Feature cards */}
          <div className="lp-features">
            {features.map((f, i) => (
              <div className="lp-feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="lp-feature-icon">{f.icon}</span>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="lp-stats">
            {stats.map((s, i) => (
              <div className="lp-stat" key={i}>
                <span className="lp-stat-val">{s.value}</span>
                <span className="lp-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="lp-testimonial">
            <div className="lp-quote-mark">"</div>
            <p>Mini CRM transformed how we manage leads. Intuitive, fast, and incredibly powerful!</p>
            <div className="lp-testimonial-author">
              <div className="lp-avatar">RB</div>
              <div>
                <strong>Rajesh</strong>
                <small>Frontend Developers</small>
              </div>
              <div className="lp-stars">★★★★★</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-card">
          {/* Card glow orbs */}
          <div className="lp-card-orb lp-card-orb-1" />
          <div className="lp-card-orb lp-card-orb-2" />

          {/* Logo */}
          <div className="lp-card-logo">
            <div className="lp-card-logo-icon">
              <span>CRM</span>
            </div>
            <h1>Mini CRM</h1>
            <p>Client Lead Management System</p>
          </div>

          {/* Tab switcher */}
          <div className="lp-tabs">
            <div
              className="lp-tab-slider"
              style={{ transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)' }}
            />
            <button
              className={`lp-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              className={`lp-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Sign Up
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="lp-alert lp-alert-error">
              <span className="lp-alert-icon">⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="lp-alert lp-alert-success">
              <CheckIcon /> {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="lp-form" noValidate>
            {mode === 'register' && (
              <div className={`lp-field ${focused.name || form.name ? 'lp-field-active' : ''}`}>
                <label htmlFor="name">Full Name</label>
                <div className="lp-input-wrap">
                  <span className="lp-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="rajesh athelli"
                    value={form.name}
                    onChange={handle}
                    onFocus={() => setFocused((f) => ({ ...f, name: true }))}
                    onBlur={() => setFocused((f) => ({ ...f, name: false }))}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className={`lp-field ${focused.email || form.email ? 'lp-field-active' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handle}
                  onFocus={() => setFocused((f) => ({ ...f, email: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, email: false }))}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={`lp-field ${focused.password || form.password ? 'lp-field-active' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>

              {/* Password strength bar (register only) */}
              {mode === 'register' && form.password && (
                <div className="lp-strength">
                  <div className="lp-strength-bars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="lp-strength-bar"
                        style={{ background: n <= strength ? strengthColor : undefined }}
                      />
                    ))}
                  </div>
                  <span className="lp-strength-label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="lp-forgot">
                <button type="button" className="lp-link">Forgot password?</button>
              </div>
            )}

            <button type="submit" className="lp-submit" disabled={loading}>
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <span className="lp-submit-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="lp-divider">
            <span>or continue with</span>
          </div>

          {/* Social buttons (UI only) */}
          <div className="lp-social">
            <button className="lp-social-btn" type="button" aria-label="Google">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="lp-social-btn" type="button" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="lp-switch">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="button"
              className="lp-link lp-link-bold"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
