export default interface CreateOrderInterface {
    client: string,
    restaurant: string,
    whatsapp: string,
    description: string,
    totalValue: number,
    formOfPayment: string,
    details: [
        {
            item: string,
            quantity: number,
            itemValue: number
        }
    ],
    orderUrl: string
}