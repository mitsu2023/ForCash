/*
  Warnings:

  - Added the required column `userId` to the `financial_account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `financial_account` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `financial_account_userId_idx` ON `financial_account`(`userId`);

-- AddForeignKey
ALTER TABLE `financial_account` ADD CONSTRAINT `financial_account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
