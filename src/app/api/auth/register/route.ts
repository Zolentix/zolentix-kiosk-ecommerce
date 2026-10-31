import { NextRequest, NextResponse } from 'next/server'
import { hashSync } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: { email, password: hashSync(password, 10), name },
    })

    const token = await signToken({ userId: user.id, role: user.role })
    const response = NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
    response.cookies.set('kiosk-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (e) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
