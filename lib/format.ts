export const formatPrice = (price: number) => {
  const value = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    currencyDisplay: "code",
  }).format(price).replace("COP", "$") + " COP";
  return value;
};
