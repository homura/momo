import { createStore, createTypedHooks } from 'easy-peasy';
import { editorModel, EditorModel } from './editor';

interface StoreModel {
  editor: EditorModel;
}

const storeModel: StoreModel = {
  editor: editorModel,
};

export const store = createStore(storeModel);

const typedHooks = createTypedHooks<StoreModel>();
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
