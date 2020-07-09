import React, { useState, useEffect, useContext } from 'react'
import Page from './Page'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import moment from 'moment'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

function ViewSinglePost(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPosts] = useState()

    const { id } = useParams();

    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        (async () => {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                setPosts(response.data)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }
        })();

        return () => {
            ourRequest.cancel();
        }
    }, [])

    if (!isLoading && !post) {
        return (
            <NotFound />
        )
    }

    if (isLoading) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    function isOwner() {

        if(appState.loggedIn) {
            return appState.user.username == post.author.username
        }

        return false;
    }

    async function deleteHandler () {
        const areYouSure = window.confirm("Do You really want to delete this post")

        if (areYouSure){
            try {
                const response = await Axios.delete(`/post/${id}`, {data: {token: appState.user.token}})
                if (response.data == "Success") {

                    appDispatch({type: "flashMessage", value: "Post was Succesfully deleted."})

                    props.history.push(`/profile/${appState.user.username}`)

                }
            } catch (error) {
                console.log("There was a problem.")
            }
        }
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                {isOwner() && (
                    <span className="pt-2">
                        <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></Link>
                        <ReactTooltip id="edit" className="custom-tolltip" />
                        {" "}
                        <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
                        <ReactTooltip id="delete" className="custom-tolltip" />
                    </span>
                )}

            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {moment().format("DD/MM/YYYY")}
            </p>

            <div className="body-content">
                <ReactMarkdown source={post.body} />
            </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost) 
