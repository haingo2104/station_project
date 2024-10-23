/*
  Warnings:

  - You are about to drop the `prixdetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `prixdetails` DROP FOREIGN KEY `PrixDetails_prix_id_fkey`;

-- DropTable
DROP TABLE `prixdetails`;
