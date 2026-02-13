const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAddressField() {
  try {
    // Test if we can query the address field
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      }
    });
    
    console.log('✅ Address field is available in the schema');
    console.log('Sample user:', user ? { ...user, address: user.address || 'null' } : 'No users found');
    
    // Test if we can update the address field
    if (user) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { address: 'Test address update' },
        select: { id: true, name: true, address: true }
      });
      console.log('✅ Address field update works:', updated);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAddressField();
