-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderId" VARCHAR(20);

-- CreateIndex
CREATE INDEX "Order_orderId_idx" ON "Order"("orderId");
