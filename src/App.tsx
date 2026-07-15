import { useState, useRef, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import QRCode from 'qrcode'
import { SketchPicker } from 'react-color'
import { DICTS, LANGS, detectLang } from './i18n'
import type { Lang, Dict } from './i18n'
import './App.css'

/* ═══════════════════ types ═══════════════════ */

type DotStyle = 'square' | 'rounded' | 'dots' | 'diamond' | 'classy'
type CornerStyle = 'square' | 'rounded' | 'circle' | 'leaf'
type ErrLevel = 'L' | 'M' | 'Q' | 'H'

type QRType =
  | 'website' | 'text' | 'wifi' | 'email' | 'sms'
  | 'phone' | 'vcard' | 'whatsapp' | 'location'

interface StyleCfg {
  fgColor: string
  bgColor: string
  dotStyle: DotStyle
  cornerStyle: CornerStyle
  margin: number
  size: number
  errorLevel: ErrLevel
  label: string
  labelColor: string
  logo: string | null
  logoScale: number
}

const DEFAULT_STYLE: StyleCfg = {
  fgColor: '#101418',
  bgColor: '#ffffff',
  dotStyle: 'square',
  cornerStyle: 'square',
  margin: 3,
  size: 512,
  errorLevel: 'M',
  label: 'Scan me!',
  labelColor: '#101418',
  logo: null,
  logoScale: 0.2,
}

type FormData = Record<string, string>

const TYPE_ICONS: Record<QRType, ReactNode> = {
  website: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" /></svg>,
  text: <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>,
  wifi: <svg viewBox="0 0 24 24"><path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.5 16a6 6 0 0 1 7 0" /><circle cx="12" cy="19.4" r="1.4" fill="currentColor" stroke="none" /></svg>,
  email: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5L12 13l8.5-6.5" /></svg>,
  sms: <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H4l2.2-3.3A8 8 0 1 1 21 12z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeLinecap="round" /></svg>,
  phone: <svg viewBox="0 0 24 24"><path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  vcard: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.5-1.6 1.7-2.4 3-2.4s2.5.8 3 2.4M14.5 10h4M14.5 13.5h4" /></svg>,
  whatsapp: <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9 8.5c0 4 2.5 6.5 6.5 6.5l.9-1.8-2-1.2-1 .8a5.3 5.3 0 0 1-2.2-2.2l.8-1-1.2-2z" /></svg>,
  location: <svg viewBox="0 0 24 24"><path d="M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
}

const TYPE_ORDER: QRType[] = ['website', 'wifi', 'vcard', 'email', 'sms', 'phone', 'whatsapp', 'location', 'text']

/* ═══════════════════ payload builders ═══════════════════ */

function buildPayload(type: QRType, d: FormData): string {
  const esc = (s: string) => (s || '').replace(/([\\;,:"])/g, '\\$1')
  switch (type) {
    case 'website': return d.url || ''
    case 'text': return d.text || ''
    case 'wifi':
      return d.ssid ? `WIFI:T:${d.security || 'WPA'};S:${esc(d.ssid)};P:${esc(d.password || '')};${d.hidden === 'true' ? 'H:true;' : ''};` : ''
    case 'email': {
      if (!d.to) return ''
      const q = new URLSearchParams()
      if (d.subject) q.set('subject', d.subject)
      if (d.body) q.set('body', d.body)
      const qs = q.toString()
      return `mailto:${d.to}${qs ? '?' + qs.replace(/\+/g, '%20') : ''}`
    }
    case 'sms': return d.number ? `SMSTO:${d.number}:${d.message || ''}` : ''
    case 'phone': return d.number ? `tel:${d.number}` : ''
    case 'whatsapp': {
      if (!d.number) return ''
      const n = d.number.replace(/[^\d]/g, '')
      return `https://wa.me/${n}${d.message ? '?text=' + encodeURIComponent(d.message) : ''}`
    }
    case 'location':
      return d.lat && d.lng ? `geo:${d.lat},${d.lng}`
        : d.query ? `https://maps.google.com/?q=${encodeURIComponent(d.query)}` : ''
    case 'vcard': {
      if (!d.firstName && !d.lastName) return ''
      const lines = ['BEGIN:VCARD', 'VERSION:3.0',
        `N:${esc(d.lastName || '')};${esc(d.firstName || '')};;;`,
        `FN:${esc([d.firstName, d.lastName].filter(Boolean).join(' '))}`]
      if (d.org) lines.push(`ORG:${esc(d.org)}`)
      if (d.title) lines.push(`TITLE:${esc(d.title)}`)
      if (d.phone) lines.push(`TEL;TYPE=CELL:${d.phone}`)
      if (d.email) lines.push(`EMAIL:${d.email}`)
      if (d.url) lines.push(`URL:${d.url}`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
  }
}

/* ═══════════════════ QR canvas renderer ═══════════════════ */

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
  ctx.closePath()
}

function leafPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + w - r)
  ctx.arcTo(x + w, y + w, x + w - r, y + w, r)
  ctx.lineTo(x, y + w)
  ctx.closePath()
}

function drawQR(canvas: HTMLCanvasElement, text: string, cfg: StyleCfg, logoImg: HTMLImageElement | null) {
  const qr = QRCode.create(text, { errorCorrectionLevel: cfg.errorLevel })
  const count = qr.modules.size
  const data = qr.modules.data
  const s = cfg.size
  canvas.width = s
  canvas.height = s
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = cfg.bgColor
  ctx.fillRect(0, 0, s, s)

  const marginPx = (cfg.margin * s) / (count + cfg.margin * 2)
  const cell = (s - marginPx * 2) / count
  const dark = (r: number, c: number) => data[r * count + c] === 1
  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7)

  ctx.fillStyle = cfg.fgColor
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!dark(r, c) || inFinder(r, c)) continue
      const x = marginPx + c * cell
      const y = marginPx + r * cell
      switch (cfg.dotStyle) {
        case 'dots':
          ctx.beginPath()
          ctx.arc(x + cell / 2, y + cell / 2, cell * 0.44, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'rounded':
          rr(ctx, x + cell * 0.04, y + cell * 0.04, cell * 0.92, cell * 0.92, cell * 0.3)
          ctx.fill()
          break
        case 'diamond': {
          ctx.save()
          ctx.translate(x + cell / 2, y + cell / 2)
          ctx.rotate(Math.PI / 4)
          const w = cell * 0.68
          ctx.fillRect(-w / 2, -w / 2, w, w)
          ctx.restore()
          break
        }
        case 'classy': {
          const p = cell * 0.04, w = cell * 0.92, rad = cell * 0.42
          ctx.beginPath()
          ctx.moveTo(x + p, y + p)
          ctx.lineTo(x + p + w - rad, y + p)
          ctx.arcTo(x + p + w, y + p, x + p + w, y + p + rad, rad)
          ctx.lineTo(x + p + w, y + p + w)
          ctx.lineTo(x + p + rad, y + p + w)
          ctx.arcTo(x + p, y + p + w, x + p, y + p + w - rad, rad)
          ctx.closePath()
          ctx.fill()
          break
        }
        default:
          ctx.fillRect(x, y, cell + 0.5, cell + 0.5)
      }
    }
  }

  const finders: [number, number][] = [[0, 0], [0, count - 7], [count - 7, 0]]
  for (const [fr, fc] of finders) {
    const x = marginPx + fc * cell
    const y = marginPx + fr * cell
    const outer = cell * 7
    const ring = cell
    const st = cfg.cornerStyle
    const oR = st === 'circle' ? outer / 2 : st === 'rounded' ? outer * 0.28 : st === 'leaf' ? outer * 0.42 : 0

    ctx.fillStyle = cfg.fgColor
    if (st === 'leaf') {
      leafPath(ctx, x, y, outer, oR); ctx.fill()
      ctx.fillStyle = cfg.bgColor
      leafPath(ctx, x + ring, y + ring, outer - ring * 2, Math.max(0, oR - ring)); ctx.fill()
    } else {
      rr(ctx, x, y, outer, outer, oR); ctx.fill()
      ctx.fillStyle = cfg.bgColor
      rr(ctx, x + ring, y + ring, outer - ring * 2, outer - ring * 2, Math.max(0, oR - ring)); ctx.fill()
    }
    ctx.fillStyle = cfg.fgColor
    const eye = cell * 3
    const ex = x + cell * 2, ey = y + cell * 2
    const eR = st === 'circle' ? eye / 2 : st === 'rounded' ? eye * 0.28 : st === 'leaf' ? eye * 0.42 : 0
    if (st === 'leaf') { leafPath(ctx, ex, ey, eye, eR); ctx.fill() }
    else { rr(ctx, ex, ey, eye, eye, eR); ctx.fill() }
  }

  if (logoImg) {
    const lw = s * cfg.logoScale
    const pad = lw * 0.14
    const lx = (s - lw) / 2, ly = (s - lw) / 2
    ctx.fillStyle = cfg.bgColor
    rr(ctx, lx - pad, ly - pad, lw + pad * 2, lw + pad * 2, lw * 0.2)
    ctx.fill()
    ctx.drawImage(logoImg, lx, ly, lw, lw)
  }
}

/* ═══════════════════ small UI pieces ═══════════════════ */

function DotThumb({ style }: { style: DotStyle }) {
  const cells = [[0, 0], [2, 0], [3, 0], [0, 1], [1, 1], [3, 1], [1, 2], [2, 2], [0, 3], [2, 3], [3, 3]]
  const u = 7
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      {cells.map(([x, y], i) => {
        const px = 2 + x * u, py = 2 + y * u
        if (style === 'dots') return <circle key={i} cx={px + u / 2 - 0.5} cy={py + u / 2 - 0.5} r={u / 2 - 0.8} fill="currentColor" />
        if (style === 'rounded') return <rect key={i} x={px} y={py} width={u - 1} height={u - 1} rx={2.2} fill="currentColor" />
        if (style === 'diamond') return <rect key={i} x={px + 0.5} y={py + 0.5} width={u - 2.4} height={u - 2.4} fill="currentColor" transform={`rotate(45 ${px + u / 2 - 0.5} ${py + u / 2 - 0.5})`} />
        if (style === 'classy') return <path key={i} d={`M${px} ${py + u - 1} v${-(u - 3.2)} q0 -2.2 2.2 -2.2 h${u - 3.2 - 1} v${u - 3.2} q0 2.2 -2.2 2.2 z`} fill="currentColor" />
        return <rect key={i} x={px} y={py} width={u - 1} height={u - 1} fill="currentColor" />
      })}
    </svg>
  )
}

function CornerThumb({ style }: { style: CornerStyle }) {
  const r = style === 'circle' ? 11 : style === 'rounded' ? 7 : 0
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      {style === 'leaf'
        ? <path d="M4 13 v-9 h9 a15 15 0 0 1 15 15 v9 h-9 a15 15 0 0 1 -15 -15 z" fill="none" stroke="currentColor" strokeWidth="3.4" />
        : <rect x="4" y="4" width="24" height="24" rx={r} fill="none" stroke="currentColor" strokeWidth="3.4" />}
      <rect x="12" y="12" width="8" height="8" rx={style === 'circle' ? 4 : style === 'square' ? 0 : 2} fill="currentColor" />
    </svg>
  )
}

function Section({ icon, title, desc, children, defaultOpen = false }: {
  icon: ReactNode; title: string; desc: string; children: ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`section${open ? ' open' : ''}`}>
      <button className="section-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="section-icon" aria-hidden="true">{icon}</span>
        <span className="section-meta">
          <span className="section-title">{title}</span>
          <span className="section-desc">{desc}</span>
        </span>
        <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="field" ref={ref}>
      <label>{label}</label>
      <div className="color-row">
        <input className="hex-input" type="text" value={value} maxLength={7} onChange={e => onChange(e.target.value)} />
        <button className="swatch" style={{ background: value }} onClick={() => setOpen(o => !o)} aria-label={label} />
      </div>
      {open && <div className="popover"><SketchPicker color={value} onChange={c => onChange(c.hex)} disableAlpha /></div>}
    </div>
  )
}

function TextInput({ label, value, onChange, placeholder, required, max, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; max?: number; type?: string
}) {
  return (
    <div className="field">
      <div className="label-row">
        <label>{label}{required && <span className="req"> *</span>}</label>
        {max && <span className="counter">{value.length}/{max}</span>}
      </div>
      <input type={type} value={value} maxLength={max}
        onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

/* ═══════════════════ step 2 forms ═══════════════════ */

function ContentForm({ type, data, set, t }: { type: QRType; data: FormData; set: (k: string, v: string) => void; t: Dict }) {
  const g = (k: string) => data[k] || ''
  const f = t.forms
  switch (type) {
    case 'website': return (
      <TextInput label={f.website.url} required value={g('url')} onChange={v => set('url', v)} placeholder={f.website.urlPh} type="url" />
    )
    case 'text': return (
      <div className="field">
        <div className="label-row"><label>{f.text.label}<span className="req"> *</span></label><span className="counter">{g('text').length}/500</span></div>
        <textarea rows={5} value={g('text')} maxLength={500} onChange={e => set('text', e.target.value)} placeholder={f.text.ph} />
      </div>
    )
    case 'wifi': return (<>
      <TextInput label={f.wifi.ssid} required value={g('ssid')} onChange={v => set('ssid', v)} placeholder={f.wifi.ssidPh} />
      <TextInput label={f.wifi.pass} value={g('password')} onChange={v => set('password', v)} placeholder="••••••••" />
      <div className="field">
        <label>{f.wifi.security}</label>
        <div className="seg">
          {[['WPA', f.wifi.wpa], ['WEP', f.wifi.wep], ['nopass', f.wifi.none]].map(([v, l]) => (
            <button key={v} className={`seg-btn${(g('security') || 'WPA') === v ? ' on' : ''}`} onClick={() => set('security', v)}>{l}</button>
          ))}
        </div>
      </div>
    </>)
    case 'email': return (<>
      <TextInput label={f.email.to} required value={g('to')} onChange={v => set('to', v)} placeholder="jan@example.com" type="email" />
      <TextInput label={f.email.subject} value={g('subject')} onChange={v => set('subject', v)} placeholder={f.email.subjectPh} max={80} />
      <div className="field">
        <div className="label-row"><label>{f.email.body}</label><span className="counter">{g('body').length}/300</span></div>
        <textarea rows={3} value={g('body')} maxLength={300} onChange={e => set('body', e.target.value)} placeholder={f.email.bodyPh} />
      </div>
    </>)
    case 'sms': return (<>
      <TextInput label={f.sms.number} required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
      <div className="field">
        <div className="label-row"><label>{f.sms.message}</label><span className="counter">{g('message').length}/160</span></div>
        <textarea rows={3} value={g('message')} maxLength={160} onChange={e => set('message', e.target.value)} placeholder={f.sms.messagePh} />
      </div>
    </>)
    case 'phone': return (
      <TextInput label={f.phone.number} required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
    )
    case 'whatsapp': return (<>
      <TextInput label={f.whatsapp.number} required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
      <div className="field">
        <div className="label-row"><label>{f.whatsapp.message}</label><span className="counter">{g('message').length}/200</span></div>
        <textarea rows={3} value={g('message')} maxLength={200} onChange={e => set('message', e.target.value)} placeholder={f.whatsapp.messagePh} />
      </div>
    </>)
    case 'location': return (<>
      <TextInput label={f.location.query} value={g('query')} onChange={v => set('query', v)} placeholder={f.location.queryPh} />
      <p className="hint">{f.location.or}</p>
      <div className="color-grid">
        <TextInput label={f.location.lat} value={g('lat')} onChange={v => set('lat', v)} placeholder="50.0617" />
        <TextInput label={f.location.lng} value={g('lng')} onChange={v => set('lng', v)} placeholder="19.9373" />
      </div>
    </>)
    case 'vcard': return (<>
      <div className="color-grid">
        <TextInput label={f.vcard.first} required value={g('firstName')} onChange={v => set('firstName', v)} placeholder={f.vcard.firstPh} />
        <TextInput label={f.vcard.last} value={g('lastName')} onChange={v => set('lastName', v)} placeholder={f.vcard.lastPh} />
      </div>
      <div className="color-grid">
        <TextInput label={f.vcard.org} value={g('org')} onChange={v => set('org', v)} placeholder={f.vcard.orgPh} />
        <TextInput label={f.vcard.title} value={g('title')} onChange={v => set('title', v)} placeholder="CEO" />
      </div>
      <TextInput label={f.vcard.phone} value={g('phone')} onChange={v => set('phone', v)} placeholder="+48 600 000 000" type="tel" />
      <TextInput label={f.vcard.email} value={g('email')} onChange={v => set('email', v)} placeholder="jan@example.com" type="email" />
      <TextInput label={f.vcard.url} value={g('url')} onChange={v => set('url', v)} placeholder="https://…" type="url" />
    </>)
  }
}

/* ═══════════════════ landing page ═══════════════════ */

function HeroQR() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    drawQR(ref.current, 'https://typerly.andrzejmich.ch',
      { ...DEFAULT_STYLE, size: 360, dotStyle: 'rounded', cornerStyle: 'rounded', fgColor: '#16232c' }, null)
  }, [])
  return <canvas ref={ref} />
}

function Landing({ onStart, t }: { onStart: () => void; t: Dict }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const L = t.landing
  const features = [
    { icon: '🎨', title: L.f1t, desc: L.f1d },
    { icon: '🖼️', title: L.f2t, desc: L.f2d },
    { icon: '📦', title: L.f3t, desc: L.f3d },
    { icon: '⬇️', title: L.f4t, desc: L.f4d },
    { icon: '🔒', title: L.f5t, desc: L.f5d },
    { icon: '⚡', title: L.f6t, desc: L.f6d },
  ]
  const faq = [
    { q: L.faq1q, a: L.faq1a }, { q: L.faq2q, a: L.faq2a }, { q: L.faq3q, a: L.faq3a },
    { q: L.faq4q, a: L.faq4a }, { q: L.faq5q, a: L.faq5a },
  ]
  return (
    <div className="landing">
      {/* hero */}
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">{L.badge}</span>
          <h1>{L.h1}</h1>
          <p>{L.sub}</p>
          <div className="hero-cta">
            <button className="dl-main hero-btn" onClick={onStart}>{L.ctaMain}</button>
            <a className="ghost-btn hero-ghost" href="#cennik">{L.ctaGhost}</a>
          </div>
          <ul className="hero-points">
            <li>✓ {L.p1}</li>
            <li>✓ {L.p2}</li>
            <li>✓ {L.p3}</li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="qr-frame"><HeroQR /></div>
          <div className="scan-label">Scan me!</div>
        </div>
      </section>

      {/* how it works */}
      <section className="how" id="jak">
        <h2>{L.howTitle}</h2>
        <p className="section-sub">{L.howSub}</p>
        <div className="how-grid">
          {[
            { n: '1', t: L.how1t, d: L.how1d },
            { n: '2', t: L.how2t, d: L.how2d },
            { n: '3', t: L.how3t, d: L.how3d },
          ].map(s => (
            <div className="how-card" key={s.n}>
              <span className="how-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features */}
      <section className="features" id="funkcje">
        <h2>{L.featTitle}</h2>
        <p className="section-sub">{L.featSub}</p>
        <div className="feature-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon" aria-hidden="true">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section className="pricing" id="cennik">
        <h2>{L.priceTitle}</h2>
        <p className="section-sub">{L.priceSub}</p>
        <div className="price-grid">
          <div className="price-card">
            <span className="price-name">{L.planPersonal}</span>
            <div className="price-value">0<span> {L.perForever}</span></div>
            <ul>
              <li>✓ {L.pp1}</li>
              <li>✓ {L.pp2}</li>
              <li>✓ {L.pp3}</li>
              <li>✓ {L.pp4}</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>{L.startNow}</button>
          </div>
          <div className="price-card featured">
            <span className="price-tag">{L.popular}</span>
            <span className="price-name">{L.planHobby}</span>
            <div className="price-value">0<span> {L.perMonth}</span></div>
            <ul>
              <li>✓ {L.ph1}</li>
              <li>✓ {L.ph2}</li>
              <li>✓ {L.ph3}</li>
              <li>✓ {L.ph4}</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>{L.startNow}</button>
          </div>
          <div className="price-card">
            <span className="price-name">{L.planPro}</span>
            <div className="price-value">0<span> {L.perYear}</span></div>
            <ul>
              <li>✓ {L.pr1}</li>
              <li>✓ {L.pr2}</li>
              <li>✓ {L.pr3}</li>
              <li>✓ {L.pr4}</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>{L.startNow}</button>
          </div>
        </div>
        <p className="price-note">{L.priceNote}</p>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2>{L.faqTitle}</h2>
        <div className="faq-list">
          {faq.map((f, i) => (
            <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                {f.q}
                <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* bottom CTA */}
      <section className="bottom-cta">
        <h2>{L.bottomTitle}</h2>
        <button className="dl-main hero-btn" onClick={onStart}>{L.ctaMain}</button>
      </section>

      <footer className="site-footer">
        <span>{L.footer1}</span>
        <span>{L.footer2}</span>
      </footer>
    </div>
  )
}

/* ═══════════════════ language switcher ═══════════════════ */

function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const current = LANGS.find(l => l.code === lang)!
  return (
    <div className="lang" ref={ref}>
      <button className="lang-btn" onClick={() => setOpen(o => !o)} aria-label="Language" aria-expanded={open}>
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="lang-menu">
          {LANGS.map(l => (
            <button key={l.code} className={`lang-item${l.code === lang ? ' on' : ''}`}
              onClick={() => { setLang(l.code); setOpen(false) }}>
              <span className="lang-flag">{l.flag}</span> {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════ app ═══════════════════ */

export default function App() {
  const [lang, setLangState] = useState<Lang>(detectLang)
  const t = DICTS[lang]
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('qr-lang', l) } catch { /* ignore */ }
    document.documentElement.lang = l
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const [page, setPage] = useState<'home' | 'studio'>('home')
  const [step, setStep] = useState(1)
  const [qrType, setQrType] = useState<QRType | null>(null)
  const [form, setForm] = useState<FormData>({})
  const [cfg, setCfg] = useState<StyleCfg>(DEFAULT_STYLE)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null)

  const setStyle = useCallback((p: Partial<StyleCfg>) => setCfg(c => ({ ...c, ...p })), [])
  const setField = useCallback((k: string, v: string) => setForm(f => ({ ...f, [k]: v })), [])

  const payload = qrType ? buildPayload(qrType, form) : ''
  const canProceed = payload.length > 0

  useEffect(() => {
    if (!cfg.logo) { setLogoImg(null); return }
    const img = new Image()
    img.onload = () => setLogoImg(img)
    img.src = cfg.logo
  }, [cfg.logo])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !payload) return
    try { drawQR(canvas, payload, cfg, logoImg) } catch { /* invalid mid-typing */ }
  }, [payload, cfg, logoImg, step])

  useEffect(() => { window.scrollTo(0, 0) }, [step])

  const pickType = (t: QRType) => {
    if (t !== qrType) setForm({})
    setQrType(t)
    setStep(2)
  }

  const onLogoFile = (f: File | undefined) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setStyle({ logo: reader.result as string, errorLevel: 'H' })
    reader.readAsDataURL(f)
  }

  const exportCanvas = (): HTMLCanvasElement => {
    const src = canvasRef.current!
    const s = cfg.size
    const labelH = cfg.label ? Math.round(s * 0.14) : 0
    const out = document.createElement('canvas')
    out.width = s
    out.height = s + labelH
    const ctx = out.getContext('2d')!
    ctx.fillStyle = cfg.bgColor
    ctx.fillRect(0, 0, s, s + labelH)
    ctx.drawImage(src, 0, 0)
    if (cfg.label) {
      ctx.fillStyle = cfg.labelColor
      ctx.font = `italic 600 ${Math.round(s * 0.075)}px "Snell Roundhand", "Brush Script MT", "Segoe Script", cursive`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(cfg.label, s / 2, s + labelH / 2)
    }
    return out
  }

  const downloadPng = () => {
    const a = document.createElement('a')
    a.href = exportCanvas().toDataURL('image/png')
    a.download = `qr-${qrType}.png`
    a.click()
  }
  const downloadSvg = () => {
    QRCode.toString(payload, {
      type: 'svg', margin: cfg.margin,
      color: { dark: cfg.fgColor, light: cfg.bgColor },
      errorCorrectionLevel: cfg.errorLevel,
    }).then(svg => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      a.download = `qr-${qrType}.svg`
      a.click()
    })
  }
  const copy = async () => {
    exportCanvas().toBlob(async blob => {
      if (!blob) return
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const brand = (
    <button className="brand" onClick={() => setPage('home')} aria-label={t.brandHome}>
      <div className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="18" height="18">
          <rect x="1" y="1" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="4" y="4" width="2" height="2" fill="currentColor" />
          <rect x="11" y="1" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="4" width="2" height="2" fill="currentColor" />
          <rect x="1" y="11" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="4" y="14" width="2" height="2" fill="currentColor" />
          <rect x="11" y="11" width="3" height="3" fill="currentColor" />
          <rect x="16" y="16" width="3" height="3" fill="currentColor" />
          <rect x="13" y="13.5" width="3" height="3" fill="currentColor" />
        </svg>
      </div>
      <span className="brand-name">QR Studio</span>
    </button>
  )

  if (page === 'home') {
    return (
      <div className="app">
        <header className="steps home-nav">
          {brand}
          <nav className="nav-links" aria-label="Nav">
            <a href="#jak">{t.nav.how}</a>
            <a href="#funkcje">{t.nav.features}</a>
            <a href="#cennik">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <div className="nav-actions">
            <LangSwitcher lang={lang} setLang={setLang} />
            <button className="dl-main nav-cta" onClick={() => setPage('studio')}>{t.nav.cta}</button>
          </div>
        </header>
        <Landing t={t} onStart={() => { setPage('studio'); window.scrollTo(0, 0) }} />
      </div>
    )
  }

  return (
    <div className="app">
      {/* ═══ steps bar ═══ */}
      <header className="steps">
        {brand}
        <nav className="crumbs" aria-label="Steps">
          {[
            { n: 1, l: t.steps.s1 },
            { n: 2, l: t.steps.s2 },
            { n: 3, l: t.steps.s3 },
          ].map(({ n, l }, i) => (
            <span key={n} style={{ display: 'contents' }}>
              {i > 0 && <span className="crumb-sep" aria-hidden="true">›</span>}
              <button
                className={`crumb${step === n ? ' current' : ''}${step > n ? ' done' : ''}`}
                disabled={n > step && !(n === 2 && qrType) && !(n === 3 && canProceed)}
                onClick={() => { if (n < step || (n === 2 && qrType) || (n === 3 && canProceed)) setStep(n) }}
              >
                <span className="crumb-num">{step > n ? '✓' : n}</span> {l}
              </button>
            </span>
          ))}
        </nav>
        <LangSwitcher lang={lang} setLang={setLang} />
      </header>

      {/* ═══ STEP 1: choose type ═══ */}
      {step === 1 && (
        <main className="step1">
          <div className="step1-head">
            <h1>{t.step1.title}</h1>
            <p>{t.step1.sub}</p>
          </div>
          <div className="type-grid">
            {TYPE_ORDER.map(qt => (
              <button key={qt} className={`type-card${qrType === qt ? ' on' : ''}`} onClick={() => pickType(qt)}>
                <span className="type-icon">{TYPE_ICONS[qt]}</span>
                <span className="type-title">{t.types[qt].title}</span>
                <span className="type-desc">{t.types[qt].desc}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ═══ STEP 2: content ═══ */}
      {step === 2 && qrType && (
        <main className="step2">
          <div className="content-card">
            <div className="content-head">
              <span className="section-icon big">{TYPE_ICONS[qrType]}</span>
              <div>
                <h2>{t.types[qrType].title}</h2>
                <p>{t.types[qrType].desc}</p>
              </div>
            </div>
            <div className="content-form">
              <ContentForm type={qrType} data={form} set={setField} t={t} />
            </div>
          </div>
          <aside className="side-preview">
            {canProceed ? (
              <>
                <div className="mini-frame"><canvas ref={canvasRef} /></div>
                <p className="hint center">{t.step2.livePreview}</p>
              </>
            ) : (
              <div className="side-empty">
                <span className="section-icon big">{TYPE_ICONS[qrType]}</span>
                <p>{t.step2.fillPrompt}</p>
              </div>
            )}
          </aside>
          <footer className="wizard-footer">
            <button className="ghost-btn back" onClick={() => setStep(1)}>{t.step2.back}</button>
            <button className="dl-main next" disabled={!canProceed} onClick={() => setStep(3)}>
              {t.step2.next}
            </button>
          </footer>
        </main>
      )}

      {/* ═══ STEP 3: customize ═══ */}
      {step === 3 && qrType && (
        <main className="step3">
          <div className="col-left">
            <Section
              icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4z" /></svg>}
              title={t.step3.modTitle} desc={t.step3.modDesc} defaultOpen>
              <div className="field">
                <label>{t.step3.moduleStyle}</label>
                <div className="tiles">
                  {(['square', 'rounded', 'dots', 'diamond', 'classy'] as DotStyle[]).map(st => (
                    <button key={st} className={`tile${cfg.dotStyle === st ? ' on' : ''}`}
                      onClick={() => setStyle({ dotStyle: st })} aria-label={`Styl: ${st}`}>
                      <DotThumb style={st} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>{t.step3.cornerShape}</label>
                <div className="tiles">
                  {(['square', 'rounded', 'circle', 'leaf'] as CornerStyle[]).map(st => (
                    <button key={st} className={`tile${cfg.cornerStyle === st ? ' on' : ''}`}
                      onClick={() => setStyle({ cornerStyle: st })} aria-label={st}>
                      <CornerThumb style={st} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="color-grid">
                <ColorField label={t.step3.qrColor} value={cfg.fgColor} onChange={v => setStyle({ fgColor: v })} />
                <ColorField label={t.step3.bgColor} value={cfg.bgColor} onChange={v => setStyle({ bgColor: v })} />
              </div>
              <div className="field">
                <div className="label-row">
                  <label>{t.step3.labelText}</label>
                  <span className="counter">{cfg.label.length}/20</span>
                </div>
                <input type="text" value={cfg.label} maxLength={20}
                  onChange={e => setStyle({ label: e.target.value })} placeholder={t.step3.labelPh} />
              </div>
              {cfg.label && (
                <ColorField label={t.step3.labelColor} value={cfg.labelColor} onChange={v => setStyle({ labelColor: v })} />
              )}
            </Section>

            <Section
              icon={<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="M4 17l5-5 4 4 3-3 4 4" /></svg>}
              title={t.step3.logoTitle} desc={t.step3.logoDesc}>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml"
                hidden onChange={e => onLogoFile(e.target.files?.[0])} />
              {cfg.logo ? (
                <div className="logo-loaded">
                  <img src={cfg.logo} alt="Logo" />
                  <div className="logo-actions">
                    <button className="ghost-btn" onClick={() => fileRef.current?.click()}>{t.step3.change}</button>
                    <button className="ghost-btn danger" onClick={() => setStyle({ logo: null })}>{t.step3.remove}</button>
                  </div>
                </div>
              ) : (
                <button className="dropzone" onClick={() => fileRef.current?.click()}>
                  <strong>{t.step3.logoUpload}</strong>
                  <span>{t.step3.logoHint}</span>
                </button>
              )}
              {cfg.logo && (
                <div className="field">
                  <div className="label-row">
                    <label>{t.step3.logoScale}</label>
                    <span className="counter">{Math.round(cfg.logoScale * 100)}%</span>
                  </div>
                  <input type="range" min={0.12} max={0.3} step={0.01} value={cfg.logoScale}
                    onChange={e => setStyle({ logoScale: +e.target.value })} />
                  <p className="hint">{t.step3.logoNote}</p>
                </div>
              )}
            </Section>

            <Section
              icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.06-.4.1-.8.1-1.2z" /></svg>}
              title={t.step3.paramsTitle} desc={t.step3.paramsDesc}>
              <div className="field">
                <label>{t.step3.errorLevel}</label>
                <div className="seg">
                  {(['L', 'M', 'Q', 'H'] as ErrLevel[]).map(l => (
                    <button key={l} className={`seg-btn${cfg.errorLevel === l ? ' on' : ''}`}
                      onClick={() => setStyle({ errorLevel: l })}>{l}</button>
                  ))}
                </div>
                <p className="hint">
                  {cfg.errorLevel === 'L' && t.step3.errL}
                  {cfg.errorLevel === 'M' && t.step3.errM}
                  {cfg.errorLevel === 'Q' && t.step3.errQ}
                  {cfg.errorLevel === 'H' && t.step3.errH}
                </p>
              </div>
              <div className="field">
                <div className="label-row"><label>{t.step3.margin}</label><span className="counter">{cfg.margin}</span></div>
                <input type="range" min={0} max={8} value={cfg.margin}
                  onChange={e => setStyle({ margin: +e.target.value })} />
              </div>
              <div className="field">
                <div className="label-row"><label>{t.step3.exportSize}</label><span className="counter">{cfg.size} px</span></div>
                <input type="range" min={256} max={2048} step={64} value={cfg.size}
                  onChange={e => setStyle({ size: +e.target.value })} />
              </div>
            </Section>
          </div>

          <div className="col-right">
            <div className="preview-card">
              <div className="qr-frame"><canvas ref={canvasRef} /></div>
              {cfg.label && <div className="scan-label" style={{ color: cfg.labelColor }}>{cfg.label}</div>}
            </div>

            <div className="tip-card">
              <div className="tip-bulb" aria-hidden="true">💡</div>
              <div>
                <strong>{t.step3.tipTitle}</strong>
                <p>{t.step3.tipBefore} <b>{t.step3.tipBold}</b> {t.step3.tipAfter}</p>
              </div>
            </div>

            <div className="dl-stack">
              <button className="dl-main" onClick={downloadPng}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M3.5 16.5h13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.step3.download}
              </button>
              <div className="dl-secondary">
                <button className="ghost-btn" onClick={downloadSvg}>SVG</button>
                <button className="ghost-btn" onClick={copy}>{copied ? t.step3.copied : t.step3.copy}</button>
                <button className="ghost-btn" onClick={() => setCfg(DEFAULT_STYLE)}>{t.step3.resetStyle}</button>
              </div>
              <button className="ghost-btn back-link" onClick={() => setStep(2)}>{t.step3.backToData}</button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
