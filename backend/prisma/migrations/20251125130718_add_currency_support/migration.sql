-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('INR', 'USD', 'EUR', 'GBP', 'CNY', 'JPY', 'IDR', 'NPR', 'AUD', 'CAD');

-- AlterTable
ALTER TABLE "FeePayment" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "FeeStructure" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'INR';
