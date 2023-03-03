import { parseEther } from 'ethers/lib/utils.js'
import React from 'react'
import { useDebounce } from 'use-debounce'
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
import {SiEthereum} from 'react-icons/si'


export default function SendTransaction() {
    const [to, setTo] = React.useState('')
    const [debouncedTo] = useDebounce(to, 500)
    
    const [amount, setAmount] = React.useState('')
    const [debouncedAmount] = useDebounce(amount, 500)
    
    const { config } = usePrepareSendTransaction({
        request: {
        to: debouncedTo,
        value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
        },
    })
    const { data, sendTransaction } = useSendTransaction(config)
    
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })
    return (
        <form
        onSubmit={(e) => {
            e.preventDefault()
            sendTransaction?.()
        }}
        >
        <input
            className='input'
            aria-label="Recipient"
            onChange={(e) => setTo(e.target.value)}
            placeholder="0xA0Cf…251e"
            value={to}
            type="text"
        />
        <input
            className='input'
            aria-label="Amount (ether)"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.05"
            value={amount}
            type="number"
        />
        <button className="send-btn" disabled={isLoading || !sendTransaction || !to || !amount}>
            {isLoading ? 'Sending...' : <SiEthereum/>}
        </button>
        {isSuccess && (
            <div>
                Successfully sent {amount} ether to {to}
                <div>
                    <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                </div>
            </div>
        )}
        </form>
    )
}
