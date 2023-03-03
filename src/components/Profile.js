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
            <div className='home'>
                <div>Connected to {connector.name}</div>
                <div ><span className='bold'>Wallet Address:</span> {ensName ? `${ensName} (${address})` : address}</div>
                <p><span className='bold'>Balance: </span> {data?.formatted} {data?.symbol}</p>
                <div><SendTransaction/></div>
                <br></br>
                <button className='disconnect-btn' onClick={disconnect}>Disconnect</button>
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
