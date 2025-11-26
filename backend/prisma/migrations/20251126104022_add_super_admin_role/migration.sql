-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Board" ADD VALUE 'IB';
ALTER TYPE "Board" ADD VALUE 'STATE_BOARD';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "board" "Board";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "schoolId" TEXT;

-- CreateTable
CREATE TABLE "TeacherApplication" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subjects" TEXT[],
    "experience" INTEGER NOT NULL,
    "qualification" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherApplication_schoolId_idx" ON "TeacherApplication"("schoolId");

-- CreateIndex
CREATE INDEX "TeacherApplication_status_idx" ON "TeacherApplication"("status");

-- CreateIndex
CREATE INDEX "TeacherApplication_email_idx" ON "TeacherApplication"("email");

-- CreateIndex
CREATE INDEX "Subject_board_idx" ON "Subject"("board");

-- CreateIndex
CREATE INDEX "User_schoolId_idx" ON "User"("schoolId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherApplication" ADD CONSTRAINT "TeacherApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
