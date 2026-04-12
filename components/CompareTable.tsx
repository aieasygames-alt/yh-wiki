interface CompareItem {
  name: string;
  values: string[];
}

interface CompareTableProps {
  items: CompareItem[];
  headers: string[];
  highlight?: number;
}

export function CompareTable({ items, headers, highlight = 0 }: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900/80">
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-left font-semibold whitespace-nowrap ${
                  i === highlight + 1
                    ? "text-primary-400"
                    : i === 0
                    ? "text-gray-400"
                    : "text-gray-300"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"}
            >
              <td className="px-4 py-3 text-gray-400 font-medium whitespace-nowrap">
                {item.name}
              </td>
              {item.values.map((val, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-4 py-3 ${
                    colIdx === highlight ? "text-primary-300 font-medium" : "text-gray-300"
                  }`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
