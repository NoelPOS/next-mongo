'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/supplier'

function App() {
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    supplierName: '',
    address: '',
    phoneNumber: '',
  })
  const [editingSupplier, setEditingSupplier] = useState(null)

  // Fetch suppliers with pagination (default page 1)
  const fetchSuppliers = async (pno = 1) => {
    try {
      const response = await axios.get(`${API_URL}?pno=${pno}`)
      setSuppliers(response.data)
    } catch (error) {
      console.error('Error fetching suppliers', error)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Add a new supplier
  const handleAddSupplier = async (supplier) => {
    try {
      const response = await axios.post(API_URL, supplier)
      setSuppliers([...suppliers, response.data])
      resetForm()
    } catch (error) {
      console.error('Error adding supplier', error)
    }
  }

  // Update an existing supplier
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const response = await axios.put(API_URL, updatedSupplier)
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === updatedSupplier._id ? response.data : supplier
        )
      )
      setEditingSupplier(null)
      resetForm()
    } catch (error) {
      console.error('Error updating supplier', error)
    }
  }

  // Delete a supplier by ID
  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } })
      setSuppliers(suppliers.filter((supplier) => supplier._id !== id))
    } catch (error) {
      console.error('Error deleting supplier', error)
    }
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submit (either add or update)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingSupplier) {
      handleUpdateSupplier({ ...formData, _id: editingSupplier._id })
    } else {
      handleAddSupplier(formData)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      supplierName: '',
      address: '',
      phoneNumber: '',
    })
    setEditingSupplier(null)
  }

  // Edit supplier (set the form to edit mode)
  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      supplierName: supplier.supplierName,
      address: supplier.address,
      phoneNumber: supplier.phoneNumber,
    })
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-4xl font-bold text-center text-gray-800 mb-8'>
        Suppliers
      </h1>

      {/* Form for Adding/Editing Suppliers */}
      <div className='max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              name='supplierName'
              placeholder='Supplier Name'
              value={formData.supplierName}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <input
              type='text'
              name='address'
              placeholder='Address'
              value={formData.address}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <input
              type='text'
              name='phoneNumber'
              placeholder='Phone Number'
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='flex space-x-4'>
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300'
            >
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {editingSupplier && (
              <button
                type='button'
                onClick={resetForm}
                className='w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Suppliers */}
      <div className='max-w-3xl mx-auto mt-8'>
        <ul className='space-y-4'>
          {suppliers.map((supplier) => (
            <li
              key={supplier._id}
              className='bg-white p-4 shadow-md rounded-lg'
            >
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-semibold text-gray-800'>
                    Name: {supplier.supplierName}
                  </p>
                  <p className='text-gray-600'>Address: {supplier.address}</p>
                  <p className='text-gray-600'>Phone: {supplier.phoneNumber}</p>
                </div>
                <div className='space-x-2'>
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className='bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier._id)}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
