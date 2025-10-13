-- DropForeignKey
ALTER TABLE "public"."MugDetails" DROP CONSTRAINT "MugDetails_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PosterDetails" DROP CONSTRAINT "PosterDetails_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TshirtDetails" DROP CONSTRAINT "TshirtDetails_productId_fkey";

-- AddForeignKey
ALTER TABLE "TshirtDetails" ADD CONSTRAINT "TshirtDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MugDetails" ADD CONSTRAINT "MugDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosterDetails" ADD CONSTRAINT "PosterDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
