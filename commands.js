//var existing_user={}
//log2("A0");
//if (exis){ // This fails and breaks the code. APE does not go any further when the variable is not defined at all.
//    log2("A1");
//}else log2("A2");
//if (existing_user.user_timeout_id){
//    log2("ttt 1");
//}else log2("ttt 2");
//
//log2("ZZZZZ 1");
//Ape.clearTimeout(5356565);
//log2("ZZZZZ 2");
//Ape.clearTimeout(null);
//log2("ZZZZZ 3");
////var toto=3;
////Ape.clearTimeout(toto); // This does not work
//log2("ZZZZZ 4");
//Ape.clearTimeout(0/0); // This works
//log2("ZZZZZ 5");
//Ape.clearTimeout(existing_user.user_timeout_id); // This works
//log2("ZZZZZ 5");
//Ape.clearTimeout(exis.user_timeout_id); // This fails
//log2("ZZZZZ 6");

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos|0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}

tuto_on=false;

g_last_Z=get_time()
Ape.setInterval(function(){
        var duration=(get_time()-g_last_Z);
        var chaine_log="ZZ "+duration+" ms";
        if (duration>=1000) chaine_log=+"SLOW++";
        else if (duration>=400) chaine_log+=" SLOW+";
        else if (duration>=105) chaine_log+=" SLOW";
        else if (duration<=1) chaine_log+=" INSTANT";
        else if (duration<=95) chaine_log+=" QUICK";
        
        if (g_env_case!="local") log2(chaine_log);
        g_last_Z=get_time();
    }
,100); // Every 100ms we log Z to see how APE behaves. Does it slow down sometimes?

function log2(texte){
    var d=new Date();
    texte=d.getMilliseconds() + " " + texte;
    Ape.log(texte);
}
 
// // TEST OR NOT
// TEST OR NOT
// TEST OR NOT
g_load_test=false; // This will call test_bot_vs_bot()
auto_play=false;

g_match_history_case=null;

g_typ="server";

// MEMORY ISSUES. 
// We estimate that APE can load 1100000 objects
// 10000 objects come from Level X (was 45000 but I changed [] to {} for this too
// For KD too, we reduced g_KD_prb from [] to {}
// g_user_info represents a lot of memory. We can fit 450 users simulaneously. Not much.
// By optimizing g_user_info we could fit more.

// These are the counters sent via SERVER_STATUS.
// We just initialize them here so that SERVER_STATUS nevers bugs.
g_user_counter=0;
g_timeout_counter=0;
g_marked_for_deletion=0;
g_chat_msg_counter_counter=0;
g_chat_history_loaded_counter=0;
g_chat_history_counter=0;
g_number_of_single_chat_ids_in_history=0;
g_number_of_g_one_to_one_chats=0;

g_size_array_match_ids=0;
g_nb_current_matches=0;
g_nb_puzzle_players=0;
g_nb_training_players=0;
g_nb_playing_players=0; // Online only I think.

g_nb_puzzle_matches_since_server_started=0;
g_nb_training_matches_since_server_started=0;
g_nb_online_matches_since_server_started=0;

g_login_counter=0;

g_channel_list_string="";

// Game history;
g_game_history_for_user={};
g_game_history_for_user_counter={};

/*
function test(obj){
    log2("test")
    var chaine="SELECT * FROM t_user WHERE user_id<=12000";
    query(SQL_ALL,chaine,function(res,errorNo)
    {
        if (errorNo)
        {
            log2("Error command 1")
            log2('Request error cjt : ' + errorNo + ' : '+ this.errorString());
            return [777, 'ERROR MYSQL'];
        }
        else
        {
            log2("OK")
            log2("obj:"+mydump(obj));
            res.each(function(data)
            {0
            });
        }
    })
}
*/
/********************/
/* Lobby and tables */
/********************/
g_lobby_tables={};
g_lobby_table_counter={}; // The number of open tables in each lobby
g_lobby_table_current_id={};
g_lobby_open_tables_ids={}; // Contains the list of ids of the tables that are currently open.
g_lobby_status_has_changed={}; // Stores whether we need to send the lobby status again to everyone.
g_lobby_tables_to_close={}// List of tables that we can close in the inn.

g_table_id_seeding=Date.now();

create_lobby("main_lobby");

/*
function test_jaz(){
    log2("ttttt");
    var user_id, i;
    
    for (user_id=1;user_id<=10000;user_id++){
        if (user_id%100==0) log2("user_id:"+user_id);
        g_user_info[user_id]=[];//2*user_id;
        
//        for (i=1;i<=7 ;i++){
//           g_user_info[user_id][i]=[2,3,4,5,7,8,09,10,11,12,13,14,15];
//        }
        
        //log2(mydump(g_user_info));

        //delete(g_user_info[user_id]);
        if (user_id%100!=0) delete(g_user_info[user_id]);
    }
};
test_jaz();
*/

/*
g_user_info.each(function(val){
    log2("val:"+mydump(val));//+ "g_user_info[val]:"+g_user_info[val]);
});
*/


/*
g_waiting_list.each(function(val)

    if (!user_id_is_robot(val))
    {
        if (game_counter==1) log2("Add user_id_to_be_matched val:"+val)

        if (Ape.getUserByPubid(g_waiting_list.keyOf(val)) == null)
        {
            log2("WHY ON EARTH IS THIS NULL? val="+val)
            log2("WHY ON EARTH IS THIS NULL? val="+val)
            log2("WHY ON EARTH IS THIS NULL? val="+val)
        }
        else if (Ape.getUserByPubid(g_waiting_list.keyOf(val)).game_id==game_id)
        {
            compteur=compteur+1;
            array_user_id_to_be_matched[compteur]=val;
        }
    }
});
*/


log2("g_env_case:"+g_env_case);
//log2("g_env_case:"+g_env_case);
/*
log2("CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT:"+CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT);
log2("g_env_case:"+g_env_case);
log2("SERVER_READY_TARGET:"+SERVER_READY_TARGET);
log2("SERVER_READY_TARGET:"+SERVER_READY_TARGET);
log2("SERVER_READY_TARGET:"+1);
*/

g_timeout_counter=0;

g_server_ready=0;

g_manager_transparent=false;

// Indicates whether we accept online matches or not.
g_maintenance=false;

g_marked_for_deletion=0;
g_user_marked_for_deletion={};


//g_test_mysql=false;

//j=0;

// For tests only...
//g_comp=0;
//g_array=[];


//log2("test");
//log2(config ().test.valeur );
//log2(config ("valeur") );
//config("2");

g_user_counter=0;

// Counter used for custom raws that will need an acknowlegement of receipt
g_custom_raw_counter=0;

g_custom_raw_list=new $H; // Hash (mootools 1.2, obsolete in 1.3)

g_match_id_offset=Ape.config("match_id.conf","match_id_offset");
log2("g_match_id_offset:"+g_match_id_offset);
g_custom_raw_counter={}; // Each player has his counter
                        
//g_auto_play=false;

// Initialisations - Déclarations
g_matches={};
//g_timer_kill_link=new Array();
g_array_match_ids={}; // Contains the match_id for each user
g_array_training_match_ids={}; // Same for training matches
g_array_puzzle_match_ids={}; // Same for training matches

g_array_timer_match_waiting_to_start={}; // Contains the timers to delete a match if it does not start early in X seconds

g_array_raw_id_counter={}; // Contains the raw_id_counter for each user
g_array_cmd_id_counter={}; // Contains the cmd_id_counter for each user
g_cmd_id_received={};

g_user_robot={};
g_game_info={};
g_perf_param={}; // Performance parameters for solo games.
g_game_ids={};

g_page_counter={}; // Contains the user page (session) counter. Set at 0 for the firt login then incremented by one for each new connection (whether CONNECT or SESSION)

g_user_info={}; // Contains the infos about the user (rating, bots unlocked, nb_of_successive_wins). See below for info about bot_unlocked_list:

//var nb_iterations=10;
//for (var i=100101;i<=100101+nb_iterations;i++){
//    log2(i)
//    Mysql_get_user_infos_if_necessary(i,null);
//    log2(i)
//}


//
//Check key (= PHP session id for the moment)
g_check_key={};
g_activation_key={};
//connection_typ={};

g_timer_robot_move={}; // List of timers set before each ask_for_robot_move()

g_matches2={};

//if (g_load_test==false)
//g_waiting_list=new $H; //Hash

g_nb_users_requesting_for_game={}; // Nb of users requesting a game of ...
g_at_least_one_user_is_requesting_for_game={}; // Is there at least one user requesting a game of ...
//g_latest_match_requests={};
        
g_temporary_locked_test_user_id={};

///////////////////////
// Mysql connections //
///////////////////////

//log2("g_mysql_ip"+Ape.config("db.conf", "mysql_ip"));
g_mysql_ip=Ape.config("db.conf","mysql_ip");
//log2("g_mysql_user"+Ape.config("db.conf", "mysql_user"));
g_mysql_user=Ape.config("db.conf","mysql_user");
//log2("g_mysql_password"+Ape.config("db.conf", "mysql_password"));
g_mysql_password=Ape.config("db.conf","mysql_password");
////log2("g_mysql_database"+Ape.config("db.conf", "mysql_database"));
g_mysql_database=Ape.config("db.conf","mysql_database");

//log2(g_mysql_ip);
//log2(g_mysql_user);
//log2(g_mysql_password);
//log2(g_mysql_database);

g_sql_con={};
g_ping_counter={};
g_query_counter={};
g_last_mysql_ping_timings={};
g_last_mysql_query_timings={};
g_ape_interval_ping_mysql={};
g_last_query_returned={};
g_first_database_connection=true;
//
MySQLConnect(SQL_CHAT);
MySQLConnect(SQL_NEWS);
// We put this one as the last one. Indeed when this connection is established, some checks are done and they take some time. So it is better if all other connections are established before. Just in case. 
// It is a bit irrelevant actually as the results of the connection are not given in the same order unfortunately!!
MySQLConnect(SQL_ALL); 
//
//
//for (var i=3;i<=150;i++){
//    log2(i);
//    var sql=new Ape.MySQL(g_mysql_ip + ":3306", g_mysql_user, g_mysql_password, g_mysql_database);
//    delete(sql);
//    sql.query("tt")
////    MySQLConnect(i);
//}


if (g_env_case=="local") var interval_print_user_counter=12000;
else if (g_env_case=="staging") interval_print_user_counter=12000;
else interval_print_user_counter=12000;

if (g_load_test==false){
    g_timeoutID2 = Ape.setInterval(function(){Print_User_Counter()}, interval_print_user_counter);
}

g_timeoutID3 = Ape.setInterval(function(){check_custom_raws_reception()}, 2500);

if (g_load_test==false){
    g_timeoutID4 = Ape.setInterval(function(){delete_users_marked_for_deletion()}, 15000);
}
//
// The rough_current_timestamp is used on functions that are called often but that don't necessitate an accurate timestamp
// (for deleting them later only)
//
set_rough_current_timestamp();
//
function set_rough_current_timestamp(){
    log2("set_rough_current_timestamp");
    g_rough_current_timestamp=get_time();
}
 g_timeoutID5 = Ape.setInterval(function(){set_rough_current_timestamp()}, 2000);
 
 // Tidy up g_cmd_id_received
// g_timeoutID6 = Ape.setInterval(function(){tidy_up()}, 10000); // Not really needed.

 //Send platform status (# of connected, etc.)
g_timeoutID7 = Ape.setInterval(function(){send_platform_status_to_players()}, 10000);

function send_platform_status_to_players(){
    log2("snd_pltfrm_status_to_pl()");
    var platform_status=get_platform_status();
    log2("pltfrm_stts:"+mydump(platform_status));
    send_raw_to_channel("main_lobby_chat","platform_status",platform_status);
}

function get_platform_status(){
    log2("gt_pltfrm_status()");
    var ret={
            "connected":g_user_counter,
            "online_matches":g_nb_current_matches,
            "online_playing_players":g_nb_playing_players,
            "training_players":g_nb_training_players,
            "puzzle_players":g_nb_puzzle_players
        };  
        //log2("g_userlist:"+mydump(g_userlist.getKeys()));
    log2("gps END");
    return ret;
}

// Not really needed. We delete g_cmd_id_received[user_id] in delete_users_marked_for_deletion() anyway.
//function tidy_up(){
//    if (!g_load_test) log2("Tidy up");
//    var current_timestamp=get_time();
//    for (var user_id in g_cmd_id_received){
//        for (var cmd_id in g_cmd_id_received[user_id]){
//            if (current_timestamp-g_cmd_id_received[user_id][cmd_id]>200000){ // Must be superior to 45s the length of a session. Otherwise we may receive the same move twice or other things. We had illegal moves because of this on the day we relesed the inn (2014/03/04)
//                //log2("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ DETLETING");
//                delete (g_cmd_id_received[user_id][cmd_id]);
//            }
//        }
//    }
//    if (!g_load_test) log2("Tidy up() End");
//}

// Managing nb of messages max by minute and by 5 minutes.
g_max_nb_of_messages_per_minute=8;
g_max_nb_of_messages_per_5_minutes=20;
g_interval_decrement_chat_messages_counter=8000;
g_timeoutID5 = Ape.setInterval(function(){decrement_chat_messages_counters()}, g_interval_decrement_chat_messages_counter);

//g_timeout_record_latest_chats=Ape.setInterval(function(){record_latest_chats()}, 5001);
g_timer_for_starting_the_game={};
g_timer_for_playing={};

//mydump_first_level(this);
//log2(mydump_first_level(this));
//log2(mydump_with_count(this));

function decrement_chat_messages_counters(){
    for (var key in g_user_info) {
        var ui=g_user_info[key];
        //for (var user_id in g_user_info){
        //log2("XXXXXXXXXXXXXXXXXXXXXX")
        //log2("XXXXXXXXXXXXXXXXXXXXXX")
        //log2("XXXXXXXXXXXXXXXXXXXXXX")
        //log2(ui["last_message_timestamp"]);  
        var fraction_of_minute=g_interval_decrement_chat_messages_counter/60000;
        ui["nb_messages_posted_last_minute"]-=fraction_of_minute*g_max_nb_of_messages_per_minute;
        if (ui["nb_messages_posted_last_minute"]<0) ui["nb_messages_posted_last_minute"]=0;
        
        ui["nb_messages_posted_last_5_minutes"]-=fraction_of_minute/5*g_max_nb_of_messages_per_5_minutes;
        if (ui["nb_messages_posted_last_5_minutes"]<0) ui["nb_messages_posted_last_5_minutes"]=0;
    };
}

function delete_users_marked_for_deletion(){
    log2("dlt_usrs_marked_for_dltion()");
    for (var user_id in g_user_marked_for_deletion){
        var diff=get_time()-g_user_marked_for_deletion[user_id];
        log2("uid:"+user_id+" diff:"+diff);
        if (diff>DELAY_BEFORE_DELETING_USER){
            remove_user_from_deletion_list_if_exists(user_id);
            delete(g_user_info[user_id]);
            delete (g_cmd_id_received[user_id]);
            //delete_user_if_marked_for_deletion(user_id);
        }
    }
    log2("END dlt_usrs_marked_for_dltion()");
}

function remove_user_from_deletion_list_if_exists(user_id){
    log2("rmv_usr_from_dltion_list_if_exists() uid:"+user_id);
    //log2("g_user_marked_for_deletion[user_id]:"+g_user_marked_for_deletion[user_id]);
    if (g_user_marked_for_deletion[user_id]!=null){
        log2("In list. We remove it!");
        g_marked_for_deletion--;
        delete(g_user_marked_for_deletion[user_id]);
    }
}

Ape.registerCmd("CLI_MOV",true,function(params,info){
    log2("CLI_MOV "+mydump(params));
    
    var user=info.user;
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    var match_id=params.match_id;
    var user_id=user.user_id;
    var g=g_matches[match_id];
    g.cli_mov=params.mov;
    wait_for_new_move(match_id);
});

///////////////////////////////////////////////////////////////////
// HOOK JOIN, SEND, and other stuffs for chat/channel management //
///////////////////////////////////////////////////////////////////

// JOIN
Ape.registerHookCmd("JOIN", function(params, info){
    
    log2("JOIN channel: "+params.channels); // channels with an s!
    log2("params:"+mydump(params));
    //log2("info:"+mydump(info));

    var user=info.user;
    var user_name=user.name;
    //log2("user_name:"+name);
    //log2("user:"+mydump(user));
    var user_id=user.user_id;
    
    //var pipe=params.pipe;
    var channel_name=params.channels; // channels with an s!
    //log2("JOIN channel_name:"+channel_name);
    // We send the last messages of the channel if there are any.
    
    
    // One-to-one chats
    if (chat_is_one_to_one(channel_name)){
        
        var channel = Ape.getChannelByName(channel_name);
        
        // If the channel is created, we reset the inactivity timestamp
        if (channel==null){
            g_channel_latest_activity[channel_name]=get_time();
        }
        
        // Check if channel already exists
        //if (channel==null){ 
            var invited_user_id=get_one_to_one_invited_user_id(channel_name,user_id);
            if (invited_user_id==-1) return -1; // ERROR!!!!
            var invited_user_name=params.invited_user_name;
            
            // Add object for this user
            add_one_to_one_chats_object(user_id, invited_user_id, invited_user_name); // The missing info ("") will be sent by the chat opener via "INVITED_USER_NAME" command.
            // Add object for the invited user
            //add_one_to_one_chats_object(invited_user_id, user_id, user_name);
            
            // We send the information about the chat being created (actually we send a refreshed version of the list of one-to-one chats
            //send_one_to_one_chats_list(user_id);
            //send_one_to_one_chats_list(invited_user_id);
        //}
    }else if (channel_is_lobby_news(channel_name) || false){
        log2("Jnng lobby news chl: "+channel_name);
        
        var lobby_name=lobby_name_from_lobby_news_channel(channel_name);
        
        //log2("g_lobby_tables[lobby_name]:"+mydump(g_lobby_tables[lobby_name]));
        //log2(">JSON.stringify(g_lobby_tables[lobby_name]:"+JSON.stringify(g_lobby_tables[lobby_name]));
        
        info.user.pipe.sendRaw("lobby_status",get_lobby_status(lobby_name));
    }
    
    if (g_chat_history_loaded[channel_name]==true){
         send_chat_history(channel_name,user,user_id);
     }else{
         Mysql_get_chat_history(channel_name,user,user_id);
     }
   
//     if (channel_name=="system_news"){
//         log2("Sending match requests latest state");
//         info.user.pipe.sendRaw("match_requests",{"match_requests":g_latest_match_requests});
//     }

    if (channel_name=="main_lobby_chat"){
        if (user.pipe!=null){
            log2("sendRaw 'platform_status' to user");
            user.pipe.sendRaw("platform_status",get_platform_status());
        }else log2("WARNING!! user_pipe is null in ASK_COUNTERS");
    }
    
    //info.pipe.send(g_chat_history[channel_name][g_chat_msg_counter[channel_name]];

    // We let the normal JOIN command work
    return 1;
});


function send_chat_history(channel_name,user,user_id){
    log2("send_chat_history channel: " + channel_name+ " to user_id:" + user_id)
    
    if (g_chat_history[channel_name]==null) log2("No history for this channel but we sent anyway as the client needs it!")
    
    if (user.pipe!=null){
        user.pipe.sendRaw("chat_history",{"channel":channel_name,"history":g_chat_history[channel_name]});
        log2("Chat history sent");
    } 
    else log2("send_chat_history channel - ERROR user.pipe is null!");
}
function get_one_to_one_users_id(channel_name){
    var chaine=channel_name.split("_");
    var obj=new Object();
        obj.user_id_1=parseInt(chaine[3]);
        obj.user_id_2=parseInt(chaine[4]);
    return obj;
}
function get_one_to_one_invited_user_id(channel_name,user_id){
    var obj=get_one_to_one_users_id(channel_name);
    if (obj.user_id_1==user_id) var invited_user_id=obj.user_id_2;
    else invited_user_id=obj.user_id_1;
    
    if (isNaN(invited_user_id)){
        invited_user_id=-1;
        log2("ERROR: WHY IS invited_user_id NOT A NUMBER?");
    }
    return invited_user_id;
}
function chat_is_one_to_one(channel_name){
    if (channel_name.substring(0,11)=="one_to_one_"){
        return true;
    }
    else return false;
}
function channel_is_lobby_news(channel_name){
    if (channel_name.search("lobby_news")!=-1){
        return true;
    }
    else return false;
}
function channel_is_lobby_chat(channel_name){
    if (channel_name.search("lobby_chat")!=-1){
        return true;
    }
    else return false;
}
function lobby_name_from_lobby_news_channel(channel_name){
    var pos=channel_name.search("lobby_news");
    var lnflnc=channel_name.substring(0,pos)+"lobby";
    log2("lobby_name_from_lobby_news_channel:"+lnflnc)
    return lnflnc;
}
// When someone has created a one-to-one chat with someone else, we don't know yet the user_name of the invited player,
// so the client sends it separately and we receive the info here.
// Not needed anymore as we nowsend the invited_user_name with the "JOIN" command
/*
Ape.registerCmd("INVITED_USER_NAME", true, function(params, info){
    
    var user=info.user; //Ape.getUserByPubid(pubid)
    var user_id=user.user_id;
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    var invited_user_id=params.invited_user_id;
    var invited_user_name=params.invited_user_name;
    log2("INVITED_USER_NAME user_id:"+user_id +" invited_user_id:"+invited_user_id+" invited_user_name:"+invited_user_name);
    
    if (g_one_to_one_chats[user_id]!=null) {
        if (g_one_to_one_chats[user_id][invited_user_id]!=null){
            g_one_to_one_chats[user_id][invited_user_id].invited_user_name=invited_user_name;
        }
        else log2("ERROR? This user ("+user_id+") does not have this invited_user_id ("+invited_user_id+") in his own one-to-one chats any more.")
    }
    else log2("ERROR? This user ("+user_id+") is probably not in his own one-to-one chat any more.")
    
    log2("g_one_to_one_chats[user_id]:"+mydump(g_one_to_one_chats[user_id]));
});
*/

function add_one_to_one_chats_object(user_id, invited_user_id, invited_user_name){ 
    log2("add_one_to_one_chats_object() user_id:"+user_id+ " invited_user_id:"+invited_user_id +" invited_user_name:"+invited_user_name);
    
    if (g_one_to_one_chats[user_id]==null) g_one_to_one_chats[user_id]={};

    if (g_one_to_one_chats[user_id][invited_user_id]==null){
       mysql_record_one_to_one_chat_opening(user_id, invited_user_id, invited_user_name)
    }
    
    // Maybe we don't need to recreate an object if it already exists?
    // Maybe we don't need to recreate an object if it already exists?
    // Maybe we don't need to recreate an object if it already exists?
    // We should probably check that.
        
    var obj=new Object();
        obj.invited_user_id=invited_user_id;
        obj.invited_user_name=invited_user_name;
        
    //if (g_one_to_one_chats[user_id][invited_user_id]=null) g_one_to_one_chats[user_id][invited_user_id]=[];
    g_one_to_one_chats[user_id][invited_user_id]=obj;
    
    log2("g_one_to_one_chats[user_id]:"+mydump(g_one_to_one_chats[user_id]));
}

function delete_one_to_one_chats_object(user_id, invited_user_id){
    log2("delete_one_to_one_chats_object() user_id:"+user_id+" invited_user_id:"+invited_user_id);
    
    //g_one_to_one_chats[user_id][invited_user_id]=null; 
    if (typeof g_one_to_one_chats[user_id]!="undefined"){
        log2("g_one_to_one_chats[user_id]: "+mydump(g_one_to_one_chats[user_id]));
        if (typeof g_one_to_one_chats[user_id][invited_user_id]!="undefined"){
            delete(g_one_to_one_chats[user_id][invited_user_id]);
        }
        else log2("WARNING: g_one_to_one_chats[user_id][invited_user_id] is UNDEFINED")
        
        // We delete g_one_to_one_chats[user_id] if it is now empty
        if (get_object_length(g_one_to_one_chats[user_id])==0){
            log2("No more one-to-one chat for this user. Deleting g_one_to_one_chats[user_id] user_id:"+user_id)
            delete(g_one_to_one_chats[user_id]);
        }
    }
    else log2("WARNING: g_one_to_one_chats[user_id] is UNDEFINED")
    //log2("g_one_to_one_chats[user_id]: "+mydump(g_one_to_one_chats[user_id]));
}

Ape.registerCmd("LEAVE_CHANNEL", true, function(params, info){    
    var user=info.user; //Ape.getUserByPubid(pubid)
    var user_id=user.user_id;
    
    var channel_name=params.channel_name;
    
    log2("LEAVE_CHANNEL channel_name: "+channel_name+" user_id: "+user.user_id);
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    // If the user left the news channel of a lobby, we make him leave all tables in this lobby.
    if (channel_is_lobby_news(channel_name)){
        var user_id=user.user_id;
        //var lobby_name=lobby_name_from_lobby_news_channel(channel_name); 
        make_user_leave_all_tables(user_id);
    }
    user.left(channel_name);
    
    // If the user deliberately decided to leave the channel we do close it for good.
    if (chat_is_one_to_one(channel_name)){
        // Extract the 2 user ids for this channel
        var obj=get_one_to_one_users_id(channel_name);
        // Find out which one is the other player id
        if (obj.user_id_1==user_id){
            var invited_user_id=obj.user_id_2;
        }else{
            invited_user_id=obj.user_id_1;
        }
        delete_one_to_one_chats_object(user_id,invited_user_id);
    }
        
    log2("LEAVE_CHANNEL mydump(g_one_to_one_chats[user_id]): "+mydump(g_one_to_one_chats[user.user_id]));
});

//////////////////////////////////////////////////
// LOBBY = INN
//////////////////////////////////////////////////

function create_lobby(lobby_name){
    log2("create_lobby: "+lobby_name);
    g_lobby_tables[lobby_name]={};
    g_lobby_table_counter[lobby_name]=0; // The number of open table in each lobby
    g_lobby_table_current_id[lobby_name]=0; // Each table will have a name including g_table_id_seeding + "_" + this id (that has no limit)
    g_lobby_status_has_changed[lobby_name]=false;
    g_lobby_open_tables_ids[lobby_name]={};
    g_lobby_tables_to_close[lobby_name]={};
    
    /*********************
    /* Create 2 channels *
    /*********************
     * 
     */
    // Create the lobby channel for chat
    Ape.mkChan(lobby_name+"_chat");
    
    // Create the associated news channel that will have the following name: "xxxx_lobby_news" for example "main_lobby_news")
    // It will send the status of the lobby room
    Ape.mkChan(lobby_name+"_news");
    Ape.setInterval(function(){send_lobby_status_if_necessary(lobby_name)}, 500);
    //    log2("PUT THIS BACK AT 500");

}

function send_lobby_status_if_necessary(lobby_name){
    if (g_lobby_status_has_changed[lobby_name]==true){
        log2("Sndng lobby status as it changed");
        
        var lobby_status_object=get_lobby_status(lobby_name);
        //log2("Lobby Status: "+mydump(lobby_status_object));
        send_raw_to_channel(lobby_name+"_news","lobby_status",lobby_status_object);
        
        g_lobby_status_has_changed[lobby_name]=false;
    }
}

function get_lobby_status(lobby_name){
//    log2("g_lbby_tbls:"+mydump(g_lobby_tables));
    // Here we could insert only the tables that are useful (for example the ones that started more than 30s ago (depening on the number of active tables)).
    // Also we could avoid sending null values (for example rating_min/max, meeples_min/max).
    // Also table.lobby_name is not needed.
    return {"lobby_name":lobby_name,"tables":JSON.stringify(g_lobby_tables[lobby_name])};
}

// We loop through all tables in the lobby for this user and this game and return the first table (by table_name) we can find
function get_first_not_full_table_for_this_user_and_game(lobby_name,user_id,game_id){
    var lobby=g_lobby_tables[lobby_name];
    if (typeof lobby=="undefined") return 0;
    
    for (var temp_table_name in lobby){
        var table=lobby[temp_table_name];
        if (table.game_id==game_id){
            // Find ELO diff between the two players to find the best match
            // We could add other criteria like changing opponent from time to time.
            for (var i=1;i<=table.nb_players;i++){
                if (table.user_ids[i]==user_id){
                    // Only right for 2 players:
                    log2("This player is at the table. Table found?")
                    if (table.user_ids[3-i]==0){
                        log2("Yes table found! table_name:"+table.table_name)
                        return table.table_name;
                    }else log2("WARNING - NO!! the table was already occupied by another player!! table_name:"+table.table_name)
                }  
            }
        }
    }
    // If none is found, we return 0;
    return 0;
}
Ape.registerCmd("JOIN_TABLE", true, function(params, info){    
    var user=info.user; 
    var lobby_name=params.lobby_name;
    var table_id=params.table_id;
    var table_name=params.table_name;
    
    log2("JOIN_TABLE lobby_name: "+lobby_name+" user_id: "+user.user_id+ " table_name: "+table_name);
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    check_join_table("join_old_table", user, lobby_name, table_name,0,false);
    
});

Ape.registerCmd("LEAVE_TABLE", true, function(params, info){    
    var user=info.user; 
    var user_id=user.user_id;
    var lobby_name=params.lobby_name;
    //var table_id=params.table_id;
    var table_name=params.table_name;
    
    log2("LEAVE_TABLE lobby_name: "+lobby_name+" user_id: "+user.user_id+ " table_name: "+table_name);
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    leave_table(user_id, lobby_name, table_name)
    
});


Ape.registerCmd("RESIGN", true, function(params, info){    
    var user=info.user; 
    var user_id=user.user_id;
    
    var match_id=params.match_id;
    
    log2("RESIGN user_id: "+user.user_id+ " match_id: "+match_id);
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;

    if (g_array_match_ids[user_id]==match_id){
        var g=g_matches[match_id];
        
        // Does the match still exist?
        if (typeof g=='undefined'){
            log2("WARNING RESIGN!! Match does not exist anymore!")
        }
        // Did the match start? If not we simply cancel it.
        else if (g.game_started==false){
            // Nothing happens?
            // delete_match_cause_cancel(match_id);
        }
        else make_user_lose_current_match(user_id,END_MATCH_RESIGNED);
    }
    else{
        log2("WARNING RESIGN!! The user was not playing this match anymore...");
    }
    
});


Ape.registerCmd("PLAY_WITH_BOT", true, function(params, info){  
    
    var user=info.user;
    var user_id=user.user_id;
    var game_id=params.game_id;
    var lobby_name=params.lobby_name;
    
    log2("PLAY_WITH_BOT lobby_name: "+lobby_name+" user_id: "+user.user_id+ " game_id: "+game_id);
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    if (g_maintenance==true){
        send_error_message_for_join_table(user,lobby_name,"ERROR_MAINTENANCE");
        return;
    }
    
    // Look for a table that was opened by the player for this game.
    var table_name=get_first_not_full_table_for_this_user_and_game(lobby_name,user_id,game_id)
    if (table_name==0){
        log2("Warning! No tables were found with this user for a bot to sit! Maybe the user sent PLAY_WITH_BOT twice!");
        return; // Change 2019/12/03 No need to continue. It only generates unnecessary logs at best.
    }else{
        log2("table found for bot to sit: "+table_name);
    }
    
    var user_rating=get_user_rating(user_id, game_id);
    log2("user_rating:"+user_rating)
    var best_robot_rating=0;
    var worst_robot_rating=10000;
    for (var j=1;j<=g_nb_of_bots;j++){
        var bot_rating=g_user_robot[j].rating[game_id];
        if (bot_rating>best_robot_rating) best_robot_rating=bot_rating;
        if (bot_rating<worst_robot_rating) worst_robot_rating=bot_rating;
    }
    log2("best_robot_rating:"+best_robot_rating+" worst_robot_rating:"+worst_robot_rating);
    
    // For strong players (and very weak), we modify their rating so that they are close to the best (worst) bot, so 
    // that they can't play against other bots sometimes.
    var rating_user_modifier_max=50;
    if (user_rating>best_robot_rating+rating_user_modifier_max){
        user_rating=best_robot_rating+rating_user_modifier_max;
    } 
    if (user_rating<worst_robot_rating-rating_user_modifier_max){
        user_rating=worst_robot_rating-rating_user_modifier_max;
    } 
    
    var interval_base_user=100;
    var rating_player_modified=user_rating+interval_base_user*(Math.random(1)+Math.random(1)+Math.random(1)-1.5);
    
    var interval_base_robot=120; // (/2=45)

    //log2("user_rating:"+user_rating);
    var score_min=9999;
    log2("user_id:"+user_id);
    log2("game_id:"+game_id);
    for (var j=1;j<=g_nb_of_bots;j++){
        //log2("g_user_info[user_id][game_id]['bot_unlocked'][i]:"+g_user_info[user_id][game_id]['bot_unlocked'][i]);
        if (g_user_info[user_id][game_id]['bot_unlocked'][j]==1){
            var score=Math.abs(g_user_robot[j].rating[game_id]+interval_base_robot*(Math.random(1)-0.5)-rating_player_modified);

            if (score<score_min){
                var best_match=j;
                score_min=score;
            }
        }
    }
    
    log2("best_match:"+best_match + " - Bot rating:"+g_user_robot[best_match].rating[game_id])
    //Match_2_players(user_id,best_match,game_id,MODE_FULL_PLAY); // Will be done automatically by join_table();
    join_table(best_match,lobby_name,table_name);
    
}); 


Ape.registerCmd("ASK_FOR_NEW_SOLO_MATCH", true, function(params, info){    
    var user=info.user; 
    var user_id=user.user_id;
    var pubid=user.getProperty("pubid");
//    var lobby_name=params.lobby_name;
    var game_id=params.game_id;
    log2("ASK_FOR_NEW_SOLO_MATCH user_id: "+user_id+" game_id: "+game_id);
//    var quick_play=params.quick_play;
//    var open_to_everyone=params.open_to_everyone;
//    var filters=params.filters;


    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    var chaine="SELECT user_food FROM t_user WHERE user_id="+user_id;
    log2(chaine);
    query(SQL_ALL,chaine,function(res,errorNo){                
        if (errorNo){
            log2("Error command ASK_FOR_NEW_SOLO_MATCH")
            //log2('Request error : ' + errorNo + ' : '+ this.errorString());
            return [777, 'ERROR MYSQL'];
        }else{
            if (g_userlist.has(user_id)){ // If the mysql query was too long, it is possible that the user has left the platform already (it happened once with Sam D.)
                res.each(function(data){
                    log2("user_food: "+data.user_food + " game_id: "+game_id + " user_id:"+user_id)


                    //
                    // Allowed to play? No if the player has just left a game before the end.
                    //
//                    if (g_user_info[user_id]["can_start_another_game"]==false){
//                        log2("The user is not allowed to play online now. He has just left a table where he was playing.");
//                        send_error_message_for_join_table(user,lobby_name,"ERROR_LEFT_TABLE_RECENTLY");
//                        return;
//                    }

                    //
                    // User already playing?  
                    //
                    if (g_array_match_ids[user_id]!=NO_MATCH){
                        log2("players already playing match: "+g_array_match_ids[user_id]);
                        send_custom_raw(pubid,user_id,"cannot_join_solo_match",{"error":"ERROR_ALREADY_PLAYING"});
                        return;
                    }
                    
                    //
                    // Enough food?
                    //
                    log2("game_id:"+game_id);
                    log2("g_game_info[game_id].game_food_cost:"+g_game_info[game_id].game_food_cost)
                    if (!potion_is_active(user_id) && Number(data.user_food)<g_game_info[game_id].game_food_cost){
                        log2("not enough food_to_play_at table");
                        send_custom_raw(pubid,user_id,"cannot_join_solo_match",{"error":"ERROR_NOT_ENOUGH_FOOD"});
                        return;          
                    } else log2("OK Enough food for solo match");

                    //else log2("OK User is not already playing lobby_name: "+lobby_name+" table_name:"+table_name)

   
//                    else{ //if (g_array_match_ids[user_id]==NO_MATCH){
                    log2("-------------user opening new solo match user_id:"+user_id);
                    Match_2_players(user_id, 0, game_id, MODE_FULL_PLAY);
//                    }
    
                });
            }
            else{
                // The user is not logged any more!!
                log2("WARNING!!! The user is not logged any more!!!!");
                log2("WARNING!!! The user is not logged any more!!!!");
            }
        }
    })
});

Ape.registerCmd("ASK_FOR_NEW_TABLE", true, function(params, info){    
    var user=info.user; 
    var lobby_name=params.lobby_name;
    var game_id=params.game_id;
    var quick_play=params.quick_play;
    var open_to_everyone=params.open_to_everyone;
    var filters=params.filters;
    
    // Beware an empty array (like filters.friends_selection={}; is received as a number (=0) instead of {};
    // Beware an empty array (like filters.friends_selection={}; is received as a number (=0) instead of {};
    // Beware an empty array (like filters.friends_selection={}; is received as a number (=0) instead of {};
    // Beware an empty array (like filters.friends_selection={}; is received as a number (=0) instead of {};
    // 
//    log2("f:"+mydump(filters))
//    log2("typeof friends_selection:"+typeof filters.friends_selection)

    //var pubid=user.pubid;
    
    log2("ASK_FOR_NEW_TABLE lbby:"+lobby_name+" uid: "+user.user_id+ " gid: "+game_id+" quick_pl:"+quick_play+" opn_to_everyo:"+open_to_everyone+ " filtrs:"+mydump(filters));
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
//    if (quick_play){
//        log2("Checking if there is a table that can be joined?");
//    }
    if (quick_play) var cas="join_old_or_create_new_table";
    else cas="create_new_table";
    
    //delete_old_tables_if_needed(lobby_name);
    
    check_join_table(cas,user,lobby_name,"ANY_TABLE_IN_THE_LOBBY",game_id, quick_play, open_to_everyone, filters);

});

function delete_old_tables_from_inn_if_needed(lobby_name){
    log2("delete_old_tables_if_needed() lobby_name:"+lobby_name);
//        log2("ZZZZZZZZZZZZZZZZ")
//        log2("ZZZZZZZZZZZZZZZZ")
//        log2("ZZZZZZZZZZZZZZZZ")
//        log2("ZZZZZZZZZZZZZZZZ")
//        log2("ZZZZZZZZZZZz :"+mydump(g_lobby_tables_to_close))

    // If we have only two tables left, we must close the old tables that we don't need to display.
    if (g_lobby_table_counter[lobby_name]>=MAX_NUMBER_OF_TABLES_PER_LOBBY-2){
        var NO_TIMESTAMP=999999999999999999999;
        var oldest_timestamp=NO_TIMESTAMP;
        var table_to_close="";
        for (var table_name in g_lobby_tables_to_close[lobby_name]){
            log2("DELETING FROM THE INN???")
            log2("DELETING FROM THE INN???")
            var timestamp=g_lobby_tables_to_close[lobby_name][table_name];
            log2("table_name:"+table_name);
            log2("timestamp:"+timestamp);
            if (timestamp<oldest_timestamp){
                table_to_close=table_name;
                oldest_timestamp=timestamp;
            }
            log2("oldest_timestamp: "+oldest_timestamp+" table_name:"+table_to_close);
            //log2("table_name:"+table_name);
        }
        if (oldest_timestamp!=NO_TIMESTAMP){
            close_lobby_table(lobby_name,table_to_close);
        }else{
            log2("WARNING!!!! No table to close!! And the lobby is almost FULL!")
        }
    }
    else{
        log2("No need to delete old tables from the inn. g_lobby_table_counter[lobby_name]:"+g_lobby_table_counter[lobby_name]);
    }
}

function check_join_table(cas,user,lobby_name,table_name,game_id, quick_play, open_to_everyone, filters){
// Cas may be "join_old_table" or "create_new_table"

    log2("check_join_table lobby_name: "+lobby_name+"  cas: "+cas+"  table_name: "+table_name+ " user_id:"+user.user_id+ " game_id:"+game_id+ " open_to_everyone:"+open_to_everyone+ " filters:"+filters);
    
    var user_id=user.user_id;
    var pubid=user.getProperty("pubid");
    var lobby=g_lobby_tables[lobby_name];

//    var saved_game_id=game_id;
//   /var saved_lobby_name=lobby_name;
//    var saved_lobby_name2=lobby_name;
//    var saved_table_name=table_name;
//    var saved_table_name2=table_name;
//    var saved_cas=cas;
    
    // Check the user has enough food to play in the lobby at this table
    
    var chaine="SELECT user_food FROM t_user WHERE user_id="+user_id;
    log2(chaine);
    query(SQL_ALL,chaine,function(res,errorNo){                
        if (errorNo){
            log2("Error command 1")
//            log2('Request error cjt : ' + errorNo + ' : '+ this.errorString());
            return [777, 'ERROR MYSQL'];
        }else{
            if (g_userlist.has(user_id)){ // If the mysql query was too long, it is possible that the user has left the platform already (it happened once with Sam D.)
                res.each(function(data){
                    log2("user_food:"+data.user_food + " game_id:"+game_id +" lobby_name:"+lobby_name + " table_name:"+table_name+ " user_id:"+user_id +" user:"+mydump(user) +" cas:"+cas)

                    //
                    // Getting game_id because in this case, we don't have it.
                    //
                    if (cas=="join_old_table"){
                        var table=lobby[table_name];
                        if (typeof table=="undefined"){
                            log2("BEWARE!!! This table does not exist anymore.");
                            return;
                        }else{
                           game_id=table.game_id;
                        }
                    }

                    //
                    // Allowed to play? No if the player has just left a game before the end.
                    //
                    if (g_user_info[user_id]["can_start_another_game"]==false){
                        log2("The user is not allowed to play online now. He has just left a table where he was playing.");
                        send_error_message_for_join_table(user,lobby_name,"ERROR_LEFT_TABLE_RECENTLY");
                        return;
                    }

                    //
                    // Enough food?
                    //
                    log2("game_id:"+game_id);
                    log2("g_game_info[game_id].game_food_cost:"+g_game_info[game_id].game_food_cost)
                    if (!potion_is_active(user_id) && Number(data.user_food)<g_game_info[game_id].game_food_cost){
                        log2("not enough food_to_play_at table");
                        send_error_message_for_join_table(user,lobby_name,"ERROR_NOT_ENOUGH_FOOD");;
                        return;          
                    } else log2("OK Enough food for table lobby_name: "+lobby_name+" table_name:"+table_name);

                    //
                    // User already playing?  
                    //
                    if (g_array_match_ids[user_id]!=NO_MATCH){
                        log2("players already playing match: "+g_array_match_ids[user_id]);
                        send_custom_raw(pubid,user_id,"cannot_join_table",{"lobby_name":lobby_name,"error":"ERROR_ALREADY_PLAYING"});  
                        return;
                    }else log2("OK User is not already playing lobby_name: "+lobby_name+" table_name:"+table_name)

                    // Looping through all tables to find an appropriate one.
                    if (cas=="join_old_or_create_new_table"){
                        log2("Is there a table to join (cas=join_old_or_create_new_table)");
                        
                        
                        // Are we in the "replay with same opponent" case?
                        var friends_selection=filters.friends_selection;
                        log2("Filters1:"+mydump(filters));
                        log2("friends_selection:"+mydump(friends_selection));
//                        if (friends_selection!=0){
                        if (friends_selection!=0){    
                            table_name=0;
                            //var game_id=filters.game_id;
                            log2("filters for replaying the same opponent:"+mydump(filters));
                            for (var temp_table_name in lobby){
                                var table=lobby[temp_table_name]; 
                                if (table.game_id==game_id){
                                    if (table.filters){
                                        if (table.filters.friends_selection!=0){
                                            for (var friend_id in table.filters.friends_selection){
                                                log2("friend_selection:"+friend_id);
                                                if (user_id==friend_id){
                                                    // We must still check that the table is not full yet. We had a bug until 09/2019.
                                                    // We were trying to join a table that was alrady full (the player who asked to replay
                                                    // the same opponent decided to play a bot before the other player asked for a rematch.
                                                    // As a result, the bot match was created a second time and this led to illegal moves.
                                                    var ret=can_user_join_table(user,lobby_name,temp_table_name,"any_table");
                                                    if (ret==true){
                                                        table_name=temp_table_name;
                                                        break; // We found the table.
                                                    }
                                                }
                                            }
                                        } // If nothing in friends_selection, it is not the right table.
                                    }
                                }// If not the right game_id, it is not the right table.
                                if (table_name!=0) break; // We found the table.
                            }
                        }else{ // Regular case: we are trying to find any player (quick play) for the game. Quick play.
    
                            var user_rating=get_user_rating(user_id,game_id);
                            var min_diff=100000;
                            var best_table=0; // Will stay at 0 if no table is suitable. And then we will create one.
                            // game_id already defined not like in "join_old_table" case
                            for (var temp_table_name in lobby){
                                var table=lobby[temp_table_name];
                                if (table.game_id==game_id){
                                    var ret=can_user_join_table(user,lobby_name,temp_table_name,"any_table");
                                    if (ret==true){
                                        // Find ELO diff between the two players to find the best match
                                        // We could add other criteria like changing opponent from time to time.
                                        for (var i=1;i<=table.nb_players;i++){
                                            if (table.user_ids[i]!=0){
                                                var opp_rating=table.ratings[i];
                                                var rating_diff=Math.abs(user_rating-opp_rating);
                                                log2("Ratings - user:"+user_rating +" opp:"+opp_rating +" diff:"+rating_diff);
                                                if (rating_diff<min_diff) {
                                                    best_table=temp_table_name;
                                                    log2("new best table: "+temp_table_name)
                                                }
                                            }  
                                        }
                                    }
                                }
                            }
                            table_name=best_table;
                        }
                        
                    }else if (cas=="join_old_table"){
                        log2("Testing if user can join a table (cas=join_old_table)");
                        var ret=can_user_join_table(user,lobby_name,table_name,"specific_table");
                        log2("ret:"+ret);
                        // It will return true or an error message starting with "ERROR_"
                        if (ret!=true){
                            send_error_message_for_join_table(user,lobby_name,ret);
                            return;
                        }
                    }

                    log2("table_name:"+table_name);

                    if (cas=="join_old_table" || (cas=="join_old_or_create_new_table" && table_name!=0)){
                        // Do nothing!
                        // var table_name=g_lobby_tables[lobby_name][table_name];
                        log2("Do nothing!");
                    }else{
                        table_name=create_lobby_table(lobby_name,user_id,game_id,open_to_everyone, filters);
                        log2("About to create table table_name:"+table_name);
                        // table_name is a string starting with "ERROR_" if an error happened
                        if (table_name.substr(0,6)=="ERROR_"){
//                        log2("WARNING: user could not open new table. Error: "+table_name);
//                        send_custom_raw(pubid,user_id,"cannot_join_table",{"lobby_name":lobby_name,"error":table_name});
                            send_error_message_for_join_table(user,lobby_name,table_name);
                            return;
                        }
                    }

                    join_table(user,lobby_name,table_name);  

                });
            }
            else{
                // The user is not logged any more!!
                log2("WARNING!!! The user is not logged any more!!!!");
                log2("WARNING!!! The user is not logged any more!!!!");
            }
        }
    })
}

function send_error_message_for_join_table(user,lobby_name,error){
    var user_id=user.user_id;
    var pubid=user.getProperty("pubid");
    log2("WARNING: user could not join a table. Error: "+error);
    send_custom_raw(pubid,user_id,"cannot_join_table",{"lobby_name":lobby_name,"error":error});
}

function can_user_join_table(user, lobby_name, table_name,any_table_or_specific_table){
    log2("cn_usr_jn_tbl lbby:"+lobby_name+" tbl:"+table_name+" any_tbl_or_spcfc_tbl:"+any_table_or_specific_table);
    
    var user_id=user.user_id;
    
    //log2("g_maintenance:"+g_maintenance);
    
    if (g_maintenance==true){
        log2("BEWARE!!! SITE IS IN MAINTENANCE MODE");
        return "ERROR_MAINTENANCE";
    }
    
    // Does the table still exist?
    if (typeof g_lobby_tables[lobby_name][table_name]=="undefined"){
        log2("BEWARE!!! This table does not exist anymore.");
        return "ERROR_TABLE_DOES_NOT_EXIST";
    }
    else var table=g_lobby_tables[lobby_name][table_name];
    
    // Has by any chance the user already joined this table?
    var seat_available=false;
    for (var i=1;i<=table.nb_players;i++){
        if (table.user_ids[i]==user_id){
            log2("BEWARE!!! The player is already at this table.");
            return "ERROR_ALREADY_AT_TABLE";
        }
    }

    // Does the user meet the filters criteria?
    var filters=table.filters;
    var friends_selection=filters.friends_selection;
//    log2("filters:"+mydump(filters));
    var user_in_friends_selection=false;
    if (filters.friends_selection!=0){
        for (var friend_id in friends_selection){
            log2("friend_selection:"+friend_id);
            if (user_id==friend_id){
                user_in_friends_selection=true;
                break;
            }
        }
    }else user_in_friends_selection=true; // If nothing in friends_selection, we are OK.
    
    if (!user_in_friends_selection){
        log2("BEWARE!!! User not in friends selection for this private tbl!!")
        return "ERROR_NOT_IN_SELECTION_FOR_TABLE";
    }
    
    // Join the first seat available. If no seats left, we display a warning in the logs.
    for (var i=1;i<=table.nb_players;i++){
        //log2("g_lobby_tables[lobby_name][table_name]:"+table[table_name]);
        if (table.user_ids[i]==0){
            log2("user "+user_id +" can join table "+table_name +" in lobby "+lobby_name);
            seat_available=true;
            break;
        }
    }
    
    if (seat_available==false){
        log2("BEWARE!! No seats!");//BEWARE!!! There is no seats at this table.");
        return "ERROR_TABLE_IS_FULL";
    }
    
    // If it is a "URL-only" table, we can't join it if we are looking for any table (through quick play not the inn)
    if (filters.url_only){
        if (any_table_or_specific_table=="any_table"){
            return "ERROR_CANNOT_JOIN_URL_ONLY_TABLE";
        }
    }
    
    return true;
    
}

function join_table(user, lobby_name, table_name){
    
    log2("join_table lobby_name:"+lobby_name+" table_name:"+table_name)
    // The function can also be called user being the bot id not the APE user as we know it
    if (!isNaN(user)){
        // Bot
        var user_id=user;
        var user_name=g_user_robot[user_id].user_name;;
    }else{
        user_id=user.user_id;
        user_name=user.name;
    }
    
    var table=g_lobby_tables[lobby_name][table_name];
    if (typeof table=="undefined"){
        log2("WARNING! Table does not exist anymore? WHY? We can't join it.");
        return;
    }
    
    var game_id=table.game_id;
    
    log2("join_table lobby_name: "+lobby_name+" --- table_name: "+table_name);
    log2("user_id:"+user_id+" user_name:"+user_name);
    
    for (var i=1;i<=table.nb_players;i++){
        if (table.user_ids[i]==0){
            log2("user "+user_id +" can join table "+table_name +" in lobby "+lobby_name);
            
            table.user_ids[i]=user_id;
            table.user_names[i]=user_name; //"User "+user_id;
            
            // Bot joining
            if (user_id_is_robot(user_id)){ 
                log2("Bot joining: "+user_id);
                table.belts[i]=0; //g_user_robot[last_bot].belt;
                table.ratings[i]=get_user_rating(user_id,game_id);
                table.languages[i]="--";
                table.teams[i]="Botland";
                table.mp[i]=0;
            }else{
            // Real player joining
                log2("Real player joining: "+user_id);
                table.belts[i]=g_user_info[user_id][table.game_id]["belt"];
                table.ratings[i]=Math.round(get_user_rating(user_id,game_id));
                table.languages[i]=g_user_info[user_id]["language"];
                table.teams[i]=g_user_info[user_id]["user_team"];
                if (potion_is_active(user_id)) table.mp[i]=1;
                else table.mp[i]=0;
                log2("g_user_info[user_id][user_team]:"+g_user_info[user_id]["user_team"]);
            }
            
            table.nb_players_seated++;
            g_lobby_status_has_changed[lobby_name]=true;
            break;
        }  
    }
    
    if (table.nb_players_seated==table.nb_players){
        // Start the game
        log2("MATCH CREATED BETWEEN PLAYERS IN LOBBY.");

        var user_id1=table.user_ids[1];
        var user_id2=table.user_ids[2];
        make_users_leave_all_other_tables(user_id1,user_id2,lobby_name,table_name);
        var g=Match_2_players(user_id1, user_id2, table.game_id,MODE_FULL_PLAY)
        g.lobby_name=lobby_name;
        g.table_name=table_name;
        table.match_id=g.match_id;
        // Store order of players according to the players's seat at the table (that we now know)
        for (var i=1;i<=table.nb_players;i++){
            table.ordered_ids[i]=g.player_id[i];
            log2("table.ordered_ids[i]:"+table.ordered_ids[i])
        }
        log2("MATCH CREATED table.ordered_ids is now filled --- g_lobby_tables[lobby_name][table_name]:"+mydump(g_lobby_tables[lobby_name][table_name]));
    }
}

function make_user_leave_all_tables(user_id){
    // IMPORTANT! This function is for users only not bots!
    
    log2("make_user_leave_all_tables() user_id:"+user_id);
    make_users_leave_all_other_tables(user_id,NO_OTHER_USER,"","");
}

// This could be optimized by storing for each user the list of tables he is seated at.
// We can use the function to make one user leave all tables by simply putting user_id2=-1, lobby_name_to_avoid="",table_name_to_avoid=""
// See above
// BEWARE BOTS WON'T LEAVE ANY OTHER TABLE!! THEY CAN PLAY MULTIPLE GAMES
function make_users_leave_all_other_tables(user_id1, user_id2, lobby_name_to_avoid, table_name_to_avoid){
    
    log2("mk_usrs_lv_all_othr_tbls() uid1:"+user_id1+" uid2:"+user_id2+ " lbby_to_avoid:"+lobby_name_to_avoid+" tbl_to_avoid:"+table_name_to_avoid)
    //log2("g_lobby_tables:"+mydump(g_lobby_tables))

    for (var lobby_name in g_lobby_tables){
        if (key_is_custom(lobby_name)){
            log2("strt lobby "+lobby_name)
            for (var table_name in g_lobby_tables[lobby_name]){
                if (true){ //key_is_custom(table_name)){
                    //log2("table_name:"+table_name);
                    //var t_name=table.table_name;
                    //var l_name=table.lobby_name;
                    //log2("make_users_leave_all_other_tables() lobby_name:"+lobby_name+" table_name:"+table_name)
                    // Check this is not the table where they will now be playing.
                    if (lobby_name!=lobby_name_to_avoid || table_name!=table_name_to_avoid){
                        var table=g_lobby_tables[lobby_name][table_name];
                        for (var i=1;i<=table.nb_players;i++){
                            if (typeof table=="undefined"){
                                // If the 1st player (i=1) has been found at the table, then he left and the table was closed 
                                // So it does not exist anymore.
                            }
                            else{
                                //log2("table.user_ids[i]:"+table.user_ids[i]);
                                if ( (table.user_ids[i]==user_id1 && user_id_is_human(user_id1)) || (table.user_ids[i]==user_id2 && user_id_is_human(user_id2)) ){
                                    leave_table(table.user_ids[i],lobby_name,table_name);
                                }
                            }
                        }
                    }
                }
            }
            log2("end "+lobby_name)
        }
    }
}

function leave_table(user_id, lobby_name, table_name){
    // user is the object user containing the pubid and user_id
    //ar user_id=user.user_id;
    log2("leave_table lobby: "+lobby_name+" - table: "+table_name+" - uid: "+user_id);
    
    var at_least_one_other_user_at_table=false;
    
    // Does the table still exist?
    if (typeof g_lobby_tables[lobby_name][table_name]=="undefined"){
        log2("BEWARE! This table does not exist anymore!");
        return;
    }
    
    // remove the player from the table if he is there.
    var removed=false;
    
    var table=g_lobby_tables[lobby_name][table_name];
            
    for (var i=1;i<=table.nb_players;i++){
        var user_x_id=g_lobby_tables[lobby_name][table_name].user_ids[i]
        //log2("g_lobby_tables[lobby_name][table_name]:"+g_lobby_tables[lobby_name][table_name]);
        if (user_x_id==user_id){
            log2("usr "+user_id +" left tbl "+table_name +" in l "+lobby_name);
            removed=true;
            
            table.user_ids[i]=0;
            table.user_names[i]="";
            table.belts[i]=null;
            table.ratings[i]=0;
             
            table.nb_players_seated--;
            
            // We must send lobby_status now.
            g_lobby_status_has_changed[lobby_name]=true;
        }
        else if (user_x_id!=0){
            at_least_one_other_user_at_table=true;
        }
    }
    if (removed==false){
        log2("BEWARE! The user was not at this table (anymore?)!");
    }else{
        // Was the match about to start with all players at the table?
        if (table.match_id!=0) {
            delete_match_cause_cancel(table.match_id)
        }
        table.match_id=0;
    }
    
    // Is there anyone left at the table?
    if (at_least_one_other_user_at_table==false){
        close_lobby_table(lobby_name,table_name);
    }
}

function create_lobby_table(lobby_name,user_id,game_id,open_to_everyone,filters){
    
    log2("create_lobby_table() lobby_name: "+lobby_name+" game_id: "+game_id+" filters:"+filters);
    //var new_table=create_lobby_table_object(game_id);

    // Find first available table_id for this lobby
    var table_id=get_first_available_table_id(lobby_name);
    
    delete_old_tables_from_inn_if_needed(lobby_name);
    
    ////////////
    // CHECKS //
    ////////////
    
    // Maintenance?
    if (g_maintenance==true){
        return "ERROR_MAINTENANCE";
    }
                
    // Check we have not reached the maximum number of tables
    if (table_id>MAX_NUMBER_OF_TABLES_PER_LOBBY){
        return "ERROR_NO_FREE_TABLE";
    }
    
    // Check the user had not opened a table yet for this game
    
    //for (var i=1;i<=MAX_NUMBER_OF_TABLES_PER_LOBBY;i++){
    var lobby=g_lobby_tables[lobby_name];
    var counter_tables_player=0;
    for (var table_name in lobby){
        var table=lobby[table_name];
        log2("table.nb_players:"+table.nb_players);
        for (var i_player=1;i_player<=table.nb_players;i_player++){
            log2("table.user_ids[i_player]:"+table.user_ids[i_player])
            log2("table.game_id:"+table.game_id)
            log2("game_id:"+game_id)
            if (table.user_ids[i_player]==user_id){
                counter_tables_player++;
                if (table.game_id==game_id){
                    return "ERROR_ALREADY_OPENED_TABLE_WITH_THIS_GAME";
                }
            }
        }
    }
    
    log2("clt 1")
    // And that he has not opened too many tables
    if (counter_tables_player>=MAX_NUMBER_OF_TABLES_PER_PLAYER_PER_LOBBY){
        return "ERROR_TOO_MANY_TABLES_OPENED_BY_PLAYER";
    }
        
    log2("clt 2")
    // Not the number of the table (between 1 and MAX_NUMBER_OF_TABLES_PER_LOBBY)
    // But basically the number of tables that have been opened in this lobby so far (never decrements)
    g_lobby_table_current_id[lobby_name]+=1;
    
    log2("clt 3")
    // And store it in the array of table_ids
    g_lobby_open_tables_ids[lobby_name][table_id]=true;
    
    log2("clt 4")
    // Increment the total of tables for this lobby
    g_lobby_table_counter[lobby_name]+=1;
    
    log2("clt 5")
    var table_name=g_table_id_seeding+"_"+g_lobby_table_current_id[lobby_name];
    log2("table_name:"+table_name);

    var table_object=new Object();
        table_object.lobby_name=lobby_name;
        table_object.game_id=game_id;
        table_object.table_id=table_id;
        table_object.table_name=table_name;
        table_object.user_ids={};
        table_object.user_names={};
        table_object.belts={};
        table_object.ratings={};
        table_object.languages={};
        table_object.teams={};
        table_object.mp={}; // Magic Potion. 0 or 1 if active.
        table_object.ordered_ids={};
        table_object.timestamp=get_time();
        table_object.open_to_everyone=open_to_everyone;
        table_object.filters=filters;
            
        table_object.nb_players=NB_MAX_PLAYERS_PER_TABLE;
        table_object.nb_players_seated=0;
        table_object.match_id=0;
        for (var i=1;i<=table_object.nb_players;i++){
            table_object.user_ids[i]=0;
            table_object.user_names[i]="--";
        }
    
    log2("clt 6");
    g_lobby_tables[lobby_name][table_name]=table_object;  
    
    log2("clt 7");
    
    //// Looking for a bug that causes APE to crash.
    // The server crashed between the loop situated before log2("clt 1") (the loop seemed to be finished)
    // and the end of the function so it is likely that the bug is in the next loop.
    var counter_invited=0; 
    
    // Send a "table_opened_for_you" raw to the invited players so that they are notified of the table opening.
    var friends_selection=table_object.filters.friends_selection;
    if (friends_selection!=0){
        for (var invited_id in friends_selection){
            counter_invited++;

            log2("clt 7aaa");
            log2("invited_id:"+invited_id);
            var pubid_invited=g_last_pubid[invited_id];
            log2("pubid_invited:"+pubid_invited);
            var pipe_invited=Ape.getPipe(pubid_invited);
            
            if (pipe_invited!=null){
                log2("pipe_invited is not null. We would like to send 'table_opened_for_you' but it crashes the platform. Why?");
//                log2("pipe_invited is not null. Sending 'table_opened_for_you'");
//                pipe_invited.sendRaw("table_opened_for_you",{user_id:user_id,game_id:game_id});
            }else{
                log2("Friend is not online now.");
            }

//            for (var i=1;i<=200000;i++){
//            Ape.setInterval(
//                function(){           
//                    log2("clt 7aaa");
//                    log2("invited_id:"+invited_id);
//                    var pubid_invited=g_last_pubid[invited_id];
//                    log2("pubid_invited:"+pubid_invited);
//                    var pipe_invited=Ape.getPipe(pubid_invited);
//                    if (pipe_invited!=null){
//                        log2("clt 7aa");
//                        log2("pipe_invited.toObject(:"+mydump(pipe_invited.toObject())); // Returns empty so does not work
//                        log2("clt 7a");
//                        var invited_user=Ape.getUserByPubid(pubid_invited);
//                        log2("clt 7b");
//                        if (invited_user==null){
//                            log2("clt 7ca");
//                            log2("var invited_user=Ape.getUserByPubid(pubid_invited)==null!!!!!!");
//                        }else{
//        //                    var invited_user_pubid=invited_user.getPipe();
//                            log2("clt 7c");
//        //                    if (invited_user_pubid!=null){
//        //                        log2("invited_user_pubid=null!!!!!!!");
//        //                        
//        //                    }else{
//        //                        log2("invited_user_pubid:"+invited_user_pubid);
//        //                    }
//        //                  log2("pipe_invited is not null. Sending 'table_opened_for_you'");
//                            log2("pipe_invited is not null. We would like to send 'table_opened_for_you' but it crashes the platform. Why?");
//                            pipe_invited.sendRaw("table_opened_for_you",{user_id:user_id,game_id:game_id});
//                        }
//                    }else{
//                        log2("Friend is not online now.");
//                    }
//                }
//                ,100
//            );  
//            }
    
            log2("counter_invited:"+counter_invited);
            if (counter_invited==2000){
                for (var i=1;i<=1000;i++){
                    log2("PB SERIOUS: counter_invited=2000 infinite loop!!!");
                }
                break;
            }
        }
    }
    
    log2("clt 8");
    
//    return "ERROR_MAINTENANCE";return "ERROR_MAINTENANCE";
    return table_name;
}

function close_lobby_table(lobby_name, table_name){
    
    log2("close_lobby_table() lobby_name: "+lobby_name+" table_name: "+table_name);
    //var new_table=create_lobby_table_object(game_id);
    
    // We remove the table from the list of tables to remove.
    if (typeof g_lobby_tables_to_close[lobby_name][table_name]!="undefined") {
        log2("Dltng tbl in g_lobby_tables_to_close")
        delete(g_lobby_tables_to_close[lobby_name][table_name]);
    } else log2("This tbl was not in g_lobby_tables_to_close any more.")
    
    var table=g_lobby_tables[lobby_name][table_name];
    if (typeof table=="undefined"){
        log2("WARNING!!!! Lobby_table was already closed!!!");
        return;
    }
    
    var table_id=table.table_id;
    log2("tbl_id: "+table_id);
    
    if (table_id){
        // If it exists, then we do delete it (but do not decrement counter before checking it existed)
        g_lobby_table_counter[lobby_name]-=1;

        delete(g_lobby_open_tables_ids[lobby_name][table_id]);

        delete(g_lobby_tables[lobby_name][table_name]);  
        
        // We must send lobby_status now.
        g_lobby_status_has_changed[lobby_name]=true;

        //log2("g_lobby_tables[lobby_name]: "+mydump(g_lobby_tables[lobby_name]))
    }
    
    //log2("g_lobby_open_tables_ids[lobby_name]:"+mydump(g_lobby_open_tables_ids[lobby_name]));
}

function get_first_available_table_id(lobby_name){
    var id=0;
    var id_found=0;
    do {
        id=id+1;
        if (typeof g_lobby_open_tables_ids[lobby_name][id]=="undefined"){
            id_found=id;
        }
    } while (id_found==0);
    log2("get_first_available_table_id lobby_name: "+lobby_name+" --- id_found: "+id_found)
    return id_found;
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// SEND
Ape.registerHookCmd("SEND", function(params, info){
    //
    //
    // BE CAREFUL, we should not store things going to non-broadcast channels (like system news)...
    // DEAL WITH THIS IN SOME WAY! Not done yet!
    //
    //
    
    var user_id=info.user.user_id;
    
    log2("SEND (from user to channel) hooked");
    //log2("JOIN channel:"+params.channels);
    ///log2("params:"+mydump(params));
    //log2("info:"+mydump(info));

    // Preventing user from posting too often
    // We limit to:
    // - 1 msg per second
    // - 10 messages per minute
    // - 25 messages per 5 minutes
    // This is a maximum as a new user might go a little beyond these thresholds (we give credit back every 6 seconds).
    // So we initialize the counters to non-zero when a user logs in to avoid new logged-ins being allowed to flood a bit more than the others.
    var diff=get_time()-g_user_info[user_id]["last_message_timestamp"];
    log2("g_user_info[user_id][last_message_timestamp]-get_time():"+diff);
    if (diff<1000){
        log2("Too many messages send in one second user_id:"+user_id);
        info.sendResponse('too_many_messages_posted_to_chat', {"error_case":"one_second"});
        return -1;
    }
    
    if (g_user_info[user_id]["nb_messages_posted_last_minute"]>g_max_nb_of_messages_per_minute){
        log2("Too many messages send in one minute user_id:"+user_id);
        info.sendResponse('too_many_messages_posted_to_chat', {"error_case":"one_minute"});
        return -1;
    }
    g_user_info[user_id]["nb_messages_posted_last_minute"]+=1;
    
    if (g_user_info[user_id]["nb_messages_posted_last_5_minutes"]>g_max_nb_of_messages_per_5_minutes){
        log2("Too many messages send in 5 minutes user_id:"+user_id);
        info.sendResponse('too_many_messages_posted_to_chat', {"error_case":"five_minutes"});
        return -1;
    }
    g_user_info[user_id]["nb_messages_posted_last_5_minutes"]+=1;
    
    g_user_info[user_id]["last_message_timestamp"]=get_time();
    
    var channel_name = Ape.getChannelByPubid(params.pipe).getProperty('name');

    //log2(mydump(channel));
    //log2("channel:"+channel);
    //log2("channel name:"+channel.getProperty('name'));

    var msg=params.msg;
    var user_name=info.user.name;
    //g_user_info[user_id]["user_name"]; //
    var user_team=g_user_info[user_id]["user_team"];
    var sender_pipe=params.pipe;

    // Adding the object one_to_one_chats_object for the receiver in one-to-one chats
    // Also sending the info to him so that he opens the chat.
    // This must be absolutely before sending the message. Otherwise the receiver will not 
    if (chat_is_one_to_one(channel_name)){
        // We are sending a message to this one-to-one channel.
        // We must add one line for the invited user in the one_to_one_chats_object.
        var invited_user_id=get_one_to_one_invited_user_id(channel_name,user_id);
        if (invited_user_id==-1) return -1; // ERROR!!!!
        
        // Add object for this user
        add_one_to_one_chats_object(invited_user_id, user_id, user_name); // The missing info ("") will be sent by the chat opener via "INVITED_USER_NAME" command.   
        send_one_to_one_chats_list(invited_user_id);
    }
    
    //log2("sender_pipe in SEND:"+sender_pipe);
    // TEST
    //var channel = Ape.getChannelByName(channel_name);
    //channel.setProperty('foo', 'bar');
    //channel.myprivate = {'my':'private'}; // Can be a string or whatever you want
    //channel.pipe.sendRaw('channel_custom_data', {'msg':msg,'user_name':user_name,'sender_pipe':params.pipe,'channel_name':channel_name});
    
    var d=new Date();
    //log2("g_user_info[user_id]['chat_ban_end']: "+g_user_info[user_id]["chat_ban_end"])
    //log2("Now: "+d);
    //log2("diff:"+(g_user_info[user_id]["chat_ban_end"]-d));
    

    //log2("g_channel_latest_activity[channel_name]:"+g_channel_latest_activity[channel_name]);
    
    //log2("g_user_info[user_id]['chat_ban_end']:"+g_user_info[user_id]["chat_ban_end"]);   
    if (g_user_info[user_id]["chat_ban_end"]<d) {
//        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
//        log2("user_name:"+user_name);
//        log2("length:"+user_name.length);
//        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
//        for (var i=1;i<=10000;i++){
        store_single_chat(channel_name, sender_pipe, user_id, user_name,user_team, msg);
//        }
        // Store latest message timestamp so that we know when a chat is getting old. We will close it automatically after a certain amount of time.
        g_channel_latest_activity[channel_name]=get_time(); //new Date();
    }
    else {
        log2("SEND refused. User is banned from chat for the moment.");
        info.sendResponse('chat_cant_publish_in_chat', {}); // Tell player that he can't chat!
    }
    //record_latest_chats();
    

    
    // We don't let the normal SEND command work
    // The message will be sent via the raw "channel_custom_data". See record_chat_message_and_get_unique_id() in mysql.js
    return -1;
});


Ape.registerCmd("ASK_FOR_NEXT_TEST_USER_ID", false, function(params, info){
    log2("ASK_FOR_NEXT_TEST_USER_ID");

    var next_test_user_id;

    for (var i=1001; i<=99999;i++){
        if (g_userlist.has(i) || g_temporary_locked_test_user_id[i]==true){
            log2("'user"+i +"' already logged");
            continue;
        }
        break;
    }

    if (i!=100000) next_test_user_id=i;
    else return 0;

    log2("next_test_user_id: " +next_test_user_id)

    g_temporary_locked_test_user_id[next_test_user_id]=true;

    return {name: "ask_for_next_test_user_id", data:{next_test_user_id:next_test_user_id}}
})

function test_bot_vs_bot(){
    log2("test_bot_vs_bot");
    
    var i;

    // Store number of moves (and real moves) in the games
    // Moves = compteur_coups_joues
    // Turns = specific indicator for the game (in KD the number of player's turn)
    
    var store_real_moves;
    var size_array_moves=501;
    var nb_of_moves=new Array(size_array_moves);
    var nb_of_turns=new Array(size_array_moves);
    var nb_of_turns_max=0;
    var nb_of_moves_max=0;
    var nb_of_moves_min=9999999999999999999;
    var games_counter=0;
    var average_nb_of_turns=0;
    var average_nb_of_moves=0;
    var nb;
    var i_max;

    var match_stats=new Array(12);
    
    for (i=0;i<=size_array_moves;i++){
        nb_of_moves[i]=0;
        nb_of_turns[i]=0;
    }
    
    var a={};
    a[2]=0;
    a[1]=0;
    for(var k in a){
        log2("k:"+k);
    }
    
    // mmmmm
    ////////////////////////////////////////////////////////////////////  
    // GAME_ID
    var game_id=2; // Game ?
    // Nb of loops
    var nb_boucles=1;
    
    // Which robots?
    var nb_robots_a_tester=2;
    var premier_robot=1;
    
    // All matches between two non tested bots will not be played. We are not interested in them.
    var tested_bots=[1,2,3,4,5,6,7,8,9,10,11,12]; // The robots missing here will not play against each other (only against the tested ones)
//    var tested_bots=[5,6,7,8,9,10,11,12]; // The robots missing here will not play
//    var tested_bots=[3,4,5,6,7,8,9,10,11];
//    var tested_bots=[2,4,5,8];
//    var tested_bots=[4];
//    var tested_bots=[1,2,3,4,5,6,7,8];
//    var tested_bots=[4,5,6,7];
//    var tested_bots=[10,11] //12];

    ///////////////////////////////////////////////////////////////////
        
    var dernier_robot=premier_robot+nb_robots_a_tester-1;
        
    //var only_one_robot_id=0; // If we want to test only one robot, we put its id here, otherwise 0

    var nb_parties=new Array(12);
    var nb_points=new Array(12);
    var nb_parties_premier_joueur=new Array(12);
    var nb_parties_second_joueur=new Array(12);
    var nb_parties_total=new Array(12);
    var nb_points_premier_joueur=new Array(12);
    var nb_points_second_joueur=new Array(12);
    for (i=1;i<=12;i++){
        nb_parties_premier_joueur[i]=0;
        nb_parties_second_joueur[i]=0;
        nb_parties_total[i]=0;
        nb_points_premier_joueur[i]=0;
        nb_points_second_joueur[i]=0;

        nb_parties[i]=new Array(12);
        nb_points[i]=new Array(12);
        for (var j=1;j<=12;j++){
            nb_parties[i][j]=0;
            nb_points[i][j]=0;
        }
        match_stats[i]={};
        match_stats[i]["Longest game"]=0;
        match_stats[i]["Biggest calls"]=0;
    }
    log2("dernier_robot:"+dernier_robot);
    //var cas="au hasard";
    var cas="tableau";

    log2("test_bot_vs_bot 0")
    if (g_server_ready==SERVER_READY_TARGET){
        if (cas=="au hasard") g_shunt_mysql=false;
        else g_shunt_mysql=true;

        log2("test_bot_vs_bot 1")

        if (cas=="tableau") i_max=(nb_robots_a_tester-1)*(nb_robots_a_tester)*nb_boucles;
        else i_max=1;

        var user1=premier_robot;
        var user2=premier_robot;
        for (game_counter=1;game_counter<=i_max;game_counter++){
            if (cas=="au hasard"){
                user1=premier_robot+Math.floor(Math.random()*(nb_robots_a_tester));
                do{
                    user2=premier_robot+Math.floor(Math.random()*(nb_robots_a_tester));
                }
                while (user2==user1)
            }
            else if (cas=="tableau"){
                user2++;
                if (user2==user1) user2++;
                if (user2>dernier_robot){
                    user2=premier_robot;
                    user1++;

                    if (user1>dernier_robot){
                        user1=premier_robot;
                        user2=premier_robot+1;
                    }
                }
            }
            
            // We exclude matches between bots that we don't want to test
            if (tested_bots.indexOf(user1) == -1 && tested_bots.indexOf(user2)==-1){
                    // next one
                    continue;
            }
            /*
            if (only_one_robot_id>0) // Only one robot tested
            {
                if (user1!=only_one_robot_id && user2!=only_one_robot_id)
                {
                    // next one
                    continue;
                }
            }
            */
            g_counter_matches_opened++;
            log2("--------------------Load test match "+game_counter+"/"+i_max);
            var mc=get_match_counter();


            if (game_id==6 || game_id==7){
                var store_turns=true;
            }else store_turns=false;


            log2("users:"+user1+" "+user2)
            // If we need to know all the things of the manager in g2, then we need to have a transparent manager
            // Not all games are ready for that so we put g_manager_transparent at false in this case
            if (game_id==3 || game_id==10 || game_id==11){
                g_manager_transparent=true;
            }else if (game_id==1 || game_id==2 || game_id==4 || game_id==5 || game_id==6|| game_id==7 || game_id==8  || game_id==9){
                g_manager_transparent=false;
            }else{
                for (var j=1;j<=100;j++){ // Can't use i which is used for something else (the game counter)
                    log2("WE DON'T KNOW IF g_manager_transparent=true or false");
                }
            }


//log2(mydump(Object.keys(this)));
//new this["Finito_game"]("s",3,0,"local","local",1,1,2,false);
//log2(mydump(Object.keys(this)));

            if (game_counter==1){
                var test_no_global_variable_creation=true;
            }else test_no_global_variable_creation=false;
            
            if (test_no_global_variable_creation){
                delete(tototo);
                var previous_nb_global_objects=Object.keys(this).length;
                var previous_list_of_keys=Object.keys(this);
            }
            
            var nom_class=g_game_info[game_id].game_short_name+"_Game";
//            log2(nom_class);
            //g_matches[mc]=new this[nom_class]("s",game_id,mc,"local","local",pick_first_player_id(user1,user2),user1,user2,false); // This was using pick_first_player_id() but I think this was an issue. We just want user1 to be the first user.
            g_matches[mc]=new this[nom_class]("s",game_id,mc,"local","local",user1,user1,user2,false);

            var g=g_matches[mc];
            games_counter++;
            
            Mysql_insert_online_match(MODE_FULL_PLAY, g);
            g.game_start_game();
            //log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g.move_ordering_bonus_for_nb_overwritten_territories:"+g.move_ordering_bonus_for_nb_overwritten_territories);

//            log2("g.first_player_id:"+g.first_player_id);
            
            
            if (false){
                run_game_manager(g);
            }else{
                //var nom_class=g_game_info[game_id].game_short_name+"_Game";
                g_matches2[mc]=new this[nom_class]("s",game_id,mc,"local","remote",g.first_player_id,user2,user1,false);// Manager is remote (done by g) but Opponent is local!

                var g2=g_matches2[mc];

//                log2("AVANT g2.game_start_game()")
                //log2("g.game_get_startup_conditions(2):"+g.game_get_startup_conditions(2))
                g2.game_start_game(g.game_get_startup_conditions(2));
                //log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g2.move_ordering_bonus_for_nb_overwritten_territories:"+g2.move_ordering_bonus_for_nb_overwritten_territories);
                
//                log2("APRES g2.game_start_game()")
                if (true){
                    
                    run_game_manager_bot_vs_bot(g);
                    //log2("VICTOIRE:"+g.match_result);
                    
                    // Checking we have not created a a variable.

                    if (test_no_global_variable_creation){
                        var current_nb_global_objects=Object.keys(this).length;
                        log2("previous_nb_global_objects:"+previous_nb_global_objects)
                        log2("current_nb_global_objects:"+current_nb_global_objects)
                        if (previous_nb_global_objects!=current_nb_global_objects){
                            for (var key in Object.keys(this)){
                                if (Object.keys(this).hasOwnProperty(key)){
                                    if (typeof previous_list_of_keys[key]=="undefined"){
                                        for (var j=1;j<=100;j++){
                                            log2("BEWARE!!! Global Variable -------"+Object.keys(this)[key]+"-------- created in "+nom_class);
                                        }
                                        crash(); // Deliberate so that the test does not carry on. We want to see the error message.
                                    }
                                }
                            }
                            previous_nb_global_objects=current_nb_global_objects;
                        }
                    }
                    
                    /////////////////////////////////
                    // Impression des statistiques //
                    /////////////////////////////////

                    //log2(user1 + " "+user2)
                    nb_parties[user1][user2]++;
                    nb_parties_premier_joueur[user1]++;
                    nb_parties_second_joueur[user2]++;
                    nb_parties_total[user1]++;
                    nb_parties_total[user2]++;

                    if (g.match_result==DRAW){
                        //log2("DRAW")
                        log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                        nb_points[user1][user2]+=0.5;
                        nb_points_premier_joueur[user1]+=0.5;
                        nb_points_second_joueur[user2]+=0.5;
                        //log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                    }else if ((g.first_player_id==user1 && g.match_result==1) || (g.first_player_id==user2 && g.match_result==2)){
                        //log2("Vic user1")
                        log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                        nb_points[user1][user2]+=1;
                        nb_points_premier_joueur[user1]+=1;
                        //log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                    }else{
                        //log2("Vic user2")
                        //log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                        //nb_points[user1][user2]+=0;
                        //log2("nb_points[user1][user2]:"+nb_points[user1][user2])
                        nb_points_second_joueur[user2]+=1;
                    }

                    nb=g.compteur_coups_joues;
                    log2("Nb of moves:"+nb);

                    nb_of_moves[nb]++;
                    average_nb_of_moves+=nb;
                    
                    if (nb<nb_of_moves_min){
                        nb_of_moves_min=nb;
                    }
                    if (nb>nb_of_moves_max){
                        nb_of_moves_max=nb;
                    }
                    if (store_turns){
                        nb=g.P.nb_of_turns;
                        log2("Nb of turns:"+nb);

                        nb_of_turns[nb]++;
                        average_nb_of_turns+=nb;

                        if (nb>nb_of_turns_max){
                            nb_of_turns_max=nb;
                        }
                    }
                    
//                            log2("stats1:"+mydump(g.match_stats))
//                            log2("stats2:"+mydump(g2.match_stats))


//                    log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g.first_player_id:"+g.first_player_id);
//                    log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g2.first_player_id:"+g.first_player_id);
//                    log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g.match_stats[Neg total calls]:"+g.match_stats["Neg total calls"]);
//                    log2("ZZZZZZZZZZZZZZZZZZZZZTTTTTTTTTTTTT g2.match_stats[Neg total calls]:"+g2.match_stats["Neg total calls"]);
    
                    for (var key in g.match_stats){
                        
                        if (key_is_custom(key)){
                        //if (true || g.hasOwnProperty(key)){
                        /*
                        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
                        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
                        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
                        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
                        log2("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
                        */
                            if (match_stats[user1][key]==undefined) match_stats[user1][key]=0;
                            if (match_stats[user2][key]==undefined) match_stats[user2][key]=0;

                            if (key=="Neg total time"){
                                var game_duration=g.match_stats[key];
                                if (game_duration>match_stats[user2]["Longest game"]) match_stats[user2]["Longest game"]=game_duration;
                                
                                var game_duration=g2.match_stats[key];
                                if (game_duration>match_stats[user1]["Longest game"]) match_stats[user1]["Longest game"]=game_duration;
                            }
                            if (key=="Neg total calls"){
                                var nb_calls=g.match_stats[key];
                                if (nb_calls>match_stats[user2]["Biggest calls"]) match_stats[user2]["Biggest calls"]=nb_calls;
                                
                                var nb_calls=g2.match_stats[key];
                                if (nb_calls>match_stats[user1]["Biggest calls"]) match_stats[user1]["Biggest calls"]=nb_calls;
                            }
                            if (key.substring(0,4)=="Neg "){
                                // We store the opponent's negamax stats in the opponents stats which means we exchange the game stats
                                match_stats[user2][key]+=g.match_stats[key];
                                match_stats[user1][key]+=g2.match_stats[key];
                            }else{
                                var val1=g.match_stats[key]; // user1 is my_player in g
                                var val2=g2.match_stats[key]; // user2 is my_player in g
                                match_stats[user1][key]+=val1;
                                match_stats[user2][key]+=val2;
                            }
                            //log2("key:"+key);
                            //log2("user1:"+user1);
                            //log2("user2:"+user2);
                            //log2("match_stats[user1][key]:"+match_stats[user1][key]);
                            
                                // I don't know what this is!!!
                                // I don't know what this is!!!
                                // I don't know what this is!!!
                                // I don't know what this is!!!
                                if (key!="points" && key!="points_diff") {
                                    
                                    // I don't know what this is!!!
                                    // So we delete it
                                    //log2("BEWARE - ADD THIS key ("+key+") to the key_is_custom() function.");
                                }
                        }
                    }
                    
                    
                    log2("Nb of turns g2:"+g.P.nb_of_turns);
                    
                }
                delete (g_matches2[mc]);
            }
            

            delete (g_matches[mc]);

        //Ape.setTimeout(function(){for (i=1;i<=100;i++) log2("zzzzzzzzzzzzzzz");test_bot_vs_bot()},8600);

            //
            // Display the results (tableau)
            //
            var i1;
            if (g_counter_matches_opened%(nb_robots_a_tester-1)==0 || game_counter==i_max){
                //log2("cas"+cas);
                var contenu_chaine;
                var cas_tableau;
                if (cas=="tableau"){
                    for (cas_tableau=1;cas_tableau<=3;cas_tableau++){
                        if (cas_tableau==1) var tableau=nb_parties;
                        else tableau=nb_points;
                        //else tableau=pourcentage_points;

                        var chaine="\t";
                        for (i1=1;i1<=12;i1++){
                            chaine=chaine+i1+"\t";
                        }
                        log2(chaine);
                        chaine="";
                        for (i1=1;i1<=12;i1++){
                            chaine=i1+"\t";
                            for (j=1;j<=12;j++){
                                if (cas_tableau==3){
                                    if (nb_parties[i1][j]>0) contenu_chaine=Math.round(nb_points[i1][j]/nb_parties[i1][j]*10000)/100+"%";
                                    else contenu_chaine=""
                                }
                                else contenu_chaine=tableau[i1][j];

                                chaine=chaine+contenu_chaine+"\t";
                            }
                            log2(chaine);
                        }
                        log2("");
                    }
                }

                // We may want to put this inside the previous {}
                chaine="";
                var chaine2="";
                var chaine3="";
                var chaine4="";
                var chaine2b="";
                var chaine4b="";
                var chaine52="";
                var chaine53="";
                var chaine54="";
                var chaine54b="";
                var ratio_points;
                var chaine_elo1="";
                var chaine_elo2="";
                var chaine_elo3="";
                var elo=[];
                for (i1=1;i1<=12;i1++){
                    chaine=chaine+nb_points_premier_joueur[i1]+"\t";
                    chaine2=chaine2+nb_parties_premier_joueur[i1]+"\t";
                    ratio_points=nb_points_premier_joueur[i1]/nb_parties_premier_joueur[i1]
                    chaine2b=chaine2b+Math.round(ratio_points*10000)/100+"%\t";
                    elo[i1]=1500+700*(ratio_points-0.5)*2
                    chaine_elo1=chaine_elo1+Math.round(elo[i1]*1)/1+"\t";

                    chaine3=chaine3+nb_points_second_joueur[i1]+"\t";
                    chaine4=chaine4+nb_parties_second_joueur[i1]+"\t";
                    ratio_points=nb_points_second_joueur[i1]/nb_parties_second_joueur[i1]
                    chaine4b=chaine4b+Math.round(ratio_points*10000)/100+"%\t";
                    elo[i1]=1500+700*(ratio_points-0.5)*2
                    chaine_elo2=chaine_elo2+Math.round(elo[i1]*1)/1+"\t";

                    chaine52=chaine52+i1+"\t";
                    chaine53=chaine53+(nb_points_premier_joueur[i1]+nb_points_second_joueur[i1])+"\t";
                    chaine54=chaine54+(nb_parties_premier_joueur[i1]+nb_parties_second_joueur[i1])+"\t";
                    ratio_points=(nb_points_premier_joueur[i1]+nb_points_second_joueur[i1])/(nb_parties_total[i1]);
                    chaine54b=chaine54b+Math.round(ratio_points*10000)/100+"%\t";
                    elo[i1]=1500+700*(ratio_points-0.5)*2
                    chaine_elo3=chaine_elo3+Math.round(elo[i1]*1)/1+"\t";
                }
                log2("1st player")
                log2(chaine);
                log2(chaine2);
                log2(chaine2b);
                log2(chaine_elo1);
                log2("")
                log2("2nd player")
                log2(chaine3);
                log2(chaine4);
                log2(chaine4b);
                log2(chaine_elo2);
                log2("")
                log2("1st and 2nd player")
                log2(chaine52);
                log2(chaine53);
                log2(chaine54);
                log2(chaine54b);
                log2(chaine_elo3);
                log2("")
                
                print_stat_line("Robot id",null,null);
                print_stat_line("Elo",elo,null);
                
                
//                if (j==1) var u =user1;
//                else u=user2;
//                var ms=match_stats[user1];
//                for (var key in ms){
//                    if (game_id==10){
//                        var round=0;
//                        if (key.indexOf("R2_")!=-1){
//                            log2('key.indexOf("R2_"):'+key.indexOf("R2_"))
//                            log2("ZZkey:"+key)
//                            log2("R2_ in key")
//                            round=2;
//                        }else if (key.indexOf("R3_")!=-1){
//                            round=3;
//                        }else if (key.indexOf("R4_")!=-1){
//                            round=4;
//                        }
//
////                        log2("Kkey:"+key)
////                        log2("Kround:"+round)
//                        if (round>0){
//                            var round_frequency=ms[round+"R+"];
//                        log2("key:"+key)
//                        log2("round:"+round)
//                            log2("round_frequency:"+round_frequency);
//                            log2("nb_parties_total[u]:"+nb_parties_total[user1]);
//                            log2("match_stats[user1][key]:"+match_stats[user1][key]);
//                            if (round_frequency>0) match_stats[user1][key]=match_stats[user1][key]/round_frequency*nb_parties_total[user1];
//                            log2("match_stats[user1][key]:"+match_stats[user1][key]);
//                        }
//                    }
//                }

                var round_occurences;
                
                for (key in match_stats[user1]){
//                    log2("key");

                    if (key_is_custom(key)){
                        var round_occurences="";
                        if (game_id==10){
                            var round=0;
//                            if (key.indexOf("R1_")!=-1){
//                                round=1;
//                            }else 
                            if (key.indexOf("R2_")!=-1){
                                round=2;
                            }else if (key.indexOf("R3_")!=-1){
                                round=3;
                            }else if (key.indexOf("R4_")!=-1){
                                round=4;
                            }

    //                        log2("Kkey:"+key)
    //                        log2("Kround:"+round)
                            if (round>0){
//                                var round_frequency=ms[round+"R+"];
//                                log2("key:"+key)
//                                log2("round:"+round)
//                                log2("round_frequency:"+round_frequency);
//                                log2("nb_parties_total[u]:"+nb_parties_total[user1]);
//                                log2("match_stats[user1][key]:"+match_stats[user1][key]);
//                                if (round_frequency>0) match_stats[user1][key]=match_stats[user1][key]/round_frequency*nb_parties_total[user1];
//                                log2("match_stats[user1][key]:"+match_stats[user1][key]);
                                  round_occurences=round+"R+";
                            }
                        }else if (game_id==11){
                            if (key.indexOf("Neg Nb moves per rel. pos.")!=-1) round_occurences="Neg mv considered (take ph)";
                            else if (key.indexOf("Neg mv played per rel. pos.")!=-1) round_occurences="Neg mv played (take ph)";
                            else if (key.indexOf("Take card offset P")!=-1) round_occurences="Take card phases counted P";
                            else if (key.indexOf("Take card offset O")!=-1) round_occurences="Take card phases counted O";
                            else if (key.indexOf("1 P THE CLEARING")!=-1 || key.indexOf("1 O THE CLEARING")!=-1 || key.indexOf("Neg 1 calls THE CLEARING")!=-1) round_occurences="1---THE CLEARING";
                            else if (key.indexOf("2 P HAPPY COWS")!=-1 || key.indexOf("2 O HAPPY COWS")!=-1|| key.indexOf("Neg 2 calls HAPPY COWS")!=-1)  round_occurences="2---HAPPY COWS";
                            else if (key.indexOf("3 P BADLANDS")!=-1 || key.indexOf("3 O BADLANDS")!=-1|| key.indexOf("Neg 3 calls BADLANDS")!=-1) round_occurences="3---BADLANDS";
                            else if (key.indexOf("4 P CIRCLE THE WAGONS")!=-1 || key.indexOf("4 O CIRCLE THE WAGONS")!=-1|| key.indexOf("Neg 4 calls CIRCLE THE WAGONS")!=-1) round_occurences="4---CIRCLE THE WAGONS";
                            else if (key.indexOf("5 P SMALLTOWN CHARM")!=-1 || key.indexOf("5 O SMALLTOWN CHARM")!=-1|| key.indexOf("Neg 5 calls SMALLTOWN CHARM")!=-1) round_occurences="5---SMALLTOWN CHARM";
                            else if (key.indexOf("6 P GOLD COUNTRY")!=-1 || key.indexOf("6 O GOLD COUNTRY")!=-1|| key.indexOf("Neg 6 calls GOLD COUNTRY")!=-1) round_occurences="6---GOLD COUNTRY";
                            else if (key.indexOf("7 P PRAIRIE LIFE")!=-1 || key.indexOf("7 O PRAIRIE LIFE")!=-1|| key.indexOf("Neg 7 calls PRAIRIE LIFE")!=-1) round_occurences="7---PRAIRIE LIFE";
                            else if (key.indexOf("8 P COOL WATER")!=-1 || key.indexOf("8 O COOL WATER")!=-1|| key.indexOf("Neg 8 calls COOL WATER")!=-1) round_occurences="8---COOL WATER";
                            else if (key.indexOf("9 P CLAIM JUMPERS")!=-1 || key.indexOf("9 O CLAIM JUMPERS")!=-1|| key.indexOf("Neg 9 calls CLAIM JUMPERS")!=-1) round_occurences="9---CLAIM JUMPERS";          
                            else if (key.indexOf("10 P BOOM OR BUST")!=-1 || key.indexOf("10 O BOOM OR BUST")!=-1|| key.indexOf("Neg 10 calls BOOM OR BUST")!=-1) round_occurences="10---BOOM OR BUST";
                            else if (key.indexOf("11 P WAGON TRAIN")!=-1 || key.indexOf("11 O WAGON TRAIN")!=-1|| key.indexOf("Neg 11 calls WAGON TRAIN")!=-1) round_occurences="11---WAGON TRAIN";
                            else if (key.indexOf("12 P ONE TOO MANY")!=-1 || key.indexOf("12 O ONE TOO MANY")!=-1|| key.indexOf("Neg 12 calls ONE TOO MANY")!=-1) round_occurences="12---ONE TOO MANY";
                            else if (key.indexOf("13 P BOOTLEGGERS")!=-1 || key.indexOf("13 O BOOTLEGGERS")!=-1|| key.indexOf("Neg 13 calls BOOTLEGGERS")!=-1) round_occurences="13---BOOTLEGGERS";
                            else if (key.indexOf("14 P UNDISCOVERED")!=-1 || key.indexOf("14 O UNDISCOVERED")!=-1|| key.indexOf("Neg 14 calls UNDISCOVERED")!=-1) round_occurences="14---UNDISCOVERED";
                            else if (key.indexOf("15 P FORTIFIED")!=-1 || key.indexOf("15 O FORTIFIED")!=-1|| key.indexOf("Neg 15 calls FORTIFIED")!=-1) round_occurences="15---FORTIFIED";
                            else if (key.indexOf("16 P THE HERD")!=-1 || key.indexOf("16 O THE HERD")!=-1|| key.indexOf("Neg 16 calls THE HERD")!=-1) round_occurences="16---THE HERD";
                            else if (key.indexOf("17 P TARGET PRACTICE")!=-1 || key.indexOf("17 O TARGET PRACTICE")!=-1|| key.indexOf("Neg 17 calls TARGET PRACTICE")!=-1) round_occurences="17---TARGET PRACTICE";
                            else if (key.indexOf("18 P RIFLES READY")!=-1 || key.indexOf("18 O RIFLES READY")!=-1|| key.indexOf("Neg 18 calls RIFLES READY")!=-1) round_occurences="18---RIFLES READY";
                        }
                        print_stat_line(key,match_stats,nb_parties_total,round_occurences);
                    }
                }
            }
        }

        // Average computation
        average_nb_of_moves/=games_counter;
        if (store_turns) average_nb_of_turns/=games_counter;


        //return;
        log2 ("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        if (nb_of_moves_max>=nb_of_turns_max) i_max=nb_of_moves_max; else i_max=nb_of_turns_max;

        // Display of the number of moves
        log2("");
        for (game_counter=nb_of_moves_min;game_counter<=nb_of_moves_max;game_counter++){
            chaine= nb_of_moves[game_counter] +"\t"+ nb_of_turns[game_counter] +"\t" + game_counter ;
            log2(chaine);
        }
        
        if (cas=="au hasard") Ape.setTimeout(function(){test_bot_vs_bot()},200); // 260 for KC?

        // Display of average nb of moves and turns
        log2("Average nb of moves: "+average_nb_of_moves);
        if (store_turns) log2("Average nb of turns: "+average_nb_of_turns);

    }
    else{
        Ape.setTimeout(function(){test_bot_vs_bot()},600);
    }

}
function key_is_custom(key){
    if (key!="$family" && key!="each" && key!="clean" && key!="associate"
        && key!="link" && key!="contains" && key!="" && key!="extend"
        && key!="getLast" && key!="getRandom" && key!="" && key!="include"
        && key!="combine" && key!="erase" && key!="empty" && key!="flatten"
        && key!="hexToRgb" && key!="rgbToHex"

        && key!="unset_if_exists") // Obsolete but let's keep it. We remove the prototyping just in case it were causing memory issues.
    return true;
    else return false;
}
function print_stat_line(key,tableau,nb_parties_total,round_occurences_key){
    var stat_with_pad = key;
    stat_with_pad = stat_with_pad + "                             ".substring(stat_with_pad.length)
    var chaine_individual_stat=stat_with_pad;
    
//    log2(mydump(tableau));
    
    for (var i=1;i<=12;i++){
        if (key=="Robot id") var printed_val=i;
        else if (key=="Elo") printed_val=Math.round(tableau[i]*100)/100;
        else if (key=="Longest game" || key=="Biggest calls"){
            //log2("ZZZZZZZZZZZZZZZZZZZZZZZZZ:"+tableau[i][1]+" "+tableau[i][2]);
            printed_val=tableau[i][key];
        }
        else{
            if (round_occurences_key!="") var nb_occurences=tableau[i][round_occurences_key];
            else nb_occurences=nb_parties_total[i]
            var printed_val=tableau[i][key]/nb_occurences;
            if (Math.abs(printed_val)>1000) printed_val=Math.round(printed_val);
            else if (Math.abs(printed_val)>1) printed_val=Math.round(printed_val*100)/100;
            else printed_val=Math.round(printed_val*1000)/1000;
        }
        
        if (isNaN(printed_val)) chaine_individual_stat+="\t"
        else chaine_individual_stat+="\t"+printed_val;
    }
    if (key=="Elo") log2("");
    if (key.toUpperCase()==key && !string_has_number(key)) log2("-------"); // This is a title, we add an empty line.
    log2(chaine_individual_stat);
}
function string_has_number(chaine){
    return /\d/.test(chaine);
}
function get_time(){
    // Returns a timestamp in ms.
    var d = new Date();
    return d.getTime();
}


function Print_User_Counter(){ 
    log2("");
    log2("# of users: " + g_user_counter
            + "      g_custom_raw_list: "+g_custom_raw_list.getLength()
            + "      g_timeout_counter: "+g_timeout_counter
            + "      g_marked_for_deletion: "+g_marked_for_deletion
            + "      g_userlist (nb users): "+g_userlist.getLength());
    // + "          # of users waiting: " + g_waiting_list.getLength()
    
    // Counter of g_chat_msg_counter
    g_chat_msg_counter_counter=count_elements_in_array(g_chat_msg_counter); 
    g_chat_history_loaded_counter=count_elements_in_array(g_chat_history_loaded); // 1 more than the others cause system_news is counted here.
    g_chat_history_counter=count_elements_in_array(g_chat_history);  
    g_number_of_single_chat_ids_in_history=count_elements_in_array(g_single_chats_id_in_history);
    g_number_of_g_one_to_one_chats=count_elements_in_array(g_one_to_one_chats)

    log2("chat_msg_counter_counter (-1 OK): " + g_chat_msg_counter_counter
            + "      chat_history_loaded_counter: "+g_chat_history_loaded_counter
            + "      chat_history_counter (-1 OK): "+g_chat_history_counter
            + "      number_of_single_chat_ids_in_history: "+g_number_of_single_chat_ids_in_history
            + "      number_of_g_one_to_one_chats: "+g_number_of_g_one_to_one_chats) 

    g_size_array_match_ids=count_elements_in_array(g_array_match_ids);
    g_nb_current_matches=count_elements_in_array(g_matches);
    g_nb_playing_players=count_playing_players();
    g_nb_training_players=count_training_players();
    g_nb_puzzle_players=count_puzzle_players();
    
    log2("g_size_array_match_ids: " + g_size_array_match_ids
            + "      g_nb_current_matches: "+g_nb_current_matches
            + "      g_nb_playing_players: "+g_nb_playing_players
            + "      g_nb_puzzle_players: "+g_nb_puzzle_players
            + "      g_nb_training_players: "+g_nb_training_players
            + "      g_login_counter: "+g_login_counter);

    log2("g_nb_puzzle_matches_since_server_started: " + g_nb_puzzle_matches_since_server_started
            + "      g_nb_training_matches_since_server_started: "+g_nb_training_matches_since_server_started
            + "      g_nb_online_matches_since_server_started: "+g_nb_online_matches_since_server_started);

    for (var user_id in g_array_match_ids){
        if(!g_array_match_ids.hasOwnProperty(user_id)) {continue;}
        // We write the list of users that are currently playing
        if (g_array_match_ids[user_id]!=NO_MATCH) {
            log2("user_id: " + user_id + " --- current_match_id: " + g_array_match_ids[user_id]);
        }
     }
     
     // Display list of channels
    g_channel_list_string="";
    for (var key in g_channel_list){
        //if(g_channel_list.hasOwnProperty(key)) {  
            if (g_channel_list_string!="") g_channel_list_string+=", ";
            //g_channel_list_string+=key +"("+Object.keys(g_channel_list_of_users[key]).length+")";
            g_channel_list_string+=key +"("+get_object_length(g_channel_list_of_users[key])+")";
        //}
    }
    //log2("# of channels by g_channel_list.length: "+g_channel_list.length); // is always 0, why?????
    log2("# of channels by g_channels_counter: "+g_channels_counter);
    log2("Channel list: "+g_channel_list_string);
}

function get_object_length(obj){
    if (obj){
        return Object.keys(obj).length;
    }else{
        return 0;
    } 
}
function count_elements_in_array(arr){
    var counter=0;
    for (var key in arr){
        if(arr.hasOwnProperty(key)){
            //log2("key:"+key);
            counter++;
        }
    } 
    return counter;
}

function count_playing_players(){
    var counter=0;
    for (var user_id in g_array_match_ids){
        //if(g_array_match_ids.hasOwnProperty(user_id)){
            // We write the list of users that are currently playing
            if (g_array_match_ids[user_id]!=NO_MATCH) {
                counter++;
            }
        //}
     }
     return counter;
}
function count_training_players(){
    var counter=0;
    for (var user_id in g_array_training_match_ids){
        if (g_array_training_match_ids[user_id]!=NO_MATCH) {
            // log2("user in g_array_training_match_ids playing match_id:"+g_array_training_match_ids[user_id])
            counter++;
        }
     }
     return counter;
}
function count_puzzle_players(){
    var counter=0;
    for (var user_id in g_array_puzzle_match_ids){
        //if(g_array_training_match_ids.hasOwnProperty(user_id)){
            // We write the list of users that are currently playing
            log2("user in g_array_puzzle_match_ids user_id:"+user_id)
            if (g_array_puzzle_match_ids[user_id]!=NO_MATCH) {
                //log2("user in g_array_puzzle_match_ids playing match_id:"+g_array_puzzle_match_ids[user_id])
                counter++;
            }
     }
     return counter;
}

//////////////////////////////////////////////////
// SERVER_STATUS
//////////////////////////////////////////////////

Ape.registerCmd("SERVER_STATUS", false, function(params, info){
    
    var time1=get_time();
    log2("SERVER_STATUS");

    var status={};
    
    status["user_counter"]=g_user_counter;
    //status["users_waiting"]=g_waiting_list.getLength();
    status["timeout_counter"]=g_timeout_counter;
    status["marked_for_deletion"]=g_marked_for_deletion;
    
    status["chat_msg_counter_counter"]=g_chat_msg_counter_counter;
    status["chat_history_loaded_counter"]=g_chat_history_loaded_counter;
    status["chat_history_counter"]=g_chat_history_counter;
    status["number_of_single_chat_ids_in_history"]=g_number_of_single_chat_ids_in_history;
    status["number_of_g_one_to_one_chats"]=g_number_of_g_one_to_one_chats;
    
    status["size_array_match_ids"]=g_size_array_match_ids;
    status["nb_current_matches"]=g_nb_current_matches;
    status["nb_playing_players"]=g_nb_playing_players;
    status["nb_puzzle_players"]=g_nb_puzzle_players;
    status["nb_training_players"]=g_nb_training_players;
    status["logins"]=g_login_counter;
    
    status["nb_puzzle_matches_since_server_started"]=g_nb_puzzle_matches_since_server_started;
    status["nb_training_matches_since_server_started"]=g_nb_training_matches_since_server_started;
    status["nb_online_matches_since_server_started"]=g_nb_online_matches_since_server_started;
    
    status["channels_list"]=g_channel_list_string;
    
    status["objects_size"]=get_all_objects_size(this);
        
    status["g_userlist"]=g_userlist;//.getKeys()
    g_last_login_logged_users={};
    for (var user_id in g_userlist){
        g_last_login_logged_users[user_id]=g_last_login[user_id];
    }
    status["g_last_login"]=g_last_login_logged_users;
//    log2("g_last_login_logged_users:"+mydump(g_last_login_logged_users));
//    log2("g_userlist:"+mydump(g_userlist));
    
    var time2=get_time();
    // log2("SERVER_STATUS time:"+time2);
    var duration_in_seconds=(time2-time1)/1000;
    log2("SERVER_STATUS duration: "+duration_in_seconds+"s");
    
    status["status_duration"]=duration_in_seconds;
    
    return {"name": "status", "data":status};
    
    //return {name: "registered", data:{value:0}}
});

 
//////////////////////////////////////////////////
// LIST_OF_PLAYING_PLAYERS
//////////////////////////////////////////////////  

Ape.registerCmd("LIST_OF_PLAYING_PLAYERS", false, function(params, info){
    // We changed the name as REGISTER_USER was posted on the APE forum.
    log2("LIST_OF_PLAYING_PLAYERS");
    //log2("REGISTER_USER - IP:"+info.ip+" check_key : " + params.check_key+ " activation_key: " + params.activation_key+" user_id:"+params.user_id);
    
    //return {name: "training_match_inserted", data:{match_id:mc}}
    
    list_of_user_ids={};
    list_of_match_ids={};
    var counter=0;
    
    for (var user_id in g_array_match_ids){
        if(!g_array_match_ids.hasOwnProperty(user_id)) {continue;}
        // We write the list of users that are currently playing
        if (g_array_match_ids[user_id]!=NO_MATCH) {
            counter++;
            //list_of_matches[user_id]=[];
            list_of_user_ids[counter]=user_id;
            //list_of_user_ids[user_id]=[user_id];
            list_of_match_ids[counter]=g_array_match_ids[user_id];
        }
     }
     
    return {name: "list_of_playing_players", data:{user_ids:list_of_user_ids,match_ids:list_of_match_ids}};
});


Ape.registerCmd("REFRESH_GAME_INFO", false, function(params, info){
    
    log2("REFRESH_GAME_INFO");
    Mysql_get_games_info(false);
   
});
   
Ape.registerCmd("REFRESH_USER_NAME", true, function(params, info){
    
    var user_id=info.user.user_id;
    log2("REFRESH_USER_NAME user_id:"+user_id);
    
    var user=info.user;
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    log2(mydump(params));
//    log2("REFRESH_USER_NAME 2");
    
    Mysql_get_user_info(user_id,-9999); // -9999 indicates that we must only fetch the new info for the user not anything more (as we usually do when the user logs in).
    
//    log2("REFRESH_USER_NAME 3");
    info.user.name=params.username;
    
//    log2("REFRESH_USER_NAME 4");
});

//////////////////////////////////////////////////
// WAITING LIST AND MATCHING PLAYERS
//////////////////////////////////////////////////

//function Match_Players()
//{
//    //log2(print_time());
//    //log2("Match_Players()");
//    //log2("g_server_ready:"+g_server_ready);
//    
//    if (g_server_ready<SERVER_READY_TARGET) return;
//
//    //log2("Matching_Players()");
//
//    var array_user_id_to_be_matched=new Array();
//    var compteur=new Array();
//    
//    // Was there a change in the requests?
//    var send_requests_to_client=false;
//    
//    for (var game_counter=1;game_counter<=g_nb_of_games;game_counter++)
//    {
//        compteur=0;
//
//        var game_id=g_game_ids[game_counter];
//
//        g_waiting_list.each(function(val)
//        {
//            if (!user_id_is_robot(val))
//            {
//                if (game_counter==1) log2("Add user_id_to_be_matched val:"+val)
//                
//                if (Ape.getUserByPubid(g_waiting_list.keyOf(val)) == null)
//                {
//                    log2("WHY ON EARTH IS THIS NULL? val="+val)
//                    log2("WHY ON EARTH IS THIS NULL? val="+val)
//                }
//                else if (Ape.getUserByPubid(g_waiting_list.keyOf(val)).game_id==game_id)
//                {
//                    compteur=compteur+1;
//                    array_user_id_to_be_matched[compteur]=val;
//                }
//            }
//        });
//
//        // Computes whether we need to save the new info to the client regarding the current requests.
//        g_nb_users_requesting_for_game[game_id]=compteur;
//        if (compteur>=1) var at_least_one=1; else at_least_one=0;
//        if (g_at_least_one_user_is_requesting_for_game[game_id]!=at_least_one) send_requests_to_client=true;
//        g_at_least_one_user_is_requesting_for_game[game_id]=at_least_one;
//
//        //log2("compteur:"+compteur)
//        for (var i=1;i<=compteur;i=i+2)
//        {
//            var user_id=array_user_id_to_be_matched[compteur];
//            //log2("yy user_id:"+user_id);
//
//            // Delay before matching the players
//            var delay_before_matching;
//            if (game_id==1) delay_before_matching=2000;
//            //else if (game_id==7) delay_before_matching=1000;
//            else if (g_env_case=="staging") delay_before_matching=4000;
//            else delay_before_matching=g_user_info[user_id]["max_waiting"]*1000-300; // - to avoid reaching 0 on the screen of the user and staying there too long
//            //log2("max_waiting:"+delay_before_matching);
//            
//            var p=g_waiting_list.keyOf(user_id);
//
//            var user=Ape.getUserByPubid(p);
//            if (user==null)
//            {
//                log2("erase user pubid:"+p + " cause user=null")
//                g_waiting_list.erase(p);
//            }
//            else
//            {
//                if (i+1<=compteur) // We have another player
//                {
//                    Match_2_players(array_user_id_to_be_matched[i],array_user_id_to_be_matched[i+1],game_id,MODE_FULL_PLAY);
//                }
//                else if (get_time()-user.request_time>=delay_before_matching)
//                {
//                    // Match contre un robot
//                    // IMPORTANT : always the player first, then the robot ID (important for the creation of the game object and the my_id and opponent_or_robot_id variables)
//
//                    // We modify the user rating so that it is higher or lower
//                    // This way, he can be matched with a robot that is a bit stronger or weaker
//                    // We also modify the robots rating
//                    // to avoid to be matched always with the same robot if we are above/below the strongest/weaked one
//                    var interval_base_user=130 // (/2=65);
//                    var rating_modified=user.rating+interval_base_user*(Math.random(1)+Math.random(1)+Math.random(1)-1.5);
//                    var interval_base_robot=90; // (/2=45)
//
//                    //log2("user.rating:"+user.rating);
//                    //log2("rating_modified:"+rating_modified);
//                    var score_min=9999;
//                    log2("user_id:"+user_id);
//                    log2("game_id:"+game_id);
//                    for (var j=1;j<=g_nb_of_bots;j++)
//                    {
//                        //log2("g_user_info[user_id][game_id]['bot_unlocked'][i]:"+g_user_info[user_id][game_id]['bot_unlocked'][i]);
//                        if (g_user_info[user_id][game_id]['bot_unlocked'][j]==1)
//                        {
//                            //log2("g_user_robot[i][user.game_id]:"+g_user_robot[i].rating[game_id]);
//
//                            //var robot_rating_modified=g_user_robot[j].rating[game_id]+interval_base_robot*(Math.random(1)-0.5);
//
//                            //log2("robot_rating_modified:"+robot_rating_modified)
//                            //log2("g_user_robot[i].rating[user.game_id]+robot_rating_modified-rating_modified)"+robot_rating_modified-rating_modified)
//
//                            var score=Math.abs(g_user_robot[j].rating[game_id]+interval_base_robot*(Math.random(1)-0.5)-rating_modified);
//                            //log2("score match :"+score)
//                            if (score<score_min)
//                            {
//                                //log2("score:"+score)
//                                var best_match=j;
//                                score_min=score;
//                            }
//                        }
//                    }
//                    Match_2_players(user_id,best_match,game_id,MODE_FULL_PLAY);
//                }
//            }
//        }
//    }
//    
//
////    if (send_requests_to_client){
////        
////        var match_requests={};
////        //new Object();
////        for (var game_id=1;game_id<=g_nb_of_games;game_id++){
////            
////            var element={};
////            element.game_id=game_id;
////            element.is_requested=g_at_least_one_user_is_requesting_for_game[game_id];
////                
////            match_requests.push(element);
////        }
////        // Stores the current state as the latest one
////        g_latest_match_requests=match_requests;
////        //log2 (mydump(match_requests));
////        send_raw_to_channel("system_news","match_requests",{"match_requests":match_requests});
////    }
//
//    //g_waiting_list.each(log2("liste:"+key));//getUser(key).getProperty('user_id')));
//
//    //TODO
//    //Tenir compte du game_id pour matcher les joueurs qui demandent le même jeu :)
//}

function send_raw_to_channel(channel_name,raw_name,details){
    log2("snd_r_to_chl() ch:"+channel_name+" r_name:"+raw_name+" d:"+mydump(details));
    var channel=Ape.getChannelByName(channel_name);     
    if (channel==null){
        log2 ("send_raw_to_channel() - ERROR: CHANNEL "+channel_name + " is not defined!")
        return;
    }
    channel.pipe.sendRaw(raw_name,details);
    log2("snd_r_to_chl END");
}

function pick_first_player_id(user_id1,user_id2){
    var val=1+Math.floor(Math.random()*2);
    
    log2("pick_first_player:"+val);

    if (val==1) var pick_first_player_id=user_id1;
    else pick_first_player_id=user_id2;

    log2("pick_first_player_id:"+pick_first_player_id);

    return pick_first_player_id;
}

function Match_2_players(user_id1, user_id2, game_id, mode_of_play){ // The first player must be human!
    log2("Match_2_players() user_id1: "+user_id1+" user_id2: "+user_id2+" --- mode of play: "+mode_of_play);
    
    var g;

    if (user_id_is_human(user_id1)){ // The first player must be human!
        //log2("Matching "+user_id1+'-'+user_id2);
        //log2("g_waiting_list "+g_waiting_list);

        var p1=g_last_pubid[user_id1];
        var p2=g_last_pubid[user_id2];
        //var p1=g_waiting_list.keyOf(user_id1); // OLD 2015/01/26
        //var p2=g_waiting_list.keyOf(user_id2); // OLD 2015/01/26
        
        log2("not in order p1-p2: "+p1+" "+p2);

        // On lance le match et on dit aux joueurs qu'on leur a trouvé un adversaire

        // Define what game it is
        //var game_id=Ape.getUserByPubid(p1).game_id;

        var mc=get_match_counter();
        //log2("mc:"+mc);
        var nom_class=g_game_info[game_id].game_short_name+"_Game";
        log2("nom_class:"+nom_class);
        // If the game is solo, the first player is the player not the bot.
        if (g_game_info[game_id].game_solo) var first_player_id=user_id1;
        else first_player_id=pick_first_player_id(user_id1,user_id2); // Pick randomly the first player in a 2-player match.
        g_matches[mc]=new this[nom_class]('s', game_id, mc,"local","local",first_player_id,user_id1,user_id2,false);

        g=g_matches[mc];
        g.game_set_pubid(user_id1,p1);
        g.game_set_pubid(user_id2,p2);
        log2("g.pubid[1]:"+g.pubid[1]+" g.pubid[2]:"+g.pubid[2]);
        Mysql_insert_online_match(mode_of_play, g);

        g_array_timer_match_waiting_to_start[mc]= Ape.setTimeout(function(){delete_match_cause_not_started(mc)}, MATCH_START_TIMEOUT);

        log2("Match created - g.match_id:" + g.match_id );

        var user1=Ape.getUserByPubid(p1);
        
        g_array_match_ids[user1.user_id]=mc;
        //g_array_training_match_ids[user1.user_id]=NO_MATCH;
        //g_array_puzzle_match_ids[user1.user_id]=NO_MATCH;
        
        log2("Match created - g_array_match_ids[user1.user_id]:" + g_array_match_ids[user1.user_id]);

        if (user_id2==0){
            // Solo game
            
        }else if (user_id_is_human(user_id2)){
            var user2=Ape.getUserByPubid(p2);
            
            g_array_match_ids[user2.user_id]=mc; 
            //g_array_training_match_ids[user2.user_id]=NO_MATCH;
            //g_array_puzzle_match_ids[user2.user_id]=NO_MATCH;
            log2("Match created - g_array_match_ids[user2.user_id]:" + g_array_match_ids[user2.user_id]);
        }
        
        // Only full play
        if (mode_of_play==MODE_FULL_PLAY){
            
            // NEW NEW NEW NEW
            g.game_set_still_ok_for_game(user_id1);
            g.game_set_still_ok_for_game(user_id2);
                
            if (pubid_is_robot(p1)){
                log2("robot prêt 1")
                g.game_set_still_ok_for_game(user_id1,1); // Un robot est toujours prêt :)
                g.game_set_player_ready(user_id1); // Un robot est toujours prêt :)
                log2("g.player_ready[1]:"+g.player_ready[1]);
                log2("g.player_ready[2]:"+g.player_ready[2]);
            }

            if (user_id2!=0){ // Not solo game
                if (pubid_is_robot(p2)){
                    log2("robot prêt 2")
                    g.game_set_still_ok_for_game(user_id2,1); // Un robot est toujours prêt :)
                    g.game_set_player_ready(user_id2); // Un robot est toujours prêt :)
                    log2("g.player_ready[1]:"+g.player_ready[1]);
                    log2("g.player_ready[2]:"+g.player_ready[2]);
                }
            }else{ // Solo game
                log2("solo player 2 ready");
                g.game_set_still_ok_for_game(user_id2,1); // Un robot est toujours prêt :)
                g.game_set_player_ready(user_id2); // Un robot est toujours prêt :)
            }
        }
    }
    else{
        log2("Error!! User1 should be a robot");
    }
    return g;
}

function add_player_to_waiting_list(pubid, user_id, game_id, belt, user_name, rating, language){
    log2('add_player_to_waiting_list pubid: '+pubid +' user_id:'+user_id +' belt:'+belt +' user_name:'+user_name + ' language:'+language);
    if (pubid!=null){
        g_waiting_list.set (pubid,user_id); // key, value
        var user=Ape.getUserByPubid(pubid);
        user.game_id=game_id;
        user.belt=belt;
        user.rating=rating;
        user.language=language;
        user.user_name=user_name;
        user.request_time=get_time();
        return true;
    }else{
        // If pubid is null, it probably means that add_player_to_waiting_list has been delayed so much that the user has logged out in the meantime
        // This happened when the database was saved (it took more than a minute back then) and the check on user_food took more than a minute to proceed.
        // The user could then destroyed before Mysql returned and thus we had null pubid here.
        for (var i=1;i<=15;i++){
            log2("PB PB PB PB PB PB PB PB pubid=null in add_player_to_waiting_list() - Check Backup does not take too long!")
        }
        return false;
    }
}

function get_match_counter(){
    g_match_counter=g_match_counter+1;
    log2("New match counter:"+g_match_counter);
    return g_match_counter;
}

//////////////////////////////////////////////////
// GAME_REQUEST.PHP
//////////////////////////////////////////////////

//MATCH_REQUEST
//Ape.registerCmd("MATCH_REQUEST", true, function(params, info){
//    log2("MATCH_REQUEST - IP:"+info.ip+" game_id:" + params.game_id+" user_id:" + params.user_id+" rating:" + params.rating+" user_name:" + params.user_name+ " info.user.pubid:"+info.user.getProperty('pubid'));
//    //No security check to make
//
//    var user_id=info.user.user_id;
//    var pubid=info.user.getProperty("pubid");
//
//    var pipe_player=Ape.getPipe(pubid);
//
//    var user=info.user; //Ape.getUserByPubid(pubid)
//    var user_id=user.user_id;
//    log2("user_id:"+user_id);
//
//    // Authenticate user
//    if (authenticate_user(user)!=1) return authenticate_user(user);
//    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
//
//    var pubid=user.getProperty('pubid');
//    log2("pubid:"+pubid)
//
//    if (g_maintenance==true)    {
//        send_custom_raw(pubid, user_id, 'maintenance', {});
//
//        log2("NO PAIRING - MAINTENANCE MODE!!!!!!!!!!!!!");
//    }else if (g_user_info[user_id]["can_start_another_game"]==false)    {
//        send_custom_raw(pubid, user_id, 'need_to_wait', {});
//
//        log2("USER NEEDS TO WAIT MORE!!!!!!!!!!!");
//    }else if (g_array_match_ids[user_id]!=NO_MATCH)    {
//        send_custom_raw(pubid, user_id, 'already_playing', {});
//
//        log2("USER ALREADY PLAYING!!!!!!!!!!!");
//    }else{
//        var chaine="SELECT user_food FROM t_user WHERE user_id="+params.user_id;
//        log2(chaine);
//        query(SQL_ALL,chaine,function(res,errorNo){
//            if (errorNo){
//                log2("Error command 1")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
//                return [777, 'ERROR MYSQL'];
//            }else{
//                res.each(function(data){
//                    log2("user_food:"+data.user_food)
//                    log2("g_game_info[ params.game_id].game_food_cost:"+g_game_info[ params.game_id].game_food_cost)
//                    if (Number(data.user_food)<g_game_info[ params.game_id].game_food_cost){
//                        log2("not enough food")
//                        send_custom_raw(pubid, user_id, "not_enough_food", {})
//                    }else{
//                        log2("add_player_to_waiting_list")
//                        var ret=add_player_to_waiting_list(pubid, params.user_id, params.game_id, params.belt, params.user_name,params.rating, params.language);
//                        //return [109, 'free_to_play'];
//
//                        if (ret==true){
//                            log2("sendraw free_to_play user_id:"+user_id)
//                            send_custom_raw(pubid, user_id, "free_to_play", {})
//                        }
//                    }
//                });
//            }
//        })
//    }
//});
//
////CANCEL_MATCH_REQUEST
//Ape.registerCmd("CANCEL_MATCH_REQUEST", true, function(params, info){
//    log2("CANCEL_MATCH_REQUEST - IP: ("+info.ip+"), game_id: " + params.game_id+" user_id: " + params.user_id+ " info.user.pubid:"+info.user.getProperty('pubid'));
//  
//    var user=info.user; //Ape.getUserByPubid(pubid)
//    var user_id=user.user_id;
//
//    // Authenticate user
//    if (authenticate_user(user)!=1) return authenticate_user(user);
//
//    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
//
//    var pubid=user.getProperty('pubid');
//    //var match_id=user.match_id;
//    var match_id=g_array_match_ids[user.user_id];
//    
//    // Security check
//    /*
//    if (user.user_id!=params.user_id)
//    {
//        log2("SOMEONE TRIED TO REQUEST A MATCH BUT HE IS NOT WHO HE SHOULD BE. Pubid and User_Id don't match!!!")
//        log2("This user is user:"+user.user_id);
//        return;
//    }
//    */
//    log2("user_match_id:"+g_array_match_ids[user.user_id]);
//        
//    //if (user.match_id==NO_MATCH)
//    if (match_id==NO_MATCH){
//        // The user was not affected to a match yet, so we just erase it from the waiting list
//        log2("Erase pubid:"+pubid + " from waiting list");
//        //g_waiting_list.erase (pubid);
//    }
//    //else if (g_matches[user.match_id].game_started==false)
//    else if (g_matches[match_id].game_started==false){
//        log2("g_matches[match_id].game_started:"+g_matches[match_id].game_started)
//        // The user was already affected to a match,
//        // and this match is not one that was started earlier
//        // so we have to do a few things (among which erase him from the list just in case)
//        delete_match_cause_cancel(match_id)
//    }
//    
//    log2("--END CANCEL_MATCH_REQUEST");
//
//    //return;
//});
////CANCEL_MATCH_REQUEST
//Ape.registerCmd("OPEN_CHAT", true, function(params, info)
//{
//    log2("OPEN_CHAT - IP: ("+info.ip+"), game_id: " + params.game_id+" user_id: " + params.user_id+ " info.user.pubid:"+info.user.getProperty('pubid'));
//  
//    var user=info.user; //Ape.getUserByPubid(pubid)
//    var user_id=user.user_id;
//
//    //return;
//});

/*
function check_identity(pubid,user_id,msg)
{
    var user=Ape.getUserByPubid(pubid);
    if (user.user_id!=user_id)
    {
        log2(msg);
        log2("This user is user:"+user.user_id);
        return;
    }
}*/

function delete_match_cause_cancel(match_id)
{
    log2("-----------delete_match_cause_cancel() match_id:"+match_id);
    delete_match_cause_not_started(match_id);
}

function delete_match_cause_not_started(match_id){
    log2("-----------delete_match_cause_not_started() match_id:"+match_id);

    var g=g_matches[match_id];

    if (typeof g=="undefined") return;
    
    if (g.mode_of_play==MODE_FULL_PLAY && g.player_id[2]!=0){ // Not a solo game
        log2("g.mode_of_play "+g.mode_of_play);
        close_lobby_table(g.lobby_name,g.table_name);
    }
    
    for (var i_player=1;i_player<=g.nb_players;i_player++){
        var pubid=g.pubid[i_player];
        var user_id=g.player_id[i_player];
        
        if (user_id_is_human(user_id)){
            g_array_match_ids[user_id]=NO_MATCH;
            send_match_cancelled(pubid,user_id, match_id);

            // Just in case, we erase him from the list.
            //g_waiting_list.erase (pubid); // This must not be done on a robot!!!! For bots, pubid is set at a fixed negative number
        }
    }

    // Here we should put it into the database that the game was cancelled!!
    Mysql_update_result_match(g.match_id, 0, 0, END_MATCH_CANCELLED, 0, 0, 0);

    g.match_cancelled=true; // If the match is not yet deleted by the Garbage Collector (GC), then this variable will be used to check if the game still exists.

    delete_match(match_id)
    //delete(g_matches[match_id]);
}

function send_match_cancelled(pubid, user_id, match_id){
    log2("send match_cancelled - match_id:" + match_id +" user_id:" + user_id + " pubid:" + pubid);
    if (!pubid_is_robot(pubid)){
        //var pipe_player=Ape.getPipe(pubid);
        //if (pipe_player!=null)
        {
            log2("send match cancelled match_id:"+match_id)
            send_custom_raw(pubid, user_id, "match_cancelled", {"match_id":match_id})
        }
    }
}

//USER_STILL_OK_FOR_GAME
//Ape.registerCmd("USER_STILL_OK_FOR_MATCH", true, function(params, info){
//    log2("USER_STILL_OK_FOR_MATCH - match_id: " + params.match_id + " user_id: " + params.user_id);
//
//    var user=info.user;
//    var user_id=user.user_id;
//
//    // Authenticate user
//    if (authenticate_user(user)!=1) return authenticate_user(user);
//    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
//
//    var pubid=user.getProperty('pubid');
//    
//    //var match_id=user.match_id;
//    var match_id=g_array_match_ids[user.user_id];
//    
//    if (check_match_cancelled(match_id)){
//        // It is possible that the user has not received the "match_cancelled" yet so we send him again just in case.
//        // That may not be necessary here.
//        //var pubid=info.user.getProperty('pubid');
//        send_match_cancelled(pubid, user_id, match_id);
//        return;
//    }
//
//    log2("u_id: "+params.user_id);
//    log2("m_id: "+params.match_id);
//
//    var g=g_matches[match_id];
//
//    log2("USER_STILL_OK_FOR_GAME1:"+g.still_ok_for_game[1]);
//    log2("USER_STILL_OK_FOR_GAME2:"+g.still_ok_for_game[2]);
//    //log2("g.match_id:"+g.match_id);
//    log2("player ids: "+g.player_id[1]+"-"+g.player_id[2]+ " 1st player_id:"+ g.first_player_id);
//    //log2("pubid: "+g.pubid[1]+"-"+g.pubid[2]);
//
//    g.game_set_still_ok_for_game(user.user_id); //params.user_id
//
//    //log2("pubids: "  +g_waiting_list.keyOf(g.player_id[1])+"-"+g_waiting_list.keyOf(g.player_id[2]));
//    //log2("USER_STILL_OK_FOR_GAME4: all_stil_ok? :"+g.game_all_players_are_still_ok_for_game());
//    log2("g.game_all_players_are_still_ok_for_game():"+g.game_all_players_are_still_ok_for_game());
//    if (g.game_all_players_are_still_ok_for_game())
//    {
//        //var pipe_player;
//        for (var i_player=1;i_player<=2;i_player++)
//        {
//            if (!pubid_is_robot(g.pubid[i_player]))
//            {
//                log2("--- CONFIRM MATCH to player "+i_player);
//                //pipe_player=Ape.getPipe(g.pubid[i_player]);
//                //user=Ape.getUserByPubid(g.pubid[i_player]);
//                
//                if (!pubid_is_robot(g.pubid[3-i_player]))
//                {
//                    var user_opponent=Ape.getUserByPubid(g.pubid[3-i_player]);
//                    var belt_opponent=user_opponent.belt;
//                    var opponent_user_name=user_opponent.user_name; // This is sent by the other opponent via APE via MATCH_REQUEST. So this does not come from Mysql (where we have problems with UTF8 or encoding. SET NAMES 'utf8' doest not help.
//                    var opponent_language=user_opponent.language;
//                }
//                else
//                {
//                    var ub=g_user_robot[g.player_id[3-i_player]];
//                    belt_opponent=0;
//                    opponent_user_name=ub.user_name;
//                    opponent_language="--";
//                    //log2("ub.user_name:"+ub.user_name)
//                }
//                
//                log2("sendraw match_confirmed match_id:"+match_id)
//
//                var game_id=g.game_id;
//
//                //var user_id=g.player_id[i_player];
//                log2("g.player_id[i_player]:"+g.player_id[i_player])
//                var rating=get_user_rating(g.player_id[i_player],game_id);
//                log2('rating:'+rating);
//                log2('game_id:'+game_id);
//
//                var opponent_id=g.player_id[3-i_player];
//                var rating_opponent=get_user_rating(opponent_id,game_id);
//                log2('opponent_id:'+opponent_id)
//
//                send_custom_raw(g.pubid[i_player], g.player_id[i_player], "match_confirmed", {"match_id":match_id,"opponent_id":opponent_id,"belt_opponent":belt_opponent,"opponent_user_name":opponent_user_name,"first_player_id":g.first_player_id,"rating":rating,"rating_opponent":rating_opponent,"language_opponent":opponent_language});
//            }
//        }
//    }
//    log2('game_confirmed - games['+match_id+'].match_id='+match_id);
//
//});

function check_match_cancelled(match_id){
//    log2("g_matches[match_id]==null:"+(g_matches[match_id]==null));
//    log2("!g_matches[match_id]:"+(!g_matches[match_id]));
    if (!g_matches[match_id]){
        log2("Match does not exist anymore:"+match_id);
        return true;
    }
    if (g_matches[match_id].cancelled==false){
         log2("Match still exists but is flagged cancelled:"+match_id)
         return true;
    }
    return false;
}

//////////////////////////////////////////////////
// GAME
//////////////////////////////////////////////////

Ape.registerCmd("INSERT_TRAINING_MATCH", false, function(params, info){
    log2("INSERT_TRAINING_MATCH - IP:"+info.ip+" game_id:" + params.game_id+ " params.user_id:"+params.user_id);

    var user_id=params.user_id;
    if (!g_userlist.has(user_id)){
        // The user does not have an APE session open so we are not certain that get_rating() will work (if g_user_info has been deleted).
        // In that case, we will not be able to insert the match in the database (it will fail before).
        // So we prefer to ask the user to reconnect via the main menu instead of starting a match that has no entry in the dabatase.
        log2("WARNING!!!! the user is asking for another match but he is not logged to APE any more! We tell him to go back to main menu.")
        return {name: "user_not_logged_to_APE", data:{value:0}};
    }
    var mc=get_match_counter();
    log2("mc:".mc);
    
    var player_id=[];
    log2("mouc1");
    player_id[1]=params.player_id[1];
    log2("mouc2");
    player_id[2]=params.player_id[2];
    log2("mouc3");

    log2("match_key:"+params.match_key);

    Mysql_insert_training_match(mc, params.game_id, player_id, params.match_key);

    return {name: "training_match_inserted", data:{match_id:mc}};
})

Ape.registerCmd("INSERT_PUZZLE_MATCH", false, function(params, info){
    log2("INSERT_PUZZLE_MATCH - IP:"+info.ip+" game_id:" + params.game_id+ " params.user_id:"+params.user_id);

    var user_id=params.user_id;
    if (!g_userlist.has(user_id)){
        // The user does not have an APE session open so we are not certain that get_rating() will work (if g_user_info has been deleted).
        // In that case, we will not be able to insert the match in the database (it will fail before).
        // So we prefer to ask the user to reconnect via the main menu instead of starting a match that has no entry in the dabatase.
        log2("WARNING!!!! the user is asking for another match but he is not logged to APE any more! We tell him to go back to main menu.")
        return {name: "user_not_logged_to_APE", data:{value:0}};
    }
    var mc=get_match_counter();
    log2("mc:"+mc);
    
    var player_id=[];
    player_id[1]=user_id;
    player_id[2]=0;
//    log2("mouc1");
//    player_id[1]=params.player_id[1];
//    log2("mouc2");
//    player_id[2]=params.player_id[2];
//    log2("mouc3");

//    log2("match_key:"+params.match_key);

    Mysql_insert_puzzle_match(mc, params.game_id, player_id, params.match_key, params.puzzle_id);

    return {name: "puzzle_match_inserted", data:{match_id:mc}};
})

Ape.registerCmd("RELOADING_SAME_MATCH", false, function(params, info){
    log2("RELOADING_SAME_MATCH - IP:"+info.ip+" user_id: "+params.user_id+ " match_id : " + params.match_id+ " last_match_id : " + params.last_match_id);

    //var user=info.user;
    var user_id=params.user_id;
    var match_id=params.match_id;

    if (g_array_match_ids[user_id]==match_id)    {
        log2("OK make_user_lose_current_match match_id:"+match_id);
        make_user_lose_current_match(user_id,END_MATCH_PAGE_RELOADED)
    }
    else{
        log2("NO OK match already finished???");
    }
})



Ape.registerCmd("LEFT_PAGE_AUTHORIZED", false, function(params, info){
    log2("---------- LEFT_PAGE_AUTHORIZED  params.match_id:"+params.match_id + " params.user_id:"+params.user_id)
    /*
    if (info.user==undefined)
    {
        log2("ERROR info.user=undefined")
        return;
    }
    log2("info.user.user_id:"+info.user.user_id);
    */
    // We get a info.user undefined here sometimes. Why???
    //tell_opponent_we_left(params.match_id, params.user_id)
})

Ape.registerCmd("LEFT_PAGE", false, function(params, info){
    log2("----------- LEFT_PAGE  params.match_id:"+params.match_id+ " user_id:"+params.user_id)

    // On a eu un user undefined suivi d'un segmentation fault ici!
    // Est-ce que c'est parce que l'user est effacé avant que le LEFT_PAGE soit traité ?
    // Oui, j'ai vu le cas où core.quit était traité avant LEFT_PAGE!!
    // Du coup l'adversaire n'est pas au courant!

    //log2("info.user.user_id:"+info.user.user_id);

    var user_id=params.user_id;
    var match_id=params.match_id;

    log2("LEFT_PAGE 2");

    if (g_array_match_ids[user_id]!=NO_MATCH){
        log2("LEFT_PAGE OK m_id:"+match_id);
        var g=g_matches[match_id];
        
        // Does the match still exist?
        if (typeof g=='undefined'){
            log2("WARNING!! Match does not exist anymore!")
        }
        // Did the match start? If not we simply cancel it.
        else if (g.game_started==false){
            delete_match_cause_cancel(match_id)
        }
        else make_user_lose_current_match(user_id,END_MATCH_LEFT_PAGE);
    }
    else{
        log2("LEFT_PAGE NOOK m_id:"+match_id);
    }
});


// PUZZLE_MATCH_COMPLETED
Ape.registerCmd("PUZZLE_MATCH_COMPLETED", true, function(params, info){
    log2("PUZZLE_MATCH_COMPLETED - IP:"+info.ip+" game_id:" + params.game_id+" match_id:" + params.match_id +" - user_id:"+params.user_id + " - puzzle_id:"+ params.puzzle_id + "- score:"+ params.score + " - stars:"+ params.stars+ " - is_tutorial:"+params.pit + " - match_key:"+ params.match_key+ " - end_match_type:"+end_match_type);

    var user=info.user; //Ape.getUserByPubid(pubid)
    var user_id=user.user_id;
    //var pubid=user.getProperty('pubid');
    
    var end_match_type=params.end_match_type;

    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    //g_array_training_match_ids[user_id]=NO_MATCH;
    g_array_puzzle_match_ids[user_id]=NO_MATCH;
    
    Mysql_record_puzzle_match(user.getProperty('pubid'), user.user_id, params.game_id, params.match_id, params.puzzle_id, params.score, params.stars, params.pit, params.match_key, end_match_type);
    
    // In this function, game_level will be modified from 30 (tuto mandatory) to 40 (training available)
    // Mysql_record_training_match(user.user_id, params.bot_id, params.game_id, params.match_id, params.result, params.integer_result, params.score_1, params.score_2, params.match_key,end_match_type);
    //log2("pubid_training:"+info.user.pipe);
    
    // In this function, game_level might be upgraded to 50 (full play)
    // We don't check awards if the game was resigned. That would not be easy to understand if the white meeple was given after resigning.
   // BEWARE!
   //  Moved to the end of Mysql_record_puzzle_match()
//     if (end_match_type!=END_MATCH_RESIGNED) Mysql_check_awards(null, 1, user.user_id, user.getProperty('pubid'), params.game_id, params.result, 0,0, (params.result=="WIN"));
    //function Mysql_check_awards(typ, user_id, pipe, game_id, result_white_belt, old_rating, rating_change, match_won)
});

// TRAINING_MATCH_COMPLETED
Ape.registerCmd("TRAINING_MATCH_COMPLETED", true, function(params, info){
    log2("TRAINING_MATCH_COMPLETED - IP:"+info.ip+" game_id:" + params.game_id+" match_id:" + params.match_id +"- user_id:"+params.user_id + "- result:"+ params.result + "- score_player:"+ params.score_player + "- score_1:"+ params.score_1 + "- score_2:"+ params.score_2 + "- match_key:"+ params.match_key );

    var user=info.user; //Ape.getUserByPubid(pubid)
    var user_id=user.user_id;
    //var pubid=user.getProperty('pubid');
    
    
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    // We should check here that the match_id that is sent is a correct one.
    
    var end_match_type=params.end_match_type;

    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    g_array_training_match_ids[user_id]=NO_MATCH;
    //g_array_puzzle_match_ids[user_id]=NO_MATCH;
    
    // In this function, game_level will be modified from 30 (tuto mandatory) to 40 (training available)
    Mysql_record_training_match(user.user_id, params.bot_id, params.game_id, params.match_id, params.result, params.integer_result, params.score_player, params.score_1, params.score_2, params.match_key,end_match_type);
    //log2("pubid_training:"+info.user.pipe);
    
    // In this function, game_level might be upgraded to 50 (full play)
    // We don't check awards if the game was resigned. That would not be easy to understand if the white meeple was given after resigning.
    
    // BEWARE - this is only correct if we are certain that the database has been fully updated in Mysql_record_training_match() which is the case now
    // But may not always be if we nest SQL calls  in it.
    if (end_match_type!=END_MATCH_RESIGNED) Mysql_check_awards(null, MODE_TRAINING, user.user_id, user.getProperty('pubid'), params.game_id, params.result, 0,0, (params.result=="WIN"));
    //function Mysql_check_awards(typ, user_id, pipe, game_id, result_white_belt, old_rating, rating_change, match_won)
});

//USER_READY_TO_START
Ape.registerCmd("USER_READY_TO_START", true, function(params, info){
    log2("USER_READY_TO_START - IP:"+info.ip+" match_id:" + params.match_id+ " user_id:"+params.user_id)+ "match_history_case: "+params.match_history_case;
    
    var user=info.user;
    var user_id=user.user_id;
    var match_history_case=params.match_history_case;
    //log2("user_id:"+user.user_id)
    var pubid=user.getProperty('pubid');
    log2("user.user_id:"+user_id +" g_array_match_ids[user_id]:"+g_array_match_ids[user_id]);

    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);

    // This should be a infos.SendResponse...
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;

//    if (match_history_case=="REPLAY"){
//        //send_game_history_for_user(pubid,user_id);
//    }else{
    var match_id=g_array_match_ids[user_id];
    log2("g_array_match_ids[user_id]:"+g_array_match_ids[user_id]+" params.match_id:"+params.match_id);

    // Beware this is not the same match_id as params.match_id. The user may have tempered with match_id or gone back in the browser history requesting the game to start with the wrong  match_id.
    // So this will only check that the current match that is indeed loaded has not been cancelled already
    // Other checks are done below.
    if (check_match_cancelled(match_id)){
        // It is possible that the user has not received the match_cancelled because he was loading the
        // match page, so we have to send him again.
        //var pubid=info.user.getProperty('pubid');
        send_match_cancelled(pubid, user_id, match_id);
        return;
    }

    var g=g_matches[params.match_id];

    if (g==null){
        log2("g=null. This game does not exist!");
        send_match_cancelled(pubid, user_id, params.match_id); // We use params.match_id here so that ack_receipt accepts the raw (otherwise there is a match_id mismatch potentially and an error code is generated instead of redirecting the user to the menu page)
        return;
    }
    // Le pubid de l'user a changé vu qu'il a ouvert une autre page.
    if (!g.game_set_pubid(user_id,user.getProperty('pubid'))){
        log2("g.game_set_pubid(user_id,user.getProperty('pubid') returned an ERROR: false. This user_id is not associated with this game.");
        send_match_cancelled(pubid, user_id, params.match_id); // We use params.match_id here so that ack_receipt accepts the raw (otherwise there is a match_id mismatch potentially and an error code is generated instead of redirecting the user to the menu page)
        return;
    }; 

    // Check that the match has not already been started!
    // It can only be started once.
    if (g.game_started==true){
        log2("WARNING! The game was already started. You can't start it again. But we can reload it now.")
        // Another send raw might be more accurate
        // For example saying "You can't restart a game - wrong command - game_lost" or something like that
        send_game_history_for_user(pubid,user_id);
        return;
    }

    g.game_set_player_ready(user_id);

    /*
    These lines send a lot of request to the user
    It was initially meant to check on the client side
    that CHL before and after this.core.request.send was incremented by 1 only
    and that no other event could change this
    so we could rely that CHL before was indeed the CHL
    used and that we could store it reliably
    log2("XXX:"+pubid);
    Ape.setInterval(function(){Ape.getPipe(pubid).sendRaw("test",{})}, 1);
    log2("XXX");
    */
    //log2("all users ready for match? "+g.pubid[1] +"-"+g.pubid[2]);

    if (g.game_all_players_are_ready()){ // If game has already been started, then we do not start it again !!! Otherwise, it is possible to cheat!!
        log2("start_game(g)");
        start_game(g);
    }
    else{
        //log2("Not all players are ready!");
    }
    
//    }
   

});

/*
Ape.registerCmd("START_FOR_GOOD", true, function(params, info)
{
    log2("START_FOR_GOOD - IP:"+info.ip+" match_id:" + params.match_id+ " user_id:"+params.user_id);

    var user=info.user;
    var user_id=user.user_id;

    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);

    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;

    //var match_id=user.match_id;
    var match_id=g_array_match_ids[user_id];

});
*/


//////////////////////////////////////////////////
// BAD COMMAND????
//////////////////////////////////////////////////
Ape.registerHookBadCmd(function(params, info, raw){
    log2('BAD COMMAND RECEIVED (' + raw + ').');
    //We return nothing so client will receive a BAD_CMD error
});

//////////////////////////////////////////////////
// REGISTER USER (PHP_SESSION_ID)
//////////////////////////////////////////////////
Ape.registerCmd("ADMIN_LOBBY_CLOSE_TABLE", false, function(params, info){
    var lobby_name=params.lobby_name;
    var table_id=params.table_id;
    
    // We changed the name as REGISTER_USER was posted on the APE forum.
    log2("ADMIN_LOBBY_CLOSE_TABLE - lobby_name:"+lobby_name+ " table_id:"+table_id);
            
    if (params.key=="456"){
        var lobby_tables=g_lobby_tables[lobby_name];
        if (typeof lobby_tables=="undefined") return {name: "ERROR LOBBY DOES NOT EXIST!", data:{value:0}};
        for (table_name in lobby_tables){
            var table=lobby_tables[table_name];
            log2("Checking table table_name:"+table_name); 
            if (table.table_id==table_id){
                close_lobby_table(lobby_name,table_name);
                return {name: "TABLE_DELETED", data:{value:0}};
            }
        }
    }
    else return {name: "ERROR 1", data:{value:0}};
    
    return {name: "NO TABLE FOUND!", data:{value:0}};
    
    //log2("REGISTER_USER - IP:"+info.ip+" check_key : " + params.check_key+ " activation_key: " + params.activation_key+" user_id:"+params.user_id);
});

//Ape.registerCmd("QUIT2", false, function(params, info){
////Ape.registerCmd("QUIT2", function(params, info){
//    log2("QUIT2 - Hook Command")
//});

Ape.registerHookCmd("QUIT", function(params, info){
    log2("QUIT - Hook Command")
});

//////////////////////////////////////////////////
// REGISTER USER (PHP_SESSION_ID)
//////////////////////////////////////////////////

Ape.registerCmd("REGISTER_USER_NEW", false, function(params, info){
    // We changed the name as REGISTER_USER was posted on the APE forum.
    log2("REGISTER_USER_NEW params.user_ip:"+params.user_ip);
    //log2("REGISTER_USER - IP:"+info.ip+" check_key : " + params.check_key+ " activation_key: " + params.activation_key+" user_id:"+params.user_id);

    var user_id=params.user_id;
    var user_agent=params.user_agent;
    var user_IP=params.user_ip;

    //return ["005", "NICK_USED"];

    if (g_maintenance==true){
        log2("NO REGISTRATION - MAINTENANCE GOING ON user_id:"+user_id);
        return  {name: "registered", data:{value:2}}
    } 
    if (g_all_has_been_loaded_we_can_register==false){
        log2("NO REGISTRATION - MYSQL CONNECTION NOT ESTABLISHED YET user_id:"+user_id);
        return  {name: "registered", data:{value:3}}
    }
    // Let's check that the user is no already logged
    if (g_userlist.has(user_id)){
        log2("005 NICK_USED user:"+user_id);
        return ["005", "NICK_USED"];
    }else log2("User can log in. His user_id is not used.");
    
    g_check_key[user_id]=params.check_key;
    g_activation_key[user_id]=params.activation_key;
    
    // For testing purposes, we can try to get user info here and see if there is any memory leak or any Mysql congestion. But it is absolutely fine on 15/04/2020.
    // Mysql_get_user_infos_if_necessary(user_id,-9999);
    
    // Getting user info.
    var shunt_mysql=false; // Testing memory leaks 2014/12/03
    if (shunt_mysql==false){        
        Mysql_store_login(user_id,user_agent,user_IP)
        // We store the login in the database
        //Ape.setTimeout(function(){Mysql_store_login(params.user_id)},10000);
        
        // We don't fetch this info here any more. This was useless optimization.
        //Mysql_get_user_infos_if_necessary(user_id);
        
//        g_user_info[user_id]=[];
//        var ret=Mysql_get_bots_allowed(user_id);
        
        //log2("g_user_info[user_id]:"+g_user_info[user_id])  
    }else ret=true;
    
    // We will not fetch user_info in g_user_info here only. We will do it in ASK_COUNTERS also now
    var ret=true;

    if (ret==true){
        log2 ("Registration OK:" +user_id)
        return {name: "registered", data:{value:1}};
    }else{
        log2 ("SOMETHING went wrong with the registration of the user:" +user_id)
        return {name: "registered", data:{value:0}}
    }
    
    
    //return ["000", "OK"]; // Ca c'est une erreur
    //return 1;
    //return "10";
});


////////////////////////////////////////////////////
// UPDATE_MAX_WAIT
//////////////////////////////////////////////////

Ape.registerCmd("UPDATE_MAX_WAIT", false, function(params, info){
    var user_id=params.user_id;
    var max=params.max;

    // We changed the name as REGISTER_USER was posted on the APE forum.
    log2("UPDATE_MAX_WAIT "+user_id);
    //log2("REGISTER_USER - The user ip : ("+info.ip+"), check_key : " + params.check_key+ "- activation_key : " + params.activation_key+"- user_id :"+params.user_id);

    g_user_info[user_id]['max_waiting']=max;
});

////////////////////////////////////////////////////
// UPDATE_MAX_WAIT
//////////////////////////////////////////////////
Ape.registerCmd("POTION_RECEIVED", false, function(params, info){
    var user_id=params.user_id;
    var potion_end=params.potion_end;

    // We changed the name as REGISTER_USER was posted on the APE forum.
    log2("POTION_RECEIVED user_id:"+user_id+" potion_end:"+potion_end);
    //log2("REGISTER_USER - The user ip : ("+info.ip+"), check_key : " + params.check_key+ "- activation_key : " + params.activation_key+"- user_id :"+params.user_id);

    if (typeof g_user_info[user_id]!="undefined"){
        g_user_info[user_id]['potion_end']=potion_end; /*Date.createFromMysql(potion_end)/1000*/;
        log2("potion_end updated");
        log2("g_user_info[user_id]['potion_end'] (ms):"+g_user_info[user_id]['potion_end']);
        log2("current_time (ms):"+get_time());
    }
});

/*
//////////////////////////////////////////////////
// LOGOUT_USER
//////////////////////////////////////////////////

Ape.registerCmd("LOGOUT_USER", false, function(params, info)
{
    log2("LOGOUT_USER");

    return {name: "logged_out", data:{value:1}};
    //return ["000", "OK"]; // Ca c'est une erreur
    //return 1;
    //return "10";
});
*/

//////////////////////////////////////////////////
// UNLOCK_BOT
//////////////////////////////////////////////////

Ape.registerCmd("UNLOCK_BOT", false, function(params, info){
    log2("UNLOCK_BOT");

    // Bot was unlocked by paying a resource
    var user_id=params.user_id;
    var game_id=params.game_id;
    var bot_id=params.bot_id;
    var gold=params.gold;

    // Update of the array containing the info for the allowed bots
    unlock_bot_in_array(user_id, game_id, bot_id);

    // We bought the right to unlock the bot so we store it in the news list.
    var news_typ="purchase_bot_unlock";
    //var news_details_pbu="game_id;"+game_id+";bot_id;"+bot_id;
    var news_details_pbu=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of shit in the array).
         news_details_pbu["game_id"]=game_id;
         news_details_pbu["bot_id"]=bot_id;
         news_details_pbu["gold"]=gold;
    send_news_in_new_format(news_typ,news_details_pbu,user_id, 1)

});

function unlock_bot_in_array(user_id, game_id, bot_id){
    g_user_info[user_id][game_id]['bot_unlocked'][0]+=1;
    g_user_info[user_id][game_id]['bot_unlocked'][bot_id]=1;
    //g_bots_unlocked[user_id][game_id][0]+=1;
    //g_bots_unlocked[user_id][game_id][bot_id]=1;
}

///////////////////////////////////////////////////////
// CHECK IF COMMAND IS ALLOWED ( means full connection)
///////////////////////////////////////////////////////
/*
function check_cmd_right(user_id)
{
    */
    //log2("connection_typ:"+connection_typ[user_id])
    //log2("user_id:"+user_id);
    /*if (connection_typ[user_id]==CONNECTION_FULL)
    {
        log2("XXXXXXXXXXXXXXXXXXXtrue");
        //log2(!)
        return 1;
    }
    else
    {
        log2("WRONG CMD - not allowed in light connection");
        return ["666", "WRONG CMD"];
    }*/
/*
    return 1;
}*/

///////////////////////////////////////////////////////
// CHECK IF COMMAND IS ALLOWED ( means full connection)
///////////////////////////////////////////////////////

//////////////////////////////////////////////////
// AUTHENTICATE_USER
//////////////////////////////////////////////////
function authenticate_user(user){
    var user_id=user.user_id;
    var check_key=user.check_key;
    
    if (g_check_key[user_id]==null){
        log2("check_key does not exist on APE server!!! The server has just been restarted?")
        return ["444", "NO_CHECK_KEY"];
    }
    else if (g_check_key[user_id]!=check_key){
        log2("222, BAD_CHECK_KEY");
        return ["222", "BAD_CHECK_KEY"];
    }
    else return 1;
}

//MOVE
Ape.registerCmd("MOVE", true, function(params, info){
    log2("MOVE m_id :"+params.match_id+" uid:"+params.user_id+" pl_n:"+params.player_number+" cmd_id:"+params.cmd_id);
    //log2("Received:");
    log2(mydump(params.move_number));

    var user=info.user;
    var user_id=user.user_id;

    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);

    // This should be a infos.SendResponse...
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false){
        log2("CCR=false so RETURN FALSE!!! NO MOVE PLAYED!!!");
        return false;
    }

//    log2("MOVE 1");

    //var match_id=user.match_id;
    var match_id=g_array_match_ids[user_id];

    //log2("MOVE 2");
    log2("m_id:"+match_id);

    var g=g_matches[match_id];

    //log2("params.move_number:"+mydump(params.move_number));
    var raw_details={"match_id":match_id,"move_number":params.move_number,"player_number":params.player_number};
         //{"match_id":g.match_id,"move_number":g.game_get_move_shortened_info(i,3-i,g.move_number[3-i]), "player_number":3-i}
    store_game_history_for_user(user_id,"move",raw_details); // Formerly game_history_move in 1st version of the game history (moves by the player)
    
    //log2("MOVE 3");

    if (typeof g=="undefined"){
        log2("g IS UNDEFINED!!! so RETURN FALSE!!! NO MOVE PLAYED!!!");
        return false; // Not sure we can arrive here...
    }

//    log2("MOVE 4");

    // TODO
    // Vérifier plus de choses quant à la légalité du coup
    // Il faut aussi que l'user soit le bon à demander ce coup !!
    if (
            (g.current_player!=g.ANY_PLAYER && g.player_id[g.current_player]!=user_id)
            ||
            (!g.game_check_and_play_move_number(params.player_number,params.move_number))
        ){
        log2("ILLEGAL MOVE!!! GAME ENDED?");
        make_user_lose_current_match(user_id, END_MATCH_ILLEGAL_MOVE);
    }
    else{
//        log2("MOVE 5");

        // On a vérifié que le coup était bien légal
        // On envoie désormais le coup à l'adversaire
        // (et éventuellement aussi au joueur pour confirmation de réception ?)
        // Si c'est le cas, alors il faut modifier le (3-i) qu'on trouve plus bas

        //check_ends(g);

        // Let's clear the timeout of the player as he has now played
        kill_timeout(g, user.user_id)

//        log2("MOVE 6");

        if (g.current_player==g.ANY_PLAYER){
//            log2("MOVE 7a");
            g.move_number[params.player_number]=params.move_number ;
        }else{
//            log2("MOVE 7b");
            for (var i=1;i<=g.nb_players;i++){
//                log2("MOVE 8 i:"+i);
                if (g.player_id[i]!=user.user_id && user_id_is_human(g.player_id[i]) ){ //&& g.player_id[i]!=0
//                    log2("MOVE 9 i:"+i);
                    log2("--- ENVOI MOVE to player "+i);
                    send_custom_raw_and_store_history(g.pubid[i],g.player_id[i],"move", {"match_id":match_id,"move_number":g.game_get_move_shortened_info(i,params.player_number,params.move_number), "player_number":params.player_number});
                }
            }
        }
//        log2("MOVE 10");
        run_game_manager(g);
//        log2("MOVE 11");
    }
});

// ACK_RECEIPT
Ape.registerCmd("ACK_RECEIPT", true, function(params, info){

//    if (math.random()>0.85)
    {    
        // We might want to check that the person who sends this ACK_RECEIPT is the right one.
        // There is however little to fear if this is done by someone else. The message has already been sent anyway
        var index=index_user_id_raw_id(params.raw_id,info.user.user_id, params.page_counter);
        log2("ACKR r_ID:"+params.raw_id + " pc:"+params.page_counter +" uid :"+info.user.user_id+" iuiri:"+index);

        g_custom_raw_list.erase(index);
    }
});


function kill_timeout(g, user_id){
    if (g.player_id[1]==user_id ){ //&& (!user_id_is_robot(g.player_id[1]) Not a bot anyway
        kill_timeout_base(g,1);
    }    else if (g.player_id[2]==user_id){ //&& (!user_id_is_robot(g.player_id[2]) Not a bot anyway
        kill_timeout_base(g,2);
    }
}

function kill_timeout_base(g,i_player){
//    log2()
    var user=Ape.getUserByPubid(g.pubid[i_player]);
    if (user != null){
        delete_timeout_completely_if_needed(user,"kill_timeout_base()");
        /*
        if (user.user_timeout_id){
            g_timeout_counter--;
            log2("kill_timeout_base() -- g_timeout_counter: "+g_timeout_counter);    
            log2("user.user_timeout_id:"+user.user_timeout_id)
            Ape.clearTimeout(user.user_timeout_id);  
            user.user_timeout_id=null;
            log2("user.user_timeout_id:"+user.user_timeout_id)
        }
        */
    }
}


//////////////////////////////////////////////////
// ROBOT
//////////////////////////////////////////////////

var ROBOT_PUBID=0;
var ROBOT_ID=1;

   
function user_id_is_robot(user_id){
    //log2("user_id_is_robot:"+user_id)
	if (user_id>=1 && user_id<=100) return true;
	else return false;
}   
function user_id_is_human(user_id){
    //log2("user_id_is_robot:"+user_id)
	if (user_id>=100000) return true;
	else return false;
}
function pubid_is_robot(pubid){
    if (pubid<0){
        //log2("pubid is robot : true")
        return true;
    }else{
         //log2("pubid is robot : false")
         return false;
    }
}

function get_pubid_human_player(g){
    if (user_id_is_robot(g.player_id[1])){
        return g.pubid[2];
    }else return g.pubid[1];
}


//////////////////////////////////////////////////
// CONTROLLER (wait_for_new_move)
//////////////////////////////////////////////////

function set_timer_robot_move(match_id){
    if (g_load_test==false){
        log2("set_timer_rbt_mv mid:"+match_id)
        //g_timer_robot_move[match_id]=Ape.setTimeout(function(){record_robot_move_problem(match_id)}, ROBOT_MOVE_TIMEOUT);
        g_timer_robot_move[match_id]=Ape.setTimeout(
            function(){
                log2("ROBOT HAS NOT MOVED IN MATCH "+match_id);
                // wait_for_new_move(match_id); // Probably not dangerous with cli_mov, but who knows.
            }
            , ROBOT_MOVE_TIMEOUT
        );
    }
}

function clear_timer_robot_move(match_id){
    if (g_load_test==false){
        log2("clr_timr_rbt_mv() mid:"+match_id)
        Ape.clearTimeout(g_timer_robot_move[match_id]);
        delete(g_timer_robot_move[match_id]);
    }
}
function crash_robot_move(){
    if (false){ //Math.random(1)>0.25)
        log2("SIMULATION CRASH !!!!!!!!!!!!!! crash_robot_move() REMOVE THIS CODE")
        return true;
    }
    else return false;
}
//function record_robot_move_problem(match_id){
//    log2("record_robot_move_problem() match_id:"+match_id)
//    log2("g_base_URL: "+g_base_URL+'record_robot_move_problem.php');
//    var request = new Http(g_base_URL+'record_robot_move_problem.php?');
//
//    // Example of Http in Http.js in framework
//    //
//    //log2("t2");
//    request.set('method', 'POST');
//
//    //log2("t3");
//
//    // GET or POST data
//    request.writeData('match_id', match_id);
//
//    // HTTP Auth
//    //request.set('auth', 'user:password');
//
//    request.getContent(
//        function (result){
//            log2("Result rec_r_m_pb:"+result);
//            log2("Relaunch wait_for_new_move()");
//            wait_for_new_move(match_id);
//        }
//    );
//    //log2("t3");
//}
//record_robot_move_problem(101);

function wait_for_new_move(match_id){
    //if (compte>=8) return;
    var move_number;

    var g=g_matches[match_id];

//    log2("wfnm() mid:"+match_id+ " current_player:"+g.current_player+" joueur id:"+g.player_id[g.current_player]+" user_id_is_robot(g.player_id[g.current_player]):"+user_id_is_robot(g.player_id[g.current_player]))

//    log2("use_cli_mov:"+g.use_cli_mov);

    if (g.current_player==g.ANY_PLAYER){
//        log2("game_ask_for_robot_move")
        var one_move_played=false;

        // Both players
        if (user_id_is_robot(g.player_id[1]) && !g.player_moved[1]){
            set_timer_robot_move(match_id);
            if (!g.use_cli_mov) move_number=g.game_ask_for_robot_move(1);
            else move_number=g.cli_mov;
            if (crash_robot_move()==true) return;
            clear_timer_robot_move(match_id)

            g.move_number[1]=move_number;
            log2("BOT MOVE plyr 1 - move nmbr:"+move_number +" m_id:"+match_id);

            g.game_check_and_play_move_number(1,move_number);
            one_move_played=true;
        }else if (user_id_is_robot(g.player_id[2]) && !g.player_moved[2]){
            set_timer_robot_move(match_id);
            if (!g.use_cli_mov) move_number=g.game_ask_for_robot_move(2);
            else move_number=g.cli_mov;
            if (crash_robot_move()==true) return;
            clear_timer_robot_move(match_id);

            g.move_number[2]=move_number;
            log2("BOT MOVE plyr 2 - move nmbr:"+move_number +" m_id:"+match_id);

            g.game_check_and_play_move_number(2,move_number);
            one_move_played=true;
        }

        if (one_move_played==true) run_game_manager(g);
    }else if (user_id_is_robot(g.player_id[g.current_player])){
//        log2("game_ask_for_robot_move()")

        //var current_player_before_move=g.current_player;
        
        set_timer_robot_move(match_id);
        if (!g.use_cli_mov) move_number=g.game_ask_for_robot_move(g.current_player);
        else move_number=g.cli_mov;
        if (crash_robot_move()==true) return;
        clear_timer_robot_move(match_id);
        
        //log2("ROBOT MOVE number:"+move_number);

//        log2("game_check_and_play_move_number()")
        g.game_check_and_play_move_number(g.current_player,move_number);
        // Careful here in Level_X, we have a move_number that is used inside game_check_and_play_move_number to get
        // the new values of die_value which means that die_value and move_number.die_value are the same array again (although we split them
        // before). Done inside.

        log2("pts1:"+g.game_points[1]+ "pts2:"+g.game_points[2] )

        var pubid_human=get_pubid_human_player(g);
        //log2("pubid_human:"+pubid_human);
        if (g_load_test==false){
            log2("ENVOI MOVE - robot played");
            send_custom_raw_and_store_history(pubid_human, g.player_id[3-g.current_player], "move", {"match_id":match_id,"move_number":g.game_get_move_shortened_info(3-g.current_player,g.current_player,move_number), "player_number":g.current_player});
        }
//        log2("just before run_game_manager()");
        run_game_manager(g);
//        log2("just after run_game_manager()");
    }
}

//record_robot_move_problem(111);

//////////////////
//  start_game  //
//////////////////

function start_game(g){
    log2("start_game "+g.match_id);
    
    g.game_start_game();
    
    log2("g.game_counter:"+g.game_counter);
        
    if (g.mode_of_play==MODE_FULL_PLAY && g.game_counter==1){
        //log2("g.mode_of_play "+g.mode_of_play);
        
        //log2("")
        // We mark this table as closed so that we can close it when needed.
        
        if (g.player_id[2]!=0){ // Not a solo game
            g_lobby_tables_to_close[g.lobby_name][g.table_name]=get_time();
        }
        //close_lobby_table(g.lobby_name,g.table_name)
        // var delay_before_closing_table=15000;
        // Ape.setTimeout(function(){close_lobby_table(g.lobby_name,g.table_name);},delay_before_closing_table);
    }

    var mc=g.match_id;
    
    log2("mc:"+g.match_id);
    Ape.clearTimeout(g_array_timer_match_waiting_to_start[mc]); // Since the match is really started, the timeout for starting is killed
    delete(g_array_timer_match_waiting_to_start[mc]);
    
    //var pipe_player;
    // Opponent id and user info
    var opp_id;
//    var opp_ui;
    var opp_language;
    var opp_first_name;

//    log2("ZZZZ:"+g.pubid[i])
//    log2("ZZZZ:"+pubid_is_robot(g.pubid[i]))
    for (var i=1;i<=g.nb_players;i++){
//        log2("i:"+i+" g.player_id[i]:"+g.player_id[i]);
//        log2("!pubid_is_robot(g.pubid[i]):"+(!pubid_is_robot(g.pubid[i])));
//        log2("g.player_id[i]!=0:"+(g.player_id[i]!=0));
        if (!pubid_is_robot(g.pubid[i]) && g.player_id[i]!=0){ // Not a solo game user_id 0
            var startup_conditions=g.game_get_startup_conditions(i);
            //log2("--- GAME_STARTED sent to player " +i+ " - " +g.pubid[i]);
            //log2("startup_conditions:"+startup_conditions);
            //pipe_player=Ape.getPipe(g.pubid[i]);
            //if (pipe_player!=null)
            log2("--- GAME_STARTED sent to player " +i+ " - " +g.pubid[i]);
            log2("--- g_array_raw_id_counter[g.player_id[i]]:"+g_array_raw_id_counter[g.player_id[i]]);
            log2("--- g.player_id[i]:"+g.player_id[i]);

            opp_id=g.player_id[3-i];
            if (user_id_is_robot(opp_id)){
                // Robot
//                opp_ui=g_user_robot[opp_id];
                opp_language="";

                // Not needed any more, was causing a bug see below and below.
                //opp_first_name=encodeURIComponent(opp_ui.user_name);
            }else if (opp_id==0){
//                opp_ui={};
                opp_language="";
            }else{
                // Human

//                opp_ui=g_user_info[opp_id];
//                opp_language=opp_ui["language"];
                opp_language=g_user_info[opp_id]["language"];

                // Not needed anymore. We get the opponent's first name from MATCH_REQUEST. It was causing a bug see below and below.
                // Encode first name ????????????????????????? We had a bug with "André" first name. On IE, it made it lose its track (got rid of the , separating André","startup_conditions":"...
                // It is possible that encodeURIComponent was a solution. It prevented the bug, yes, but then... Would it be decoded easily? Could we encode/decode everything (Japanese characters ?)...
                //opp_first_name=encodeURIComponent(opp_ui["first_name"]);
            }

//            log2("--- opponent first name:"+opp_first_name);
            log2("--- opponent language:"+opp_language);

            // Let's pay for the food
            //log2("g.game_id:"+g.game_id)
            var food_cost=g_game_info[g.game_id].game_food_cost;
            //log2("food_cost:"+food_cost);

            // Delete match/game history for the player
            if (g.game_counter==1){
                reset_game_history_for_player(g.player_id[i]);
            }

            var raw_name="game_started";
            var raw_details={
                    "match_id":mc ,
                    "food_cost":food_cost,
                    "opponent_language":opp_language,
                    "startup_conditions":startup_conditions
                };
            // We store this information in case we need to send it again for a reload/replay of the game
            send_custom_raw_and_store_history(g.pubid[i], g.player_id[i], raw_name,raw_details);

            if (g.game_counter==1){
                if (g.player_id[i]>100000 ){ // In load test, we do not substract food
                    if (!potion_is_active(g.player_id[i])){
                        var food_really_used=food_cost;
                    }else food_really_used=0;
                    var experience_gained=food_cost;
                    var chaine="UPDATE t_user SET user_experience=user_experience+"+food_cost+",user_food_used=user_food_used+"+food_really_used+", user_food=user_food-"+food_really_used+ " WHERE user_id="+g.player_id[i];
                    log2(chaine);
                    query(SQL_ALL,chaine,function(res,errorNo){
                        if (errorNo){
//                            log2('Request error : ' + errorNo + ' : '+ this.errorString());
                        }else{
                            log2("food paid!");
                        }
                    }
                    );
                }
            }
        }
    }
    
    run_game_manager(g);
}

function reset_game_history_for_player(user_id){
    log2("reset_game_history_for_player():"+user_id);
//    log2(g_game_history_for_user_counter[user_id]);
//    log2(g_game_history_for_user[user_id]);
    g_game_history_for_user_counter[user_id]=0;
    g_game_history_for_user[user_id]={};
}

//record_robot_move_problem(112);
function store_game_history_for_user(user_id,raw_name,raw_details){
    log2("store_game_history_for_user() u_id:"+user_id);
    var cloned_details=clone_object(raw_details);
    var cloned_raw_name=raw_name;
    if (cloned_raw_name=="game_started"){
        cloned_raw_name="gs";
        delete(cloned_details.food_cost);
        delete(cloned_details.opponent_language);
    }else if (cloned_raw_name=="manager_infos"){
        cloned_raw_name="mi";
        delete(cloned_details.match_id);
        
        // Replace data.manager_infos by data.mi
        cloned_details.mi=cloned_details.manager_infos;
        delete cloned_details.manager_infos;
//        delete(cloned.details.opponent_language);
    }else if (cloned_raw_name=="move"){
        cloned_raw_name="mv";
        delete(cloned_details.match_id);
        
        // Replace data.move_number by data.mn
        cloned_details.mn=cloned_details.move_number;
        delete cloned_details.move_number;   
        cloned_details.pn=cloned_details.player_number;
        delete cloned_details.player_number;        
    }else if (cloned_raw_name=="match_ended"){
        cloned_raw_name="me";
        delete(cloned_details.match_id);
//        delete(cloned.details.opponent_language);
    }
//    cloned_details.d=cloned_details.data;
//    delete(cloned_details.data);
    
    // If the player has ended the match before it even started (clicking on the back button quickly,
    // then g_game_history_for_user[user_id] is not defined and this generates an abort.
    // We must therefore check it is (or do soemthing else before.
    // This was a big bug found on 05/05/2020 following a weird game between Pierre Kubica and Duke Smith (4122899) that was interrupted because the game 4122889 between Duck and Lilloo Martine was stopped by Duke before it even started.
    // The abort meant that Lilloo was not made aware that the game was over and she interrupted it (and lost too!) a few minutes later.
    if (!g_game_history_for_user[user_id]) reset_game_history_for_player(user_id);
    
    g_game_history_for_user[user_id][++g_game_history_for_user_counter[user_id]]=
        {
            r:cloned_raw_name,
            d:cloned_details
        };
//    log2("g_game_history_for_user_counter:"+mydump(g_game_history_for_user_counter));
//    log2("g_game_history_for_user:"+mydump(g_game_history_for_user));
}
function send_game_history_for_user(pubid,user_id){
    var match_id=g_array_match_ids[user_id];  
    log2("send_game_history_for_user user_id:"+user_id +" pubid:"+pubid+" match_id:"+match_id);
//    var match_id=g_game_history_for_user_counter[user_id].match_id;

    var time_last_manager_for_match=g_matches[match_id].time_last_manager_for_match;  
    //log2("time_last_manager_for_match:"+time_last_manager_for_match);
    
    // We used to send g_time_last_server_raw[user_id] instead of g_time_last_manager_for_match[g.match_id]
    send_custom_raw(pubid,user_id,"game_history",{nb_items:g_game_history_for_user_counter[user_id],time_last_server_raw:time_last_manager_for_match,history:g_game_history_for_user[user_id]});
}
                        
////////////////////////
//  run_game_manager  //
////////////////////////
function run_game_manager(g){
//    log2("r_g_mngr() m_id:"+g.match_id);
    //compte=compte+1;
    //log2("g.compteur_game_manager:"+g.compteur_game_manager);

    var i;

    if (g.current_player==g.ANY_PLAYER){
        log2("r_g_mngr() cas ANY_PL m_id:"+g.match_id);
        //log2("player_moved[1]:"+g.player_moved[1]+" player_moved[2]:"+g.player_moved[2]);
        if (g.player_moved[1] && g.player_moved[2]){
            for (i=1;i<=g.nb_players;i++){
                log2("--- ENVOI MOVE - the 2 players played");
                if (user_id_is_human(g.player_id[i]) ){ // Not a solo game user_id 0 // && g.player_id[i]!=0
                    log2("MOVE - match_id:"+g.match_id);
                        
                    // Here we only send to player i the move from player 3-i
                    send_custom_raw_and_store_history(g.pubid[i], g.player_id[i], "move", {"match_id":g.match_id,"move_number":g.game_get_move_shortened_info(i,3-i,g.move_number[3-i]), "player_number":3-i});
                }
            }
        }else if (g_load_test){
            wait_for_new_move(g.match_id);
            return;
        }
    }

    // Check end of game and end of match...
    // Just after play_move_number
    // We will test it after game.game_manager also later below
    //log2("Game result (1st) ? : "+g.game_result);
    if (g.game_result){
        log2("r_g_mngr() -- passage 1 avant deal_with_end_of_game")
        deal_with_end_of_game(g);
    }else{
        if (g.current_player!=g.ANY_PLAYER || (g.player_moved[1]&&g.player_moved[2]) || g.compteur_game_manager==0){
//            log2("r_g_mngr() GO m_id:"+g.match_id);

            g.game_manager();

//            log2("r_g_mngr() AFTER "+g.match_id);

            //log2("g.P.dice_locked"+mydump(g.P.dice_locked));
            //log2("g.P.dice_values"+mydump(g.P.dice_values));

            if (false && g_load_test){
                end_match(g,END_MATCH_NORMAL);
                 return;
            }

            // On envoie les infos du manager aux 2 joueurs
            for (i=1;i<=g.nb_players;i++){
//                log2("i: "+i+ " g.player_id[i]:"+g.player_id[i]);
                if (user_id_is_human(g.player_id[i])){ // && g.player_id[i]!=0
                    var inf=g.game_get_manager_infos(i);
                    log2("MNGR_INFOS to pl:"+i+" " +inf);
                    send_custom_raw_and_store_history(g.pubid[i], g.player_id[i], "manager_infos",  {"match_id":g.match_id,"manager_infos":inf});
                }
            }

            set_timer_if_needed(g,1);
            set_timer_if_needed(g,2);

            // Test the end of the game here and also before in play_move_number
            //g.game_check_and_mark_end_of_game(g.last_player,2); // 2 means after manager()
            //log2("Game result (2nd) ? : "+g.game_result);
            if (g.game_result){
//                log2("r_g_mngr() -- passage 2 avant deal_with_end_of_game")
                deal_with_end_of_game(g);
            }else if (g.game_ended==false){
                if (!g.use_cli_mov) wait_for_new_move(g.match_id)
            }
        }
    }
}

//record_robot_move_problem(113);

// Timer of the start of the game. It triggers after MOVE_TIMEOUT seconds and leads to the immediate loss of the game
// It must be reset (stop function below) when 1) the game is started (user clicks on Start button) and also when 2) the game ends (inadvertenly). Otherwise, as this timer is not associated with the match_id, one could imagine that after a disconnection, the user plays another game and receives this timer (from previous match). Unlikely, maybe not even possible but...
/*
function set_timer_for_start_of_game(g,i_player)
{
    var user_id=g.player_id[i_player]
    g_timer_for_starting_the_game[user_id] = Ape.setTimeout(function(){log2("Loss on time because player did not start the game - player"+i_player);make_user_lose_current_match(user_id, END_MATCH_CLOCK)}, START_MATCH_TIMEOUT);
}

function stop_timer_for_start_of_game(g,i_player)
{
    var user_id=g.player_id[i_player]
    Ape.clearTimeout(g_timer_for_starting_the_game[user_id]);
}
*/

function set_timer_if_needed(g,i_player){
    //log2("set_timer_if_needed for i_player:"+i_player+"?")
    if (user_id_is_human(g.player_id[i_player]) && (g.current_player==g.ANY_PLAYER || g.current_player==i_player)){
        //log2("set_timer_if_needed YES")
        var user=Ape.getUserByPubid(g.pubid[i_player])
        //if (user.user_timeout_id){
            /*
            Ape.clearTimeout(user.user_timeout_id); // If we do not do that, the previous timeout carries on!
            user.user_timeout_id=null;
            g_timeout_counter--;
            */
        //}
        delete_timeout_completely_if_needed(user,"set_timer_if_needed()")
        
//        log2("g.player_id[3-i_player]:"+g.player_id[3-i_player]);
//        log2("user_id_is_robot(g.player_id[3-i_player]):"+user_id_is_robot(g.player_id[3-i_player]));
        
        if (!user_id_is_human(g.player_id[3-i_player])){ // Was checking user_id_is_robot before 03/12/2019 but for solo games, we want to check that the opponent is not human rather (id=0)
            var timeout_delay=MOVE_TIMEOUT_AGAINST_ROBOT;
        }
        else timeout_delay=MOVE_TIMEOUT_AGAINST_HUMAN;
        
//        log2("g.player_id[3-i_player]:"+g.player_id[3-i_player])
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
//        log2("timeout_delay:"+timeout_delay)
        
//        log2("timeout_delay:"+timeout_delay)
        user.user_timeout_id = Ape.setTimeout(function(){log2("Loss on time player "+i_player);make_user_lose_current_match(user.user_id, END_MATCH_CLOCK)}, timeout_delay);
//        log2("user.user_timeout_id:"+user.user_timeout_id)
        g_timeout_counter++;
        log2("st_tmr_if_ndd g_tmeout_cntr:"+g_timeout_counter);
    }
    //else log2("set_timer_if_needed NO")
}

function delete_timeout_completely_if_needed(user,cas){
    log2("dlt_timeout_cmpltly_if_ndd() cas:"+cas);
    if (user==null){
        return false;
    }
    log2("dlt_timeout_cmpltly_if_ndd() - usr exists - usr.usr_timeout_id:"+user.user_timeout_id)
    
    return final_erase_timeout_existing_user(user,cas)
}
function final_erase_timeout_existing_user(existing_user,cas){
    if (existing_user.user_timeout_id){
        Ape.clearTimeout(existing_user.user_timeout_id); // If we do not do that, the previous timeout carries on!
        existing_user.user_timeout_id=null; // We must put it at null otherwise it is not done automatically
        g_timeout_counter--;
        log2(cas+ " --g_timeout_counter: "+g_timeout_counter +" cas:"+cas);
        return true;
    }else return false;
}

function deal_with_end_of_game(g){
//    log2("deal_with_end_of_game() --------------------------------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx g.match_result:"+g.match_result);
    if (g.match_result){
        end_match(g,END_MATCH_NORMAL);
    }else{
        log2("Game ended but match not ended - Current match score:"+g.match_points[1]+"-"+g.match_points[2]);
        
//        g.game_set_no_players_ready();
//        // Robots are always ready to restart
//        if (pubid_is_robot(g.pubid[1])) g.player_ready[1]=1;
//        if (pubid_is_robot(g.pubid[2])) g.player_ready[2]=1;

        // Both players are ready to start a new game (=round?) in the match. So we just start it.
        //g.start_game();
        //g.game_start_game();
        
        // We start a new game
        if (g_load_test==false){
            start_game(g);
        }else{
//            log2("restarting g game after end of game in match")
            g.game_start_game();
            var g2=g_matches2[g.match_id];
//            log2("restarting g2 game after end of game in match")
            g2.game_start_game(g.game_get_startup_conditions(2));
            run_game_manager_bot_vs_bot(g);
//            log2("END OF RESTARTS")
        }

        // Just in case, we stop the timer for starting the game to avoid any leak on next game
        /*
        for (var i_player = 0; i_player <= 2; i_player++)
        {
            stop_timer_for_start_of_game(g, i_player)
        }
        */
    }
}

//record_robot_move_problem(114);

function make_user_lose_current_match(user_id, end_type){
    log2("mk_usr_lose_crrnt_match uid:"+user_id+ " end_type:"+end_type)
    // g is not defined here!!!!!!!!!!!!!!!
    //log2("user.match_id:"+user.match_id);log2("g.player_id[1]:"+g.player_id[1]);log2("g.player_id[2]:"+g.player_id[2]);log2("user.user_id:"+user.user_id);log2("user.name:"+user.name);log2("user.game_id:"+user.game_id);log2("user.match_id:"+user.match_id);log2("user.match_id:"+user.match_id);

    //var user_id=user.user_id;
    var umid=g_array_match_ids[user_id];
    log2("usr mid:"+umid);
    
    if (end_type==END_MATCH_DISCONNECTION || end_type==END_MATCH_PAGE_RELOADED || end_type==END_MATCH_LEFT_PAGE){
        // The user has lost connection (it will often be intentional: closing the game window)
        // In this case, we set up a timer so that he can ask for another game within next 2 minutes
        //log2("mulcm 1");
        g_user_info[user_id]["can_start_another_game"]=false;
        //log2("mulcm 2");
        Ape.setTimeout(function(){g_user_info[user_id]["can_start_another_game"]=true},CANNOT_ASK_FOR_A_NEW_GAME_AFTER_UNFINISHED_GAME_TIMEOUT)
        //log2("mulcm 3");
    }
    if (umid!=NO_MATCH){
        //log2("mulcm 1b");
        var g=g_matches[umid];
        if (g.game_is_solo()){
            g.match_result=1; // If match aborted, match_result=0 for solo games.
        }else{
            if (user_id==g.player_id[1]) g.match_result=2;
            else if (user_id==g.player_id[2]) g.match_result=1;
            else {log2("PROBLEM: user that has failed to play a move is not found");g.match_result=0;}
        }
        
        //log2("mulcm 2b");
        for (var i=1;i<=g.nb_players;i++){
            log2("g.player_id[i]:"+g.player_id[i]+" user_id_is_human(g.player_id[i]):"+user_id_is_human(g.player_id[i]));
            if (user_id_is_human(g.player_id[i])){
                //log2("--- ENVOI GAME_ENDED_PREMATURELY TO PLAYER "+i);
                log2("--- ENVOI GAME_ENDED_PREMATURELY TO PLAYER "+i);  
                send_custom_raw(g.pubid[i], g.player_id[i], "game_ended_prematurely", {"match_id":umid,"match_result":g.match_result,"end_type":end_type});
            }
        }
        //log2("mulcm 2c");
        end_match(g_matches[umid], end_type);
        //log2("mulcm 2d");
    }
    else log2("umid==NO MATCH is this normal?????????")
}

function end_match(g,end_type){
    
    var match_id=g.match_id;
        
    log2("end_match:"+match_id+" end_match type:"+end_type);
    
    if (g.mode_of_play==MODE_FULL_PLAY && g.player_id[2]!=0){ // Not a solo game
        log2("g.mode_of_play "+g.mode_of_play);
        if (!g_load_test) close_lobby_table(g.lobby_name,g.table_name);
    }
    
    for (var i_player=1;i_player<=2;i_player++){
        var user_id=g.player_id[i_player];
        if (user_id_is_human(g.player_id[i_player])){ // Not solo game user_id 0 // && g.player_id[i_player]!=0
                    
            kill_timeout(g, g.player_id[i_player]);

            g_array_match_ids[g.player_id[i_player]]=NO_MATCH;

            send_custom_raw_and_store_history(g.pubid[i_player], user_id, "match_end", {}); //'match_id':match_id it was useless. We already have the info anyway.
            log2("sndng mtch_end to pl:"+i_player);
            
            // Storing the match history (the game is finished)
            if (g.mode_of_play==MODE_FULL_PLAY){
            //log2("g.mode_of_play "+g.mode_of_play);
                Mysql_store_match_history(match_id, i_player,user_id);
            }
        }
    }
    
    //return;
    log2("MATCH ENDED - SCORE:"+g.match_points[1]+"-"+g.match_points[2] + " END TYPE:" + end_type);

    var score_1=g.match_points[1];
    var score_2=g.match_points[2];
    var playing_turn;
    if (end_type>0){
        // If the game has not been started yet, g.current_player is undefined!!!!! Which caused a bug. The game could not be recorded.
        if (g.current_player!=undefined) playing_turn=g.current_player;
        else playing_turn=0;
    }
    else playing_turn=0;
    
    // Let's save the match result in the database first
    Mysql_update_result_match(g.match_id, 0, g.match_result, end_type, playing_turn, score_1, score_2);

//    var game_rated=true;

    var pubids=new Array(0,g.pubid[1], g.pubid[2]);
    var players=new Array(0,g.player_id[1],g.player_id[2])

    Mysql_update_stats_and_ratings_all_players(g.match_id, players, pubids, g.match_result, end_type, g.game_id, g.solo_performance);

    g.game_ended=true;

    // Ici delete (g) ne marche pas et cause donc un big memory leak!!!!!!!!!!!!!
    // C'est la référence g qui est effacée et non ce vers quoi elle pointe
    delete_match(g.match_id);
    //delete(g_matches[g.match_id]);

    // The game is ended, so we must try to close the link between the players and the server in case
    // they leave their browser open
    // Might be done on the client side, but that's less secure (if the timer fails there)
    //this.set_timer_kill_link(g.match_id);
    
    if (false && g_load_test){
        g_counter_matches_opened--;
        log2("-----------------------2ème partie mc:"+mc);

        var mc=get_match_counter();
        g_counter_matches_opened++;
        //g_matches[mc]=new KeltisCard_Game("s",4,mc,"local",0,0,1);
        g_matches[mc]=new Tictactoe_Game("s",1,mc,"local",0,0,1,false);

        Mysql_insert_online_match(MODE_FULL_PLAY,g_matches[mc]);
        g_matches[mc].game_start_game();
        run_game_manager(g_matches[mc]);
    }
    
    //log2("g.match_id:"+g.match_id);
}

function delete_match(match_id){
    delete(g_matches[match_id]);
}

//record_robot_move_problem(115);


//record_robot_move_problem(116);
//
////////////////////
// Load testing   //
////////////////////
// Bot Vs Bot avec 2 bots sur le serveur dont le premier qui est l'arbitre
// Ca bugue !!! Et fait planter l'appli assez vite

function run_game_manager_bot_vs_bot(g){
    //compte=compte+1;

//    log2("g.compteur_game_manager_bot_vs_bot:"+g.compteur_game_manager);

    var g2=g_matches2[g.match_id];

    // Check end of game and end of match...
    // Just after play_move_number
    // We will test it after game.game_manager also later below
    // log2("Game result (1st) ? : "+g.game_result);
    if (g.game_result){
        //log2("passage 1 avant deal_with_end_of_game")
        deal_with_end_of_game(g);
    }else{
        if (g.current_player!=g.ANY_PLAYER || (g.player_moved[1]&&g.player_moved[2]) || g.compteur_game_manager==0){
            g.game_manager();
            //log2("test")
            if (false && g_load_test){
                end_match(g,END_MATCH_NORMAL);//(0,END_MATCH_CLOCK)
                 return;
            }

            var inf=g.game_get_manager_infos(2);
            g2.game_manager(inf);

            // Test the end of the game here and also before in play_move_number
            //g.game_check_and_mark_end_of_game(g.last_player,2); // 2 means after manager()
            //log2("Game result (2nd) ? : "+g.game_result);
            if (g.game_result){
                //log2("passage 2 avant deal_with_end_of_game")
                deal_with_end_of_game(g);
            }else if (g.game_ended==false){
                wait_for_new_move_bot_vs_bot(g.match_id);
                //Ape.setTimeout(function(){wait_for_new_move(g.match_id)},4*(1000+Math.random()*1000));
            }
            //log2("wait_for_n_m lancé:"+g.match_id);

        }
        // Gérer le cas ANY_PLAYER, faut bien récupérer le coup du 2ème joueur !!
    }
}

function wait_for_new_move_bot_vs_bot(match_id){
    //if (compte>=8) return;

//    log2("wait_for_new_move_bot_vs_bot() match_id:"+match_id);
    //log2("2ème:"+match_id);
    var g=g_matches[match_id];
    var g2=g_matches2[match_id];

    //log2("current_player:"+g.current_player);
    //log2("joueur id:"+g.player_id[g.current_player]);

    if (g.current_player==g.ANY_PLAYER){
        // Both players
        set_timer_robot_move(match_id)
        var move_number=g.game_ask_for_robot_move(g.opponent_or_robot_number);
        if (crash_robot_move()==true) return;
        clear_timer_robot_move(match_id);

        g.move_number[g.opponent_or_robot_number]=move_number;
        //log2("ROBOT MOVE player 1 - move number:"+move_number);

        g.game_check_and_play_move_number(g.opponent_or_robot_number,move_number);
        g2.game_check_and_play_move_number(g.opponent_or_robot_number,move_number);

        set_timer_robot_move(match_id)
        move_number=g2.game_ask_for_robot_move(g2.opponent_or_robot_number);
        if (crash_robot_move()==true) return;
        clear_timer_robot_move(match_id);

        g2.move_number[g2.opponent_or_robot_number]=move_number;
        //log2("ROBOT MOVE player 2 - move number:"+move_number);

        g2.game_check_and_play_move_number(g2.opponent_or_robot_number,move_number);
        g.game_check_and_play_move_number(g2.opponent_or_robot_number,move_number);

        run_game_manager_bot_vs_bot(g);
    }else{
//        log2("g.my_player_number:"+g.my_player_number);
//        log2("g.opponent_or_robot_number:"+g.opponent_or_robot_number);
//        log2("g2.opponent_or_robot_number:"+g2.opponent_or_robot_number);
//        log2("g.current_player:"+g.current_player);
//        log2("g.opponent_or_robot_number:"+g.opponent_or_robot_number);

//        if (g.current_player==g.opponent_or_robot_number){
//        log2("g.opponent_or_robot_number:"+g.opponent_or_robot_number);

// mmmmm
        if (g.current_player!=g.opponent_or_robot_number){
//            log2("g moves g.current_player:"+g.current_player);
            set_timer_robot_move(match_id);
            move_number=g2.game_ask_for_robot_move(g.current_player);
            if (crash_robot_move()==true) return;
            clear_timer_robot_move(match_id);
        }else{
//            log2("g2 moves g.current_player:"+g.current_player);
            set_timer_robot_move(match_id)
            move_number=g.game_ask_for_robot_move(g.current_player);
            if (crash_robot_move()==true) return;
            clear_timer_robot_move(match_id);
        }
        
        //log2("ROBOT MOVE number:"+move_number);

        g.game_check_and_play_move_number(g.current_player,move_number);
        g2.game_check_and_play_move_number(g.current_player,move_number);

        //return;
        run_game_manager_bot_vs_bot(g);
    }
}

//record_robot_move_problem(117);

function print_time(){
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    if (minutes < 10){
        minutes = "0" + minutes
    }
    if (seconds < 10){
        seconds = "0" + seconds
    }
    return hours + ":" + minutes + ":"+ seconds;
}

function update_rating_locally(user_id, game_id, evolution_rating){
    var old_rating=get_user_rating(user_id,game_id);
    var new_rating=Number(old_rating)+Number(evolution_rating);

    if (user_id_is_human(user_id)){
        g_user_info[user_id][game_id]["rating"]=new_rating;
    }else{
        g_user_robot[user_id].rating[game_id]=new_rating;
    }
}

function check_command_reception(user,cmd_id, cmd_page_counter){
    var user_id=user.user_id;
    
    //log2("CCR check_command_reception");
    log2("CCR cmd_id:"+cmd_id+" - "+"user_id:"+user_id +" - g_array_cmd_id_counter[user.user_id]:"+g_array_cmd_id_counter[user.user_id])

//    if (Math.random()>0.9){
    if (false){
        log2("TEST PURPOSE: WE DO NOT RECEIVE cmd_id"+cmd_id);
        return false;
    }
 
    if (cmd_page_counter!=g_page_counter[user_id]){ // If this is an old cmd, we do not deal with it.
        log2("CCR ERROR OLD CMD: cmd_page_counter:"+cmd_page_counter+" g_page_counter[user_id]:"+g_page_counter[user_id]);
        return false;
    }
    // Note that it is also possible that we are on a new page on the client side, but ASK_COUNTERS has not yet been received
    // In this case, we have this.

    if (cmd_id>g_array_cmd_id_counter[user_id]+1){
        // We do not acknowledge receipt as this is not a next raw_id but a future one (raw too early)
        // We do not acknowledge receipt as this is not a next raw_id but a future one (raw too early)
        // We do not acknowledge receipt as this is not a next raw_id but a future one (raw too early)
        // We do not acknowledge receipt as this is not a next raw_id but a future one (raw too early)
        // We do not acknowledge receipt as this is not a next raw_id but a future one (raw too early)
        // One at least was missed, let's wait for it before receiving the following ones.

        log2("WARNING!!! CCR RAW TOO EARLY:"+false);
        return false;
    }

    // Acknowledgement of receipt
    user.pipe.sendRaw("cmd_received",{'cmd_id':cmd_id, 'page_counter':g_page_counter[user_id]});

    //var log_text_base='g_cmd_id_received[user_id][cmd_id]:'+g_cmd_id_received[user_id][cmd_id];
//    log2()
    if (g_cmd_id_received[user_id][cmd_id]){ // cmd already received  otherwise undefined 
        log2("WARNING !!!! CCR already received CCR:"+false);
        return false;
    }else{
        log2("CCR normal");

        g_cmd_id_received[user_id][cmd_id]=g_rough_current_timestamp;
        g_array_cmd_id_counter[user_id]++;
        
        return true;
    }
}

//record_robot_move_problem(118);

Ape.registerCmd("ASK_COUNTERS", true, function(params, info){
    var page_context=params.page_context;
    // If this ASK_COUNTERS COMES FROM A MENU PAGE WITH A nav_case=close_match_confirmed then we have confirm_close_current_match=true
    var confirm_close_current_match=params.confirm_close_current_match;
    log2("ASK_COUNTERS cntxt:"+page_context+" params.confirm_close_current_match:"+params.confirm_close_current_match);
    
    var user=info.user;
    var user_id=user.user_id;
    
    //log2("subuser:"+mydump(info.subuser));
    
    Ape.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZz:"+page_context);
    Ape.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZz:"+g_array_match_ids[user_id]);
    Ape.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZz:"+params.match_id);
    Ape.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZz:"+params.replaying_on_game_page);
    
//    if (page_context!="game"){
    if (g_array_match_ids[user_id]!=NO_MATCH) {
        // There is a game going on, so we don't want to open a main menu page and connect to APE which would cut the game.
        // Unless we have confirmation to do that.
        if (confirm_close_current_match) make_user_lose_current_match(user_id,END_MATCH_LEFT_PAGE);
        else{
            //log2("subuser:"+mydump(info.subuser));
            if (page_context=="menu" || (page_context=="game" && params.replaying_on_game_page==true)){ 
                info.sendResponse("CANNOT_LOG_TO_APE_ALREADY_PLAYING",{match_id:g_array_match_ids[user_id]}); // Sent only to sub-user (the window who was just opened, not the game page otherwise it messes things up)
                return;
            }
        }
    }
    
    if (page_context!="game"){
        g_array_training_match_ids[user_id]=NO_MATCH;
        g_array_puzzle_match_ids[user_id]=NO_MATCH;
    }
        
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);

    init_raw_and_cmd_ids(user_id);

    Mysql_get_user_infos_if_necessary(user_id,user.getProperty('pubid'))
    
    // We don't want to receive the news for the lobbies except when we are in the lobby itself. 
    // So we leave all of them if needed.
    leave_all_lobby_news(user);
    
    // The user leaves all tables except on game page because we need the information about current table before starting the game.
    if (page_context!="game"){
        // We found out that two American users managed to cancel a game that was already started.
        // One called "menu.php?nav_case=remote&game_id=3" without sending a LEFT_PAGE.
        // Then we reached this line so we made him leave all tables which unduly led to "cancelled match"
        // It is surprizing that he could call the menu.php without leaving the game page (he was on Opera but I checked and LEFT_PAGE is sent correctly so...) but that's what he did.
        log2("We make the user leave all tables because we need the information about current table before starting the game.");
        make_user_leave_all_tables(user_id);
    } // I think I had a bug because this was not present (the player managed to play against himself!!)
    
    //var user_pipe=Ape.getUserByPubid(pubid).pipe;
    
    //user_pipe.sendRaw("init_ack_counters",{'page_counter':g_page_counter[user_id],'cmd_id_counter':g_array_cmd_id_counter[user_id],'raw_id_counter':g_array_raw_id_counter[user_id]});
    
});

function leave_all_lobby_news(user){
    log2("lv_all_lbby_news() uid:"+user.user_id);
    for (var lobby_name in g_lobby_tables){
        log2("lbby:"+lobby_name)
        var lobby_news_name=lobby_name+"_news";
        log2("We make usr lv chl: "+lobby_news_name);
        user.left(lobby_news_name);
    }    
}

function do_stuffs_after_user_info_is_fetched(user_id,pubid){
    log2("do_stuffs_aftr_u_info_is_ftchd() uid:"+user_id+ " pubid:"+pubid);
    if (pubid==-9999){
        log2("immediate return pubid=-9999");
        return;
    }
    
    var user_pipe=Ape.getUserByPubid(pubid).pipe;
    log2("usr_pp: "+user_pipe);
    log2("g_pg_cntr[uid]:"+g_page_counter[user_id])
    log2("g_ar_cmd_id_cntr[uid]:"+g_array_cmd_id_counter[user_id])
    log2("g_ar_r_id_cntr[uid]:"+g_array_raw_id_counter[user_id])
    user_pipe.sendRaw("init_ack_counters",{'page_counter':g_page_counter[user_id],'cmd_id_counter':g_array_cmd_id_counter[user_id],'raw_id_counter':g_array_raw_id_counter[user_id]});
    
    unsubscribe_from_old_one_to_one_chats(user_id);
    send_one_to_one_chats_list(user_id);
}

// This is called on each ASK_COUNTER (well when do_stuffs_after_user_info_is_fetched() is called which is probably the same now)
function unsubscribe_from_old_one_to_one_chats(user_id){
    log2("unsubscribe_from_old_one_to_one_chats() user_id"+user_id);
    if (g_one_to_one_chats[user_id]!=null){
        log2("g_oto_chats[uid]:"+mydump(g_one_to_one_chats[user_id]));
        
        // Inactivity? Close chat for user?
        // 
        // If there has been no activity in the chat for some time, we close it down for this user
        // However, we open the window if the user has recently logged in and has received a message since. 
        // We use g_last_login[user_id] to see when the user has last logged in.
        // 
        // BEWARE: if a user starts a one-to-one chat then never comes back on the platform,
        // g_one_to_one_chats[user_id] will never be deleted for this player.
        // Mettre en place un collecteur au bout de 15 jours ? Ou trouver un autre système pour réouvrir
        // les chats dans lesquels un message nous a été laissé.
        //
        log2("PEOPLE USR "+user_id+ " CHATS WITH:");
        
        var current_time=get_time();
        //log2("current_time:" +current_time+" g_last_login[user_id]:"+g_last_login[user_id]+ " diff:"+(current_time-g_last_login[user_id]) +" DELAY_BEFORE_CLOSING_INACTIVE_CHAT:"+DELAY_BEFORE_CLOSING_INACTIVE_CHAT)
        if (current_time-g_last_login[user_id]>DELAY_BEFORE_CLOSING_INACTIVE_CHAT_AFTER_LOGIN){
            log2("loop through all items of g_one_to_one_chats[user]");
            for (var key in g_one_to_one_chats[user_id]) {
                var entry = g_one_to_one_chats[user_id][key];
                log2('entry["invited_user_name"]:'+entry["invited_user_name"]);
                var invited_user_id=entry["invited_user_id"]
                var channel_name=get_one_to_one_chat_name(user_id,invited_user_id);
                log2("get_time()-g_channel_latest_activity[channel_name]:"+(get_time()-g_channel_latest_activity[channel_name]));
                
                if (current_time-g_channel_latest_activity[channel_name]>DELAY_BEFORE_CLOSING_INACTIVE_CHAT){
                    delete_one_to_one_chats_object(user_id,invited_user_id);
                }
            };
        }
    }
}

function send_one_to_one_chats_list(user_id){
    // Send info about the chats that the user is connected to now.
    log2("send_one_to_one_chats_list user_id:"+user_id + " g_one_to_one_chats[user_id]:"+g_one_to_one_chats[user_id]);
    if (get_object_length(g_one_to_one_chats[user_id])!=0){
        log2("g_one_to_one_chats[user_id]:"+mydump(g_one_to_one_chats[user_id]));
        
        //var user=info.user;
        //var user_id=user.user_id;
        var pubid=g_last_pubid[user_id];
        //log2("---------------------------->>>>>pubid:"+pubid);
        if (pubid!=null){
            var raw_details={'one_to_one_chats_list':g_one_to_one_chats[user_id]};
            log2("mydump(raw_details) for one_to_one_chats_list:"+mydump(raw_details));
            send_custom_raw(pubid,user_id,"one_to_one_chats_list",raw_details);
        }
        //function send_custom_raw(pubid, user_id, raw_name, raw_details)
        //user.pipe.sendRaw("one_to_one_chats_list",{'one_to_one_chats_list':g_one_to_one_chats[user_id]});
    } else log2("Nothing in g_one_to_one_chats[user_id]. No one-to-one chats list to send.")
}

function get_one_to_one_chat_name(user_id_1,user_id_2){
    if (user_id_1<user_id_2) {
        var small_id=user_id_1;
        var big_id=user_id_2;
    }
    else{
        var small_id=user_id_2;
        var big_id=user_id_1;
    }
    return "one_to_one_"+small_id+"_"+big_id;
}

Ape.registerCmd("GO_IN_MAINTENANCE_MODE", false, function(params, info){
    log2("GO_IN_MAINTENANCE_MODE????????????");

    if (params.key=="954387421ag3d5gffq56687fqds132"){
        for (var i=1;i<=15;i++)        {
            log2("GO_IN_MAINTENANCE_MODE");
        }

        g_maintenance=true;

        //return {name: "registered", data:{value:0}};
        return {name: "MAINTENANCE_ON",data:{}};
        //name: "registered", data:{value:0}
    }else{
        log2("WRONG KEY!!!")
        return {name: "WRONG KEY",data:{}};
        //return {name: "registered", data:{value:0}};
    }
    //return {res: "maintenance_mode",data:{value:"OK"}};

});

function send_custom_raw(pubid, user_id, raw_name, raw_details){
    log2("s_cstm_raw:"+user_id + " d:" +mydump(raw_details));
    var time_created=get_time();
    raw_details.time_created=time_created;

    g_array_raw_id_counter[user_id]++;
   
    send_custom_raw_once(pubid, user_id, raw_name, raw_details, g_array_raw_id_counter[user_id]);
}
// For sending raws attached the game history. 
// We store the game history before sending the raw.
function send_custom_raw_and_store_history(pubid, user_id, raw_name, raw_details){
    store_game_history_for_user(user_id,raw_name,raw_details);
    send_custom_raw(pubid, user_id, raw_name, raw_details)
}

// This sends the message once
// This function will be reused if the message has not been acknowledged in x seconds
function send_custom_raw_once(pubid, user_id, raw_name, raw_details, raw_id){
    // We add the custom raw id to the parameters of the custom raw
    raw_details.raw_id=raw_id;
    raw_details.page_counter=g_page_counter[user_id];
    
    //log2("s_c_r_once r_detls:" +mydump(raw_details));
    
    var index_g_crl=index_user_id_raw_id(raw_id, user_id,0);
    //log2("s_c_r_1(): u_id:"+user_id+" pubid:"+pubid+" RID:"+raw_id+" "+raw_name+ " index_user_id_raw_id:"+index_g_crl + " content:"+raw_name);

    if (raw_name=="game_started"){
        //log2("content: "+raw_name) // Has been put above now
    }else if (raw_name=="move"){
        //log2("content: "+raw_name)
        //log2(mydump(raw_details.move_number));
    }else if (raw_name=="msg"){
        //log2("content: "+raw_name)
        //log2(mydump(raw_details.msg));
    }else if (raw_name=="manager_infos"){
        //log2("content: "+raw_name)
        //log2(mydump(raw_details.manager_infos));
    }

//    if ( (raw_id==1 && Math.random()>0.90) || (raw_id>=2 && Math.random()>0.95) )
//    if (Math.random()>0.9){
    if (false){
        log2("TEST PURPOSE: WE DO NOT SEND custom_raw_once")
    }else{
        //log2("s_c_r_1() a1")
        var pipe_player=Ape.getPipe(pubid);
        //log2("s_c_r_1() a2")
        
        if (pipe_player==null){
            log2("ERROR pipe_player IS NULL in send_custom_raw_once() --------- RETURN!!!!");
            log2("s_c_r_once r_detls:" +mydump(raw_details));
            log2("pubid:"+pubid)
            return "USER_HAS_NO_PIPE";
        }else{
            //log2("pipe_player OK OK OK OK OK OK OK OK OK")
        }
        //log2("ZZZZZZZZZZZZZZZZZZZZZZ")
        // pipe_player.sendRaw("msg",{"msg":"c'est"});
        //log2("XXXXXXXXXXXXXXXXXXXX")
        //log2("s_c_r_once OK")
        pipe_player.sendRaw(raw_name,raw_details);
        //log2("s_c_r_1() a3")
    }

    //log2("s_c_r_1() b")
    if (!g_custom_raw_list.has(index_g_crl)){ // Text existence of raw, we don't want to recreate it with a new timestamp
        
    //log2("s_c_r_1() c")
        // We store the custom raw and will delete it when the acknowledgement is received
        var raw=[];
        raw.raw_id=raw_id; // Fait un peu doublon par rapport à index (qui contient raw_id)
        raw.raw_name=raw_name;
        raw.raw_details=clone_object(raw_details);
        
        //log2("s_c_r_1() d")
        raw.raw_timestamp=get_time();
        //log2("s_c_r_1() e")
        raw.user_id=user_id;
        raw.page_counter=g_page_counter[user_id];
        // pipe_player was stored here but that was dangerous and caused bugs (probably) because it could be modified later
        raw.pubid_player=pubid;//

        //log2("s_c_r_1() f")
        g_custom_raw_list.set(index_g_crl,raw);
        
        //log2("s_c_r_1() g")
    }
    //log2("s_c_r_1() END")
}

//record_robot_move_problem(119);

function mydump(arr,level){
    var dumped_text = "";
    if(!level) level = 0;

    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";

    if (typeof(arr) == 'object'){
        for (var item in arr){
            if (arr.hasOwnProperty(item)){ // To exclude methods and other things of the object
                var value = arr[item];

                if(typeof(value) == 'object'){
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    dumped_text += mydump(value,level+1);
                }else{
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        }
    }else{
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}

function mydump_with_count(arr){
    //log2("XXXXXXXX")
    //log2(get_all_objects_size(this)["TEXT"]);
    return get_all_objects_size(arr)["TEXT"];
}

function get_all_objects_size(arr,level){
    var object_counts={};
    
    var dumped_text = "";
    if(!level) {
        level = 0;
    }
    if (level==0){
        var total=0;
    }

    if (typeof(arr) == 'object'){
        for (var item in arr){
            
            //log2(item)
            
            g_list_of_items_with_precounting={};
            g_list_of_items_with_precounting["g_CTW_tt_hash_card_position"]=257506;
            g_list_of_items_with_precounting["g_CTW_list_of_32_bits_generated"]=253536;
            g_list_of_items_with_precounting["g_GB_list_of_32_bits_generated"]=11974;
            g_list_of_items_with_precounting["g_GB_tt_hash_player_pile"]=8823;
            g_list_of_items_with_precounting["g_GB_tt_hash_cards_on_board"]=2887;
            g_list_of_items_with_precounting["LX_ordonner"]=1297;
            g_list_of_items_with_precounting["g_HK_chances_draw_for_geisha"]=1221;
            g_list_of_items_with_precounting["g_HK_chances_win_for_geisha"]=1221;
            g_list_of_items_with_precounting["g_posts_left_or_below_wire"]=1315;
            g_list_of_items_with_precounting["g_SOLO_RB_forbidden_wirings"]=5059;
                
            // This was used to see where we are (in case of infinite loops. Put this back if needed.
            //if (level==0) log2(item);
            if (item=="g_global_object"){
                // Do nothing. Otherwise infinite loop
            }else if (item=="g_deck_logics" || item=="g_pile_logics"  || item=="g_matches"
                || item=="LX_p" || item=="LX_g"|| item=="LX_history"
                || item=="g_KD_prb" || item=="LX_race" || item=="LX_nb_combis" ){ 
                // We have to exclude this one because it refers to something that refers back to it with this.blabla=this... or something like that. Infinite loop.
                // Migrato gives infinite references (loops) so we skip it and we have to skip g_matches for that reason.
                // We skip
            }else{
                if (level==0) g_mydump_with_count_counter=1;
                else g_mydump_with_count_counter++;
                
                if (g_list_of_items_with_precounting[item]){
                    object_counts[item]=g_list_of_items_with_precounting[item];
                    total+=object_counts[item];
                }
//                if (item=="g_CTW_tt_hash_card_position"){
//                    object_counts[item]=257506;
//                }else if (item=="g_CTW_list_of_32_bits_generated"){
//                    object_counts[item]=253536;
//                }else if (item=="g_GB_list_of_32_bits_generated"){
//                    object_counts[item]=11974;
//                }else if (item=="g_GB_tt_hash_player_pile"){
//                    object_counts[item]=8823;
//                }else if (item=="g_GB_tt_hash_cards_on_board"){
//                    object_counts[item]=2887;
//                }else if (item=="LX_ordonner"){
//                    object_counts[item]=1297;
//                }else if (item=="g_HK_chances_draw_for_geisha"){
//                    object_counts[item]=1221;
//                }else if (item=="g_HK_chances_win_for_geisha"){
//                    object_counts[item]=1221;
//                }else if (item=="g_posts_left_or_below_wire"){
//                    object_counts[item]=1315;
//                }else if (item=="g_SOLO_RB_forbidden_wirings"){
//                    object_counts[item]=5059;
//                }

                // To exclude methods and other things of the object
                else if (arr.hasOwnProperty(item)){
                    var value = arr[item];

                    if(typeof(value) == 'object'){
                        //dumped_text += level_padding + "'" + item + "' ...\n";
                        //dumped_text += 
                        //log2(dumped_text);
//                        if (level==8){
//                            var t=0/0;
//                            log2(t);
//                            return;
//                        }//return;
//                        if (level==0) log2(item);
                        get_all_objects_size(value,level+1);
                        if (level==0){
                            dumped_text += item+ ":  "+g_mydump_with_count_counter+"\n";
                            log2(item+ ":  "+g_mydump_with_count_counter);
                            //log2(dumped_text);
                            object_counts[item]=g_mydump_with_count_counter;
                        }//else log2("L"+level+" "+item);
                    }
                    else{
                        //dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                    }
                }

                total+=g_mydump_with_count_counter;
            }
        }
    } 
    else{
        //dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    //log2("ZZZZZ")
    if (level==0) {
        dumped_text+="TOTAL: "+total;
        object_counts["TOTAL"]=total;
    }
    
    object_counts["TEXT"]=dumped_text;
//    log2(mydump(object_counts));
    return object_counts;
    //return dumped_text;
}

function mydump_first_level(arr){    
    log2("mydump_first_level")
    log2("mydump_first_level")
    log2("mydump_first_level")
    log2("mydump_first_level")
    var dumped_text = "";
    
    log2("00000")

    log2("00000")
    var level_padding = "";

        log2("00000")
    if (typeof(arr) == 'object'){
        //log2("TTTT")
        for (var item in arr){
            if (arr.hasOwnProperty(item)){ // To exclude methods and other things of the object

                var value = arr[item];

                if(typeof(value) == 'object'){
                    dumped_text += level_padding + "'" + item + "' ...\n";
                    log2("item:"+item)
                    dumped_text += item ; //mydump(value,level+1);
                }else{
                    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                }
            }
        }
    }else{
        log2("ZZZZZ");
        dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    
        log2("END    ")
    return dumped_text;
}

function clone_object(srcInstance){
//    log2("clone_object")
    return JSON.parse(JSON.stringify(srcInstance));
//    log2("clone_object")
//    /*Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne*/
//    if(typeof(srcInstance) != 'object' || srcInstance == null)
//    {
//        return srcInstance;
//    }
//
//    //log2("CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE CLONE")
//
//    /*On appel le constructeur de l'instance source pour créer une nouvelle instance de la même classe*/
//    var newInstance = srcInstance.constructor();
//    /*On parcourt les propriétés de l'objet et on les recopie dans la nouvelle instance*/
//    for (var i in srcInstance)
//    {
//        //if (srcInstance.hasOwnProperty(i))
//            newInstance[i] = clone_object(srcInstance[i]);
//    }
//    /*On retourne la nouvelle instance*/
//    return newInstance;
}

/*
Object.prototype.clone = function() {
    var fn = function (o, cloner){
        if(o == null || typeof(o) != 'object') return o
        var no = new o.constructor()
        Object.keys(o).forEach(function(e){this[e] = cloner(o[e], cloner)},no)
        return no;
    }
    return fn(this, fn)
}
*/
/*
function clone_object(o)
{
    return createo.clone();
}
*/

//record_robot_move_problem(120);

function check_custom_raws_reception(){
    //if (g_env_case=="local") log2("--check_custom_raws_reception()")

    g_custom_raw_list.each(function(raw, index){
        var diff=Number(get_time()-raw.raw_timestamp);
        log2("check_cstm_r_rec Stored msg r_id:"+raw.raw_id+" r.rw_name:" + raw.raw_name+" pg_ctr:"+raw.page_counter+" age:"+diff + " rw.rw_dtls.mv_nmbr:" + raw.raw_details.move_number)

        if (raw.page_counter!=g_page_counter[raw.user_id]){
            // Too old a message, we cancel it
            log2("ERASE OLD MSG PAGE HAS CHANGED raw.raw_id:"+raw.raw_id);
            g_custom_raw_list.erase(index);
        }else if (diff>45000){ // If message is too old, we erase it in the lost message queue.

            // Too old a message, we cancel it
            log2("ERASE OLD MSG");
            g_custom_raw_list.erase(index);
        }else if (diff>3000){
            log2("RESEND MSG:"+raw.raw_id);

            log2("r_id:"+raw.raw_id+" r.rw_name:" + raw.raw_name+" rw.raw_details:" + raw.raw_details+" raw.rw_dtils.mv_nmbr:" + raw.raw_details.move_number+" r.r_tmstmp:" + raw.raw_timestamp)
            log2("raw.pubid_player:"+raw.pubid_player)   
            // We dump the raw_details that we are resending
            log2(mydump(raw.raw_details));

            //var pipe_player=Ape.getPipe(raw.pubid_player)
            var ret=send_custom_raw_once(raw.pubid_player, raw.user_id, raw.raw_name, raw.raw_details, raw.raw_id);
            if (ret=="USER_HAS_NO_PIPE"){
                // We won't send it again! The user is not logged in anymore!
                log2("ERASE MSG CAUSE USER HAS NO PIPE")
                g_custom_raw_list.erase(index);
            }
        }else{
            //log2("NEW MESSAGE NO RESEND raw_id:"+raw_id);
        }
    });
}

/*
function close_inactive_games(){   
    for (var mc in g_matches){
        if (g_matches.hasOwnProperty(mc)){
           log2("mc:"+mc);
        }
    }
}
*/

function init_raw_and_cmd_ids(user_id){
    log2("iraci() uid:"+user_id);
    
    g_array_raw_id_counter[user_id]=0;
    //log2("g_array_raw_id_counter[user_id]:"+g_array_raw_id_counter[user_id]);

    g_array_cmd_id_counter[user_id]=0;
    //log2("g_array_cmd_id_counter[user_id]:"+g_array_cmd_id_counter[user_id]);
    
    g_cmd_id_received[user_id]={}; // Reinit the array // True if already received

    // We increment g_page_counter for every new page that connects to the APE server
    if (g_page_counter[user_id]==undefined) g_page_counter[user_id]=0;
    g_page_counter[user_id]++;

    if (g_page_counter[user_id]==10) g_page_counter[user_id]=1; // We don't want to have to big a page_counter. Because this make the index too big. So we reset at 1 after 9.

//    log2("g_page_counter[user_id]:"+g_page_counter[user_id]);
}

function index_user_id_raw_id(raw_id,user_id,page_ctr){ // If page_ctr is filled, it means that the info comes from the client. This is necessary as the raw_id is not enough to define a raw
    if (page_ctr==0) page_ctr=g_page_counter[user_id];
    //log2("ind user_id:"+user_id)
    //log2("ind user_id:"+Number(user_id));
    //
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL    
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // BE CAREFUL
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // The index must not be too big (something like 1E15). Otherwise it is rounded.
    // raw_id has 99999 max (5 digits)
    // page_counter is 9 max (1 digit)
    // user_id is 99 999 999 max (8 digits)
    return 10000000000*Number(raw_id) + 100000000*Number(page_ctr) + Number(user_id);
    // We put Number above because in some cases, the user_id was probably considered as a string (coming from ACK_RECEIPT)
    // In any case the index was giving something like 18000043000000000 & 101000 ie the two bits were not added but concatenated!!!
}

Ape.registerCmd("GOLD_PURCHASED", false, function(params, info){
    var user_id=params.user_id;
    var amount_gold_purchased=params.amount_gold_purchased;
    log2("GOLD_PURCHASED user_id:"+user_id+" gold_purchased:"+amount_gold_purchased);
    
    var pubid=g_last_pubid[user_id];
    log2("pubid:"+pubid);
    if (pubid!=null){
        log2("sending info to player that gold has been purchased and should be credited.")
        send_custom_raw(pubid, user_id, "gold_purchased",{"amount":amount_gold_purchased});
    }
});

Ape.registerCmd("LIKE_MSG", true, function(params, info){
    // It is possible for someone to like a message several times or his own message. 
    // These cases are only prevented on the client side, not on the server side.
    var user=info.user;
    var user_id=user.user_id;
    var liker_user_name=info.user.name;
    var pubid=info.user.getProperty("pubid");
    
    var channel_name=params.channel_name;
    var msg_id=params.msg_id;
    
    // Authenticate user
    if (authenticate_user(user)!=1) return authenticate_user(user);
    // Check command reception
    if (check_command_reception(user,params.cmd_id,params.page_counter)==false) return;
    
    log2("LIKE_MSG?? channel_name:"+channel_name+" msg_id:"+msg_id +" liker_id:"+user_id);
    
    store_msg_like(msg_id,channel_name,user_id,liker_user_name);

    // Now let the channel know about the reward!
    log2("liker_user_name:"+liker_user_name);
    send_raw_to_channel(channel_name,"msg_got_like",{"msg_id":msg_id,"channel_name":channel_name,"liker_id":user_id,"liker_user_name":liker_user_name});
});

Ape.registerCmd("ADMIN_CHAT_REWARD_MESSAGE", true, function(params, info){
    var user=info.user;
    var user_id=user.user_id;
    var pubid=info.user.getProperty("pubid");
    
    var admin_reward=params.admin_reward;
    var channel_name=params.channel_name;
    var msg_id=params.msg_id;
    var msg_sender_id=params.msg_sender_id;
    
    log2("ADMIN_CHAT_REWARD_MESSAGE reward:"+admin_reward +" channel_name:"+channel_name+" msg_id:"+msg_id +" msg_sender_id:"+msg_sender_id);

    if (check_admin_permission("chat_reward",user_id)){
        if (admin_reward>1000) {
            send_custom_raw(pubid, user_id, 'admin_error', {"error":"The server says: Amount error!"});
        }
        else{
        
            // We update the single_chat object for that message (if it still exists in history).
            var msg_id_in_history=g_single_chats_id_in_history[msg_id];
            log2("msg_id_in_history:"+msg_id_in_history);
            var sc=g_chat_history[channel_name][msg_id_in_history];
            log2("sc:"+mydump(sc));
            
            if (sc!=null){
                sc.admin_reward+=admin_reward;
            }else log2("Message rewarded is not in history anymore!");

            // We really credit the gold and save the news in new format
            Mysql_credit_gold(msg_sender_id,admin_reward,"admin_chat_reward_message",{"chat_msg_id":msg_id});
            
            Mysql_store_msg_reward(msg_id,admin_reward);
            
            // We let the admin know that we have been able to do the action.
            send_admin_action_completed(pubid, user_id,"The reward has been given!");
            //send_custom_raw(pubid, user_id, 'admin_action_completed', {"msg":"The reward has been given!"});

            // Now let the channel know about the reward!
            send_raw_to_channel(channel_name,"msg_got_admin_reward",{"msg_id":msg_id,"channel_name":channel_name,"admin_reward":admin_reward});
            //var channel=Ape.getChannelByName(channel_name);        
            //channel.pipe.sendRaw("msg_got_admin_reward",{"msg_id":msg_id,"channel_name":channel_name,"admin_reward":admin_reward});
        }
    }
    else {  
        send_does_not_have_admin_permission(pubid, user_id)
        //return {name: "admin_error", data:{"error":"You don't have permission to do that. You are not an admin for that!"}};
    }
    //return {res: "maintenance_mode",data:{value:"OK"}};
});

Ape.registerCmd("ADMIN_CHAT_BAN_USER", true, function(params, info){
    var user=info.user;
    var user_id=user.user_id;
    var pubid=info.user.getProperty("pubid");

    var banned_user_id=params.banned_user_id;
    var ban_nb_of_hours=params.ban_nb_of_hours;
    var channel_name=params.channel_name;
    log2("channel_name:"+channel_name);
    
    log2("ADMIN_CHAT_BAN_USER?? banned_user_id:"+banned_user_id);

    if (check_admin_permission("chat_ban_user",user_id)){
        if (false) { //admin_reward>1000) {
            //send_custom_raw(pubid, user_id, 'admin_error', {"error":"The server says: Amount error!"});
        }
        else{
            // We update the single_chat object for that message (if it still exists in history).
            //var msg_id_in_history=g_single_chats_id_in_history[msg_id];
            //var sc=g_chat_history[channel_name][msg_id_in_history];
            //if (sc!=null){
            //    sc.admin_reward+=admin_reward;
            //} else log2("Message rewarded is not in history anymore!")

            // We ban the user and save the news in new format
            Mysql_ban_user(banned_user_id, user_id, ban_nb_of_hours);

            // We let the admin know that we have been able to do the action.
            send_admin_action_completed(pubid, user_id,"The user has been banned!");

            // Now let the channel know about the ban!
            send_raw_to_channel(channel_name,"chat_user_banned",{"banned_user_id":banned_user_id,"channel_name":channel_name});
            // For the moment we ban for all channels not one specifically, but we send the info that is needed.
            //var channel=Ape.getChannelByName(channel_name);        
            //channel.pipe.sendRaw("chat_user_banned",{"banned_user_id":banned_user_id,"channel_name":channel_name}); 
        }
    }
    else {  
        send_does_not_have_admin_permission(pubid, user_id)
        //return {name: "admin_error", data:{"error":"You don't have permission to do that. You are not an admin for that!"}};
    }
    //return {res: "maintenance_mode",data:{value:"OK"}};
});


Ape.registerCmd("ADMIN_CHAT_DELETE_MESSAGE", true, function(params, info){
    var user=info.user;
    var user_id=user.user_id;
    var pubid=info.user.getProperty("pubid");
    
    var channel_name=params.channel_name;
    var msg_id=params.msg_id;
    var sender_user_id=params.sender_user_id;
    
    log2("ADMIN_CHAT_DELETE_MESSAGE?? channel_name:" +channel_name+" msg_id:"+msg_id+ " sender_user_id:"+sender_user_id);

    if (check_admin_permission("chat_delete_msg",user_id)){
        // We update the single_chat object for that message (if it still exists in history).
        var msg_id_in_history=g_single_chats_id_in_history[msg_id];
        log2("msg_id_in_history:"+msg_id_in_history);
        var sc=g_chat_history[channel_name][msg_id_in_history];
        log2("sc:"+mydump(sc));
        
        if (sc!=null){
            sc.deleted=1;
        } else log2("Message deleted is not in history anymore!")

        // We really credit the gold and save the news in new format
        Mysql_delete_msg(msg_id,user_id,sender_user_id);

        // We let the admin know that we have been able to do the action.
        send_admin_action_completed(pubid, user_id,"The message has been deleted!");

        // Now let the channel know about the deletion!
        send_raw_to_channel(channel_name,"msg_got_deleted",{"msg_id":msg_id,"channel_name":channel_name});
        //var channel=Ape.getChannelByName(channel_name);        
        //channel.pipe.sendRaw("msg_got_deleted",{"msg_id":msg_id,"channel_name":channel_name});
    }
    else {  
        send_does_not_have_admin_permission(pubid, user_id)
    }
    //return {res: "maintenance_mode",data:{value:"OK"}};
});

function send_does_not_have_admin_permission(pubid, user_id){
    send_custom_raw(pubid, user_id, 'admin_error', {"error":"You don't have permission to do that. You are not an admin for that!"});
}
function send_admin_action_completed(pubid,user_id,msg_to_admin){
    send_custom_raw(pubid, user_id, 'admin_action_completed', {"msg":msg_to_admin});
}
function check_admin_permission(cas,user_id){
    return g_user_info[user_id]["admin"][cas]; // 1 if admin for that, 0 if not.
}
//record_robot_move_problem(121);


//////////////////
//  kill link   //
//////////////////
// On tue le lien avec APE si ça dure trop longtemps sans activité

/*
function set_timer_kill_link(mc)
{
    // We do not send kill_link anymore!!!
    // So no need to set them at all
    // The window disconnects itself after some time.
    //
    //
    //
    //
    //log2("code unplugged - set_timer_kill_link mc:"+mc);

    //Ape.clearTimeout(g_timer_kill_link[mc]);
    //g_timer_kill_link[mc]=Ape.setTimeout(function(){kill_link(mc)},180000);
}
*/

/*
function kill_link(mc)
{
    if (g_load_test==false) log2("kill_link mc:"+mc);

    var user_ids=g_chat_user_ids[mc];
    var pubids=g_chat_pubids[mc];

    if (user_ids==null) return;
    if (pubids==null) return;

    for (var i=1;i<=2;i++)
    {
        if (!user_id_is_robot(user_ids[i]))
        {
            if (g_load_test==false) log2("ENVOI KILL_LINK to player "+i);
            if (pubids[i]!=null)
            {
                if (Ape.getPipe(pubids[i])!=null)
                {
                    log2("ENVOI kill_link TO PLAYER match_id:"+mc);
                    send_custom_raw(Ape.getPipe(pubids[i]), user_ids[i], "kill_link", {"match_id":mc});
                }
            }
        }
    }

    delete (g_chat_pubids[mc]);
    delete (g_chat_user_ids[mc]);
}
*/

function mouchard(texte){
    if (g_env_case=="local") log2(texte);
}
function mouchard_in_pile_deck_logic(chaine){
    // Nothing!!
}

// Used in CTW_game (Number.IsInteger does not exist in APE).
Number.isInteger = function isInteger(x){
    return +x===(+x - (+x %1));
}

// Can we play with bots online?
// A specific bot?
// This function is duplicated in index_bot_functions.js. Because it is slightly different than the server one there.
function can_play_with_a_specific_bot_online(game_id,bot_id){
    return can_play_with_a_specific_bot_online_base(game_id,bot_id,g_game_info[game_id].game_solo)
}