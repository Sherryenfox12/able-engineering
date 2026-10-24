import { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { GlobeIcon } from '../components/Icons'
import en from './en.json'
import zh from './zh.json'
import id from './id.json'

const LOCALES = { en, zh, id }
const LANGUAGES = ['en', 'zh', 'id']
const DEFAULT_LANG = 'en'
const LANG_STORAGE_KEY = 'able-lang'

const LanguageContext = createContext(null)

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function interpolate(value, vars) {
  if (typeof value !== 'string' || !vars) return value
  return value.replace(/\{(\w+)\}/g, (_, key) => (vars[key] == null ? `{${key}}` : String(vars[key])))
}

function readStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored && LOCALES[stored]) return stored
  } catch {
    // ignore storage errors (private mode, etc.)
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = (next) => {
    if (!LOCALES[next]) return
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
  }, [lang])

  const value = useMemo(() => {
    const dict = LOCALES[lang] ?? LOCALES[DEFAULT_LANG]

    const t = (key, vars) => {
      const fromCurrent = getByPath(dict, key)
      const fromFallback = fromCurrent === undefined ? getByPath(LOCALES[DEFAULT_LANG], key) : fromCurrent
      if (fromFallback === undefined) return key
      if (Array.isArray(fromFallback)) {
        return fromFallback.map((item) => interpolate(item, vars))
      }
      return interpolate(fromFallback, vars)
    }

    return { lang, setLang, t, languages: LANGUAGES }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function LanguageSwitcher() {
  const { lang, setLang, t, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className={`lang-switcher ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="lang-switcher__btn"
        aria-label={t('lang.switch')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon size={18} />
        <span className="lang-switcher__current">{t(`lang.${lang}`)}</span>
        <span className="lang-switcher__chevron" aria-hidden="true" />
      </button>

      <ul
        id={listId}
        className="lang-switcher__menu"
        role="listbox"
        aria-label={t('lang.label')}
        hidden={!open}
      >
        {languages.map((code) => (
          <li key={code} role="option" aria-selected={code === lang}>
            <button
              type="button"
              className={`lang-switcher__option ${code === lang ? 'is-active' : ''}`}
              onClick={() => {
                setLang(code)
                setOpen(false)
              }}
            >
              {t(`lang.${code}`)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
