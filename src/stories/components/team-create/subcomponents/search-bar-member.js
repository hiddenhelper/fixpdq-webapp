import React from 'react'
import { Dropdown } from 'semantic-ui-react';
import './search-bar.less'

export const SearchBarMember = ( props ) => {
    const allUsers = [
        {
            key: 'Jenny Hess',
            text: 'Jenny Hess',
            value: 'Jenny Hess',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
        {
            key: 'Elliot Fu',
            text: 'Elliot Fu',
            value: 'Elliot Fu',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
        {
            key: 'Stevie Feliciano',
            text: 'Stevie Feliciano',
            value: 'Stevie Feliciano',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
        {
            key: 'Christian',
            text: 'Christian',
            value: 'Christian',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
        {
            key: 'Matt',
            text: 'Matt',
            value: 'Matt',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
        {
            key: 'Justen Kitsune',
            text: 'Justen Kitsune',
            value: 'Justen Kitsune',
            image: { avatar: true, src: 'https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg' },
        },
    ]
    return (
        <Dropdown
            button
            className='icon searchBarClass'
            floating
            labeled
            icon='plus'
            options={allUsers}
            search
            text='Search to add...'
            onChange={(event, data)=>{
                // need to find a user in users  in the future....
                props.addMember(data.value);
            }}
        />
    );
}

export default SearchBarMember;