import { useMemo, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

export function useUserSearchFilter(data) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const filteredData = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data;
    return data.filter((u) =>
      [u.email, u.first_name, u.last_name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, debouncedSearch]);

  return { search, setSearch, debouncedSearch, filteredData };
}
