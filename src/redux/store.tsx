import { configureStore } from "@reduxjs/toolkit";

import MenuReducer from "./reducer/MenuReduce";
import RefreshReducer from "./reducer/RefreshReduce";
import UserReducer from "./reducer/UserReduce";
import ModalReducer from "./reducer/ModalReduce";

const store = configureStore({
    reducer: {
        menu: MenuReducer.reducer,
        refresh: RefreshReducer.reducer,
        user: UserReducer.reducer,
        modal: ModalReducer.reducer,

    }
})

export default store