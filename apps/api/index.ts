import app from "./app"

export type ApiType = typeof app

export default{
    port: 3000,
    fetch: app.fetch,
}