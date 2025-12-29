-- AlterTable
ALTER TABLE "associates" ADD COLUMN     "workspaceId" INTEGER;

-- CreateTable
CREATE TABLE "workspaces" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "associates" ADD CONSTRAINT "associates_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
