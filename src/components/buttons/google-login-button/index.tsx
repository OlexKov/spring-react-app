import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'antd';
import { accountService } from '../../../services/accountService';
import { LoginButtonProps } from '../../../models/Props';


const GoogleLoginButton: React.FC<LoginButtonProps> = ({ onLogin = () => { }, title, icon }) => {

    const login = useGoogleLogin({
        onSuccess: async (authCodeResponse) => {
            const result = await accountService.googleLogin({ token: authCodeResponse.access_token });
            if (result.status === 200) {
                console.log(result.data)
                onLogin(result.data.token)
            }

        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
    });

    return (
        <Button icon={icon} onClick={()=>login()}>
            {title}
        </Button>
    );
};

export default GoogleLoginButton;