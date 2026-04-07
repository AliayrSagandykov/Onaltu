import {NextRequest} from 'next/server';
import {prisma} from '@/lib/prisma';
import {auth} from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const users = await prisma.user.findMany({
    select: {id: true, email: true, name: true, role: true, createdAt: true},
    orderBy: {createdAt: 'asc'},
  });

  return Response.json(users);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const {email, password, name} = await request.json();
  if (!email || !password) return Response.json({error: 'Email and password required'}, {status: 400});

  const existing = await prisma.user.findUnique({where: {email}});
  if (existing) return Response.json({error: 'User already exists'}, {status: 409});

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {email, password: hashed, name: name || null, role: 'admin'},
    select: {id: true, email: true, name: true, role: true, createdAt: true},
  });

  return Response.json(user);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return Response.json({error: 'Unauthorized'}, {status: 401});

  const {searchParams} = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return Response.json({error: 'Missing id'}, {status: 400});

  // Prevent deleting yourself
  const users = await prisma.user.findMany({select: {id: true}});
  if (users.length <= 1) return Response.json({error: 'Cannot delete the last admin'}, {status: 400});

  await prisma.user.delete({where: {id}});
  return Response.json({success: true});
}
