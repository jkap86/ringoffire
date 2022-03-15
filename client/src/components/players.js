import { useState } from "react";
import volcano from '../volcano.png';
import allPlayers from '../allPlayers.json';

const Players = (props) => {
    const [players, setPlayers] = useState([])
    if (props.players !== players) setPlayers(props.players)

    const showLeagues = (e) => {
        let p = players
        p.filter(x => x.player === e).map(player => {
            player.isLeaguesHidden = !player.isLeaguesHidden
        })
        setPlayers([...p])
    }

    return <>
        <table className="main">
            <tbody>
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>KTC Value</th>
                    <th>Record</th>
                </tr>
            </tbody>
            {players.sort((a, b) => b.dynasty_value - a.dynasty_value).map(player =>
                <tbody>
                    <tr className={player.isLeaguesHidden ? 'hover clickable' : 'active clickable'} key={player.player} onDoubleClick={(e) => showLeagues(player.player)}>
                        <td><img className="thumbnail" alt={player.player} src={`https://sleepercdn.com/content/nfl/players/thumb/${player.player}.jpg`} onError={(e) => { return e.target.src = volcano }} /></td>
                        <td>
                            {allPlayers[player.player].position + " " + allPlayers[player.player].first_name + " " +
                                allPlayers[player.player].last_name + " " + (allPlayers[player.player].team === null ? 'FA' :
                                    allPlayers[player.player].team)}
                        </td>
                        <td>{parseInt(player.dynasty_value).toLocaleString("en-US")}</td>
                        <td>{player.wins}-{player.losses}</td>
                    </tr>
                    {player.isLeaguesHidden === true ? null :
                        <tr>
                            <td colSpan={4}>
                                <table className="secondary">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th colSpan={3}>League</th>
                                            <th></th>
                                            <th colSpan={2}>Owner</th>
                                            <th colSpan={2}>Record</th>
                                        </tr>
                                        {player.leagues.map(league => 
                                            <tr className="hover">
                                                <td><img className="thumbnail" alt={league.league_name} src={`https://sleepercdn.com/avatars/${league.league_avatar}`} /></td>
                                                <td colSpan={3}>{league.league_name}</td>
                                                <td><img className="thumbnail" alt={league.owner_name} src={league.owner_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.owner_avatar}`} /></td>
                                                <td colSpan={2}>{league.owner_name}</td>
                                                <td colSpan={2}>{league.wins}-{league.losses}</td>
                                            </tr>
                                            )}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    }
                </tbody>
            )}

        </table>
    </>
}

export default Players;

