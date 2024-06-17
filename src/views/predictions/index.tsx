
import { FC, useEffect, useState } from "react";
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { useWallet } from '@solana/wallet-adapter-react';


const fetch_predictions = async (publicKey: string) => {
  const response = await fetch('https://parlaydex.com/api/predictions?wallet_key='+publicKey)
  const data = await response.json()
  console.log(data)
  return data.predictions
}

export const PredictionsView: FC = ({ }) => {
  const { publicKey } = useWallet();
  const [predictions, setPredictions] = useState<any>([]);


  useEffect(() => {
    if (publicKey) {
      console.log('Public key:', publicKey.toBase58());

      const update_predictions = async () => {
        const predictions = await fetch_predictions(publicKey.toBase58())
        setPredictions(predictions)
      }

      update_predictions()

    }


  }, [publicKey]);
  
  

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Predictions
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">

          {predictions ?
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
                Your Predictions
                </h2>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Event</th>
                      <th className="px-4 py-2">Market</th>
                      <th className="px-4 py-2">Side</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Stake</th>
                      <th className="px-4 py-2">Confidence</th>
                      <th className="px-4 py-2">Signature</th>
                      <th className="px-4 py-2">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions?.map((prediction: any) => (
                      <tr key={prediction._id}>
                        <td className="border px-4 py-2">{prediction.event_meta.name}</td>
                        <td className="border px-4 py-2">{prediction.selection_meta.market_type}</td>
                        <td className="border px-4 py-2">{prediction.selection_meta.type}</td>
                        <td className="border px-4 py-2">{prediction.price}</td>
                        <td className="border px-4 py-2">{prediction.stake}</td>
                        <td className="border px-4 py-2">{prediction.confidence}</td>
                        <td className="border px-4 py-2">{prediction.signature.slice(0,10)}</td>
                        <td className="border px-4 py-2">{prediction.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            : null
              }
          
        </div>
      </div>
    </div>
  );
};
