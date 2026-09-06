import { User } from '../models/User.js';

export const seedAdminUser = async (): Promise<void> => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL as string).toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const userWithEmail = await User.findOne({ email: adminEmail });
      if (userWithEmail) {
        userWithEmail.role = 'admin';
        userWithEmail.password = adminPassword;
        await userWithEmail.save();
        console.log(`[SeedAdmin] Existing account ${adminEmail} upgraded to Admin role.`);
      } else {
        await User.create({
          name: 'System Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
        console.log(`[SeedAdmin] Single System Admin created (${adminEmail}).`);
      }
    }
  } catch (error) {
    console.error('[SeedAdmin] Error seeding admin user:', (error as Error).message);
  }
};
