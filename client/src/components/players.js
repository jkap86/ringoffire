import { useState } from "react";
import volcano from '../volcano.png';
import allPlayers from '../allPlayers.json';
import Search from "./search";
import { motion } from 'framer-motion';

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
                <motion.tbody
                    key={index}
                    initial={{ y: 900 }}
                    animate={{ y: 0 }}
                    exit={{ y: 900 }}
                    transition={{ duration: 1, type: "spring" }}
                >
                    <tr className={player.isLeaguesHidden ? 'hover clickable' : 'active clickable'} key={player.player} onClick={(e) => showLeagues(player.player)}>
                        <td>
                            <motion.img
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
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
                        <motion.tr
                            key={index}
                            initial={{ y: 900 }}
                            animate={{ y: 0 }}
                            exit={{ y: 900 }}
                            transition={{ duration: 1, type: "spring" }}
                        >
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
                                                <td>
                                                    <motion.img
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                                        className="thumbnail"
                                                        alt={league.league_name}
                                                        src={`https://sleepercdn.com/avatars/${league.league_avatar}`}
                                                    />
                                                </td>
                                                <td colSpan={3}>{league.league_name}</td>
                                                <td>
                                                    <motion.img
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: Math.random() * 10 + 2 }}
                                                        className="thumbnail"
                                                        alt={league.owner_name}
                                                        src={league.owner_avatar === null ? volcano : `https://sleepercdn.com/avatars/${league.owner_avatar}`}
                                                    />
                                                </td>
                                                <td colSpan={2}>{league.owner_name}</td>
                                                <td colSpan={2}>{league.wins}-{league.losses}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </td>
                        </motion.tr>
                    }
                </motion.tbody>
            )}

        </table>
    </>
}

export default Players;

