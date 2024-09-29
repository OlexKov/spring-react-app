import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import { accountService } from '../../../services/accountService';
import { LoginButtonProps } from '../../../models/Props';


const GoogleLoginButton:React.FC<LoginButtonProps> = ({onLogin = ()=>{},title,icon}) => {
   
    const login  = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async(authCodeResponse) => {
            const result =  await accountService.googleLogin({token:authCodeResponse.access_token});
            if(result.status === 200){
                console.log(result.data)
                onLogin(result.data.token)
            }

          },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
    });
    
    const handleLoginClick = async(event) => {
        event.preventDefault();
        login();
    };

    return (
        <Button icon={icon} onClick={handleLoginClick}>
           {title}
        </Button>
    );
};

export default GoogleLoginButton;