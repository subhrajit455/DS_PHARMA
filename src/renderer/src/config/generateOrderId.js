export const generateOrderId = () => {
  const now = Date.now()
  return now.toString().slice(0, 9)
}
