import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'

function ProfileFollowers() {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        (async () => {
            try {
                const response = await Axios.get(`/profile/${username}/followers`, {cancelToken: ourRequest.token})
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
            
           {posts.map((follower, index) => {

               return (
                <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                    <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                </Link>
               )
           })}
        </div>
    )
}

export default ProfileFollowers
