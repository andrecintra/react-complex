import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import ViewSinglePost from './components/ViewSinglePost'
import FlashMessages from './components/FlashMessages'
import Profile from './components/Profile'
import EditPost from './components/EditPost'
import NotFound from './components/NotFound'
import Search from './components/Search'

import Axios from 'axios';
import { CSSTransition } from 'react-transition-group'
import Chat from './components/Chat';

Axios.defaults.baseURL = "http://localhost:8080"


function Main() {
    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complexappToken")),
        flashMessages: [],
        user: {
            token: localStorage.getItem("complexappToken"),
            username: localStorage.getItem("complexappUsername"),
            avatar: localStorage.getItem("complexappAvatar")
        },
        isSearchOpen: false,
        isChatOpen: false,
        unreadChatCount: 0
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.data
                break;
            case "logout":
                draft.loggedIn = false
                break;
            case "flashMessage":
                draft.flashMessages.push(action.value)
                break;
            case "openSearch":
                draft.isSearchOpen = true
                break;
            case "closeSearch":
                draft.isSearchOpen = false
                break;
            case "toogleChat":
                draft.isChatOpen = !draft.isChatOpen;
                break;
            case "closeChat":
                draft.isChatOpen = false
                break;
            case "incrementUnreadChatCount":
                draft.unreadChatCount++
                break;
            case "clearUnreadChatCount":
                draft.unreadChatCount = 0
                break;
            default:
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {

        if (state.loggedIn) {
            localStorage.setItem("complexappToken", state.user.token)
            localStorage.setItem("complexappUsername", state.user.username)
            localStorage.setItem("complexappAvatar", state.user.avatar)
        } else {
            localStorage.removeItem("complexappToken")
            localStorage.removeItem("complexappUsername")
            localStorage.removeItem("complexappAvatar")
        }

    }, [state.loggedIn])

    useEffect(() => {
        if (state.loggedIn) {
            const ourRequest = Axios.CancelToken.source();
            
            (async()=> {
                try {
                    const response = await Axios.post('/checkToken', {token: state.user.token}, {cancelToken: ourRequest.token})

                    if(!response.data){
                        dispatch({type: "logout"})
                        dispatch({type: "flashMesage", value: "Your sessions has expired. Please log in again."})
                    }
                    
                } catch (error) {
                    console.log(error)
                }
            })()

            return () => ourRequest.cancel()
        }
    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Switch>
                        <Route path="/" exact>
                            {state.loggedIn ? <Home /> : <HomeGuest />}
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
                        <Route path="/profile/:username" exact>
                            <Profile />
                        </Route>
                        <Route path="/post/:id/edit" exact>
                            <EditPost />
                        </Route>
                        <Route path="/profile/:username/followers" component={Profile}></Route>
                        <Route path="/profile/:username/following" component={Profile}></Route>
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                    <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
                        <Search />
                    </CSSTransition>
                    <Chat />
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

ReactDOM.render(<Main />, document.querySelector('#app'))

if (module.hot) {
    module.hot.accept()
}