const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const studentPasswordHash = await bcrypt.hash('aluno123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gymflow.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gymflow.local',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'aluno@gymflow.local' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'aluno@gymflow.local',
      password: studentPasswordHash,
      role: 'STUDENT',
      profile: {
        create: {
          birthDate: new Date('1995-05-15'),
          initialWeight: 80,
          currentWeight: 80,
          height: 1.75,
        },
      },
    },
  });

  await prisma.plan.upsert({
    where: { id: 'seed-monthly' },
    update: {},
    create: {
      id: 'seed-monthly',
      name: 'Plano Mensal',
      price: 9900,
      durationInDays: 30,
    },
  });

  const musculacao = await prisma.modality.upsert({
    where: { id: 'seed-musculacao' },
    update: {},
    create: {
      id: 'seed-musculacao',
      name: 'Musculação',
      description: 'Treinamento com pesos e máquinas para ganho de força e massa muscular',
      icon: '💪',
      color: '#6C5DD3',
    },
  });

  const crossfit = await prisma.modality.upsert({
    where: { id: 'seed-crossfit' },
    update: {},
    create: {
      id: 'seed-crossfit',
      name: 'CrossFit',
      description: 'Treinamento funcional de alta intensidade com movimentos variados',
      icon: '🔥',
      color: '#FF6B35',
    },
  });

  const yoga = await prisma.modality.upsert({
    where: { id: 'seed-yoga' },
    update: {},
    create: {
      id: 'seed-yoga',
      name: 'Yoga',
      description: 'Prática milenar que une corpo e mente através de posturas e respiração',
      icon: '🧘',
      color: '#4CAF50',
    },
  });

  await prisma.schedule.upsert({
    where: { id: 'seed-musc-seg' },
    update: {},
    create: {
      id: 'seed-musc-seg',
      modalityId: musculacao.id,
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:00',
      instructor: 'Carlos Silva',
      maxCapacity: 20,
    },
  });

  await prisma.schedule.upsert({
    where: { id: 'seed-cross-ter' },
    update: {},
    create: {
      id: 'seed-cross-ter',
      modalityId: crossfit.id,
      dayOfWeek: 2,
      startTime: '18:00',
      endTime: '19:00',
      instructor: 'Ana Costa',
      maxCapacity: 15,
    },
  });

  await prisma.schedule.upsert({
    where: { id: 'seed-yoga-qua' },
    update: {},
    create: {
      id: 'seed-yoga-qua',
      modalityId: yoga.id,
      dayOfWeek: 3,
      startTime: '07:00',
      endTime: '08:00',
      instructor: 'Mariana Santos',
      maxCapacity: 12,
    },
  });

  console.log('Seed ok:', {
    adminEmail: admin.email,
    studentEmail: student.email,
    studentPassword: 'aluno123',
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});








