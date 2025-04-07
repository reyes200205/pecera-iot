/*
  Warnings:

  - You are about to drop the column `level` on the `alert` table. All the data in the column will be lost.
  - Added the required column `sensorId` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alert` DROP COLUMN `level`,
    ADD COLUMN `sensorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_sensorId_fkey` FOREIGN KEY (`sensorId`) REFERENCES `Sensor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
