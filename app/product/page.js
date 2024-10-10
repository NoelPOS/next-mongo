'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import { set } from 'mongoose'

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE

  const columns = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'description', headerName: 'Description', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleUpdate(params.id)}
        >
          Update
        </Button>
      ),
    },
  ]

  const { register, handleSubmit } = useForm()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState([])
  const [currentProduct, setCurrentProduct] = useState({})

  async function fetchProducs() {
    const data = await fetch(`${API_BASE}/product`)
    const p = await data.json()
    const p2 = p.map((product) => {
      return {
        ...product,
        id: product._id,
      }
    })
    setProducts(p2)
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`)
    const c = await data.json()
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id,
      }
    })
    setCategory(c2)
  }

  const createProduct = (data) => {
    fetch(`${API_BASE}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducs())
  }

  const handleUpdate = async (id) => {
    const data = await fetch(`${API_BASE}/product/${id}`)
    const product = await data.json()
    setCurrentProduct(product)
  }

  useEffect(() => {
    fetchCategory()
    fetchProducs()
  }, [])

  return (
    <div className='flex flex-row'>
      <div className='self-center'>
        <form onSubmit={handleSubmit(createProduct)}>
          <div className='grid grid-cols-2 gap-4 m-4 '>
            <div>Code:</div>
            <div>
              <input
                name='code'
                type='text'
                {...register('code', { required: true })}
                className='border border-black w-full'
                value={currentProduct.code}
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name='name'
                type='text'
                {...register('name', { required: true })}
                className='border border-black w-full'
                value={currentProduct.name}
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name='description'
                {...register('description', { required: true })}
                className='border border-black w-full'
                value={currentProduct.description}
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name='name'
                type='number'
                {...register('price', { required: true })}
                className='border border-black w-full'
                value={currentProduct.price}
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name='category'
                {...register('category', { required: true })}
                className='border border-black w-full'
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-span-2'>
              <input
                type='submit'
                value='Add'
                className='bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
              />
            </div>
          </div>
        </form>
      </div>
      <div className='border m-4 bg-slate-300 w-[50%] self-center'>
        <h1 className='text-2xl'>Products ({products.length})</h1>
        <DataGrid rows={products} columns={columns} autoHeight />
      </div>
    </div>
  )
}
