import React from 'react';
import { TlaSubscribeButton } from '@/components/TlaSubscribeButton';
import { useSearchParams } from "react-router-dom";
import { startCheckout } from "@/services/checkout";
import { TlaPostsList } from "@/components/TlaPostsList";

export default function TimelineAlchemy() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Timeline Alchemy Posts</h1>
      <TlaPostsList />
    </div>
  );
}

<button
  onClick={() => startCheckout({
    org_id: "b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8", // jouw org_id
    price_id: "price_1S1VMWFlYXjX03EzHKNwtkWW"      // jouw Stripe price
  })}
  className="rounded-md px-4 py-2 bg-black text-white"
>
  Subscribe
</button>

const TimelineAlchemy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Timeline Alchemy
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Ontgrendel premium features van Timeline Alchemy en automatiseer je
        spirituele content journey met één druk op de knop.
      </p>

      <TlaSubscribeButton
        orgId="b02de5d1-382c-4c8a-b1c4-0c9abdd1b6f8"
        priceId="price_1S1VMWFlYXjX03EzHKNwtkWW"
      />
    </div>
  );
};

export default TimelineAlchemy;
