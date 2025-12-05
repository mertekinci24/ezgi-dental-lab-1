import { db } from '../src/lib/db';

async function main() {
    console.log('Testing database connection...');

    try {
        // 1. Create a Tenant
        const tenant = await db.tenant.create({
            data: {
                name: 'Test Clinic',
                type: 'CLINIC',
                timezone: 'Europe/Istanbul'
            }
        });
        console.log('✅ Tenant created:', tenant.id);

        // 2. Create a User
        const user = await db.user.create({
            data: {
                email: `test-${Date.now()}@clinic.com`, // Unique email
                password: 'hashed_password',
                role: 'DENTIST',
                tenantId: tenant.id
            }
        });
        console.log('✅ User created:', user.id);

        // 3. Create a Patient
        const patient = await db.patient.create({
            data: {
                fullName: 'John Doe',
                dob: new Date('1990-01-01'),
                gender: 'M',
                tenantId: tenant.id
            }
        });
        console.log('✅ Patient created:', patient.id);

        // 4. Create a Case
        const newCase = await db.case.create({
            data: {
                dentistId: user.id,
                patientId: patient.id,
                tenantId: tenant.id,
                dueDate: new Date(),
                caseNumber: Math.floor(Math.random() * 10000), // Manual ID for SQLite POC
                odontogramData: JSON.stringify({}), // Stringified JSON
                rxPreferences: JSON.stringify({}), // Stringified JSON
                status: 'DRAFT'
            }
        });
        console.log('✅ Case created:', newCase.id);

        // 5. Verify Read
        const fetchedCase = await db.case.findUnique({
            where: { id: newCase.id },
            include: { tenant: true }
        });

        if (fetchedCase?.tenant.name === 'Test Clinic') {
            console.log('✅ Verification SUCCESS: Data round-trip complete.');
        } else {
            console.error('❌ Verification FAILED: Data mismatch.');
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Verification FAILED:', e);
        process.exit(1);
    }
}

main();
