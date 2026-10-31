import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')

export async function signToken(payload: { userId: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { userId: string; role: string }
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get('kiosk-token')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  return user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.role !== 'admin') throw new Error('Forbidden')
  return session
}
