import React from 'react'
import {Link} from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-top text-center small text-muted py-3">
            <p><Link to="/">Home</Link> | <Link to="/about-us">About Us</Link> | <Link to="/terms">Terms</Link></p>
            <p className="m-0">Copyright &copy; 2020 <a href="/" className="text-muted">ComplexApp</a>. All rights reserved.</p>
        </footer>
    )
}

export default Footer;