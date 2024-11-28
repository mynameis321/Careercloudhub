import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category:null,
    editCategory:false,
    categoryLoading:false
}

const categorySlice = createSlice({
    name:"job",
    initialState,
    reducers:{
        setCategory: (state , action)=>{
            state.category = action.payload;
        },
        setEditCategory: (state , action)=>{
            state.editCategory = action.payload;
        },
        setCatgeoryLoading:(state,action)=>{
            state.categoryLoading = action.payload;
        },
        resetcategoryState: (state)=>{
            state.category = null;
            state.editCategory = false;
        }
    }
});

export const { 
    setCategory,
    setEditCategory,
    setCatgeoryLoading,
    resetcategoryState
} = categorySlice.actions;

export default categorySlice.reducer;