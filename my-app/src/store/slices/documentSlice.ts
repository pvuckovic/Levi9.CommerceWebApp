import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductResponse } from '../../components/product/products';

export interface DocumentItem {
    productId: number;
    name: string;
    priceValue: number;
    currency: string;
    quantity: number;
}

export interface DocumentState {
    documentType: string;
    clientId: number;
    items: DocumentItem[];
}

export const initialState: DocumentState = {
    documentType: '',
    clientId: 0,
    items: [],
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {

        addItem: (state, action: PayloadAction<ProductResponse>) => {
            const { id, name, priceList } = action.payload;
            const price = priceList[0];

            const existingItem = state.items.find((item) => item.productId === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const newItem: DocumentItem = {
                    productId: id,
                    name,
                    priceValue: price.priceValue,
                    currency: price.currency,
                    quantity: 1,
                };
                state.items.push(newItem);
            }
        },
        setDocumentType: (state, action: PayloadAction<string>) => {
            state.documentType = action.payload;
        },
    },
});

export const { addItem, setDocumentType } = documentSlice.actions;
export default documentSlice.reducer;