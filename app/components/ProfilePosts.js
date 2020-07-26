import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import Axios from 'axios'
import moment from 'moment'
import LoadingDotsIcon from './LoadingDotsIcon'
import Post from './Post'

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
    }, [username])

    if (isLoading) {
        return <LoadingDotsIcon />
    }

    return (
        <div className="list-group">
            
           {posts.map((post) => {
               return <Post noAuthor={true} post={post} key={post._id}/>
           })}
        </div>
    )
}

export default ProfilePosts
