type CategoryFiltersProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (value: string) => void;
};

export function CategoryFilters({ categories, selectedCategory, onSelectCategory }: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Image categories">
      {categories.map((category) => {
        const active = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              active
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
