import {
  Wallet,
  WalletName,
  WalletReadyState,
  isRedirectable,
  useWallet,
} from '@aptos-labs/wallet-adapter-react';
import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { shortenWalletAddress } from '@/utils/shortenWalletAddress';
import { PetraWalletName } from 'petra-plugin-wallet-adapter';
import { AiFillCopy } from 'react-icons/ai';

import { wallets } from '@/context/WalletProvider';

export function ConnectWallet() {
  return (
    <>
      {wallets.map((wallet: Wallet) => {
        return <div key={wallet.name}>{WalletView(wallet)}</div>;
      })}
    </>
  );
}

const WalletView = (wallet: Wallet) => {
  const { connect, connected, account, disconnect } = useWallet();
  // const { setErrorAlertMessage } = useAlert();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  const [isOpen, setIsOpen] = useState(false);

  const onWalletConnectRequest = async (walletName: WalletName) => {
    try {
      await connect(walletName);
    } catch (error: any) {
      window.alert(error);
      console.log(error);
      // setErrorAlertMessage(error);
    }
  };

  const onWalletDisconnectRequest = async () => {
    setIsOpen(false);
    try {
      await disconnect();
    } catch (error: any) {
      window.alert(error);
      // setErrorAlertMessage(error);
    }
  };

  const onGetAWallet = async () => {};

  /**
   * If we are on a mobile browser, adapter checks whether a wallet has a `deeplinkProvider` property
   * a. If it does, on connect it should redirect the user to the app by using the wallet's deeplink url
   * b. If it does not, up to the dapp to choose on the UI, but can simply disable the button
   * c. If we are already in a in-app browser, we dont want to redirect anywhere, so connect should work as expected in the mobile app.
   *
   * !isWalletReady - ignore installed/sdk wallets that dont rely on window injection
   * isRedirectable() - are we on mobile AND not in an in-app browser
   * mobileSupport - does wallet have deeplinkProvider property? i.e does it support a mobile app
   */
  if (!isWalletReady && isRedirectable()) {
    // wallet has mobile app
    if (mobileSupport) {
      return (
        <button
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 hover:bg-blue-700`}
          disabled={false}
          key={wallet.name}
          onClick={() => onWalletConnectRequest(wallet.name)}
        >
          <>{wallet.name}!!</>
        </button>
      );
    }
    // wallet does not have mobile app
    return (
      <button
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded mr-4 opacity-50 cursor-not-allowed`}
        disabled={true}
        key={wallet.name}
      >
        <>{wallet.name}## - Desktop Only</>
      </button>
    );
  } else {
    // we are on desktop view
    return (
      <Menu as='div' className='relative inline-block text-left'>
        {!isWalletReady && !account ? (
          <a
            type='button'
            className='nes-btn is-primary nes-pointer'
            href='https://petra.app'
            target='_blank'
          >
            Get A Wallet
          </a>
        ) : (
          <Menu.Button
            onClick={() =>
              connected
                ? setIsOpen(!isOpen)
                : onWalletConnectRequest(PetraWalletName)
            }
            className={`nes-btn is-primary ${
              isWalletReady
                ? 'hover:bg-blue-700'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isWalletReady && !account && 'Connect Wallet'}
            {account && shortenWalletAddress(account.address)}
          </Menu.Button>
        )}

        {connected && (
          <Transition
            show={isOpen}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <div className='absolute right-0'>
              <div className='nes-container is-dark with-title h-[175px] w-[540px]'>
                <p className='title'>Wallet</p>
                <div className='flex text-white mb-5'>
                  {/* <div className='flex justify-center items-center nes-pointer'>
                    <i className='nes-icon coin' />
                  </div> */}
                  <div className=''>
                    <input
                      className='w-full h-8 rounded px-2 nes-input is-dark nes-pointer disabled'
                      defaultValue={
                        connected && account
                          ? shortenWalletAddress(account.address, 8)
                          : 'Connect Wallet'
                      }
                    />
                  </div>
                  <div className='mx-auto flex justify-center items-center nes-pointer'>
                    <AiFillCopy className='h-8 w-8 drop-shadow-sm' />
                  </div>
                </div>
                <div className='flex text-white justify-between'>
                  <div className='flex justify-center items-center nes-pointer'>
                    <button
                      className='nes-btn is-warning'
                      onClick={() => onWalletDisconnectRequest()}
                    >
                      Change Wallet
                    </button>
                  </div>
                  <div className='flex justify-center items-center nes-pointer'>
                    <button
                      className='nes-btn is-error'
                      onClick={() => onWalletDisconnectRequest()}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        )}
      </Menu>
    );
  }
};
