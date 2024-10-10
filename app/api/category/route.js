import Category from '@/models/Category'

export async function GET(request) {
  const pno = request.nextUrl.searchParams.get('pno')
  if (pno) {
    const size = 3
    const categories = await Category.find()
      .skip(pno - 1)
      .limit(size)
    return Response.json(categories)
  }
  const categories = await Category.find()
  return Response.json(categories)
}

export async function POST(request) {
  const body = await request.json()
  const category = new Category(body)
  await category.save()
  return Response.json(category)
}

export async function PUT(request) {
  const data = await request.json()
  const category = await Category.findByIdAndUpdate(data._id, data)
  return Response.json(category)
}
