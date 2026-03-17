-- AlterTable
ALTER TABLE `financial_account` ADD COLUMN `accountNumber` TEXT NULL,
    ADD COLUMN `accountNumberLast4` VARCHAR(191) NULL;
