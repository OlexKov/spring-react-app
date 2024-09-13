import { useNavigate } from "react-router-dom";
import logo from '../../../../logo.png';
import { Menu } from "../../menu/menu";


const Header: React.FC =() => {
    const navigate = useNavigate();

    return (
        <header>
           <div className='w-70 h-100 mx-auto d-flex  justify-content-between align-items-center'>
            <div className="d-flex gap-4">
                <img onClick={()=>navigate('/')} style={{ marginLeft:30, height: 45, width: 45, cursor:'pointer' }} src={logo} alt='logo' />
                <Menu/>
            </div>
               
                <div className=' d-flex gap-5'>
                    
                </div>
            </div>
        </header>
    );
};

export default Header;