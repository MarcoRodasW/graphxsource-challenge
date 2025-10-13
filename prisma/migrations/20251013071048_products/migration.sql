-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('TSHIRT', 'MUG', 'POSTER');

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "sku" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(255),
    "productType" "ProductType" NOT NULL DEFAULT 'TSHIRT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TshirtDetails" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "size" VARCHAR(5) NOT NULL,
    "color" VARCHAR(50) NOT NULL,

    CONSTRAINT "TshirtDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MugDetails" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "color" VARCHAR(50) NOT NULL,

    CONSTRAINT "MugDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosterDetails" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "material" VARCHAR(100) NOT NULL,

    CONSTRAINT "PosterDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_sku_key" ON "Products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "TshirtDetails_productId_key" ON "TshirtDetails"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "MugDetails_productId_key" ON "MugDetails"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PosterDetails_productId_key" ON "PosterDetails"("productId");

-- AddForeignKey
ALTER TABLE "TshirtDetails" ADD CONSTRAINT "TshirtDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MugDetails" ADD CONSTRAINT "MugDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosterDetails" ADD CONSTRAINT "PosterDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
