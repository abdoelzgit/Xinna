import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting password migration...");
    const users = await prisma.user.findMany();

    for (const user of users) {
        // Check if password is already hashed (bcrypt hashes start with $2)
        if (!user.password.startsWith("$2")) {
            console.log(`Hashing password for: ${user.email}`);
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
        } else {
            console.log(`Password for ${user.email} is already hashed.`);
        }
    }

    console.log("Migration finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
