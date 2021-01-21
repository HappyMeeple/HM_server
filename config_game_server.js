//path_games_js="files://var/www/TestAPE2/js/games/";


//g_path_js="../../var/www/HM/min_js/";
//g_path_games_js=g_path_js + "games/";
//g_path_common_js=g_path_js + "common/";
//g_path_game_common_js=g_path_js+"game_common/";

//include(g_path_games_js+"game.min");
//include(g_path_game_common_js+"pile_and_deck_logic.min");

//include(g_path_games_js+"LC_game.min");
//include(g_path_games_js+"Finito_game.min");
//#include(g_path_games_js+"LX_game.min");
//#include(g_path_games_js+"KeltisCard_game.min");
//include(g_path_games_js+"KD_game.min");
//include(g_path_games_js+"SC_game.min");
//include(g_path_games_js+"MG_game.min");
//include(g_path_games_js+"GB_game.min");
//include(g_path_games_js+"HK_game.min");
//include(g_path_games_js+"CTW_game.min");

//include(g_path_games_js+"Tictactoe_game.min");

//#include(g_path_common_js+"resources.min");
//#include(g_path_common_js+"HP_gains.min");
//#include(g_path_common_js+"client_server_base.min");

g_path_js="../../var/www/HM/min_js/";
g_path_games_js=g_path_js + "games/";
g_path_game_specific_js=g_path_js + "game_specific/";
g_path_common_js=g_path_js + "common/";
g_path_game_common_js=g_path_js+"game_common/";

include(g_path_js+"game_main/game.min");
include(g_path_game_common_js+"pile_and_deck_logic.min");

include(g_path_game_specific_js+"LC/LC_game.min");
include(g_path_game_specific_js+"Finito/Finito_game.min");
include(g_path_game_specific_js+"LX/LX_game.min");
include(g_path_game_specific_js+"KeltisCard/KeltisCard_game.min");
include(g_path_game_specific_js+"KD/KD_game.min");
include(g_path_game_specific_js+"SC/SC_game.min");
include(g_path_game_specific_js+"MG/MG_game.min");
include(g_path_game_specific_js+"GB/GB_game.min");
include(g_path_game_specific_js+"HK/HK_game.min");
include(g_path_game_specific_js+"CTW/CTW_game.min");
include(g_path_game_specific_js+"CTG/CTG_game.min");

include(g_path_game_specific_js+"SOLO_RF/SOLO_RF_game.min"); // Risky Fishing
include(g_path_game_specific_js+"SOLO_RB/SOLO_RB_game.min"); // Raging Bulls
include(g_path_game_specific_js+"SOLO_LP/SOLO_LP_game.min"); // Leaf Pile
include(g_path_game_specific_js+"HXR/HXR_game.min"); //HexRoller

include(g_path_game_specific_js+"Tictactoe/Tictactoe_game.min");

include(g_path_common_js+"resources.min");
include(g_path_common_js+"HP_gains.min");
include(g_path_common_js+"client_server_base.min");


