import React, { useEffect, useContext, useState } from 'react'
import Page from './Page'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import StateContext from '../StateContext'
import ProfilePosts from './ProfilePosts'

function Profile() {

    const { username } = useParams()
    const appState = useContext(StateContext)
    const [profile, setProfile] = useState({
        "profileUsername": "andre4",
        "profileAvatar": "https://gravatar.com/avatar/placeholder?s=128",
        "isFollowing": false,
        "counts":
        {
            "postCount": "0",
            "followerCount": "0",
            "followingCount": "0"
        }
    })

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();

        (async () => {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: appState.user.token })
                setProfile(response.data)
            } catch (error) {
                console.log(error)
            }
        })();

        return () => {
            ourRequest.cancel();
        }
    }, [])

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profile.profileAvatar} /> {profile.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profile.counts.postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profile.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profile.counts.followingCount}
                </a>
            </div>

            <ProfilePosts />
        </Page>
    )
}

export default Profile
