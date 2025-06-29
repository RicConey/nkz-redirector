-- CreateTable
CREATE TABLE "RedirectLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "RedirectLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RedirectLog_ownerId_idx" ON "RedirectLog"("ownerId");

-- AddForeignKey
ALTER TABLE "RedirectLog" ADD CONSTRAINT "RedirectLog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
