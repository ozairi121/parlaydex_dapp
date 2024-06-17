import { FC } from "react";
import { useState, useEffect } from 'react';
import { SignMessage } from '../../components/SignMessage';
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { CreatePrediction } from '../../components/CreatePrediction';
import { BetSlip } from '../../components/BetSlip';
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
  return parseMarkets(data.markets)
}


export const MarketsView: FC = ({ }) => {
  
  const [data, setData] = useState(null)
  const [current_selection, setCurrentSelection] = useState(null)
  const [current_selections, setCurrentSelections] = useState([])
  const [isLoading, setLoading] = useState(true)

  const update_selections = (selection) => {
    setCurrentSelections([...current_selections, selection])
  }

  const remove_selection = (selection) => {
    const new_selections = current_selections.filter(s => s.selectionID !== selection.selectionID)
    setCurrentSelections(new_selections)
  }
 
  useEffect(() => {
    // setData(test_data)
    // Add true API call to fetch markets

      const update_markets = async () => {
        const markets = await fetch_markets()
        setData(markets)
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
    <div className="w-full">
      <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
        Available Markets
      </h1>
      <div className='flex gap-8 justify-center'>
          
          <div className="w-2/4">
            <ViewEvents data={data} setCurrentSelection={setCurrentSelection} />
          </div>

          <div className="w-1/4">
              <BetSlip data={current_selection} selection={current_selection} close={() => setCurrentSelection(null)} />
          </div>

      </div>
    </div>
  );
};

function ViewEvents({ data, setCurrentSelection }) {
  return (
    <>
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
                  <div className='flex flex-row items-center gap-4 text-center'>
                    {Object.keys(event.markets||{}).map(market_type => {
                      const markets = event.markets[market_type]
                      const key = `${event.eventID}-${market_type}`
                      return (
                        <div className='' key={key}>
                          <div>{market_type}</div>
                          <div className='flex flex-col items-center gap-4'>
                            {markets.map(market => {
                              const this_selection = {
                                ...market,
                                eventID: event.eventID,
                                selectionID: market.selectionID,
                                event_name: event.event_meta.name,
                                name: market['full_name'],
                                selection_meta: {
                                  name: market['full_name'],
                                  market_type: market_type,
                                  type: market.type,
                                  price: market.price,
                                  line: market.line,
                                  odds: market.odds,
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
    </>
  )
}
