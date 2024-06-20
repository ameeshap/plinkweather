import { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'

const SearchBar = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null)

  const handleOnChange = (searchData) => {
    setSearch(searchData)
  }

  return (
    <AsyncPaginate
      placeholder="Search for City or Address"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
    />
  )
}

export default SearchBar
