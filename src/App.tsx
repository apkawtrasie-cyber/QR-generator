import { useState, useRef, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import QRCode from 'qrcode'
import { SketchPicker } from 'react-color'
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

const TYPE_META: Record<QRType, { title: string; desc: string; icon: ReactNode }> = {
  website: {
    title: 'Strona WWW',
    desc: 'Otwórz stronę lub landing page',
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" /></svg>,
  },
  text: {
    title: 'Tekst',
    desc: 'Dowolna wiadomość tekstowa',
    icon: <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>,
  },
  wifi: {
    title: 'Wi-Fi',
    desc: 'Połącz z siecią bez wpisywania hasła',
    icon: <svg viewBox="0 0 24 24"><path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.5 16a6 6 0 0 1 7 0" /><circle cx="12" cy="19.4" r="1.4" fill="currentColor" stroke="none" /></svg>,
  },
  email: {
    title: 'E-mail',
    desc: 'Otwórz gotową wiadomość e-mail',
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5L12 13l8.5-6.5" /></svg>,
  },
  sms: {
    title: 'SMS',
    desc: 'Wyślij gotowego SMS-a',
    icon: <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H4l2.2-3.3A8 8 0 1 1 21 12z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeLinecap="round" /></svg>,
  },
  phone: {
    title: 'Telefon',
    desc: 'Zadzwoń pod wskazany numer',
    icon: <svg viewBox="0 0 24 24"><path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  },
  vcard: {
    title: 'Wizytówka',
    desc: 'Zapisz kontakt jednym skanem',
    icon: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.5-1.6 1.7-2.4 3-2.4s2.5.8 3 2.4M14.5 10h4M14.5 13.5h4" /></svg>,
  },
  whatsapp: {
    title: 'WhatsApp',
    desc: 'Rozpocznij czat na WhatsApp',
    icon: <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /><path d="M9 8.5c0 4 2.5 6.5 6.5 6.5l.9-1.8-2-1.2-1 .8a5.3 5.3 0 0 1-2.2-2.2l.8-1-1.2-2z" /></svg>,
  },
  location: {
    title: 'Lokalizacja',
    desc: 'Otwórz miejsce w mapach',
    icon: <svg viewBox="0 0 24 24"><path d="M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  },
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

function ContentForm({ type, data, set }: { type: QRType; data: FormData; set: (k: string, v: string) => void }) {
  const g = (k: string) => data[k] || ''
  switch (type) {
    case 'website': return (
      <TextInput label="Adres strony" required value={g('url')} onChange={v => set('url', v)} placeholder="https://twojastrona.pl" type="url" />
    )
    case 'text': return (
      <div className="field">
        <div className="label-row"><label>Tekst<span className="req"> *</span></label><span className="counter">{g('text').length}/500</span></div>
        <textarea rows={5} value={g('text')} maxLength={500} onChange={e => set('text', e.target.value)} placeholder="Wpisz dowolną treść…" />
      </div>
    )
    case 'wifi': return (<>
      <TextInput label="Nazwa sieci (SSID)" required value={g('ssid')} onChange={v => set('ssid', v)} placeholder="MojaSiec" />
      <TextInput label="Hasło" value={g('password')} onChange={v => set('password', v)} placeholder="••••••••" />
      <div className="field">
        <label>Zabezpieczenie</label>
        <div className="seg">
          {[['WPA', 'WPA/WPA2'], ['WEP', 'WEP'], ['nopass', 'Brak']].map(([v, l]) => (
            <button key={v} className={`seg-btn${(g('security') || 'WPA') === v ? ' on' : ''}`} onClick={() => set('security', v)}>{l}</button>
          ))}
        </div>
      </div>
    </>)
    case 'email': return (<>
      <TextInput label="Adres e-mail odbiorcy" required value={g('to')} onChange={v => set('to', v)} placeholder="jan@przyklad.pl" type="email" />
      <TextInput label="Temat" value={g('subject')} onChange={v => set('subject', v)} placeholder="Temat wiadomości" max={80} />
      <div className="field">
        <div className="label-row"><label>Treść</label><span className="counter">{g('body').length}/300</span></div>
        <textarea rows={3} value={g('body')} maxLength={300} onChange={e => set('body', e.target.value)} placeholder="Treść wiadomości…" />
      </div>
    </>)
    case 'sms': return (<>
      <TextInput label="Numer telefonu" required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
      <div className="field">
        <div className="label-row"><label>Wiadomość</label><span className="counter">{g('message').length}/160</span></div>
        <textarea rows={3} value={g('message')} maxLength={160} onChange={e => set('message', e.target.value)} placeholder="Treść SMS-a…" />
      </div>
    </>)
    case 'phone': return (
      <TextInput label="Numer telefonu" required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
    )
    case 'whatsapp': return (<>
      <TextInput label="Numer telefonu" required value={g('number')} onChange={v => set('number', v)} placeholder="+48 600 000 000" type="tel" />
      <div className="field">
        <div className="label-row"><label>Wiadomość powitalna</label><span className="counter">{g('message').length}/200</span></div>
        <textarea rows={3} value={g('message')} maxLength={200} onChange={e => set('message', e.target.value)} placeholder="Cześć! Piszę w sprawie…" />
      </div>
    </>)
    case 'location': return (<>
      <TextInput label="Adres lub nazwa miejsca" value={g('query')} onChange={v => set('query', v)} placeholder="np. Rynek Główny, Kraków" />
      <p className="hint">…albo podaj dokładne współrzędne:</p>
      <div className="color-grid">
        <TextInput label="Szerokość (lat)" value={g('lat')} onChange={v => set('lat', v)} placeholder="50.0617" />
        <TextInput label="Długość (lng)" value={g('lng')} onChange={v => set('lng', v)} placeholder="19.9373" />
      </div>
    </>)
    case 'vcard': return (<>
      <div className="color-grid">
        <TextInput label="Imię" required value={g('firstName')} onChange={v => set('firstName', v)} placeholder="Jan" />
        <TextInput label="Nazwisko" value={g('lastName')} onChange={v => set('lastName', v)} placeholder="Kowalski" />
      </div>
      <div className="color-grid">
        <TextInput label="Firma" value={g('org')} onChange={v => set('org', v)} placeholder="Moja Firma" />
        <TextInput label="Stanowisko" value={g('title')} onChange={v => set('title', v)} placeholder="CEO" />
      </div>
      <TextInput label="Telefon" value={g('phone')} onChange={v => set('phone', v)} placeholder="+48 600 000 000" type="tel" />
      <TextInput label="E-mail" value={g('email')} onChange={v => set('email', v)} placeholder="jan@przyklad.pl" type="email" />
      <TextInput label="Strona WWW" value={g('url')} onChange={v => set('url', v)} placeholder="https://…" type="url" />
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

const FEATURES = [
  {
    icon: '🎨', title: 'Pełna personalizacja',
    desc: 'Zmieniaj kształty modułów i narożników, kolory oraz dodaj podpis pod kodem — wszystko z podglądem na żywo.',
  },
  {
    icon: '🖼️', title: 'Własne logo',
    desc: 'Wstaw logo firmy lub avatar w środek kodu. Korekcja błędów podnosi się automatycznie, aby kod pozostał czytelny.',
  },
  {
    icon: '📦', title: '9 gotowych formatów',
    desc: 'Strona WWW, Wi-Fi, wizytówka vCard, e-mail, SMS, telefon, WhatsApp, lokalizacja i dowolny tekst.',
  },
  {
    icon: '⬇️', title: 'Eksport PNG i SVG',
    desc: 'Pobierz kod w wysokiej rozdzielczości do 2048 px albo jako wektor SVG do druku. Możesz też skopiować go do schowka.',
  },
  {
    icon: '🔒', title: 'Pełna prywatność',
    desc: 'Kody generowane są w całości w Twojej przeglądarce. Żadne dane nie opuszczają Twojego komputera.',
  },
  {
    icon: '⚡', title: 'Bez rejestracji',
    desc: 'Zero kont, zero limitów, zero znaków wodnych. Otwierasz, tworzysz, pobierasz.',
  },
]

const FAQ = [
  {
    q: 'Czy wygenerowane kody QR wygasają?',
    a: 'Nie. Kody są statyczne — dane zapisane są bezpośrednio w kodzie, więc działają bezterminowo i nie zależą od żadnego serwera.',
  },
  {
    q: 'Czy mogę używać kodów komercyjnie?',
    a: 'Tak, wygenerowane kody możesz wykorzystywać bez ograniczeń — na wizytówkach, plakatach, opakowaniach czy w menu restauracji.',
  },
  {
    q: 'Jak działa kod Wi-Fi?',
    a: 'Po zeskanowaniu telefon proponuje automatyczne połączenie z siecią — gość nie musi przepisywać hasła.',
  },
  {
    q: 'Który format pobrania wybrać?',
    a: 'PNG sprawdzi się w internecie i dokumentach. SVG to wektor — wybierz go do druku w dużym formacie, nigdy nie traci jakości.',
  },
  {
    q: 'Czy kolorowy kod QR zawsze zadziała?',
    a: 'Zadbaj o kontrast: ciemny kod na jasnym tle. Po zmianie kolorów zeskanuj podgląd telefonem, aby mieć pewność.',
  },
]

function Landing({ onStart }: { onStart: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  return (
    <div className="landing">
      {/* hero */}
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-badge">Darmowy · bez rejestracji · offline</span>
          <h1>Stwórz kod QR w kilka sekund</h1>
          <p>
            Trzy proste kroki od pomysłu do gotowego kodu: wybierz format,
            wpisz dane i dopasuj wygląd do swojej marki.
          </p>
          <div className="hero-cta">
            <button className="dl-main hero-btn" onClick={onStart}>Utwórz kod QR</button>
            <a className="ghost-btn hero-ghost" href="#cennik">Zobacz cennik</a>
          </div>
          <ul className="hero-points">
            <li>✓ 9 formatów danych</li>
            <li>✓ Eksport PNG / SVG</li>
            <li>✓ Własne logo i kolory</li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="qr-frame"><HeroQR /></div>
          <div className="scan-label">Scan me!</div>
        </div>
      </section>

      {/* how it works */}
      <section className="how" id="jak">
        <h2>Trzy kroki do gotowego kodu</h2>
        <p className="section-sub">Od wyboru do pobrania — przejrzyście na każdym etapie.</p>
        <div className="how-grid">
          {[
            { n: '1', t: 'Wybierz typ kodu', d: 'Strona, Wi-Fi, wizytówka, e-mail, SMS i więcej — każdy format ma gotowy formularz.' },
            { n: '2', t: 'Wprowadź dane', d: 'Uzupełnij pola i obserwuj podgląd kodu aktualizujący się na żywo.' },
            { n: '3', t: 'Dostosuj i pobierz', d: 'Kolory, kształty, logo i podpis. Pobierz PNG w wysokiej jakości lub wektor SVG.' },
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
        <h2>Wszystko, czego potrzebujesz</h2>
        <p className="section-sub">Kompletny generator — bez kont, limitów i znaków wodnych.</p>
        <div className="feature-grid">
          {FEATURES.map(f => (
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
        <h2>Cennik</h2>
        <p className="section-sub">Prosty jak sama aplikacja.</p>
        <div className="price-grid">
          <div className="price-card">
            <span className="price-name">Osobisty</span>
            <div className="price-value">0 zł<span> / na zawsze</span></div>
            <ul>
              <li>✓ Wszystkie 9 formatów</li>
              <li>✓ Pełna personalizacja</li>
              <li>✓ Eksport PNG i SVG</li>
              <li>✓ Bez limitów i rejestracji</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>Zacznij teraz</button>
          </div>
          <div className="price-card featured">
            <span className="price-tag">Najpopularniejszy</span>
            <span className="price-name">Hobby</span>
            <div className="price-value">0 zł<span> / miesiąc</span></div>
            <ul>
              <li>✓ Wszystko z planu Osobisty</li>
              <li>✓ Własne logo w kodzie</li>
              <li>✓ Rozdzielczość do 2048 px</li>
              <li>✓ Kopiowanie do schowka</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>Zacznij teraz</button>
          </div>
          <div className="price-card">
            <span className="price-name">Pro (żartujemy)</span>
            <div className="price-value">0 zł<span> / rok</span></div>
            <ul>
              <li>✓ Wszystko z planu Hobby</li>
              <li>✓ Kod działa bezterminowo</li>
              <li>✓ 100% prywatności — offline</li>
              <li>✓ Dobre samopoczucie gratis</li>
            </ul>
            <button className="dl-main price-btn" onClick={onStart}>Zacznij teraz</button>
          </div>
        </div>
        <p className="price-note">Aplikacja do użytku własnego — wszystkie funkcje są i pozostaną darmowe.</p>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2>Częste pytania</h2>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <div className={`faq-item${openFaq === i ? ' open' : ''}`} key={f.q}>
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
        <h2>Gotowy na swój pierwszy kod?</h2>
        <button className="dl-main hero-btn" onClick={onStart}>Utwórz kod QR</button>
      </section>

      <footer className="site-footer">
        <span>QR Studio — generator kodów QR do użytku własnego</span>
        <span>Działa w 100% w Twojej przeglądarce</span>
      </footer>
    </div>
  )
}

/* ═══════════════════ app ═══════════════════ */

export default function App() {
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

  const meta = qrType ? TYPE_META[qrType] : null

  const brand = (
    <button className="brand" onClick={() => setPage('home')} aria-label="Strona główna">
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
          <nav className="nav-links" aria-label="Nawigacja">
            <a href="#jak">Jak to działa</a>
            <a href="#funkcje">Funkcje</a>
            <a href="#cennik">Cennik</a>
            <a href="#faq">FAQ</a>
          </nav>
          <button className="dl-main nav-cta" onClick={() => setPage('studio')}>Utwórz kod QR</button>
        </header>
        <Landing onStart={() => { setPage('studio'); window.scrollTo(0, 0) }} />
      </div>
    )
  }

  return (
    <div className="app">
      {/* ═══ steps bar ═══ */}
      <header className="steps">
        {brand}
        <nav className="crumbs" aria-label="Kroki">
          {[
            { n: 1, l: 'Wybierz typ' },
            { n: 2, l: 'Wprowadź dane' },
            { n: 3, l: 'Dostosuj i pobierz' },
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
      </header>

      {/* ═══ STEP 1: choose type ═══ */}
      {step === 1 && (
        <main className="step1">
          <div className="step1-head">
            <h1>Jaki kod QR chcesz utworzyć?</h1>
            <p>Wybierz typ — w następnym kroku uzupełnisz dane, a na końcu dopasujesz wygląd.</p>
          </div>
          <div className="type-grid">
            {TYPE_ORDER.map(t => (
              <button key={t} className={`type-card${qrType === t ? ' on' : ''}`} onClick={() => pickType(t)}>
                <span className="type-icon">{TYPE_META[t].icon}</span>
                <span className="type-title">{TYPE_META[t].title}</span>
                <span className="type-desc">{TYPE_META[t].desc}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* ═══ STEP 2: content ═══ */}
      {step === 2 && meta && qrType && (
        <main className="step2">
          <div className="content-card">
            <div className="content-head">
              <span className="section-icon big">{meta.icon}</span>
              <div>
                <h2>{meta.title}</h2>
                <p>{meta.desc}</p>
              </div>
            </div>
            <div className="content-form">
              <ContentForm type={qrType} data={form} set={setField} />
            </div>
          </div>
          <aside className="side-preview">
            {canProceed ? (
              <>
                <div className="mini-frame"><canvas ref={canvasRef} /></div>
                <p className="hint center">Podgląd na żywo</p>
              </>
            ) : (
              <div className="side-empty">
                <span className="section-icon big">{meta.icon}</span>
                <p>Uzupełnij wymagane pola, aby zobaczyć podgląd kodu.</p>
              </div>
            )}
          </aside>
          <footer className="wizard-footer">
            <button className="ghost-btn back" onClick={() => setStep(1)}>‹ Wstecz</button>
            <button className="dl-main next" disabled={!canProceed} onClick={() => setStep(3)}>
              Dalej ›
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
              title="Modyfikacja" desc="Kształty, kolory i tekst kodu QR" defaultOpen>
              <div className="field">
                <label>Styl modułów</label>
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
                <label>Kształt narożników</label>
                <div className="tiles">
                  {(['square', 'rounded', 'circle', 'leaf'] as CornerStyle[]).map(st => (
                    <button key={st} className={`tile${cfg.cornerStyle === st ? ' on' : ''}`}
                      onClick={() => setStyle({ cornerStyle: st })} aria-label={`Narożnik: ${st}`}>
                      <CornerThumb style={st} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="color-grid">
                <ColorField label="Kod QR" value={cfg.fgColor} onChange={v => setStyle({ fgColor: v })} />
                <ColorField label="Tło" value={cfg.bgColor} onChange={v => setStyle({ bgColor: v })} />
              </div>
              <div className="field">
                <div className="label-row">
                  <label>Tekst pod kodem</label>
                  <span className="counter">{cfg.label.length}/20</span>
                </div>
                <input type="text" value={cfg.label} maxLength={20}
                  onChange={e => setStyle({ label: e.target.value })} placeholder="np. Scan me!" />
              </div>
              {cfg.label && (
                <ColorField label="Kolor tekstu" value={cfg.labelColor} onChange={v => setStyle({ labelColor: v })} />
              )}
            </Section>

            <Section
              icon={<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="M4 17l5-5 4 4 3-3 4 4" /></svg>}
              title="Logo" desc="Umieść własne logo w środku kodu QR">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml"
                hidden onChange={e => onLogoFile(e.target.files?.[0])} />
              {cfg.logo ? (
                <div className="logo-loaded">
                  <img src={cfg.logo} alt="Logo" />
                  <div className="logo-actions">
                    <button className="ghost-btn" onClick={() => fileRef.current?.click()}>Zmień</button>
                    <button className="ghost-btn danger" onClick={() => setStyle({ logo: null })}>Usuń</button>
                  </div>
                </div>
              ) : (
                <button className="dropzone" onClick={() => fileRef.current?.click()}>
                  <strong>Kliknij, aby przesłać logo</strong>
                  <span>PNG, JPG lub SVG · maks. 5 MB</span>
                </button>
              )}
              {cfg.logo && (
                <div className="field">
                  <div className="label-row">
                    <label>Skala logo</label>
                    <span className="counter">{Math.round(cfg.logoScale * 100)}%</span>
                  </div>
                  <input type="range" min={0.12} max={0.3} step={0.01} value={cfg.logoScale}
                    onChange={e => setStyle({ logoScale: +e.target.value })} />
                  <p className="hint">Przy logo korekcja błędów została podniesiona do H.</p>
                </div>
              )}
            </Section>

            <Section
              icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.06-.4.1-.8.1-1.2z" /></svg>}
              title="Parametry" desc="Korekcja błędów, marginesy i rozmiar pliku">
              <div className="field">
                <label>Korekcja błędów</label>
                <div className="seg">
                  {(['L', 'M', 'Q', 'H'] as ErrLevel[]).map(l => (
                    <button key={l} className={`seg-btn${cfg.errorLevel === l ? ' on' : ''}`}
                      onClick={() => setStyle({ errorLevel: l })}>{l}</button>
                  ))}
                </div>
                <p className="hint">
                  {cfg.errorLevel === 'L' && 'Niski (7%) — najmniejszy kod'}
                  {cfg.errorLevel === 'M' && 'Średni (15%) — zalecany na co dzień'}
                  {cfg.errorLevel === 'Q' && 'Wysoki (25%) — dobre pod logo'}
                  {cfg.errorLevel === 'H' && 'Maksymalny (30%) — wymagany przy logo'}
                </p>
              </div>
              <div className="field">
                <div className="label-row"><label>Marginesy</label><span className="counter">{cfg.margin}</span></div>
                <input type="range" min={0} max={8} value={cfg.margin}
                  onChange={e => setStyle({ margin: +e.target.value })} />
              </div>
              <div className="field">
                <div className="label-row"><label>Rozmiar eksportu</label><span className="counter">{cfg.size} px</span></div>
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
                <strong>Czy wiesz, że?</strong>
                <p>Kody QR z kolorem, logo lub własnym kształtem są skanowane <b>częściej</b> niż zwykłe czarno-białe. Wyróżnij swój.</p>
              </div>
            </div>

            <div className="dl-stack">
              <button className="dl-main" onClick={downloadPng}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M3.5 16.5h13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Pobierz kod QR
              </button>
              <div className="dl-secondary">
                <button className="ghost-btn" onClick={downloadSvg}>SVG</button>
                <button className="ghost-btn" onClick={copy}>{copied ? '✓ Skopiowano' : 'Kopiuj'}</button>
                <button className="ghost-btn" onClick={() => setCfg(DEFAULT_STYLE)}>Reset stylu</button>
              </div>
              <button className="ghost-btn back-link" onClick={() => setStep(2)}>‹ Wróć do danych</button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
