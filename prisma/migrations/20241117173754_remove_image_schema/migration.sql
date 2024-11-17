/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_memoryId_fkey";

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
