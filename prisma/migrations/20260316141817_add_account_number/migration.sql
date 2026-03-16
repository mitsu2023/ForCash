-- AlterTable
ALTER TABLE `financial_account` ADD COLUMN `accountNumber` TEXT NULL,
    ADD COLUMN `accountNumberLast4` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));
