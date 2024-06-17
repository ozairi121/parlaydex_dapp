import { FC } from "react";
import { useState, useEffect } from 'react';
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { CreatePrediction } from '../../components/CreatePrediction';
import axios from 'axios';
import { test_data } from './markets';
import { parseMarkets } from '../../utils/markets';


/*
Prediction data should store:

- eventID
- market_type
- selectionID
- stake
- confidence
- price
- signature

meta_information:
- event name
- event date
- event time
- market name



*/

const fetch_markets = async () => {
  const response = await fetch('http://127.0.0.1:8000/nba/markets')
  const data = await response.json()
  // console.log(data)
  return data.markets
}


export const MarketsView: FC = ({ }) => {
  
  const [data, setData] = useState(null)
  const [current_selection, setCurrentSelection] = useState(null)
  const [isLoading, setLoading] = useState(true)
 
  useEffect(() => {
    // setData(test_data)
    // Add true API call to fetch markets

      const update_markets = async () => {
        const markets = await fetch_markets()
        const parsed_markets = parseMarkets(markets)
        console.log(parsed_markets)
        setData(parseMarkets(markets))
        setLoading(false)
      }

      update_markets()



    // const available_markets = parseMarkets(test_data)
    // console.log(available_markets)
    // setData(available_markets)
    // setLoading(false)
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>
 
  const prediction = {
    stake: 4,
    confidence: 90,
    price: -110,
    selection_key: 'F9A8G',
  }

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Available Markets
        </h1>
        {/* CONTENT GOES HERE */}



        {data ? (
            data?.map(event => {
              return (
                <div className='border p-4 w-full' key={event.eventID}>
                  <div className='flex items-center'>
                    <div>{event.event_meta.date}</div>
                    <div>{event.event_meta.time}</div>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex items-center'>
                      <img src={`/nba_logos/${event.event_meta.awayID.replace(/\s/g, '-').toLowerCase()}.svg`}
                      className='w-16 h-16'
                      />
                      {event.event_meta.awayID}
                    </div>
                    <div className='text-center w-24'>
                      vs
                    </div>
                    <div className='flex items-center'>
                      {event.event_meta.homeID}
                      <img src={`/nba_logos/${event.event_meta.homeID.replace(/\s/g, '-').toLowerCase()}.svg`}
                      className='w-16 h-16'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col items-center'>
                    {Object.keys(event.markets||{}).map(market_type => {
                      const markets = event.markets[market_type]
                      const key = `${event.eventID}-${market_type}`
                      return (
                        <div className='' key={key}>
                          <div>{market_type}</div>
                          <div className='flex items-center gap-4'>
                            {markets.map(market => {
                              const this_selection = {
                                ...market,
                                eventID: event.eventID,
                                event_name: event.event_meta.name,
                                market_type: market_type,
                                selectionID: market.selectionID,
                                name: market['full_name'],
                                selection_meta: {
                                  name: market['full_name'],
                                  market_type: market_type,
                                }
                              }
                              return (
                                <div className='border w-40 text-center rounded cursor-pointer hover:bg-gray-100' onClick={() => setCurrentSelection(this_selection)}
                                  key={market.selectionID}
                                >
                                  <div>{market['full_name']}</div>
                                </div>
                              )
                            })}
                            
                          </div>

                        </div>
                      )
                    })}
                    
                  </div>
                </div>
              )
            })
          ) : (
            <p>Loading...</p>
          )}



          {current_selection ?
            <CreatePrediction data={current_selection} selection={current_selection} />
            : null}


        {/* <div className="text-center">
          <CreatePrediction data={prediction} />
        </div> */}
      </div>
    </div>
  );
};
