
// JWT AUTHENTICATION
export const JWT_AUTHENTICATION = {
    jwt_secret_key: "Some Secret Key",
    expiresIn: 1 * 24 * 60 * 60 * 1000,
}

export const NOUNCE = "some random string";
const MONGODB_USER = "tom"
const MONGODB_PASSWORD = "waterbottle"
export const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.yyiz64c.mongodb.net/?retryWrites=true&w=majority`;

export const SOCKET_SERVER_URL = "https://streaming-server-waterbottle.koyeb.app/"
// export const SOCKET_SERVER_URL = "http://localhost:8000"