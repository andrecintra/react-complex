import React, { useState, useReducer } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'
import ExampleContext from './ExampleContext';

import Axios from 'axios';

Axios.defaults.baseURL = "http://localhost:8080"


function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: []
    }

    function ourReducer(state, action) {
        switch (action.type) {
            case "login":
                return {loggedIn: true, flashMessages: state.flashMessages}

            case "logout":

                return {loggedIn: false, flashMessages: state.flashMessages}
            case "flashMessage":

                return {loggedIn: state.loggedIn, flashMessages: state.flashMessages.concat(action.value)}

            default:
                break;
        }
    }

    const [state, dispatch] = useReducer(ourReducer, initialState)

    const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexappToken")))
    const [flashMessages, setFlashMessages] = useState([])

    function addFlashMessages(msg) {

        setFlashMessages(prev => prev.concat(msg))
    }

    return (
        <ExampleContext.Provider value={{ addFlashMessages, setLoggedIn }}>
            <BrowserRouter>
                <FlashMessages messages={flashMessages} />
                <Header loggedIn={loggedIn} />
                <Switch>
                    <Route path="/" exact>
                        {loggedIn ? <Home /> : <HomeGuest />}
                    </Route>
                    <Route path="/create-post" exact>
                        <CreatePost />
                    </Route>
                    <Route path="/about-us" exact>
                        <About />
                    </Route>
                    <Route path="/terms" exact>
                        <Terms />
                    </Route>
                    <Route path="/post/:id" exact>
                        <ViewSinglePost />
                    </Route>
                </Switch>
                <Footer />
            </BrowserRouter>
        </ExampleContext.Provider>
    )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if (module.hot) {
    module.hot.accept()
}