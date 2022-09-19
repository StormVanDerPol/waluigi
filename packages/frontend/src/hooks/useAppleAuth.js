/* global document, window */
import React, { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import client from '../utils/client';

const clientUrl = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
const authAppleEndpoint = '/api/auth-apple';

function useAppleIDAuthClient() {
  const [clientReady, setClientReady] = useState(typeof document !== 'undefined' && !!document.querySelector(`script[src="${clientUrl}"]`));
  useEffect(() => {
    if (clientReady) return;

    const script = document.createElement('script');
    script.setAttribute('src', clientUrl);
    script.setAttribute('async', true);
    script.setAttribute('defer', true);
    document.body.appendChild(script);
    script.onload = () => {
      setClientReady(true);
    };
  }, [clientReady]);

  return { ready: clientReady };
}

export function useAppleAuth() {
  const { ready } = useAppleIDAuthClient();
  const [nonce] = useState(v4());

  useEffect(() => {
    if (!ready) return;
    try {
      window.AppleID.auth.init({
        clientId: 'test.com.resumedia.apple-auth',
        scope: 'name email',
        redirectURI: 'https://kwkz.moe',
        state: `${window.location.pathname}${window.location.search}`,
        nonce, // wtf
        usePopup: true,
      });
    } catch (error) {
      console.error('Apple client error', error);
    }
  }, [ready, nonce]);

  const signIn = useCallback(async () => {
    try {
      if (!ready) throw new Error('AppleID API not ready');

      const authData = await window.AppleID.auth.signIn();

      return client.post(authAppleEndpoint, { ...authData, nonce });
    } catch (error) {
      console.error('Apple sign in error', error);
      return null;
    }
  }, [ready, nonce]);

  return { signIn };
}

// from official resources (jsx-iffied) (secretly removed black bg color) (secretly made smaller)
const appleLogoSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="38px" height="38px" viewBox="6 6 44 44" version="1.1">
    <g id="White-Logo-Square-" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <rect id="Rectangle" fill="#00000000" x="6" y="6" width="44" height="44" />
      <path
        d="M28.2226562,20.3846154 C29.0546875,20.3846154 30.0976562,19.8048315 30.71875,19.0317864 C31.28125,18.3312142 31.6914062,17.352829 31.6914062,16.3744437 C31.6914062,16.2415766 31.6796875,16.1087095 31.65625,16 C30.7304687,16.0362365 29.6171875,16.640178 28.9492187,17.4494596 C28.421875,18.06548 27.9414062,19.0317864 27.9414062,20.0222505 C27.9414062,20.1671964 27.9648438,20.3121424 27.9765625,20.3604577 C28.0351562,20.3725366 28.1289062,20.3846154 28.2226562,20.3846154 Z M25.2929688,35 C26.4296875,35 26.9335938,34.214876 28.3515625,34.214876 C29.7929688,34.214876 30.109375,34.9758423 31.375,34.9758423 C32.6171875,34.9758423 33.4492188,33.792117 34.234375,32.6325493 C35.1132812,31.3038779 35.4765625,29.9993643 35.5,29.9389701 C35.4179688,29.9148125 33.0390625,28.9122695 33.0390625,26.0979021 C33.0390625,23.6579784 34.9140625,22.5588048 35.0195312,22.474253 C33.7773438,20.6382708 31.890625,20.5899555 31.375,20.5899555 C29.9804688,20.5899555 28.84375,21.4596313 28.1289062,21.4596313 C27.3554688,21.4596313 26.3359375,20.6382708 25.1289062,20.6382708 C22.8320312,20.6382708 20.5,22.5950413 20.5,26.2911634 C20.5,28.5861411 21.3671875,31.013986 22.4335938,32.5842339 C23.3476562,33.9129053 24.1445312,35 25.2929688,35 Z"
        id=""
        fill="#FFFFFF"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export function AppleAuthButton({ onAuthenticate }) {
  const { signIn } = useAppleAuth();

  return (
    <div className="flex justify-center mt-2">
      <button
        onClick={() =>
          signIn()
            .then(onAuthenticate)
            .catch(() => {})
        }
        type="button"
        style={{ width: '269px' }}
        className="inline-flex border items-center justify-center rounded-button cursor-pointer relative box-content transition-colors duration-150 overflow-hidden max-w-full focus-visible:ring-4 ring-white bg-black active:bg-gray-600 not-touch:active:bg-gray-600 text-white border-transparent not-touch:hover:bg-gray-800 font-medium ps-2 pe-4 text-base"
      >
        {appleLogoSVG}
        <div className="truncate h-6 ms-1.5 ">Continue with Apple</div>
      </button>
    </div>
  );
}
