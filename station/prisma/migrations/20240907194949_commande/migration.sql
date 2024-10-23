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
    `date_commande` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `carburant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `fournisseur_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommandesCarburant` ADD CONSTRAINT `CommandesCarburant_fournisseur_id_fkey` FOREIGN KEY (`fournisseur_id`) REFERENCES `Fournisseurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
