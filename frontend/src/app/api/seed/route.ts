import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  return createAdmin();
}

export async function POST() {
  return createAdmin();
}

async function createAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: {email: 'admin@onaltu.kz'},
  });

  if (existingAdmin) {
    return Response.json({message: 'Admin already exists'});
  }

  const hashedPassword = await bcrypt.hash('onaltu2024', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@onaltu.kz',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  return Response.json({message: 'Admin created', email: admin.email});
}
