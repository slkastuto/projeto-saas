/*
  Warnings:

  - You are about to drop the column `lastMessageAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `ConversationTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[whatsappId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ConversationTag" DROP CONSTRAINT "ConversationTag_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationTag" DROP CONSTRAINT "ConversationTag_tagId_fkey";

-- DropIndex
DROP INDEX "Conversation_companyId_contact_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "lastMessageAt";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "whatsappId" TEXT;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "color";

-- DropTable
DROP TABLE "ConversationTag";

-- CreateIndex
CREATE UNIQUE INDEX "Message_whatsappId_key" ON "Message"("whatsappId");
