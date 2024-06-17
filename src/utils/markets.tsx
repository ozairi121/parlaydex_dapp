
export function parseMarkets(
    data: any
) {
    const group_by_eventID = {}
    data.forEach(g => {
        if (group_by_eventID[g.eventID]) {
            group_by_eventID[g.eventID].push(g)
        } else {
            group_by_eventID[g.eventID] = [g]
        }
    })

    // for each eventID, group by market_type
    const group_by_eventID2 = []
    Object.keys(group_by_eventID).forEach(eventID => {
        const event = group_by_eventID[eventID]
        const group_by_market_type = {}
        event.forEach(market => {
            if (group_by_market_type[market.market_type]) {
                group_by_market_type[market.market_type].push(market)
            } else {
                group_by_market_type[market.market_type] = [market]
            }
        })
        group_by_eventID2.push({
            eventID: eventID,
            event_meta: event[0].event_meta,
            markets: group_by_market_type,
        })
    })

    return group_by_eventID2
}