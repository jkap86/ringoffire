import { useState, useEffect } from "react";
import allPlayers from '../allPlayers.json';

const Transactions = (props) => {
    const [transactions, setTransactions] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        setTransactions(props.transactions.sort((a, b) => b.status_updated - a.status_updated))
    }, [props.transactions])

    return <>
        <ol className="page_numbers">
            {Array.from(Array(parseInt(transactions.length / 50)).keys()).map(key => key + 1).map(page_number => 
                <li
                    key={page_number} 
                    className={page_number === page ? 'active_page clickable' : 'clickable' }
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
                {transactions.slice((page * 50), (page * 50) + 50).map((trans, index) =>
                    <tr className="transaction_row hover slide_up" key={index}>
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
                                                {trans.type === 'waiver' ? `$${trans.settings.waiver_bid}`: null}
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
        <ol className="page_numbers">
            {Array.from(Array(parseInt(transactions.length / 50)).keys()).map(key => key + 1).map(page_number => 
                <li
                    key={page_number} 
                    className={page_number === page ? 'active_page clickable' : 'clickable' }
                    onClick={() => setPage(page_number)}
                >
                    {page_number}
                </li>    
            )}
        </ol>
    </>
}
export default Transactions;