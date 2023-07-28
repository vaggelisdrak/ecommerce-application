import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"

import { SanityProduct } from "@/config/inventory"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { FeaturedProducts } from "@/components/featured-products"

interface Props {
  params: {
    slug: string
  }
}


export default async function Page({ params }: Props) {
  const product = await client.fetch<SanityProduct>(groq`*[_type == "product" && slug.current == "${params.slug}"][0]{
    _id,
    _createdAt,
    "id": _id,
    name,
    sku,
    images,
    price,
    currency,
    description,
    sizes,
    categories,
    colors,
    "slug": slug.current
  }`)

  const products =  await client.fetch<SanityProduct[]>(groq`*[_type == "product" && slug.current != "${params.slug}" && "${product.categories[0]}" in categories ]{
    _id,
    _createdAt,
    "id": _id,
    name,
    sku,
    images,
    price,
    currency,
    description,
    sizes,
    categories,
    colors,
    "slug": slug.current
  }`)

  console.log(product.categories[0])

  return (
    <main className="mx-auto max-w-5xl sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        {/* Product */}
        <div className="pb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          {/* Product gallery */}
          <ProductGallery product={product}/>
          {/* Product info */}
          <ProductInfo product={product}/>
        </div>
        <hr/><br/>
        <div className="pb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          <h1 className="text-3xl font-bold tracking-tight pl-1">Featured Products</h1>
          <br/><br/>
          <FeaturedProducts products={products}/>
          <br/>
        </div>
      </div>
    </main>
  )
}
