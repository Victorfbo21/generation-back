export default interface OrderDto {
    client: string,
    restaurant: string,
    whatsapp: string,
    description: string,
    formOfPayment: string,
    moneyChange: number,
    details: [
        {
            item: string,
            quantity: number,
            itemValue: number
        }
    ],
    hash: string
}