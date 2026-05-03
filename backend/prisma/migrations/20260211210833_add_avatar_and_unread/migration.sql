-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "unreadCount" INTEGER NOT NULL DEFAULT 0;
