import React, { useState } from "react";
import volcano from '../volcano.png';
import allPlayers from '../allPlayers.json';
import Search from "./search";
import Roster from "./roster";

const Players = (props) => {
    const [filters, setFilters] = useState({ positions: [] })
    const [players, setPlayers] = useState([])
    if (props.players !== players) setPlayers(props.players)

    const showLeagues = (e) => {
        let p = players
        p.filter(x => x.player === e).map(player => {
            player.isLeaguesHidden = !player.isLeaguesHidden
        })
        setPlayers([...p])
    }
    const showRoster = (player_id, league_id) => {
        let p = players
        p.filter(x => x.player === player_id).map(player => {
            return player.leagues.filter(x => x.league_id === league_id).map(league => {
                return league.isRosterHidden = !league.isRosterHidden
            })
        })
        setPlayers([...p])
    }

    const getSearched = (data) => {
        let p = players
        if (data) {
            p.map(player => {
                return player.isPlayerHidden = true
            })
            p.filter(x => {
                const team = allPlayers[x.player].team === null ? 'FA' : allPlayers[x.player].team
                return `${allPlayers[x.player].full_name} ${allPlayers[x.player].position} ${team}` === data
            }).map(player => {
                return player.isPlayerHidden = false
            })
        } else {
            p.map(player => {
                return player.isPlayerHidden = false
            })
        }
        setPlayers([...p])
    }

    const filterPosition = (e, position) => {
        let f = filters.positions
        if (e.target.checked) {
            const index = f.indexOf(position)
            f.splice(index, 1)
        } else {
            f.push(position)
        }
        setFilters({ ...filters, positions: [...f] })
    }

    return <>
        <div className="checkboxes">
            <label className="position">
                QB
                <input className="clickable" onClick={(e) => filterPosition(e, 'QB')} defaultChecked type="checkbox" />
            </label>
            <label className="position">
                RB
                <input className="clickable" onClick={(e) => filterPosition(e, 'RB')} defaultChecked type="checkbox" />
            </label>
            <label className="position">
                WR
                <input className="clickable" onClick={(e) => filterPosition(e, 'WR')} defaultChecked type="checkbox" />
            </label>
            <label className="position">
                TE
                <input className="clickable" onClick={(e) => filterPosition(e, 'TE')} defaultChecked type="checkbox" />
            </label>
        </div>
        <Search
            list={players.map(player => {
                const team = allPlayers[player.player].team === null ? 'FA' : allPlayers[player.player].team
                return `${allPlayers[player.player].full_name} ${allPlayers[player.player].position} ${team}`
            })}
            placeholder="Search Players"
            sendSearched={getSearched}
        />
        <table className="main">
            <tbody>
                <tr>
                    <th></th>
                    <th>Player</th>
                    <th>KTC Value</th>
                    <th>Record</th>
                </tr>
            </tbody>
            {players.filter(x => x.isPlayerHidden === false && !filters.positions.includes(allPlayers[x.player].position)).sort((a, b) => b.dynasty_value - a.dynasty_value).map((player, index) =>
                <tbody className="slide_up">
                    <tr className={player.isLeaguesHidden ? 'hover clickable' : 'active clickable'} key={player.player} onClick={(e) => showLeagues(player.player)}>
                        <td>
                            <img
                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                className="thumbnail"
                                alt={player.player}
                                src={`https://sleepercdn.com/content/nfl/players/thumb/${player.player}.jpg`}
                                onError={(e) => { return e.target.src = volcano }}
                            />
                        </td>
                        <td>
                            {allPlayers[player.player].position + " " + allPlayers[player.player].first_name + " " +
                                allPlayers[player.player].last_name + " " + (allPlayers[player.player].team === null ? 'FA' :
                                    allPlayers[player.player].team)}
                        </td>
                        <td>{parseInt(player.dynasty_value).toLocaleString("en-US")}</td>
                        <td>{player.wins}-{player.losses}</td>
                    </tr>
                    {player.isLeaguesHidden === true ? null :
                        <tr className="slide_up">
                            <td colSpan={4}>
                                <table className="secondary">
                                    <tbody>
                                        <tr>
                                            <th></th>
                                            <th colSpan={3}>League</th>
                                            <th></th>
                                            <th colSpan={2}>Owner</th>
                                            <th colSpan={2}>Record</th>
                                            <th colSpan={2}>Roster Value</th>
                                        </tr>
                                        {player.leagues.sort((a, b) => a.league_name > b.league_name ? 1 : -1).map(league =>
                                            <React.Fragment>
                                                <tr onClick={() => showRoster(player.player, league.league_id)} className={league.isRosterHidden ? 'hover clickable' : 'active clickable'}>
                                                    <td>
                                                        <img
                                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                                            className="thumbnail"
                                                            alt={league.league_name}
                                                            src={`https://sleepercdn.com/avatars/${league.league_avatar}`}
                                                        />
                                                    </td>
                                                    <td colSpan={3}>{league.league_name}</td>
                                                    <td>
                                                        <img
                                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                                            className="thumbnail"
                                                            alt={league.owner_name}
                                                            src={league.owner_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.owner_avatar}`}
                                                        />
                                                    </td>
                                                    <td colSpan={2}>{league.owner_name}</td>
                                                    <td colSpan={2}>{league.wins}-{league.losses}</td>
                                                    <td colSpan={2}>{league.roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer(cur)), 0).toLocaleString("en-US")}</td>
                                                </tr>
                                                {league.isRosterHidden === true ? null :
                                                    <tr className="slide_up">
                                                        <td colSpan={11}>
                                                            <Roster
                                                                roster={league.roster}
                                                                matchPick={props.matchPick}
                                                                matchPlayer={props.matchPlayer}
                                                            />
                                                        </td>
                                                    </tr>
                                                }
                                            </React.Fragment>
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

