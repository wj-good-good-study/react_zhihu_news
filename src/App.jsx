import React from "react";
import { BrowserRouter } from 'react-router-dom';
import RouterView from "./router";
import { KeepAliveProvider } from "keepalive-react-component/lib";
const App = function App() {
    return (
        <BrowserRouter>
            <KeepAliveProvider>
                <RouterView />
            </KeepAliveProvider >
        </BrowserRouter>
    )
}
export default App;