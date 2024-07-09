import { useNavigate, Outlet } from "react-router-dom"
import { useEffect, useState} from 'react'
import axios from 'axios'

//Root container for authorization check

const AdminLayout = () =>{
    const navigate = useNavigate();
    const [auth, setAuth]=useState(false)
    useEffect(() => {
        const fetchData = async () => {
          try {    
            const response = await axios.get('http://localhost:3000/authCheck');
            setAuth(response.data.auth)
          } catch (error) {
            navigate('/')
            console.log(error)
          }
        }
        fetchData();
      });
    return(
        <div>
            {auth?<Outlet />:<p>Loading</p>}
        </div>
    )
}

export default AdminLayout