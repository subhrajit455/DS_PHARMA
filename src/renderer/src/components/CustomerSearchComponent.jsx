import React, { useState } from 'react'
import AsyncSelect from 'react-select/async'
import { customerUrl } from '../config'
import axios from 'axios'

function CustomerSearchComponent({ onCustomerSelect, selectedCustomer }) {
  const [isLoading, setIsLoading] = useState(false)

  const fetchCustomers = async (searchQuery = '') => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${customerUrl.getAllCustomers}?query=${searchQuery}`)

      return response.data.data.parties || []
    } catch (error) {
      console.error('Error fetching customers:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const loadOptions = async (inputValue, callback) => {
    try {
      const customers = await fetchCustomers(inputValue)
      const options = customers.map((customer) => ({
        value: customer.rid,
        label: `${customer.name} ${customer.phone1 ? `(${customer.phone1})` : ''}`,
        customer: customer
      }))
      callback(options)
    } catch (error) {
      console.error('Error loading options:', error)
      callback([])
    }
  }

  const handleChange = (selectedOption) => {
    if (selectedOption && onCustomerSelect) {
      onCustomerSelect(selectedOption.customer)
    } else if (!selectedOption && onCustomerSelect) {
      onCustomerSelect(null)
    }
  }

  const getDefaultValue = () => {
    if (selectedCustomer) {
      return {
        value: selectedCustomer.rid,
        label: `${selectedCustomer.name} ${selectedCustomer.phone1 ? `(${selectedCustomer.phone1})` : ''}`,
        customer: selectedCustomer
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
      placeholder="Search customer..."
      className="react-select-container"
      classNamePrefix="react-select"
      debounceTimeout={300}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `No customers found for "${inputValue}"` : 'Start typing to search customers'
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

export default CustomerSearchComponent
