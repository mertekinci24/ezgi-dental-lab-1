import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Clean up existing data
    await prisma.case.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();

    // 2. Create Tenants
    const labTenant = await prisma.tenant.create({
        data: {
            name: 'Merkez Lab',
            type: 'LAB',
        },
    });

    const clinicTenant = await prisma.tenant.create({
        data: {
            name: 'Mert Dental Klinik',
            type: 'CLINIC',
        },
    });

    // 3. Create Users
    // Lab Admin
    await prisma.user.create({
        data: {
            email: 'admin@ezgi.com',
            password: 'admin', // Demo password
            name: 'Ezgi Admin',
            role: 'LAB_ADMIN',
            tenantId: labTenant.id,
        },
    });

    // Dentist
    const dentist = await prisma.user.create({
        data: {
            email: 'dt.mert@ezgi.com',
            password: '123', // Demo password
            name: 'Dt. Mert Yılmaz',
            role: 'DENTIST',
            tenantId: clinicTenant.id,
        },
    });

    console.log('Database seeded successfully!');
    console.log('Lab Tenant ID:', labTenant.id);
    console.log('Clinic Tenant ID:', clinicTenant.id);
    console.log('Dentist ID:', dentist.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
