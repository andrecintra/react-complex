import React, {useState, useEffect} from 'react'
import Page from './Page'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import moment from 'moment'

function ViewSinglePost() {
    const [isLoading, setIsLoading] = useState(true)
    const [post, setPosts] = useState()

    const {id} = useParams();

    useEffect(() => {
        (async () => {
            try {
                const response = await Axios.get(`/post/${id}`)
                setPosts(response.data)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }
        })();
    }, [])

    if (isLoading) {
        return (
            <Page title="...">
                <div>Loading...</div>
            </Page>
        )
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                <span className="pt-2">
                    <a href="#" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"></i></a>
                    <a className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
                </span>
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {moment().format("DD/MM/YYYY")}
            </p>

            <div className="body-content">
                {post.body}
            </div>
        </Page>
    )
}

export default ViewSinglePost
