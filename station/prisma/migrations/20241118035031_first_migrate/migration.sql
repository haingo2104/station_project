-- CreateTable
CREATE TABLE `Users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mfaCode` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `permission_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permissions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fournisseurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandesCarburant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantite` DOUBLE NOT NULL,
    `prix_unitaire` DOUBLE NOT NULL,
    `date_commande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `carburant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `fournisseur_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carburants` (
    `carburant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`carburant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prix` (
    `prix_id` INTEGER NOT NULL AUTO_INCREMENT,
    `carburant_id` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`prix_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `stock_id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantite` DOUBLE NOT NULL,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `carburant_id` INTEGER NOT NULL,

    PRIMARY KEY (`stock_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pompe` (
    `pompe_id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`pompe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pompiste` (
    `pompiste_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `salaire` DOUBLE NOT NULL,

    PRIMARY KEY (`pompiste_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tuyaux` (
    `tuyau_id` INTEGER NOT NULL AUTO_INCREMENT,
    `carburant_id` INTEGER NOT NULL,
    `pompe_id` INTEGER NOT NULL,

    PRIMARY KEY (`tuyau_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModeDePaie` (
    `modeDePaie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`modeDePaie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vente` (
    `vente_id` INTEGER NOT NULL AUTO_INCREMENT,
    `total` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pompe_id` INTEGER NOT NULL,
    `pompiste_id` INTEGER NOT NULL,
    `modeDePaie_id` INTEGER NOT NULL,

    PRIMARY KEY (`vente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Relever` (
    `relever_id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantiteAvant` DOUBLE NOT NULL,
    `quantiteApres` DOUBLE NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `carburant_id` INTEGER NOT NULL,
    `pompe_id` INTEGER NOT NULL,

    PRIMARY KEY (`relever_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `References` (
    `reference_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ref_value` VARCHAR(191) NOT NULL,
    `modeDePaie_id` INTEGER NOT NULL,
    `vente_id` INTEGER NOT NULL,
    `montant` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`reference_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPermissions` ADD CONSTRAINT `UserPermissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermissions` ADD CONSTRAINT `UserPermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandesCarburant` ADD CONSTRAINT `CommandesCarburant_fournisseur_id_fkey` FOREIGN KEY (`fournisseur_id`) REFERENCES `Fournisseurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandesCarburant` ADD CONSTRAINT `CommandesCarburant_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prix` ADD CONSTRAINT `Prix_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tuyaux` ADD CONSTRAINT `Tuyaux_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tuyaux` ADD CONSTRAINT `Tuyaux_pompe_id_fkey` FOREIGN KEY (`pompe_id`) REFERENCES `Pompe`(`pompe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vente` ADD CONSTRAINT `Vente_pompe_id_fkey` FOREIGN KEY (`pompe_id`) REFERENCES `Pompe`(`pompe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vente` ADD CONSTRAINT `Vente_pompiste_id_fkey` FOREIGN KEY (`pompiste_id`) REFERENCES `Pompiste`(`pompiste_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vente` ADD CONSTRAINT `Vente_modeDePaie_id_fkey` FOREIGN KEY (`modeDePaie_id`) REFERENCES `ModeDePaie`(`modeDePaie_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relever` ADD CONSTRAINT `Relever_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relever` ADD CONSTRAINT `Relever_pompe_id_fkey` FOREIGN KEY (`pompe_id`) REFERENCES `Pompe`(`pompe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `References` ADD CONSTRAINT `References_modeDePaie_id_fkey` FOREIGN KEY (`modeDePaie_id`) REFERENCES `ModeDePaie`(`modeDePaie_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `References` ADD CONSTRAINT `References_vente_id_fkey` FOREIGN KEY (`vente_id`) REFERENCES `Vente`(`vente_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
