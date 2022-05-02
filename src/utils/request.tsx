type RequestParams = {
    url: string,
    method?: string,
    data?: any
}
export const request = ({ url, method, data }: RequestParams) => {
    const base_url = 'http://localhost:8080/'
    return fetch(base_url + url, {
        method: method,
        body: data
    })
}