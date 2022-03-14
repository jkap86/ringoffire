const workerpool = require('workerpool')
const axios = require('axios')

const getLeagues = async (season) => {
    const leagues = await axios.get(`https://api.sleeper.app/v1/user/435483482039250944/leagues/nfl/${season}`)
    let leaguesROF = leagues.data.filter(x => x.name.includes('Ring of Fire: '))
    let rostersROF = []
    await Promise.all(leaguesROF.map(async league => {
        const [rosters, users] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/rosters`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/users`)
        ])
        rosters.data.map(roster => {
            rostersROF.push({
                ...roster,
                league_name: league.name,
                league_avatar: league.avatar,
                username: roster.owner_id > 0 ? users.data.find(x => x.user_id === roster.owner_id).display_name : 'orphan',
                user_avatar: roster.owner_id > 0 ? users.data.find(x => x.user_id === roster.owner_id).avatar : null,
                wins: roster.settings.wins,
                losses: roster.settings.losses,
                ties: roster.settings.ties,
                fpts: parseFloat(roster.settings.fpts + '.' + roster.settings.fpts_decimal),
                fpts_against: roster.settings.fpts_against === undefined ? 0 : parseFloat(roster.settings.fpts_against + '.' + roster.settings.fpts_against_decimal)
            })
        })
    }))
    return rostersROF
}

workerpool.worker({
    getLeagues: getLeagues
})