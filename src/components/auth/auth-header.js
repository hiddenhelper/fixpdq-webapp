import React from 'react'
import { css } from 'glamor'

import logo from '../../assets/images/logo.svg'

function AuthHeader({ children }) {
    return (
        <div {...css(styles.header)}>
            <img src={logo} alt='logo' width="120px"/>
        </div>
    )
}

const styles = {
    header: {
        display: 'block'
    }    
}

export default AuthHeader;