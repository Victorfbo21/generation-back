export default interface MenuDto {
    item:
    {
        name: string,
        price: number,
        dishImage: string,
    }
    owner: string,
    ownerAddress: string,
    ownerPhone: string,
    initialHour: string,
    finalHour: string
}