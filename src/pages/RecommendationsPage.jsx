import React, { useEffect, useState } from "react";
import FullscreenSpinner from "../ui/FullscreenSpinner";
import ItemsListView from "../ui/ItemsListView";
import useRecommendations from "../features/lists/useRecommendatons";

export default function RecommendationsPage() {
  const { items, isLoading } = useRecommendations();
  if (isLoading) return <FullscreenSpinner />;
  if (!items) return <p>Empty</p>;
  return (
    <div className="flex justify-center">
      <div className="max-w-2xl">
        <ItemsListView items={items} title="Recommendations to you" />
      </div>
    </div>
  );
}
