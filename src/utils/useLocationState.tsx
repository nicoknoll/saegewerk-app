import { useLocation, useNavigate } from '@solidjs/router';

const useLocationState = (): [any, (state: any) => void] => {
    const navigate = useNavigate();
    const location = useLocation();

    const setState = (state: any) => {
        const fullPath = `${location.pathname}${location.search}${location.hash}`;

        navigate(fullPath, { state, replace: true });
    };

    return [location.state, setState];
};

export default useLocationState;
