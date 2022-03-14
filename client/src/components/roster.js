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

    const roster_value = roster === undefined ? 0 : roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0)
    const picks_value = roster === undefined ? 0 : picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
    return roster === undefined ? <h1>Loading...</h1> :
        <>
            <table className="secondary">
                <tbody>
                    <tr>
                        <th></th>
                        <th className="values">
                            Roster: {roster_value.toLocaleString("en-US")}
                        </th>
                        <th className="values">
                            Picks: {picks_value.toLocaleString("en-US")}
                        </th>
                        <th className="values">
                            Total: {parseInt(roster_value + picks_value).toLocaleString("en-US")}
                        </th>
                        <th></th>
                    </tr>
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
                                <p>
                                    {starter === '0' ? 'empty' : allPlayers[starter].position + " " +
                                        allPlayers[starter].first_name + " " + allPlayers[starter].last_name + " " +
                                        (allPlayers[starter].team === null ? 'FA' : allPlayers[starter].team)}
                                    <em>
                                        : {props.matchPlayer(starter)}
                                    </em>
                                </p>
                            )}
                        </td>
                        <td>
                            {roster.players.map(player =>
                                roster.starters.includes(player) || (roster.reserve !== null && roster.reserve.includes(player)) ||
                                    (roster.taxi !== null && roster.taxi.includes(player)) ?
                                    null :
                                    <p>
                                        {allPlayers[player].position + " " +
                                            allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                            (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                        <em>
                                            : {props.matchPlayer(player)}
                                        </em>
                                    </p>
                            )}
                        </td>
                        <td>
                            {roster.reserve === null ? null : roster.reserve.map(player =>
                                <p>
                                    {allPlayers[player].position + " " +
                                        allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                        (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                    <em>
                                        : {props.matchPlayer(player)}
                                    </em>
                                </p>
                            )}
                        </td>
                        <td>
                            {roster.taxi === null ? null : roster.taxi.map(player =>
                                <p>
                                    {allPlayers[player].position + " " +
                                        allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                        (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                    <em>
                                        : {props.matchPlayer(player)}
                                    </em>
                                </p>
                            )}
                        </td>
                        <td>
                            {picks.map(pick =>
                                <p>
                                    {`${pick.season} Round: ${pick.round}`}
                                    <em>
                                        : {props.matchPick(pick.season, pick.round)}
                                    </em>
                                </p>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
}

export default Roster;