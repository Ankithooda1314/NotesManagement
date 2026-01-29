import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../ReduxApi/Login/Login.js"
import SignupSlice from "../ReduxApi/Signup/Signup.js"
import CreateNotesSlice from "../ReduxApi/Notes/CreateSlice.js"
import getNotesSlice from "../ReduxApi/Notes/GetNoteSlice.js"
import updateNoteSlice  from "./Notes/UpdateNoteSlice.js";
import deleteNoteSlice from "./Notes/DeleteNoteSlice.js";
import userStatsSlice from "./UserStats/UserStats.js"

const store=configureStore({ 
    reducer:{
        login:LoginSlice,
         signup:SignupSlice,
         notes:CreateNotesSlice,
         getNote:getNotesSlice,
         updateNote:updateNoteSlice,
         deleteNote:deleteNoteSlice,
          userStats: userStatsSlice 



    }
})

export default store;