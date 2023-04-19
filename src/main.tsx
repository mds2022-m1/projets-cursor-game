import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import {
  ApolloClient, createHttpLink, InMemoryCache, ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Connection from './connection/Connection';
import App from './App';

const httpLink = createHttpLink({
  uri: 'https://good-lamb-48.hasura.app/v1/graphql',
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-hasura-admin-secret': 'dF2aerLtIDkk8ZHbsG07ZR8AZXTdsFsZ3G0eVM8O7wyFLH9Ghw23gYMe3sEohYdN',
  },
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(
    {
      typePolicies: {
        player: {
          keyFields: ['uuid'],
        },
      },
    },
  ),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Connection/>}/>
          <Route path="/playground" element={<App/>}/>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
