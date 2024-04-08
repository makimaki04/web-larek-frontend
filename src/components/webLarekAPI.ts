import { Api, ApiListResponse } from "./base/api";
import { IAppItem, IAppModel, IOrder, IOrderResult } from "../types";

export interface IWebLarekAPI {
    getItemList: () => Promise<IAppItem[]>;
    getLotItem: (id: string) => Promise<IAppItem>;
}

export class WebLarekAPI extends Api{
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItemList(): Promise<IAppItem[]> {
        return this.get('/product').then(
            (data: ApiListResponse<IAppItem>) => 
                data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image
                }))
        )
    }

    getItem(id: string):Promise<IAppItem> {
        return this.get(`/product/${id}`).then(
            (item: IAppItem) => ({
                ...item,
                image: this.cdn + item.image
            })
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}