-- AddForeignKey
ALTER TABLE `CommandesCarburant` ADD CONSTRAINT `CommandesCarburant_carburant_id_fkey` FOREIGN KEY (`carburant_id`) REFERENCES `Carburants`(`carburant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
