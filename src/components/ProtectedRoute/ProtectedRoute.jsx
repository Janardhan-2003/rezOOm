import React from 'react'
import {Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute=({children})=>{
    const token=Cookies.get('authToken');

    if (token===undefined){
        return <Navigate to='/' replace />
    }

    return children
}

export default ProtectedRoute