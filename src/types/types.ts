export type DecodeType = {
    email: string,
    password: string
};

export type UserUpdatesType = {
    name?: string,
    email?: string,
    password?: string,
    state?: string
};

export type ImageType = {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number
};

export type FilterType = {
    status: boolean,
    stock: object,
    title?: RegExp,
    category?: string,
    state?: string
}

export type ImageTypeModel = {
    url: string,
    public_id: string
};

export type UpdatesProductType = {
    state?: string,
    title?: string,
    description?: string,
    category?: string,
    price?: number,
    status?: Boolean,
    images?: ImageTypeModel[]
}

export type RecoverType = {
    email: string,
    token: string
};