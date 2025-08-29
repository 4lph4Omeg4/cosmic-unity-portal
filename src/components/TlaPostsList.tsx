import React from "react";
import { fetchTlaPosts } from "@/services/tlaData";

export function TlaPostsList() {
  const [items, setItems] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await fetchTlaPosts();
      if (error) setError(error.message);
      else setItems(data || []);
    })();
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  return (
    <ul className="space-y-2">
      {items.map(p => (
        <li key={p.id} className="p-3 rounded border">
          <div className="font-semibold">{p.title}</div>
          <div className="text-sm opacity-70">
            {new Date(p.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
