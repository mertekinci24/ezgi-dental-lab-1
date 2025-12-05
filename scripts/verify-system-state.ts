import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 STARTING SYSTEM VERIFICATION...");

    // 1. Verify Tenant
    const tenant = await prisma.tenant.findUnique({ where: { id: 't-001' } });
    if (!tenant) {
        console.error("❌ FAIL: Tenant 't-001' NOT FOUND. Database might be empty.");
        process.exit(1);
    }
    console.log("✅ PASS: Tenant 't-001' found.");

    // 2. Verify User
    const user = await prisma.user.findUnique({ where: { id: 'mock-user-001' } });
    if (!user) {
        console.error("❌ FAIL: User 'mock-user-001' NOT FOUND.");
        process.exit(1);
    }
    console.log("✅ PASS: User 'mock-user-001' found.");

    // 3. Verify Schema Compatibility (Dry Run Case Creation)
    console.log("🔄 TESTING: Attempting to create a dummy Case to verify Schema...");
    try {
        // Create a dummy patient first
        const patient = await prisma.patient.create({
            data: {
                fullName: "System Verify Patient",
                tenantId: "t-001"
            }
        });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const testCase = await prisma.case.create({
            data: {
                tenantId: 't-001',
                dentistId: 'mock-user-001',
                patientId: patient.id,
                caseNumber: 99999,
                status: 'DRAFT',
                restorationType: 'TEST_CROWN',
                toothNumber: 1,
                shade: 'A1',
                notes: 'System Verification Test',
                dueDate: dueDate,
                odontogramData: '{}',
                rxPreferences: '{}',
            },
        });
        console.log("✅ PASS: Dummy Case created successfully. Schema is VALID.");

        // Cleanup
        await prisma.case.delete({ where: { id: testCase.id } });
        await prisma.patient.delete({ where: { id: patient.id } });
        console.log("🧹 CLEANUP: Dummy data removed.");

    } catch (error) {
        console.error("❌ FAIL: Schema Mismatch or Constraint Violation.", error);
        process.exit(1);
    }

    console.log("🚀 SYSTEM READY: All checks passed.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
