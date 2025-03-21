/*
  Warnings:

  - You are about to drop the column `device_id` on the `aquarium` table. All the data in the column will be lost.
  - Added the required column `deviceId` to the `Aquarium` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aquarium` DROP COLUMN `device_id`,
    ADD COLUMN `deviceId` INTEGER NOT NULL;
