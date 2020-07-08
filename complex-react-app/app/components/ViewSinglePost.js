import React, {useState, useEffect} from 'react'
import Page from './Page'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import moment from 'moment'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'

function ViewSinglePost() {
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPosts] = useState()

    const {id} = useParams();

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        (async () => {
            try {
                const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
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

    if (isLoading) {
        return (
            <Page title="...">
                <LoadingDotsIcon/>
            </Page>
        )
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                <span className="pt-2">
                    <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></Link>
                    <ReactTooltip id="edit" className="custom-tolltip" />
                    {" "}
                    <a data-tip="Delete" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
                    <ReactTooltip id="delete" className="custom-tolltip" />
                </span>
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

export default ViewSinglePost
