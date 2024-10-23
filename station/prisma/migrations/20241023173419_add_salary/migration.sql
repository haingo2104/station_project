/*
  Warnings:

  - Added the required column `salaire` to the `Pompiste` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pompiste` ADD COLUMN `salaire` DOUBLE NOT NULL;
