export const sampleImages = {
  apparelPrimary: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  apparelSecondary: "https://res.cloudinary.com/demo/image/upload/woman.jpg",
  apparelTertiary: "https://res.cloudinary.com/demo/image/upload/shoes.jpg",
};

function product(data) {
  return {
    ...data,
    imageUrl: data.image,
    images: data.images || [data.image],
    active: true,
  };
}

export const products = [
  product({
    id: "basic-t-shirt",
    name: "Basic T-shirt",
    category: "Apparel",
    tags: ["Basics", "Tops"],
    description: "Soft everyday t-shirt for a reusable store catalog.",
    price: 24900,
    image: sampleImages.apparelPrimary,
    badge: "New",
    stock: 12,
  }),
  product({
    id: "urban-jacket",
    name: "Urban jacket",
    category: "Apparel",
    tags: ["Outerwear", "Urban"],
    description: "Light jacket sample product ready to replace with real stock.",
    price: 54900,
    image: sampleImages.apparelSecondary,
    badge: "Featured",
    stock: 8,
  }),
  product({
    id: "daily-accessory",
    name: "Daily accessory",
    category: "Accessories",
    tags: ["Accessories"],
    description: "Accessory sample item for testing the checkout flow.",
    price: 19900,
    image: sampleImages.apparelTertiary,
    badge: "Accessory",
    stock: 10,
  }),
];
