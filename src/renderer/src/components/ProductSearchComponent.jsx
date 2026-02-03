import React, { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { productUrl } from '../config'
import axios from 'axios'

function ProductSearchComponent({ onProductSelect, selectedProduct }) {
  const [isLoading, setIsLoading] = useState(false)

  const fetchProducts = async (searchQuery = '') => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${productUrl.getAllProducts}?query=${searchQuery}`)

      return response.data.data.products
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const loadOptions = async (inputValue, callback) => {
    try {
      const products = await fetchProducts(inputValue)
      const options = products.map((product) => ({
        value: product.rid,
        label: `${product.name}-${product.code ? `(${product.code})` : ''}-${Number(product.stock) > 0 ? `(${product.stock})` : 'Out of Stock'}`,
        product: product
      }))
      callback(options)
    } catch (error) {
      console.error('Error loading options:', error)
      callback([])
    }
  }

  const handleChange = (selectedOption) => {
    if (selectedOption && onProductSelect) {
      onProductSelect(selectedOption.product)
    } else if (!selectedOption && onProductSelect) {
      onProductSelect(null)
    }
  }

  const getDefaultValue = () => {
    if (selectedProduct) {
      return {
        value: selectedProduct.rid,
        label: `${selectedProduct.name}-${selectedProduct.code ? `(${selectedProduct.code})` : ''}-${Number(selectedProduct.stock) > 0 ? `(${selectedProduct.stock})` : 'Out of Stock'}`,
        product: selectedProduct
      }
    }
    return null
  }

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      value={getDefaultValue()}
      isClearable={true}
      isSearchable={true}
      isLoading={isLoading}
      placeholder="Search product..."
      className="react-select-container"
      classNamePrefix="react-select"
      debounceTimeout={300}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `No products found for "${inputValue}"` : 'Start typing to search products'
      }
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '40px',
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

export default ProductSearchComponent
