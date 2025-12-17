-- DropForeignKey
ALTER TABLE "associates" DROP CONSTRAINT "associates_userId_fkey";

-- AlterTable
ALTER TABLE "associates" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "associates" ADD CONSTRAINT "associates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
