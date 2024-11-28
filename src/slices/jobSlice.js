import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    job:null,
    editJob:false,
    jobLoading:false
}

const jobSlice = createSlice({
    name:"job",
    initialState,
    reducers:{
        setJob: (state , action)=>{
            state.job = action.payload;
        },
        setEditJob: (state , action)=>{
            state.editJob = action.payload;
        },
        setJobLoading:(state,action)=>{
            state.jobLoading = action.payload;
        },
        resetJobState: (state)=>{
            state.job = null;
            state.editJob = false;
        }
    }
});

export const { 
    setJob,
    setEditJob,
    setJobLoading,
    resetJobState 
} = jobSlice.actions;

export default jobSlice.reducer;