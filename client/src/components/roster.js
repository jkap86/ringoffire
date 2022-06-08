import { useState } from "react";
import allPlayers from '../allPlayers.json';
import volcano from '../volcano.png';

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
                        <th colSpan={2} className="values">
                            Roster: {roster_value.toLocaleString("en-US")}
                        </th>
                        <th colSpan={2} className="values">
                            Picks: {picks_value.toLocaleString("en-US")}
                        </th>
                        <th colSpan={2} className="values">
                            Total: {parseInt(roster_value + picks_value).toLocaleString("en-US")}
                        </th>
                    </tr>
                    <tr>
                        <td colSpan={3} className="top">
                            <div className="roster_group">
                                <p className="header">Starters</p>
                                {roster.starters.map(starter =>
                                    <p className="hover left">
                                        <img
                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                            className="thumbnail"
                                            alt="headshot"
                                            src={`https://sleepercdn.com/content/nfl/players/thumb/${starter}.jpg`}
                                            onError={(e) => { return e.target.src = volcano }}
                                        />
                                        {starter === '0' ? 'empty' : allPlayers[starter].position + " " +
                                            allPlayers[starter].first_name + " " + allPlayers[starter].last_name + " " +
                                            (allPlayers[starter].team === null ? 'FA' : allPlayers[starter].team)}
                                        <em>
                                            : {props.matchPlayer(starter)}
                                        </em>
                                    </p>
                                )}
                            </div>
                        </td>
                        <td colSpan={3} className="top">
                            <div className="roster_group">
                                <p className="header">Bench</p>
                                {roster.players.sort((a, b) => props.matchPlayer(b) - props.matchPlayer(a)).map(player =>
                                    roster.starters.includes(player) || (roster.reserve !== null && roster.reserve.includes(player)) ||
                                        (roster.taxi !== null && roster.taxi.includes(player)) ?
                                        null :
                                        <p className="hover left">
                                            <img
                                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                                className="thumbnail"
                                                alt="headshot"
                                                src={`https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg`}
                                                onError={(e) => { return e.target.src = volcano }}
                                            />
                                            {allPlayers[player].position + " " +
                                                allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                                (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                            <em>
                                                : {props.matchPlayer(player)}
                                            </em>
                                        </p>
                                )}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className="top">
                            <div className="roster_group">
                                <p className="header">Taxi</p>
                                {roster.taxi === null ? null : roster.taxi.sort((a, b) => props.matchPlayer(b) - props.matchPlayer(a)).map(player =>
                                    <p className="hover left">
                                        <img
                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                            className="thumbnail"
                                            alt="headshot"
                                            src={`https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg`}
                                            onError={(e) => { return e.target.src = volcano }}
                                        />
                                        {allPlayers[player].position + " " +
                                            allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                            (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                        <em>
                                            : {props.matchPlayer(player)}
                                        </em>
                                    </p>
                                )}
                            </div>
                        </td>
                        <td colSpan={3} className="top">
                            <div className="roster_group">
                                <p className="header">IR</p>
                                {roster.reserve === null ? null : roster.reserve.sort((a, b) => props.matchPlayer(b) - props.matchPlayer(a)).map(player =>
                                    <p className="hover left">
                                        <img
                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                            className="thumbnail"
                                            alt="headshot"
                                            src={`https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg`}
                                            onError={(e) => { return e.target.src = volcano }}
                                        />
                                        {allPlayers[player].position + " " +
                                            allPlayers[player].first_name + " " + allPlayers[player].last_name + " " +
                                            (allPlayers[player].team === null ? 'FA' : allPlayers[player].team)}
                                        <em>
                                            : {props.matchPlayer(player)}
                                        </em>
                                    </p>
                                )}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="top picks">
                            <div className="roster_group">
                                <p className="header">Draft Picks</p>
                                {picks.map(pick =>
                                    <p className="hover left">
                                        {`${pick.season} Round: ${pick.round}`}
                                        <em>
                                            : {props.matchPick(pick.season, pick.round)}
                                        </em>
                                    </p>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
}

export default Roster;