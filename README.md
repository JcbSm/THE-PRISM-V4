# THE-PRISM-V4
 
Small discord bot for small servers.

The bot exclusively uses application commands (better known as slash commands), to limit the need for message content.
However, if the counting feature is enabled, it will read your messsage content, ONLY in the counting channel.

# Features
## Administration
Administration commands. All the commands below require the `Administrator` permission to use.
- `/channel`
    - Sets the channel for a specific feature.
- `/levelroles add`
    - Adds new a new level role (see XP)
- `/levelroles manage`
    - Manages the current level roles.
## Calls
Calls are temporary voice channels which users can create and manage themselves. They can modify the visibility (for @everyone) and the userlimit.
- `/call`
    - Creates a call. 
## Fun
- `/handgrab`
    - Lay a handgrab trap.<br>
    - <details><summary>Image</summary>
        <p align="center"><img src="https://i.imgur.com/af3w8E3.png" width=800></p>
    </details>
- `/rps`
    - Play rock paper scissors with the homies
    - W/L/D is tracked per-server and is visible on `/stats`
## Statistics
- `/stats`
    - View your server stats.
        - Message count
        - Voice chat time
        - Global stats
    - Also available on user context menu
## Tools & Utilities
- `/avatar`
    - View a user's avatar
    - Also available on user context menu
- `/ping`
    - View the bot's ping
- `/roll`
    - Roll a dice
## XP and Levelling
XP is earnt by messaging & calling in the server.
- 3-7 is earny per message sent (1 minute cooldown)
- 5 minutes is earnt every 5 minutes of (not alone/deafened) voice chat time.
### Commands
- `/levels`
    - View the xp leaderboard for the server.
- `/xp`
    - View user XP and level.
    - Also available on user context menu.