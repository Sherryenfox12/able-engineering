import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

const SESSION_KEY = 'able_admin_session'
const SESSION_DAYS = 7
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000

function saveSession(user) {
  const session = {
    id: user.id,
    username: user.username,
    expiresAt: Date.now() + SESSION_MS,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const session = JSON.parse(raw)
    if (!session?.expiresAt || Date.now() > session.expiresAt) {
      clearAdminSession()
      return null
    }

    return session
  } catch {
    clearAdminSession()
    return null
  }
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function isAdminLoggedIn() {
  return Boolean(getAdminSession())
}

/**
 * Login against Firestore `AccountAndUser`.
 * Plain string match on username + password (temporary for testing).
 */
export async function loginAdmin(username, password) {
  const trimmedUsername = String(username ?? '').trim()
  const trimmedPassword = String(password ?? '')

  if (!trimmedUsername || !trimmedPassword) {
    throw new Error('Username and password are required.')
  }

  const usersRef = collection(db, 'AccountAndUser')
  const q = query(usersRef, where('username', '==', trimmedUsername))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw new Error('Invalid username or password.')
  }

  const match = snapshot.docs.find((doc) => {
    const data = doc.data()
    return String(data.password ?? '') === trimmedPassword
  })

  if (!match) {
    throw new Error('Invalid username or password.')
  }

  const data = match.data()
  return saveSession({
    id: match.id,
    username: String(data.username ?? trimmedUsername),
  })
}

export function logoutAdmin() {
  clearAdminSession()
}
