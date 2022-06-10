import { useState, useEffect } from "react";
import allPlayers from '../allPlayers.json';
import Search from "./search";

const Transactions = (props) => {
    const [transactions, setTransactions] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        setTransactions(props.transactions.sort((a, b) => b.status_updated - a.status_updated))
    }, [props.transactions])

    const getSearchedLeague = (data) => {
        let t = transactions
        if (data) {
            t.filter(x => x.league_name !== data).map(trans => {
                return trans.isTransactionHidden = true
            })
        } else {
            t.map(trans => {
                return trans.isTransactionHidden = false
            })
        }
        setPage(1)
        setTransactions([...t])
    }
    const getSearchedManager = (data) => {
        let t = transactions
        if (data) {
            t.filter(x => x.users.find(y => y.username === data) === undefined).map(trans => {
                return trans.isTransactionHidden = true
            })
        } else {
            t.map(trans => {
                return trans.isTransactionHidden = false
            })
        }
        setPage(1)
        setTransactions([...t])
    }
    const getSearchedPlayer = (data) => {
        let t = transactions
        if (data) {
            const player = Object.keys(allPlayers).find(x => `${allPlayers[x].full_name}` === data)
            t.filter(x => x.adds === null || !Object.keys(x.adds).includes(player)).map(trans => {
                return trans.isTransactionHidden = true
            })
        } else {
            t.map(trans => {
                trans.isTransactionHidden = false
            })
        }
        setTransactions([...t])
    }
    const leagues = Array.from(new Set(transactions.filter(x => x.isTransactionHidden === false).map(trans => {
        return trans.league_name
    })))
    const managers = Array.from(new Set(transactions.filter(x => x.isTransactionHidden === false).map(trans => {
        return trans.users.map(user => {
            return user.username
        })
    }).flat()))
    const players = Array.from(new Set(transactions.filter(x => x.isTransactionHidden === false).map(trans => {
        return trans.adds === null ? [] : Object.keys(trans.adds).map(add => {
            return allPlayers[add].full_name
        })
    }).flat()))

    return <>
        <div className="transaction_searches">
            <Search
                list={leagues}
                placeholder="Search Leagues"
                sendSearched={getSearchedLeague}
            />
            <Search
                list={managers}
                placeholder="Search Managers"
                sendSearched={getSearchedManager}
            />
            <Search 
                list={players}
                placeholder="Search Players"
                sendSearched={getSearchedPlayer}
            />
        </div>
        <ol className="page_numbers">
            {Array.from(Array(parseInt(transactions.filter(x => x.isTransactionHidden === false).length / 50)).keys()).map(key => key + 1).map(page_number =>
                <li
                    key={page_number}
                    className={page_number === page ? 'active_page clickable' : 'clickable'}
                    onClick={() => setPage(page_number)}
                >
                    {page_number}
                </li>
            )}
        </ol>
        <table className="main">
            <tbody>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th colSpan={3}>League</th>
                    <th colSpan={2}>Transaction</th>
                </tr>
                {transactions.filter(x => x.isTransactionHidden === false).sort((a, b) => b.status_updated - a.status_updated).slice((page - 1) * 50, ((page - 1) * 50) + 50).map((trans, index) =>
                    <tr className="transaction_row hover slide_up" key={trans.transaction_id}>
                        <td>{new Date(trans.status_updated).toLocaleString()}</td>
                        <td>{trans.type.replace('_', ' ')}</td>
                        <td>
                            <img
                                style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                className="thumbnail"
                                alt="avatar"
                                src={`https://sleepercdn.com/avatars/${trans.league_avatar}`}
                            />
                        </td>
                        <td colSpan={2}>{trans.league_name}</td>
                        <td colSpan={2}>
                            <div className="transaction">
                                {trans.users.map((user, index) =>
                                    <div className="transaction_user" key={index}>
                                        <p className="header_user">
                                            <img
                                                className="thumbnail_small"
                                                src={`https://sleepercdn.com/avatars/${user.user_avatar}`}
                                            />&nbsp;
                                            {user.username}
                                        </p>
                                        {trans.adds === null ? null : Object.keys(trans.adds).filter(x => trans.adds[x] === user.roster_id).map((player, index) =>
                                            <p className="green" key={index}>
                                                + {`${allPlayers[player].full_name} ${allPlayers[player].position} ${allPlayers[player].team === null ? 'FA' : allPlayers[player].team}`}
                                                <img
                                                    className="thumbnail_small"
                                                    src={`https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg`}
                                                />
                                                {trans.type === 'waiver' ? `$${trans.settings.waiver_bid}` : null}
                                            </p>
                                        )}
                                        {trans.draft_picks.filter(x => x.owner_id === user.roster_id).sort((a, b) => a.season - b.season || a.round - b.round).map((pick, index) =>
                                            <p className="green" key={index}>{`+ ${pick.season} Round ${pick.round} (${pick.original_username})`}</p>
                                        )}
                                        {trans.drops === null ? null : Object.keys(trans.drops).filter(x => trans.drops[x] === user.roster_id).map((player, index) =>
                                            <p className="red" key={index}>
                                                - {`${allPlayers[player].full_name} ${allPlayers[player].position} ${allPlayers[player].team === null ? 'FA' : allPlayers[player].team}`}
                                                <img
                                                    className="thumbnail_small"
                                                    src={`https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg`}
                                                />
                                            </p>
                                        )}
                                        {trans.draft_picks.filter(x => x.previous_owner_id === user.roster_id).sort((a, b) => a.season - b.season || a.round - b.round).map((pick, index) =>
                                            <p className="red" key={index}>{`- ${pick.season} Round ${pick.round}  (${pick.original_username})`}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
}
export default Transactions;