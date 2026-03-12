import type { Metadata } from "next";
import { getAllAdresses } from "@/lib/api";
import TastyMapWrapper from "@/components/map/TastyMapWrapper";

export const metadata: Metadata = {
  title: "La Tasty Map",
  description:
    "Explorez toutes les bonnes adresses de la Moselle sur notre carte interactive. Restaurants, producteurs, caves à vins.",
};

export default async function CartePage() {
  const adresses = await getAllAdresses();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <TastyMapWrapper adresses={adresses} />
    </div>
  );
}
