type token = {
    refresh: string,
    access: string
}
interface storage {
    getToken: () => token,
    setToken: (token: any) => void,
    clearToken: () => void
}
export const storage: storage = {
    getToken: () => window.localStorage.getItem("token")?.toString() == "undefined" ? false : JSON.parse(window.localStorage.getItem("token")!),
    setToken: (token: any) =>
        window.localStorage.setItem("token", JSON.stringify(token)),
    clearToken: () => window.localStorage.removeItem("token")
};
