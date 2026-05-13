import { FiStar } from 'react-icons/fi'
import type { SearchParams } from '../../types'

interface Props {
  filters: SearchParams
  onChange: (f: Partial<SearchParams>) => void
  onReset: () => void
}

export default function SearchFilters({ filters, onChange, onReset }: Props) {
  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Filters</h3>
        <button onClick={onReset} className="text-xs text-primary-600 hover:underline">Reset</button>
      </div>

      {/* Type */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Type</p>
        <div className="space-y-1.5">
          {[['', 'All'], ['HOTEL', 'Hotels'], ['FLIGHT', 'Flights'], ['TOUR', 'Tours']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value={val}
                checked={(filters.type || '') === val}
                onChange={() => onChange({ type: val || undefined, page: 0 })}
                className="accent-primary-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={e => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 0 })}
            className="input w-full text-sm py-1.5"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={e => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 0 })}
            className="input w-full text-sm py-1.5"
          />
        </div>
      </div>

      {/* Min rating */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Minimum Rating</p>
        <div className="space-y-1.5">
          {[0, 3, 4, 4.5].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={(filters.minRating ?? 0) === r}
                onChange={() => onChange({ minRating: r || undefined, page: 0 })}
                className="accent-primary-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-600 group-hover:text-slate-800">
                {r === 0 ? 'Any' : (
                  <>
                    <FiStar className="fill-amber-400 text-amber-400 text-xs" />
                    {r}+
                  </>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.available === true}
            onChange={e => onChange({ available: e.target.checked ? true : undefined, page: 0 })}
            className="accent-primary-500 w-4 h-4"
          />
          <span className="text-sm text-slate-600">Available only</span>
        </label>
      </div>
    </aside>
  )
}
