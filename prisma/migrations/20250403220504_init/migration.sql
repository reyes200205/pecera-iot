-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(120) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aquarium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` INTEGER NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(45) NOT NULL,
    `level` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    `aquariumId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actionType` VARCHAR(45) NOT NULL,
    `condition` VARCHAR(45) NOT NULL,
    `scheduledTime` VARCHAR(45) NOT NULL,
    `aquariumId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sensor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `type` VARCHAR(45) NOT NULL,
    `aquariumId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(45) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `sensorId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actionType` VARCHAR(45) NOT NULL,
    `time` VARCHAR(45) NOT NULL,
    `userId` INTEGER NOT NULL,
    `aquariumId` INTEGER NOT NULL,
    `origin` ENUM('APP', 'SYSTEM', 'MANUAL') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Aquarium` ADD CONSTRAINT `Aquarium_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_aquariumId_fkey` FOREIGN KEY (`aquariumId`) REFERENCES `Aquarium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_aquariumId_fkey` FOREIGN KEY (`aquariumId`) REFERENCES `Aquarium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_aquariumId_fkey` FOREIGN KEY (`aquariumId`) REFERENCES `Aquarium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reading` ADD CONSTRAINT `Reading_sensorId_fkey` FOREIGN KEY (`sensorId`) REFERENCES `Sensor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_aquariumId_fkey` FOREIGN KEY (`aquariumId`) REFERENCES `Aquarium`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
