import { useState } from "react";
import allPlayers from '../allPlayers.json';

const Roster = (props) => {
    const [roster, setRoster] = useState()
    if (props.roster !== roster) setRoster(props.roster)

    const picks = Object.keys(props.roster.draft_picks.picks).map(season =>
        Object.keys(props.roster.draft_picks.picks[season]).map(round =>
            props.roster.draft_picks.picks[season][round].picks.map(pick => {
                return {
                    season: season,
                    round: round,
                    roster_id: pick
                }
            })
        )
    ).flat(2)
    console.log(picks)

    return roster === undefined ? <h1>Loading...</h1> :
        <>
            <table className="secondary">
                <tbody>
                    <tr>
                        <th>Starters</th>
                        <th>Bench</th>
                        <th>IR</th>
                        <th>Taxi</th>
                        <th>Picks</th>
                    </tr>
                    <tr>
                        <td>
                            {roster.starters.map(starter =>
                                <p>{starter === '0' ? 'empty' : allPlayers[starter].position + " " +
                                    allPlayers[starter].first_name + " " + allPlayers[starter].last_name + " " +
                                    (allPlayers[starter].team === null ? 'FA' : allPlayers[starter].team)}</p>
                            )}
                        </td>
                        <td>
                            {roster.players.map(player =>
                                roster.starters.includes(player) || (roster.reserve !== null && roster.reserve.includes(player)) ||
                                    (roster.taxi !== null && roster.taxi.includes(player)) ?
                                    null :
                                    <p>{allPlayers[player].position + " " +
                                        allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                        (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}</p>
                            )}
                        </td>
                        <td>
                            {roster.reserve === null ? null : roster.reserve.map(player =>
                                <p>{allPlayers[player].position + " " +
                                    allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                    (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}</p>
                            )}
                        </td>
                        <td>
                            {roster.taxi === null ? null : roster.taxi.map(player =>
                                <p>{allPlayers[player].position + " " +
                                    allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                    (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}</p>
                            )}
                        </td>
                        <td>
                            {picks.map(pick => 
                                <p>{`${pick.season} Round: ${pick.round}`}</p>  
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
}

export default Roster;