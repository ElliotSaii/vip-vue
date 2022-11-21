import { createStore } from "vuex";
import pagination from "./modules/Pagination";
// import axios from "axios";

export default createStore({
    modules: { pagination }
})