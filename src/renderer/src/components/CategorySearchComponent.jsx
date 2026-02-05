import { useSelector } from 'react-redux'
import Select from 'react-select'

function CategorySearchComponent({ onCategorySelect, selectedCategory }) {
  const { categories } = useSelector((state) => state.category)

  const options = categories.map((category) => ({
    value: category._id,
    label: category.name,
    category
  }))

  const selectedOption = options.find(
    (opt) => opt.value === selectedCategory?._id || opt.value === selectedCategory
  )

  return (
    <Select
      value={selectedOption || null}
      options={options}
      isClearable
      isSearchable
      placeholder="Select category"
      onChange={(option) => {
        onCategorySelect(option ? option.category : null)
      }}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `No categories found for "${inputValue}"` : 'Start typing to search categories'
      }
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '32px',
          borderColor: 'hsl(var(--input))',
          '&:hover': {
            borderColor: 'hsl(var(--ring))'
          }
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999
        })
      }}
    />
  )
}

export default CategorySearchComponent
