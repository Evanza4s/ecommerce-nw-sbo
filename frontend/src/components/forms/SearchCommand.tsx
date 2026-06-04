import { Search } from 'lucide-react'
import React from 'react'

const SearchCommand = () => {
  return (
    <button
      className="
        flex h-10 w-72 items-center
        gap-2 rounded-xl border
        px-3 text-sm text-muted-foreground
      "
    >
      <Search size={16} />

      Search products, orders...

      <kbd className="ml-auto text-xs">
        ⌘K
      </kbd>
    </button>
  )
}

export default SearchCommand