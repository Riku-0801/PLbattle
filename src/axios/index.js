import axios from "axios";

// baseURLの設定
const http = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "https://code--duel.herokuapp.com/api"
      : "/api",
});

export default http;
