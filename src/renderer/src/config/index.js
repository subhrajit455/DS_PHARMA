const websiteUrl = `${import.meta.env.VITE_WEB_BASE_URL}`
const desktopUrl = `${import.meta.env.VITE_DESKTOP_BASE_URL}/api/v1`

export const categoryUrl = {
  getAllCategories: `${desktopUrl}/allcategory`,
  getPaginatedCategories: `${desktopUrl}/categories`,
  deleteCategory: `${desktopUrl}/categories`
}

export const productUrl = {
  getAllProducts: `${desktopUrl}/products`,
  deleteProduct: `${desktopUrl}/product`,
  addProduct: `${desktopUrl}/product`,
  updateProduct: `${desktopUrl}/product`
}

export const customerUrl = {
  getAllCustomers: `${desktopUrl}/parties`
}

export const orderUrl = {
  createOrder: `${desktopUrl}/order`
}

export const websiteOrderUrl = {
  getIncomingOrders: `${websiteUrl}/getallorder`
}
