-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" TEXT;

-- CreateTable
CREATE TABLE "_ConversationTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConversationTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversationTags_B_index" ON "_ConversationTags"("B");

-- AddForeignKey
ALTER TABLE "_ConversationTags" ADD CONSTRAINT "_ConversationTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationTags" ADD CONSTRAINT "_ConversationTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
