-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "customer_id" TEXT NOT NULL,
    "contractor_id" TEXT NOT NULL,
    "task_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
