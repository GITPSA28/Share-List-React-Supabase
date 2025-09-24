import React from "react";
import ItemRow from "./ItemRow";

export default function ItemsListView({ items, title }) {
  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xl font-bold tracking-wide">{title}</li>
        {items.map((item) => {
          return <ItemRow key={item.id} item={item} />;
        })}
      </ul>
    </div>
  );
}
