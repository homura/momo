import { Layout } from 'antd';
import { StoreProvider } from 'easy-peasy';
import React from 'react';
import './App.css';
import { Editor } from './containers/Editor';
import { store } from './store';

const { Content } = Layout;

function App() {
  return (
    <StoreProvider store={store}>
      <Layout>
        <Content>
          <Editor />
        </Content>
      </Layout>
    </StoreProvider>
  );
}

export default App;
