export const ADDTOCART = 'ADDTOCART'
export const REMITEM = 'REMITEM'
export const DELCART = 'DELCART'

export const addtoCart = (id, price, name,quan) => {
    return { type: ADDTOCART, itemid: id, itemprice: price, itemname: name, quan: quan }
};
export const remItem = (id) => {
    return { type: REMITEM, itemid: id }
};
export const delCart = () => {
    return {type: DELCART}
}