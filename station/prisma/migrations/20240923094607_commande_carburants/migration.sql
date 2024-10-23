/*
  Warnings:

  - Added the required column `prix_unitaire` to the `CommandesCarburant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CommandesCarburant` ADD COLUMN `prix_unitaire` DOUBLE NOT NULL;
