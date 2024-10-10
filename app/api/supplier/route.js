import Supplier from '@/models/Supplier'

// GET: Fetch suppliers with pagination
export async function GET(request) {
  const pno = request.nextUrl.searchParams.get('pno')
  if (pno) {
    const size = 3
    const suppliers = await Supplier.find()
      .skip((pno - 1) * size)
      .limit(size)
    return Response.json(suppliers)
  }
  const suppliers = await Supplier.find()
  return Response.json(suppliers)
}

// POST: Create a new supplier
export async function POST(request) {
  const body = await request.json()
  const supplier = new Supplier(body)
  await supplier.save()
  return Response.json(supplier)
}

// PUT: Update an existing supplier by ID
export async function PUT(request) {
  const data = await request.json()
  const supplier = await Supplier.findByIdAndUpdate(data._id, data, {
    new: true,
  })
  return Response.json(supplier)
}

// DELETE: Remove a supplier by ID
export async function DELETE(request) {
  const { id } = await request.json()
  await Supplier.findByIdAndDelete(id)
  return Response.json({ message: 'Supplier deleted successfully' })
}
