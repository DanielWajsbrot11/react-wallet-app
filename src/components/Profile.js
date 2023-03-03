import React from 'react'
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsName,
    useBalance,
} from 'wagmi'
import SendTransaction from './SendTransaction'

export default function Profile() {
    const { address, connector, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { data, isError} = useBalance({address})
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    
    if (isConnected) {
        if (isLoading) return <div>Fetching balance…</div>
        if (isError) return <div>Error fetching balance</div>
        return (
            <div className='container'>
                <div className='home'>
                    {/* <h1><div className='bold'>Connected to {connector.name}</div></h1> */}
                    <div className='wallet-info'>
                        <p><span className='bold'>Wallet Address:</span> {ensName ? `${ensName} (${address})` : address}</p>
                        <p><span className='bold'>Balance: </span> {data?.formatted} {data?.symbol}</p>
                        <SendTransaction/>
                    </div>
                    <div className='converter'>
                    <crypto-converter-widget
                        live
                        shadow
                        symbol
                        fiat="united-states-dollar"
                        crypto="ethereum"
                        amount="1"
                        border-radius="0.60rem"
                        background-color="#8a2be2"
                        decimal-places="2"/>
                    </div>
                    <br></br>
                    <div className='disconnect-container'>
                        <button className='disconnect-btn' onClick={disconnect}>Disconnect</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='default-home'>
            <h1 className='title'>Web3 Wallet</h1>
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="connect-btn"
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </button>
            ))}
            {error && <div>{error.message}</div>}
        </div>
    )
}
