Ape.log("g_env_case:"+g_env_case);

SQL_ALL=1;
SQL_CHAT=2;
SQL_NEWS=3;

// Will be used in loops from now on (2015/01/22) so that when we want to switch to multi-player, we can more easily.
NB_MAX_PLAYERS_PER_TABLE=2;

// LOBBY
MAX_NUMBER_OF_TABLES_PER_LOBBY=20;
MAX_NUMBER_OF_TABLES_PER_PLAYER_PER_LOBBY=4;

NO_OTHER_USER=-1;

// No match currently played by the player so user.match_id equals to:
NO_MATCH=-55;

// Kind of match
MODE_PUZZLE=0;
MODE_TRAINING=1;
MODE_FULL_PLAY=2;
//MODE_LOBBY_PLAY=3;

// Possible cases for the end of a match
// SI ON EN RAJOUTE UN, ON DOIT AUSSI LE METTRE DANS la fonction match_is_considered_played_for_rating() ci-dessous
// SI ON EN RAJOUTE UN, ON DOIT AUSSI LE METTRE DANS la fonction match_is_considered_played_for_rating() ci-dessous
// SI ON EN RAJOUTE UN, ON DOIT AUSSI LE METTRE DANS la fonction match_is_considered_played_for_rating() ci-dessous
// SI ON EN RAJOUTE UN, ON DOIT AUSSI LE METTRE DANS la fonction match_is_considered_played_for_rating() ci-dessous
// SI ON EN RAJOUTE UN, ON DOIT AUSSI LE METTRE DANS la fonction match_is_considered_played_for_rating() ci-dessous
END_MATCH_NORMAL=0;
END_MATCH_DISCONNECTION=1;
END_MATCH_CLOCK=2;
END_MATCH_ILLEGAL_MOVE=3;
END_MATCH_CANCELLED=4;
END_MATCH_PAGE_RELOADED=5;
END_MATCH_LEFT_PAGE=6;
END_MATCH_RESIGNED=33;
END_MATCH_NOT_STARTED=99; // Lire plus haut.

function match_is_considered_played_for_rating(match_end_type)
{
    if (
        match_end_type==END_MATCH_NORMAL
       || match_end_type==END_MATCH_DISCONNECTION
       || match_end_type==END_MATCH_CLOCK
       || match_end_type==END_MATCH_ILLEGAL_MOVE
       || match_end_type==END_MATCH_PAGE_RELOADED
       || match_end_type==END_MATCH_LEFT_PAGE
       || match_end_type==END_MATCH_RESIGNED
   ) return true;
   else return false;
}

// Timeout before a robot move is considered as undecided (=bug)
ROBOT_MOVE_TIMEOUT=8000; // 8s

// Timeout before a player is considered as gone and then loses the game
//MOVE_TIMEOUT=120000// 120000;
if (g_env_case=="local") MOVE_TIMEOUT_AGAINST_HUMAN= 60000002; // 1000 minutes per move against humans
else MOVE_TIMEOUT_AGAINST_HUMAN=120000; // 2 minutes per move against humans
if (g_env_case=="local") MOVE_TIMEOUT_AGAINST_ROBOT= 60000001; // 1000 minutes per move against robots in local mode
else  MOVE_TIMEOUT_AGAINST_ROBOT=600000;  // 10 minutes per move against robots

//Ape.log("ROBOT_MOVE_TIMEOUT:"+ROBOT_MOVE_TIMEOUT);
Ape.log("MOVE_TIMEOUT_AGAINST_HUMAN:"+(MOVE_TIMEOUT_AGAINST_HUMAN/1000)+"s");
Ape.log("MOVE_TIMEOUT_AGAINST_ROBOT:"+(MOVE_TIMEOUT_AGAINST_ROBOT/1000)+"s");
//Ape.log("ROBOT_MOVE_TIMEOUT:"+ROBOT_MOVE_TIMEOUT);
//START_MATCH_TIMEOUT=15000;

MATCH_START_TIMEOUT=60000; // If the match is not started for good (that is user did not connect to the server from game.php) within 60s, then it is cancelled

// Possible results
DRAW=255;
NOT_STARTED=99;

// Connection types
//CONNECTION_FULL=1111; // User car use all APE commands
//CONNECTION_LIGHT=2222; // User can only a few APE commands

// Nb of games while the rating if provisional for a given game_id (=i)
g_nb_of_games_provisional_rating= {};
//for (var i=1;i<=100; i++)
//{
//    // Ca va être plus pour LC et Finito que pour Level X ou d'autre jeux où on joue plus longtemps et où on apprend plus vite
//    g_nb_of_games_provisional_rating[i]=25;
//}

SERVER_READY_TARGET=3; // Nb of Mysql queries needed to complete before the server is ready
Ape.log("SERVER_READY_TARGET:"+SERVER_READY_TARGET);

DELAY_BEFORE_CLOSING_INACTIVE_CHAT=1200000; // must be in milliseconds. 1500000 = 25 min.
DELAY_BEFORE_CLOSING_INACTIVE_CHAT_AFTER_LOGIN=1000000; // must be in milliseconds. 1200000 = 20 min.
//DELAY_BEFORE_CLOSING_INACTIVE_CHAT=12000; // must be in milliseconds. 1500000 = 25 min.
//DELAY_BEFORE_CLOSING_INACTIVE_CHAT_AFTER_LOGIN=8000; // must be in milliseconds. 900000 = 20 min.
//
//DELAY_BEFORE_CLOSING_INACTIVE_CHAT=10000; // must be in milliseconds.

if (g_env_case=="local") CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT=2000;
else if (g_env_case=="staging") CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT=2000;
else CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT=120000;

//Ape.log("CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT:"+CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT)
//Ape.log("ttt");

if (g_env_case=="local") DELAY_BEFORE_DELETING_USER=10000;
else DELAY_BEFORE_DELETING_USER=120000; // 3000=3s;