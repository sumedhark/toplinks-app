import PropTypes from 'prop-types';
import './authenticate.scss';
import { useEffect } from 'react';
import { post } from '../../utils/serverMethods';
function Authenticate() {
  const getAccessToken = async () => {
    const queryString = new URLSearchParams(window.location.search);
    const oauth_token = queryString.get('oauth_token');
    const oauth_verifier = queryString.get('oauth_verifier');

    if (oauth_token && oauth_verifier) {
      try {
        const { response } = await post('/authenticateUser', {
          oauth_token,
          oauth_verifier,
        });
        if (response) {
          localStorage.setItem(
            'accessTokenData',
            JSON.stringify(response.data.resp)
          );
          localStorage.setItem('successfulLogin', JSON.stringify(true));
          window.close();
        }
        return response;
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const { searchParams } = new URL(window.location);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');

    const accessTokenProcessing = async (token, verifier) => {
      const res = await getAccessToken(token, verifier).then(
        (response) => response
      );
      return res;
    };

    if (oauth_token && oauth_verifier) {
      accessTokenProcessing(oauth_token, oauth_verifier);
    } else {
      window.location.href = '/login';
    }
  }, []);
  return <div className='authenticate row'></div>;
}

Authenticate.propTypes = {
  loginToTwitter: PropTypes.func,
};

export default Authenticate;
