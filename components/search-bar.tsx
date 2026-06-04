type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-medium text-slate-700">Search images</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, description or category"
        className="w-full rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2"
      />
    </label>
  );
}
