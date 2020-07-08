import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import Axios from 'axios'
import moment from 'moment'
import LoadingDotsIcon from './LoadingDotsIcon'

function ProfilePosts() {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        (async () => {
            try {
                const response = await Axios.get(`/profile/${username}/posts`, {cancelToken: ourRequest.token})
                setIsLoading(false)
                setPosts(response.data)
            } catch (error) {
                console.log(error)
            }
        })();

        return () => {
            ourRequest.cancel();
        }
    }, [])

    if (isLoading) {
        return <LoadingDotsIcon />
    }

    return (
        <div className="list-group">
            
           {posts.map((post) => {
               const date = new Date(post.createdDate)
               const dateFormatted = moment(date).format("DD/MM/YYYY");

               return (
                <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                    <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> {" "}
                    <span className="text-muted small">on {dateFormatted} </span>
                </Link>
               )
           })}
        </div>
    )
}

export default ProfilePosts
