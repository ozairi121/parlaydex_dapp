// TODO: SignMessage
import { useState } from 'react';
import { verify } from '@noble/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

type Prediction = {
    stake: number;
    confidence: number;
    price: number;
    wallet_key: string;
    selection_key: string;
}

type Selection = {
    selectionID: string;
    decimal_price: number;
}

type CreatePredictionProps = {
    data: any;
    selection: Selection;
    close: () => void;
};

function savePrediction(prediction: any) {
    // Save prediction to database
    // const api_url = 'http://localhost:8000/predictions'
    const api_url = 'https://parlaydex.com/api/predictions'

    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prediction),
    })
}

export const BetSlip: FC<CreatePredictionProps> = ({
    data = {},
    selection = {},
    close = () => { },
}) => {
    const [formData, setFormData] = useState({
        stake: '',
        confidence: '',
    })
    const { publicKey, signMessage } = useWallet();

    const onClick = useCallback(async (formData) => {
        try {

            const verified_prediction = {
                stake: formData.stake,
                confidence: formData.confidence,
                price: selection.decimal_price,
                selection_key: selection.selectionID,
            }


            // `publicKey` will be null if the wallet isn't connected
            if (!publicKey) throw new Error('Wallet not connected!');
            // `signMessage` will be undefined if the wallet doesn't support it
            if (!signMessage) throw new Error('Wallet does not support message signing!');
            // Encode anything as bytes
            // const message = new TextEncoder().encode('Hello, world!');
            // Encode json object as bytes
            const message = new TextEncoder().encode(JSON.stringify(verified_prediction));
            // Sign the bytes using the wallet
            const signature = await signMessage(message);
            // Verify that the bytes were signed using the private key that matches the known public key
            if (!verify(signature, message, publicKey.toBytes())) throw new Error('Invalid signature!');
            notify({ type: 'success', message: 'Sign message successful!', txid: bs58.encode(signature) });

            verified_prediction['signature'] = bs58.encode(signature)
            verified_prediction['original_message'] = message
            verified_prediction['wallet_key'] = publicKey.toBase58();
            verified_prediction['event_meta'] = data.event_meta;
            verified_prediction['selection_meta'] = data.selection_meta;
            verified_prediction['eventID'] = data.eventID;

            console.log(verified_prediction)

            savePrediction(verified_prediction)

            close()

        } catch (error: any) {
            notify({ type: 'error', message: `Sign Message failed!`, description: error?.message });
            console.log('error', `Sign Message failed! ${error?.message}`);
        }
    }, [publicKey, notify, signMessage]);

    const new_prediction = {}
    const updateState = new_formData => setFormData({...formData, ...new_formData});

    // console.log('data', data)
    // console.log('selection', selection)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    console.log('formData', formData)
    console.log('selectionData', data)

    if (!data) return (<EmptyComponent />)

    return (
        <div className='border border-white p-2'>
            <h1>
                Create Prediction
                <br/>
                {data?.event_name}
                <br/>
                {data.name}
            </h1>

            <div className="flex flex-row justify-center">
                <form className='px-8 flex flex-row justify-center'>
                    <label>
                        <div className="w-32">Stake:</div>
                        <input
                            type="text"
                            name="stake"
                            value={formData.stake}
                            onChange={handleChange}
                            className='text-black w-16'
                        />
                    </label>
                    <label>
                        <div className="w-32">Confidence:</div>
                        <input
                            type="text"
                            name="confidence"
                            value={formData.confidence}
                            onChange={handleChange}
                            className='text-black w-16'
                        />
                    </label>
                </form>
            </div>
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={() => onClick(formData)} disabled={!publicKey}
                    >
                        <div className="hidden group-disabled:block">
                            Wallet not connected
                        </div>
                        <span className="block group-disabled:hidden" > 
                            Submit Prediction
                        </span>
                    </button>
                </div>
                <button className="group w-60 m-2 btn bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black" onClick={close}>
                    Close
                </button>
        </div>
    );
};

function EmptyComponent() {
    return (
        <div className='border border-white p-2'>
            <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            Betslip
            </h1>
            <div className="text-center mt-10 mb-10 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500">
                <p>No selection made</p>
            </div>
        </div>
    )
}
