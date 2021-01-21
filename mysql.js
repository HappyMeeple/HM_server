g_global_object=this;

g_all_has_been_loaded_we_can_register=false;

g_chat_history={}; // Stores all single_chat objects (but deletes some to keep only the latest 1000)
g_chat_msg_counter={}; // Stores the number of messages in the channel
g_max_number_of_messages_in_chat=100;

g_single_chats_id_in_history={};

g_one_to_one_chats={}; // Stores all one_to_one chats for each user (with the other player id and his user_name)
// Basically says that a user is connected to a chat (and he also gets reconnected when offline when he receives a message, which means this indicates that we need to open a chat window to read it).
g_last_pubid={}; // stores the last pubid of each user so that we can finally send something to a user if needed just by knowing its user_id. Just check that it is not null before sending anything.
      
g_channel_list={};
g_channels_counter=0; // This is equivalent to g_channel_list.length? No?
//g_channel_user_counter={};

g_channel_latest_activity={};
g_last_login={};
g_chat_history_loaded={};

g_channel_list_of_users={}; // List of users connected to a channel

//connect to MySQL Server
/*
* You must specify a user and password, mysql module does not support yet connecting with a user without password. /!\
*/

/*if (load_test==true) g_shunt_mysql=true;
else */
g_shunt_mysql=false;

// Adding x hours to a Javacript date object.
/*
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
*/

function increase_g_server_ready(){
    g_server_ready++;
    log2("---");
    log2("PRELOADING FROM DATABASE : "+g_server_ready+ " steps are done.");
    log2("---");
    log2("SERVER_READY_TARGET:"+SERVER_READY_TARGET);
    if (g_server_ready>SERVER_READY_TARGET){
        for (var i=1;i<=25;i++) log2("ERROR SERVER_READY_TARGET is too small. Update defs.js immediately!!!");
    }
    else if (g_server_ready==SERVER_READY_TARGET){
        log2("PRELOADING FROM DATABASE OK!!!!!!!!!!!!!!!!!!!")
        log2("APE READY TO GO! MATCHES CAN START.")       
        log2("-----------------------------------------------------");

        // Checking global variable creation in any game file (we want to avoid it at all cost) 
//        check_no_global_variable();
//Ape.log(mydump(this));
        Ape.setTimeout(check_no_global_variable,50); //log2(mydump(this))

        g_all_has_been_loaded_we_can_register=true;
        // Testing memory load. 
        // g_user_info takes a lot of space (350 objects at the moment)
        // which means we cannot have more than 200-300 simultaneous users!!! 
        // APE would blow away if we had!
//        var nb_iterations=250;
//        for (var i=100101;i<=100101+nb_iterations;i++){
//            log2(i)
//            Mysql_get_user_infos_if_necessary(i,null);
//            //log2(i)
//        }
    
        /*
         * Testing mysql results. To see if the arrays and objects are "cloned" when results is finally received.
         * As calls are asynchronous, it is possible to call the same function several times with different arrays as parameters
         * When all call return finally, we want to make sure that the arrays are different each time not the last one only.
         * So it does not seem we have to worry anything.
        */
       /*
        var obj1={};
       obj1[1]="obj1"
       obj1[2]="to1";
       var obj2={};
       //var obj1=["obj1","to1"]
        //var obj2=["obj2","to2"]
        test(obj1);
        test(obj2);
        */

        /*
        var nb_users=1000;
        for (var user_id=100101;user_id<=100100+nb_users;user_id++){
            log2("user_id:"+user_id);
            Mysql_get_user_infos_if_necessary(user_id,user_id);
        }
        */
       //test_open_close_chat();

    }
}

function check_no_global_variable(){ // Because of the setTimeout calling this function, this is different from what it should be. So we pass it as a parameter... Dull but it works.
    log2("check_no_global_variable()");
//    log2("t1:"+mydump(this));
    log2(g_global_object);
//    log2(this);
//    log2(main_this);
    for (var game_id in g_game_info){
        var nom_class=g_game_info[game_id].game_short_name+"_Game";
        log2("Checking there is no global variable creation in "+nom_class);

        var previous_list_of_keys=Object.keys(g_global_object);
        var previous_nb_global_objects=previous_list_of_keys.length; 
  
        if (g_global_object[nom_class]){
//            Ape.log("ttttt");
            var g=new g_global_object[nom_class]("s",3,0,"local","local",1,1,2,false);
            
//            Ape.log("ttttt");
            g.game_start_game();
            var current_nb_global_objects=Object.keys(g_global_object).length;
            if (previous_nb_global_objects!=current_nb_global_objects){
                for (var key in Object.keys(g_global_object)){
                    if (Object.keys(g_global_object).hasOwnProperty(key)){
                        if (typeof previous_list_of_keys[key]=="undefined"){
                            for (var i=1;i<=100;i++){
                                log2("BEWARE!!! Global Variable -------"+Object.keys(g_global_object)[key]+"-------- created in "+nom_class);
                            }
                        }
                    }
                }
                previous_nb_global_objects=current_nb_global_objects;
            }
        }
    }
}

/*
g_test_counter=0;

function test_open_close_chat(){

     var nb_iterations=1000;
     var i_min=100000+g_test_counter*nb_iterations;
     for (var i=1;i<=nb_iterations;i++){
         add_one_to_one_chats_object(i_min+i,i_min+1+i,"toto");
     }
     for (var i=1;i<=nb_iterations;i++){
         delete_one_to_one_chats_object(i_min+i,i_min+1+i);
     }

    g_test_counter=g_test_counter+1;
    Ape.setTimeout(function(){test_open_close_chat()},50) // 1600  
}
*/

Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}
Date.createFromMysql = function(mysql_string){ 
   //log2(mysql_string)
   if(typeof mysql_string === 'string'){
      var t = mysql_string.split(/[- :]/);

      //when t[3], t[4] and t[5] are missing they defaults to zero
      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }

   return null;   
}


function Mysql_try_to_reconnect(sql_con_id){
    log2("Mysql_try_to_reconnect() sql_con_id:"+Mysql_try_to_reconnect);
    
//    if (g_ape_interval_ping_mysql[sql_con_id]!=null){
//        log2("Ape.clearInterval(g_ape_interval_ping_mysql[sql_con_id] sql_con_id="+[sql_con_id]);
//        Ape.clearInterval(g_ape_interval_ping_mysql[sql_con_id])
//    }
    
//    if (!sql.currently_trying_to_connect)
    MySQLConnect(sql_con_id);
}

function MySQLConnect(sql_con_id){
    log2("MySQLConnect() sql_con_id:"+sql_con_id);
    
    // Warning the port 3306 of the IP is added below.
    // Maybe we need to modify this.
    if (sql_con_id==SQL_ALL){
        var ip= g_mysql_ip;
        var user= g_mysql_user;
        var password= g_mysql_password;
        var database= g_mysql_database;
    }else if (sql_con_id==SQL_CHAT){
        var ip= g_mysql_ip;
        var user= g_mysql_user;
        var password= g_mysql_password;
        var database= g_mysql_database;
    }else{
        
        var ip= g_mysql_ip;
        var user= g_mysql_user;
        var password= g_mysql_password;
        var database= g_mysql_database;
//        
//        log2("sql_con_id:"+sql_con_id);
//        log2("No database defined in MySQLConnect()!!");
//        log2("No database defined in MySQLConnect()!!");
//        log2("No database defined in MySQLConnect()!!");
//        log2("No database defined in MySQLConnect()!!");
//        log2("No database defined in MySQLConnect()!!");
//        return;
    }
    /*log2(ip);
    log2(user);
    log2(password);
    log2(database);*/
    
    // Test too many connections. We generate 200 connections and that stops Mysql from working!
    // But this is very DANGEROUS, we don't want to send this to prod or staging.
    /*
    g_sql=[];
    for (i=1;i<=200;i++){
        g_sql[i] = new Ape.MySQL(ip + ":3306", user, password, database);

        
        //onConnect callback
        g_sql[i].onConnect = function()
        {
            log2('You are now connected to MySQL server: '+i);
            return;
        }
    }
    */
   
    if (g_sql_con[sql_con_id]) delete(g_sql_con[sql_con_id]); // We delete previous connection. It won't be able to ping or do anything else for the moment.
    
    var sql = new Ape.MySQL(ip + ":3306", user, password, database);
    g_sql_con[sql_con_id]=sql;
    sql.currently_trying_to_connect=true;
    
    sql.sql_con_id=sql_con_id;
    sql.ip=ip;
    sql.user=user;
    sql.password=password;
    sql.database=database;
        
    g_ping_counter[sql_con_id]=0;
    g_query_counter[sql_con_id]=0;
    g_last_mysql_ping_timings[sql_con_id]={};
    g_last_mysql_query_timings[sql_con_id]={};
    g_last_query_returned[sql_con_id]=0;
    
//    g_ape_interval_ping_mysql[sql_con_id]=null;
    
//    g_sql[sql_con_]
//    Ape.log("sql object a:"+mydump(sql));
    
    //onError callback // This triggers when a query fails because the connection has been lost. But also when the connection failed.
    sql.onError = function(errorNo){
        log2('CONNECTION error ' + errorNo +' '+ this.errorString()+" sql_con_id:"+sql.sql_con_id);
        
        delete(sql);
        sql=null;
        
        if (errorNo==13){ // Error when connecting
            Ape.setTimeout(function(){Mysql_try_to_reconnect(sql_con_id)},5000); // We don't make it more often, because otherwise each generated connection uses extra memory until the server crashes.
        }else{
//            log2("errorNo!=13. We do not try to reconnect")
            Ape.setTimeout(function(){Mysql_try_to_reconnect(sql_con_id)},5000); // We don't make it more often, because otherwise each generated connection uses extra memory until the server crashes.
//            Ape.setTimeout(function(){Mysql_try_to_reconnect(sql_con_id)},200);
//            log2(("this.currently_trying_to_connect:"+this.currently_trying_to_connect));
//            if (!sql.currently_trying_to_connect){
//                MySQLConnect(sql_con_id);
//                // Ape.setTimeout(function(){MySQLConnect(sql_con_id)},200);
//            }
        }
    }
    
    sql.onConnect = function(){
        log2('You are now connected to MySQL server sql_con_id:'+sql_con_id);
        
        sql.currently_trying_to_connect=false;
        
        g_ape_interval_ping_mysql[sql_con_id] = Ape.setInterval(function(){
                    ping_mysql(sql_con_id);
//                    log2("TOTOT test");
//                    sql.query("SLEECT fqsdfsqd",function(res, errorNo){
//                        if erro
//                    })
        }, 50000); // Was 50s before 31/03/2020
        
//        Ape.log("sql object b:"+mydump(sql));
// Testing send_news_in_new_format()
//        var news_details=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
//            news_details["gold"]=9999;
//            news_details["referal_case"]="testing case with ' and "+'"'+'toto';
//            news_details["refered_player_id"]=999999;
//        send_news_in_new_format("gold_earned_by_refering_test",news_details,1999999, 0);
            
        //sql.query('SELECT 1',);
//        sql.query('SELECT 1', function(res, errorNo){
//            if (errorNo == 8){
//                log2(print_time());
//                log2("errorNo = 8 dans ping_mysql()");
//                //Something went wrong, connection has been closed
//
//                delete(sql);
//                sql=null;
//                delete(sql);
//
//                //sql =  MySQLConnect(ip, user, password, database); // Reconnect to MySQL Server
//            }
//            else if (errorNo) log2("ERROR in onConnect - SELECT 1 errorNo:"+errorNo+" - "+this.errorString());
//        }
//        );

        query(sql_con_id, "SET NAMES 'utf8'",function(res, errorNo){
//            if (errorNo) log2("ERROR in onConnect - SET NAMES 'utf8' errorNo:"+errorNo+" - "+this.errorString());
        }
        );

//        var first_database_connection=g_first_database_connection;
        if (g_first_database_connection==true && sql_con_id==SQL_ALL){
            Mysql_get_last_match_id();
            Mysql_get_games_info(true);
            Mysql_get_robots_info();
            g_first_database_connection=false;
        }
        
        /*
        // Test de charge en ouvrant x parties d'un jeu.
        g_arr={}
        var nb_iterations=10000;
        for (var i=1;i<=nb_iterations;i++){
            g_arr[i]=new SC_Game("s",1,i,"local","local",0,1,2,false);
        }
        */
       
        /*var user_1=new Object();
        user_1.name="user_1";
        test(user_1);
        var user_2=new Object();
        user_2.name="user_2";
        test(user_2);*/
        // We don't load the chat history now. We will load it when the first user connects.
        //Mysql_get_chat_history("main_chat",null,null); // user,user_id, used only for one-on-one channels
    }

//    Ape.log("sql object a:"+mydump(sql));
    
    log2("End of MySQLConnect() sql_con_id:"+sql_con_id);
    //return sql;
}

//Set up a pooller to send keep alive request each 1 second //minute(s)
function ping_mysql(sql_con_id){
//    var sql_con_id=sql.sql_con_id;
    
    var sql=g_sql_con[sql_con_id];

    g_ping_counter[sql_con_id]++;
    var memory_ping_counter=g_ping_counter[sql_con_id]; // By the time the query is done, another ping might have started and the counter will have changed. We record it so that we can safely use it.
    if (g_load_test==false) log2("ping_mysql con_id:"+sql_con_id+" ping_cntr:"+g_ping_counter[sql_con_id]);
    
    var nb_max_pings=10;
    
    var start_time=get_time();
    
    
//    sql.onError = function(errorNo){
//        log2('Connection error ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ' + errorNo +' '+ this.errorString()+" sql_con_id:"+sql.sql_con_id);
//    }
    
    
//    Ape.log("sql object a:"+mydump(sql));
        
//    log2("sql object before sql.query(ping): sql_con_id:"+sql_con_id);//+mydump(sql));
    var chaine='SELECT '+g_ping_counter[sql_con_id];
    sql.query(chaine, function(res, errorNo){
        log2("ping done sql_con_id:"+sql_con_id);
        
//        if (errorNo!=0){
//            log2("ERROR ping errorNo:"+errorNo);
//            log2("ERROR ping errorNo:"+errorNo);
//            log2("ERROR ping errorNo:"+errorNo);
//            log2("ERROR ping errorNo:"+errorNo);
//            log2("ERROR ping errorNo:"+errorNo);
//        }
        var end_time=get_time();
        var diff=end_time-start_time;
        g_last_mysql_ping_timings[sql_con_id][memory_ping_counter]=diff;
        if (memory_ping_counter%nb_max_pings==0){
//            Ape.log("ping list of timings");
            var total_timings=0;
            for (var i=memory_ping_counter-nb_max_pings+1;i<=memory_ping_counter;i++){
                total_timings+=g_last_mysql_ping_timings[sql_con_id][i];
                Ape.log("g_last_mysql_ping_timings[sql_con_id][i]:"+g_last_mysql_ping_timings[sql_con_id][i])
            }
            var average_timing=total_timings/nb_max_pings;
            Ape.log("sql_con_id:"+g_ping_counter[sql_con_id]+" average ping_timings:"+average_timing);
            Ape.log("ping_timings:"+mydump(g_last_mysql_ping_timings[sql_con_id]));
            
            //g_ping_counter[sql_con_id]=0;
            g_last_mysql_ping_timings[sql_con_id]={};
        }
        
        if (errorNo){
            log2("errorNo:"+errorNo+ " dans ping_mysql() - something went wrong - MySQL connection closed. sql_con_id:"+sql_con_id);
        }
        //log2("ERROR in ping_mysql() "+chaine+" - errorNo:"+errorNo+" sql_con_id:"+sql_con_id);
    
// Don't ask for a reconnection following a ping
// Don't ask for a reconnection following a ping
// Don't ask for a reconnection following a ping
// Don't ask for a reconnection following a ping
// 
//        if (errorNo == 8){
////            log2(print_time());
//            log2("errorNo = 8 dans ping_mysql() - something went wrong - MySQL connection closed. sql_con_id:"+sql_con_id);
//            //Something went wrong, connection has been closed
//
////            delete(sql);
////            sql=null;
////            delete(sql);
////            
//            Mysql_try_to_reconnect(sql_con_id); //Reconnect to MySQL Server
//           
//        }else if (errorNo){
//            // In fact, the first failure is or can be errorNo=1.
//            log2("ERROR in ping_mysql() errorNo:"+errorNo+" "+chaine + " sql_con_id:"+sql_con_id+" memory_ping_counter:"+memory_ping_counter);
//        }
    }
    );
    log2("after ping: con_id:"+sql_con_id+" memory_ping_counter:"+memory_ping_counter);//mydump(sql));
}

function query(sql_con_id,chaine,fn){
    var sql=g_sql_con[sql_con_id];
    if (sql.currently_trying_to_connect){
        log2("Query aborted before even trying, the connection with the DB is not established for the moment. We are reconnecting.");
        return false;
    }
    g_query_counter[sql_con_id]++;
    var memory_query_counter=g_query_counter[sql_con_id]; // By the time the query is done, another ping might have started and the counter will have changed. We record it so that we can safely use it.
    
    log2("Qry S   con:"+sql_con_id+" cntr:"+memory_query_counter+" in queue:"+(memory_query_counter-g_last_query_returned[sql_con_id])); // + chaine?
    
    var nb_max_queries=10;
    
    var start_time=get_time();

//    Ape.log("sql object a:"+mydump(sql));
        
    sql.query(chaine, function(res, errorNo){
        
        var end_time=get_time();
        var diff=end_time-start_time;
        g_last_mysql_query_timings[sql_con_id][memory_query_counter]=diff;
        g_last_query_returned[sql_con_id]=memory_query_counter;
        log2("Qry OK  con:"+sql_con_id+" cntr:"+memory_query_counter+" timing: "+diff+"ms");
        if (diff>500){
            log2("Qry SLOW++ "+diff+"ms");
        }else if (diff>100){
            log2("Qry SLOW+ "+diff+"ms");
        }else if (diff>30){
            log2("Qry SLOW "+diff+"ms");
        }
        
        if (memory_query_counter%nb_max_queries==0){
//            Ape.log("ping list of timings");
            var total_timings=0;
            for (var i=memory_query_counter-nb_max_queries+1;i<=memory_query_counter;i++){
                total_timings+=g_last_mysql_query_timings[sql_con_id][i];
//                Ape.log("g_last_mysql_query_timings[sql_con_id][i]:"+g_last_mysql_query_timings[sql_con_id][i])
            }
            var average_timing=total_timings/nb_max_queries;
            Ape.log("con:"+g_ping_counter[sql_con_id]+" Average query timings: "+average_timing+"ms");
            Ape.log("query_timings:"+mydump(g_last_mysql_query_timings[sql_con_id]));
            g_last_mysql_query_timings[sql_con_id]={};
        }
        
        //log2("ERROR in ping_mysql() "+chaine+" - errorNo:"+errorNo+" sql_con_id:"+sql_con_id);
        
        if (errorNo == 1 || errorNo == 8){
//            log2(print_time());
            log2("ERROR in query - errorNo = "+errorNo+" dans query() - something went wrong - MySQL connection closed? sql_con_id:"+sql_con_id+ " Error:"+this.errorString());

            if (!sql.currently_trying_to_connect) Mysql_try_to_reconnect(sql_con_id); // Launching the reconnection to MySQL Server but only once. This is not completely water-proof. Suppose the connection is reestablished when an old query fails and arrives here.
           
        }else if (errorNo){
            // In fact, the first failure is or can be errorNo=1.
            log2("ERROR in query() errorNo:"+errorNo+" "+chaine + " sql_con_id:"+sql_con_id+" memory_query_counter:"+memory_query_counter+ " Error:"+this.errorString());
        }
        
        // Call the callback
        fn(res,errorNo);
    }
    );
    log2("Qry END con:"+sql_con_id+" cntr:"+memory_query_counter); // + chaine?
//    log2("After sql.query(ping): con_id:"+sql_con_id+" qry_cntr:"+memory_query_counter);//mydump(sql));
    
}
function Mysql_insert_match(match_type, match_id, game_id, player_ids, match_key, puzzle_id){
    log2("Mysql_insert_match() match_type:"+match_type+" - players_ids: "+player_ids+ " game_id: "+game_id+ " puzzle_id:"+puzzle_id)

    if (g_shunt_mysql) return;

    log2("Mim 1");
    var match_rating_1=get_user_rating(player_ids[1], game_id);
    log2("Mim 2");
    if (player_ids[2]!=0){
        var match_rating_2=get_user_rating(player_ids[2], game_id);
    }else match_rating_2=0; // Puzzle game
    log2("Mim 3");
    var chaine="INSERT INTO t_match(match_type, match_id,match_game_id, match_puzzle_id, match_player1_id, match_player2_id, match_rating_1, match_rating_2, match_timestamp,match_result,match_end_type, match_key) VALUES ("+match_type+","+match_id+","+game_id+","+puzzle_id+","+player_ids[1]+","+player_ids[2]+","+match_rating_1+","+match_rating_2+", CURRENT_TIMESTAMP,"+NOT_STARTED+","+END_MATCH_NOT_STARTED+","+match_key+")";

    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 1")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("Match inserted in DB");
            if (g_game_info[game_id].game_solo && match_type==MODE_FULL_PLAY){
                var g=g_matches[match_id];
                //log2("g.pubid[1]:"+g.pubid[1])
                send_custom_raw(g.pubid[1], g.player_id[1], "solo_match_accepted", {"match_id":match_id, "game_id":game_id});
            }
        }
    }
    );
}

function Mysql_insert_online_match(mode_of_play, g){
    log2("Mysql_insert_online_match()")
    
    g_nb_online_matches_since_server_started++;
    /*if (mode_of_play=="full_play") var mode=MODE_LOBBY_PLAY;
    else if (mode_of_play=="lobby_play") mode=MODE_LOBBY_PLAY;
    else {
        for (var i=1;i<=20;i++){
            log2("MISSING CASE IN Mysql_insert_online_match()");
        }
    }*/
    Mysql_insert_match(mode_of_play, g.match_id, g.game_id, g.player_id,0,0)
    g.mode_of_play=mode_of_play;
}

function Mysql_insert_training_match(match_id, game_id, player_id, match_key){ // player_id is an array of user_ids
    log2("Mysql_insert_training_match() match_id: "+match_id+" game_id: "+game_id);
    
    g_nb_training_matches_since_server_started++;
    for (var i=1;i<=NB_MAX_PLAYERS_PER_TABLE;i++){
        var user_id=player_id[i];
        if (user_id_is_human(user_id)){
            g_array_training_match_ids[user_id]=match_id;
        }
    }
    Mysql_insert_match(MODE_TRAINING, match_id, game_id, player_id, match_key,0)
    // g_matches[match_id].mode_of_play=MODE_TRAINING; // There is no such match! It has not been created in training!!
}

function Mysql_insert_puzzle_match(match_id, game_id, player_id, match_key, puzzle_id){ // player_id is an array of user_ids
    log2("Mysql_insert_puzzle_match() match_id: "+match_id+" game_id: "+game_id);
    
    g_nb_puzzle_matches_since_server_started++;
//    for (var i=1;i<=2;i++){
//        var user_id=player_id[i];
//        if (user_id!=0 && !user_id_is_robot(user_id)){
//            g_array_puzzle_match_ids[user_id]=match_id;
//        }
//    }

    var user_id=player_id[1];
    g_array_puzzle_match_ids[user_id]=match_id;
    Mysql_insert_match(MODE_PUZZLE, match_id, game_id, player_id, match_key, puzzle_id)
    // g_matches[match_id].mode_of_play=MODE_TRAINING; // There is no such match! It has not been created in training!!
}


function Mysql_update_result_match(match_id, match_key, result, match_end_type, playing_turn, match_score_1, match_score_2){
    log2("Mysql_update_result_match()");
    
    if (g_shunt_mysql) return;

    if (match_key!=0){
        // Training match
        var text_clause_where=" AND match_key="+match_key;
    }else{
        // Online match
        text_clause_where= "" ;
    }

    var chaine="UPDATE t_match SET match_playing_turn="+playing_turn + ", match_score_1="+ match_score_1 +",match_score_2="+match_score_2+", match_result = "+ result + ", match_length=TIME(SEC_TO_TIME(UNIX_TIMESTAMP(CURRENT_TIMESTAMP)-UNIX_TIMESTAMP(match_timestamp))), match_end_type= " + match_end_type + " WHERE match_id=" + match_id + text_clause_where ;
    // , match_rating_1="+ match_rating_1 +",match_rating_2="+match_rating_2+"
    
    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 2")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
                //log2("Query succeeded");
        }
    }
    );
}

function Mysql_update_stats_and_ratings_all_players(match_id, players, pubids, match_result, end_type, game_id, perf){ //user_id1, g.player_id[2], g.match_result, g.game_id, evolutions_rating)
    log2("Mysql_update_stats_and_ratings_all_players()")
    if (g_shunt_mysql) return;
    
    var evolutions_rating=new Array(2);
    
    var scores=new Array(2);
    var g=g_matches[match_id]; // Compute this now before g is deleted (beware below is asynchronous).
    for (var i=1;i<=2;i++){
        scores[i]=g.match_points[i];
    }

//    log2("game_rated:"+game_rated);
    log2("match_result:"+match_result);
    
    //game_rated=true;
//    if (game_rated==true){
        
    //
    // Solo games
    //

    log2("g_game_info[game_id].game_solo:"+g_game_info[game_id].game_solo);
    if (g_game_info[game_id].game_solo){
        log2("SOLO GAME");
//        log2("SOLO GAME");
//        log2("SOLO GAME");
//            log2("SOLO GAME");
//            log2("SOLO GAME");
//            log2("SOLO GAME");
//            log2("SOLO GAME");

        var pp=g_perf_param[game_id];
//            log2(mydump(pp));
//            var perf_base=pp.perf_base;
//            var perf_coef=pp.perf_coef;
//            var perf_min=pp.perf_min;
//            var perf_max=pp.perf_max;
        var perf_speed=pp.perf_speed;
        var nb_games_for_prosivional_rating=1/perf_speed; 
        // We will accelerate rating evolution for this number of games.

        //Mysql_update_rating(g.player_id[1], g.player_id[2], g.match_result, g.game_id, evolutions_rating)
        var chaine="SELECT okgame_user_id, okgame_rating, okgame_nb_of_rated_games FROM t_okgame WHERE okgame_user_id=" +players[1] +" AND okgame_game_id="+game_id;
//            log2(chaine);

//            log2("pl[1]:"+players[1])
        //log2("pts_plyr1:"+points_player1);

        var old_rating;
        var nb_of_games;

        query(SQL_ALL,chaine,function(res,errorNo){
            if (errorNo){
                log2("Error 3")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }else{
                //var compteur=0;
                res.each(function(data){

                    // Do not put var here or the variable will only be available in this sub-function not outside.
                    old_rating=data.okgame_rating;
                    nb_of_games=Number(data.okgame_nb_of_rated_games);
                })

                var ratio_nb_games=nb_of_games/nb_games_for_prosivional_rating;
                if (ratio_nb_games>1) var coef_evol_speed=1;
                else{
                    var coef_evol_speed_max=2.5; // The rating will evolve 2.5x faster for the first game.
                    coef_evol_speed=1+(coef_evol_speed_max-1)*(1-ratio_nb_games);
                }
//                    log2("perf_base:"+perf_base);
//                    log2("perf_coef:"+perf_coef);
//                    log2("perf_min:"+perf_min);
//                    log2("perf_max:"+perf_max);
//                    log2("perf_speed:"+perf_speed);
//                    log2("nb_of_games:"+nb_of_games);
//                    log2("nb_games_for_prosivional_rating:"+nb_games_for_prosivional_rating);
//                    log2("ratio_nb_games:"+ratio_nb_games);
//                    log2("coef_evol_speed:"+coef_evol_speed);

                var final_speed=coef_evol_speed*perf_speed;
                if (final_speed>0.3) final_speed=0.3 // Safety in case something is wrong (if perf_speed were bigger than 1/coef_evol_speed_max, we would have a problem as (1-final_speed) would be negative!!!)

                var new_rating=old_rating*(1-final_speed) +perf*final_speed;

                var evol=new_rating-old_rating;

                log2("final_speed:"+final_speed);
                log2("perf:"+perf);
                log2("evol:"+evol);
                log2("old_rating:"+old_rating);
                log2("new_rating:"+new_rating);

                // Beware!! This must be the same as the call 10 lines below and it can't be moved (factorisé plus bas) because of the asynchronous call)
                // Beware!! This must be the same as the call 10 lines below and it can't be moved (factorisé plus bas) because of the asynchronous call)
                // Solo game
                Mysql_update_stats_and_rating_player(match_id, 1, players[1], pubids[1], match_result, end_type, game_id, old_rating, evol, 0, scores[1]); //Beware voir au-dessus beware
            }
        });

    }else{

        //
        // 2-player games
        //   
        //Mysql_update_rating(g.player_id[1], g.player_id[2], g.match_result, g.game_id, evolutions_rating)
        var chaine="SELECT okgame_user_id, okgame_rating, okgame_nb_of_rated_games FROM t_okgame WHERE (okgame_user_id=" +players[1] + " OR okgame_user_id=" +players[2] +  ") AND okgame_game_id="+game_id;
        //log2(chaine);

        var ratio=new Array(2);
        var evol_temp=new Array(2)
        var rating=new Array(2);
        var nb_of_games=new Array(2);

        log2("pl[1]:"+players[1]+ " pl[2]:"+players[2]);

        if (match_result==1) var points_player1=2;
        else if (match_result==DRAW) points_player1=1;
        else points_player1=0;

//            log2("pts_plyr1:"+points_player1);

//            log2(chaine)
        query(SQL_ALL,chaine,function(res,errorNo){
            if (errorNo){
                log2("Error 3")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }else{
                //var compteur=0;
                res.each(function(data){
                    //compteur++;
                    if (data.okgame_user_id==players[1]){
                        rating[1]=data.okgame_rating;
                        nb_of_games[1]=Number(data.okgame_nb_of_rated_games);
                    }else if (data.okgame_user_id==players[2]){
                        rating[2]=data.okgame_rating;
                        nb_of_games[2]=Number(data.okgame_nb_of_rated_games);
                    }
                    /*if (load_test)
                    {
                        rating[1]=g_user_robot[players[1]].rating[game_id];
                        rating[2]=g_user_robot[players[2]].rating[game_id];
                    }*/
                })

                var expected_points_player1= 2*1 / (1 + Math.pow(10, (rating[2]-rating[1])/800));

                log2("rating[1]:"+rating[1]+" -- rating[2]:"+rating[2] + " -- expected_points_player1:"+expected_points_player1);

                var K_human = 14;
                if (g_load_test==true) var K_robot = 0.3  ;//0.3;
                else K_robot=0.3;

                if (user_id_is_robot(players[1])) var K1=K_robot; else K1=K_human;
                if (user_id_is_robot(players[2])) var K2=K_robot; else K2=K_human;

                evol_temp[1]= (points_player1 - expected_points_player1)
                evol_temp[2] = - evol_temp[1];
                evol_temp[1]= K1 * evol_temp[1];
                evol_temp[2]= K2 * evol_temp[2];
                
//                log2("nb_of_games[1]:"+nb_of_games[1]+ " --- nb_of_games[2]:"+nb_of_games[2])
                log2("evol_temp[1]:"+evol_temp[1]+ " --- evol_temp[2]:"+evol_temp[2])

                /*
                nb_of_games_prov=g_nb_of_games_provisional_rating[game_id];
                if (nb_of_games[1]<nb_of_games_prov) var ratio1= 1+(nb_of_games_prov-nb_of_games[1])/nb_of_games_prov;
                else ratio1=1;
                if (nb_of_games[2]<nb_of_games_prov) var ratio2= 1+(nb_of_games_prov-nb_of_games[2])/nb_of_games_prov;
                else ratio2=1;*/

                var nb_of_games_prov=g_nb_of_games_provisional_rating[game_id];
                for (var i=1;i<=NB_MAX_PLAYERS_PER_TABLE;i++){
                    if (nb_of_games[i]<nb_of_games_prov) ratio[i]= 1+1.5*(nb_of_games_prov-nb_of_games[i])/nb_of_games_prov;
                    else if (nb_of_games[i]>300) ratio[i]=0.83;
                    else if (nb_of_games[i]>100) ratio[i]=0.88;
                    else ratio[i]=1;

                    // Give a chance to weak players to come back quicker
                    if (rating[i]<=1200) ratio[i]*=1.6;
                    else if (rating[i]<=1300) ratio[i]*=1.3;
                    else if (rating[i]<=1400) ratio[i]*=1.15;
                }

//                // For certain games (with no AI to play against), we give bonus rating points for experience (6 points for the first 20 rated games for example for Cartographers)
//                for (var i=1;i<=NB_MAX_PLAYERS_PER_TABLE;i++){
//                    if (user_id_is_human[players[i]]){
//                        var rating_for_experience=get_bonus_rating_for_experience(game_id,nb_of_games[i])
//                        evol_temp[i]+=rating_for_experience;
//                        log2("rating_for_experience "+i+":"+rating_for_experience);
//                    }
//                }
                
                log2("nb_of_games[1]:"+nb_of_games[1]+ " --- nb_of_games[2]:"+nb_of_games[2])
                
                for (i=1;i<=NB_MAX_PLAYERS_PER_TABLE;i++){
                    evol_temp[i]=Math.round(evol_temp[i]*ratio[i]*100)/100;
                    
//                    log2("--------->>>players[i]:"+players[i]);
//                    log2("--------->>>user_id_is_human(players[i]):"+user_id_is_human(players[i]));
                    
                    if (user_id_is_human(players[i])){
                        var rating_for_experience=get_bonus_rating_for_experience(game_id,nb_of_games[i])
//                        log2("--------->>>");
//                        log2("--------->>>");
                        log2("------------>>> rating_for_experience "+i+":"+rating_for_experience);
//                        log2("--------->>>");
//                        log2("--------->>>");
                    }else rating_for_experience=0;
                    
                    evolutions_rating[i]=evol_temp[i]+rating_for_experience;
                }

                log2("evolutions_rating[1]:"+evolutions_rating[1]);
                log2("evolutions_rating[2]:"+evolutions_rating[2]);

                // Beware!! This must be the same as the call 10 lines below and it can't be moved (factorisé plus bas) because of the asynchronous call)
                // Beware!! This must be the same as the call 10 lines below and it can't be moved (factorisé plus bas) because of the asynchronous call)
                for (var i_player=1;i_player<=NB_MAX_PLAYERS_PER_TABLE;i_player++){
                    Mysql_update_stats_and_rating_player(match_id, i_player, players[i_player], pubids[i_player], match_result, end_type, game_id, rating[i_player], evolutions_rating[i_player],players[3-i_player], scores[i_player]); //Beware voir au-dessus beware
                }

            }
        });
    }
//    }else{
//        
//        // Game is not rated (not sure we ever go here)
//        
//        log2("test2")
//        evolutions_rating[1]=0;
//        evolutions_rating[2]=0;
//        
//        //
//        // Solo games (not sure we ever go here)
//        //
//        if (g_game_info[game_id].game_solo){
//            log2("players[1]:"+players[1]);
//            log2("pubids[1]:"+pubids[1]);
//            Mysql_update_stats_and_rating_player(match_id, i_player, players[1], pubids[1], match_result, end_type, game_id, game_rated, rating[i_player], evolutions_rating[1],players[2], scores[i_player]);
//        }else{
//            
//            //
//            // 2-player games
//            //   
//            for (var i_player=1;i_player<=NB_MAX_PLAYERS_PER_TABLE;i_player++){
//                // Beware!! This must be the same as the call 10 lines above and it can't be moved (factorisé plus bas) because of the asynchronous call)
//                // Beware!! This must be the same as the call 10 lines above and it can't be moved (factorisé plus bas) because of the asynchronous call)
//                Mysql_update_stats_and_rating_player(match_id, i_player, players[i_player], pubids[i_player], match_result, end_type, game_id, game_rated, rating[i_player], evolutions_rating[i_player],players[3-i_player], scores[i_player]);
//            }
//        }
//    }
    
    // We don't earn any food after a solo match.
    if (!g_game_info[game_id].game_solo){
        log2("match_result before Mysql_update_food_and_resources():"+match_result)
        // Food and resource update for a win or a draw
        for (i_player=1;i_player<=NB_MAX_PLAYERS_PER_TABLE;i_player++){
            Mysql_update_food_and_resources(i_player, players[i_player], match_result, game_id);
        }
    }
}

function Mysql_update_food_and_resources(i_player, user_id, match_result, game_id){
    log2("Mysql_updt_fd_and_res:"+i_player);

    if (user_id_is_robot(user_id)) return;

    log2("uid:"+user_id+" gid:"+game_id+" m_res:"+match_result);
    
    if (match_result==i_player){
        log2("1 - g_game_info[game_id].game_food_per_win:"+g_game_info[game_id].game_food_per_win)
        var food_gain=g_game_info[game_id].game_food_per_win;
    }else if (match_result==DRAW){
        log2("2 - g_game_info[game_id].game_food_per_win:"+g_game_info[game_id].game_food_per_win)
        food_gain=Math.ceil(g_game_info[game_id].game_food_per_win/2);
    }
    else return;

    if (food_gain!=0){
        var chaine="UPDATE t_user SET user_food=user_food+" + food_gain + " WHERE user_id="+user_id; // IF(user_food+"+food_gain+">user_storage,user_storage,user_food+" + food_gain +")

        log2 (chaine);
        query(SQL_ALL,chaine,function(res,errorNo){
            if (errorNo){
                log2("Error 4")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }else{

            }
        })
    }
}

function Mysql_update_stats_and_rating_player(match_id, i_player, user_id, pubid, match_result, end_type, game_id, old_rating, evolution_rating, opp_id, score){
    if (g_shunt_mysql) return;

    log2("Mysql_updt_stats_and_rtng_pl i_p:"+i_player+" uid:"+user_id + " m_res:"+match_result+" end_tp:"+end_type+" gid:"+game_id+" old_rtng:"+old_rating+" ev:"+evolution_rating+ " score:"+score);

    if (end_type==END_MATCH_NORMAL){
        var inc_full_match=1;
    }else{
        inc_full_match=0;
    }

    if (i_player==match_result) var inc_match_won=1; else inc_match_won=0;
    if (match_result==DRAW) var inc_match_drawn=1; else inc_match_drawn=0;

    ///////////////////////////////////
    // Storing # of wins, draws etc. //
    ///////////////////////////////////
    
    var chaine="UPDATE t_okgame SET okgame_nb_matches_played = okgame_nb_matches_played+1"
    
//    if (!g_game_info[game_id].game_solo){
        chaine+=", okgame_nb_matches_won = okgame_nb_matches_won+" + inc_match_won
        chaine+=", okgame_nb_matches_drawn = okgame_nb_matches_drawn+" + inc_match_drawn
//    }

    // for solo games, the result is always marked as a win (=1) in the database.
    if (end_type==END_MATCH_NORMAL || (inc_match_won==1 && !g_game_info[game_id].game_solo) ) var inc_match_played_for_belt=1; else inc_match_played_for_belt=0;
    chaine+=", okgame_nb_full_matches_played = okgame_nb_full_matches_played+" + inc_full_match
    if (!g_game_info[game_id].game_solo){
        chaine+=", okgame_nb_full_matches_won = okgame_nb_full_matches_won+" + inc_match_won*inc_full_match
        chaine+=", okgame_nb_full_matches_drawn = okgame_nb_full_matches_drawn+" + inc_match_drawn*inc_full_match
        chaine+=", okgame_nb_matches_won_for_belt = okgame_nb_matches_won_for_belt+" + inc_match_won
    }
    chaine+=", okgame_nb_matches_played_for_belt = okgame_nb_matches_played_for_belt+" + inc_match_played_for_belt
    chaine+=", okgame_best_online_score= GREATEST(okgame_best_online_score,"+score+")";


    /////////////////////
    // Successive wins //
    /////////////////////
    
    var longest_series_beaten=false;
    
    if (!g_game_info[game_id].game_solo){
        if (inc_match_won){
            chaine+=", okgame_nb_successive_wins = okgame_nb_successive_wins+1"

            if (user_id_is_human(user_id)){
                g_user_info[user_id][game_id]["successive_wins"]+=1;
                if (g_user_info[user_id][game_id]["successive_wins"]>g_user_info[user_id][game_id]["longest_series"]){
                    longest_series_beaten=true;
                    g_user_info[user_id][game_id]["longest_series"]=g_user_info[user_id][game_id]["successive_wins"];
                    chaine+=", okgame_longest_series = " + g_user_info[user_id][game_id]["longest_series"];
                }
            }
        }else{
            chaine+=", okgame_nb_successive_wins = 0"
            if (user_id_is_human(user_id)){
                g_user_info[user_id][game_id]["successive_wins"]=0;
            }
        }

        if (inc_match_won) chaine+=", okgame_nb_successive_matches_won_for_belt = okgame_nb_successive_matches_won_for_belt+" + 1
        else chaine+=", okgame_nb_successive_matches_won_for_belt = 0"
    }

    ////////////////////////////////////////////////////
    // Storing rating evolution, last match timestamp //
    // Resetting inactivity penalty
    ////////////////////////////////////////////////////

    chaine+=", okgame_rating=okgame_rating+("+ evolution_rating +"), okgame_nb_of_rated_games=okgame_nb_of_rated_games+1";
    chaine+=", okgame_last_online_match=CURRENT_TIMESTAMP";

    // Let's save the last timestamp when a match was completed for that game for that player (but only if this was a valid game.
    if (match_is_considered_played_for_rating(end_type)){
        chaine+=", okgame_last_match_completed_timestamp=CURRENT_TIMESTAMP";
        chaine+=", okgame_MEEPELO=okgame_rating, okgame_rating_malus=0" //  We update the MEEPELO too (note that because we placed okgame_MEEPELO=... after okgame_rating=..., it is the new okgame_rating that is used to update MEEPELO)
        // We also update the rating_malus to 0.
    }

    chaine+=" WHERE okgame_user_id=" + user_id + " AND okgame_game_id="+game_id;

    log2 (chaine);

    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 5")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            if (user_id_is_robot(user_id)){
                log2("evolution_rating:"+evolution_rating)
                log2("Number(evolution_rating):"+Number(evolution_rating))
                //log2(" eval(g_user_robot[user_id].rating[game_id]:"+ eval(g_user_robot[user_id].rating[game_id]+Number(evolution_rating)))
                var new_rating=Number(g_user_robot[user_id].rating[game_id])+Number(evolution_rating);
                log2("new_rating:"+new_rating);

                if (match_result==i_player) var resu="LOSS";
                else if (match_result==DRAW) resu="DRAW";
                else resu="WIN";
                log2("resu:"+resu);

                Mysql_record_win_vs_bot(opp_id, user_id, game_id, resu);
            }
            //log2("Query succeeded");
            if (user_id_is_human(user_id)) Mysql_check_awards(match_id, 2, user_id, pubid, game_id, null, old_rating, evolution_rating, (match_result==i_player))
        }
    }
    )

   /**********************************
   /* Update ratings in local array
   /**********************************/

   // We update the rating here 
   // This works for bots and for humans alike
   update_rating_locally(user_id, game_id, evolution_rating);

   //////////////////////////////
   // Successive wins? Bounty? //
   //////////////////////////////

   // Not for solo games.
   if (user_id_is_human(user_id) && inc_match_won && !g_game_info[game_id].game_solo){
       //
       // If the series is longer than 4, we give resources
       //
       // Even if it goes beyond 10 wins (unlike the achievement which stops at 10)
       //

       var bounty=0;

       var suc_wins=g_user_info[user_id][game_id]["successive_wins"];

       var bounty_for_series=false;

       // Was 8/12/16/20/etc.before 17/12/2019
       // Was 10/15/20/25 before 23/03/2017
       if (suc_wins==3){
           bounty_for_series=true;
           bounty=6; // 8 // 20 Gold
       }else if (suc_wins==4){
           bounty_for_series=true;
           bounty=6; //12; // 20 Gold
       }else if (suc_wins==5){
           bounty_for_series=true;
           bounty=6; // 16; // 20 Gold
       }else if (suc_wins==6){
           bounty_for_series=true;
           bounty=7; // 20;
       }else if (suc_wins==7){
           bounty_for_series=true;
           bounty=8; //30; // 20 Gold
       }else if (suc_wins==8){
           bounty_for_series=true;
           bounty=9;//40; // 20 Gold
       }else if (suc_wins>=9){
           bounty_for_series=true;
           bounty=10; //50; // 20 Gold
       }

       if (bounty_for_series==true){

           if (potion_is_active(user_id)){
               log2("Potion is active so we give no bounty.");
               bounty=0;
               var give_suc_wins_reward=false;
               var news_read_or_not=0;
           }else{
               log2("Potion is not active so we give bounty.");
               var give_suc_wins_reward=true;
               var news_read_or_not=0;
           }

            //var chaine_res_bounty="UPDATE t_user SET user_wood=user_wood+"+res_bounty[1]+",user_bricks=user_bricks+"+res_bounty[2]+",user_iron=user_iron+"+res_bounty[3]+",user_gold=user_gold+"+res_bounty[4]+" WHERE user_id="+user_id;
            var chaine_res_bounty="UPDATE t_user SET user_gold=user_gold+"+bounty+" WHERE user_id="+user_id;

            // We load these variables here and not after the query as res_bounty may change by the time the query is finished
            // Typical case: 5 consecutive wins is triggered also if 5 cons. wins for the 1st time. So it meant a bug in the display of the news.
            var news_typ_sw="successive_wins_bounty";
            //var news_details_sw="game_id;"+game_id+";successive_wins;"+suc_wins+";gold;"+bounty;
            var news_details_sw=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                 news_details_sw["game_id"]=game_id;
                 news_details_sw["successive_wins"]=suc_wins;
                 news_details_sw["gold"]=bounty;

            if (give_suc_wins_reward){
                 log2("Sending news when potion is not active.");
                 log2(chaine_res_bounty);
                 query(SQL_ALL,chaine_res_bounty,function(res,errorNo){
                     if (errorNo){
                         log2("Error 6");
//                         log2('Request error : ' + errorNo + ' : '+ this.errorString());
                     }else{
                         send_news_in_new_format(news_typ_sw, news_details_sw, user_id, news_read_or_not);  // This line is duplicated below (normal)
                     }
                 });
             }else{
                 log2("Sending news when potion is active.");
                 send_news_in_new_format(news_typ_sw, news_details_sw, user_id, news_read_or_not); // This line is duplicated above (normal)
             }
       }

       //
       //
       // If there is a new longest series, then we give him an achievement and reward the player accordingly
       //
       //

       var longest_series=g_user_info[user_id][game_id]["longest_series"];
       log2("longest_series:"+longest_series)

       if (longest_series_beaten && longest_series>=3){
           // At present, we reward the longest series from 3 consecutives wins
           // However, there is no reward above 10
           // Only a reward for the "repeated-achievement" (see above)

           var bounty_longest_series=0;
           var bounty_HP_longest_series=0;
           var bounty_for_longest_series=false;

           if (longest_series>=3){
               bounty_for_longest_series=true;
               bounty_longest_series=20;
               bounty_HP_longest_series=g_HP_gain_longest_series[longest_series]; 
           }

           if (bounty_for_longest_series==true){
                chaine_res_bounty="UPDATE t_user SET user_gold=user_gold+" + bounty_longest_series + ",user_HP=user_HP+" + bounty_HP_longest_series +" WHERE user_id="+user_id;
                log2(chaine_res_bounty);

                // We load these variables here and not after the query as res_bounty may change by the time the query is finished
                // Typical case: 5 consecutive wins is triggered also if 5 cons. wins for the 1st time. So it meant a bug in the display of the news.
                var news_typ_ls="achievement_longest_series";
                //var news_details_ls="game_id;"+game_id+";longest_series;"+longest_series+";gold;"+bounty_longest_series;
                var news_details_ls=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                     news_details_ls["game_id"]=game_id;
                     news_details_ls["successive_wins"]=longest_series;
                     news_details_ls["gold"]=bounty_longest_series;
                     news_details_ls["HP"]=bounty_HP_longest_series;

               query(SQL_ALL,chaine_res_bounty,function(res,errorNo){
                   if (errorNo){
                       log2("Error 7")
//                       log2('Request error : ' + errorNo + ' : '+ this.errorString());
                   }else{
                        send_news_in_new_format(news_typ_ls, news_details_ls, user_id, 0);
                   }
               });
           }
       }
    }
}

function Mysql_check_awards(match_id, typ, user_id, pubid, game_id, result_white_belt, old_rating, rating_change, match_won){
    // typ=0 after puzzle match
    // typ=1 after training match
    // typ=2 after online match
    
    log2("Mysql_check_awards()");
    
    if (g_shunt_mysql) return;

    var new_rating=Number(old_rating)+Number(rating_change);
    
    if (g_game_info[game_id].game_solo){
        if (typ==MODE_PUZZLE){
            var chaine="SELECT okgame_belt, bc_solo_stars, bc_solo_score, bc_solo_nb_scores, okgame_nb_matches_played_for_belt, bc_rating_min FROM t_okgame INNER JOIN t_belt_criteria ON bc_belt=okgame_belt AND bc_game_id=okgame_game_id WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;
        }else if (typ==MODE_TRAINING){
            var chaine="SELECT okgame_nb_of_offline_games, okgame_nb_of_offline_won_games, bc_nb_of_games, okgame_belt FROM t_okgame INNER JOIN t_belt_criteria ON bc_belt=okgame_belt AND bc_game_id=okgame_game_id WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;
        }else if (typ==MODE_FULL_PLAY){
            chaine="SELECT bc_solo_stars, bc_solo_score, bc_solo_nb_scores, bc_nb_of_games, bc_nb_of_wins,  okgame_belt, okgame_nb_matches_played_for_belt, okgame_nb_matches_won_for_belt, okgame_nb_successive_matches_won_for_belt, bc_rating_min, okgame_nb_of_rated_games FROM t_okgame INNER JOIN t_belt_criteria ON bc_belt=okgame_belt AND bc_game_id=okgame_game_id WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;
        }
    }else{ // Not a solo game
        if (typ==MODE_TRAINING){
            // Todo
            // Optimization possible
            // This test needs not be done if one knows that the player has already got the white belt
            // And this info can be passed from the client
            var chaine="SELECT okgame_nb_of_offline_games, okgame_nb_of_offline_won_games, bc_nb_of_games, okgame_belt FROM t_okgame INNER JOIN t_belt_criteria ON bc_belt=okgame_belt AND bc_game_id=okgame_game_id WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;
        }else if (typ==MODE_FULL_PLAY){
            // Ca peut être optimisé, on n'a pas besoin de tant de champs, non ?
            // Moreover, we could certainly put that info in an array linked to the user
            chaine="SELECT bc_nb_of_games, bc_nb_of_wins, bc_nb_of_successive_wins, okgame_belt, okgame_nb_matches_played_for_belt, okgame_nb_matches_won_for_belt, okgame_nb_successive_matches_won_for_belt, okgame_nb_of_offline_games, bc_rating_min, okgame_nb_of_rated_games FROM t_okgame INNER JOIN t_belt_criteria ON bc_belt=okgame_belt AND bc_game_id=okgame_game_id WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;
        }            
    }
    
    // TODO
    //Optimisation potentielle de la requête (* à remplacer)

    // TODO
    // Il faudrait également pour optimiser mettre dans un tableau les conditions d'obtention des ceintures

    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 8")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("chaine queried OK.")
            res.each(function(data){
                if (data.okgame_belt==15){
                    // No need to send any belt info if the user already has the max belt
                    // Wrong!! We need to send the rating evolution!!
                    // return;
                }
                
                var bc_nb_of_games=data.bc_nb_of_games
                var bc_nb_of_wins=data.bc_nb_of_wins
                var bc_nb_of_successive_wins=data.bc_nb_of_successive_wins
                
                var belt=false;
                //log2("data.okgame_nb_matches_played_for_belt:"+data.okgame_nb_matches_played_for_belt)
                //log2("data.okgame_nb_matches_played_for_belt+1.4*data.okgame_nb_matches_won_for_belt:"+eval(data.okgame_nb_matches_played_for_belt)+1.4*data.okgame_nb_matches_won_for_belt)
                //log2("data.bc_nb_of_games:"+data.bc_nb_of_games)

                if (typ==MODE_PUZZLE){ // Getting a low belt???
                    if (data.okgame_belt<=8){
                        Mysql_check_puzzle_awards_for_low_belts(pubid, user_id, game_id, typ, Number(data.okgame_belt), Number(data.bc_solo_stars), Number(data.bc_solo_score), Number(data.bc_solo_nb_scores),0,0);
                    }else belt=false;
                }else if (typ==MODE_TRAINING){ // Getting a white belt???
                    if (g_game_info[game_id].game_solo){ // Game is solo
                        // Nothing happens
                    }else{ // Game is not solo
                        log2("data.okgame_belt:"+data.okgame_belt);
                        log2("result_white_belt:"+result_white_belt);
                        if (data.okgame_belt==0){
                            if (result_white_belt=="WIN"){ // Give it if you can win one game! // || result_white_belt=="DRAW" (removed 05/12/2019 to be consistent with the text displayed on the belt windows which only speaks about a win)
                                belt=true;
                            }else if (data.okgame_nb_of_offline_games>=data.bc_nb_of_games){ // Or give it after x games.
                                belt=true;
                            }
                        }
                    }
                }else if (typ==MODE_FULL_PLAY){ // Getting another belt (white already there)
                    if (data.okgame_belt<=8){
                        
                        // Solo game (first belts)
                        if (g_game_info[game_id].game_solo){
                            
                            Mysql_check_puzzle_awards_for_low_belts(pubid, user_id, game_id, typ, Number(data.okgame_belt), Number(data.bc_solo_stars), Number(data.bc_solo_score), Number(data.bc_solo_nb_scores),old_rating,rating_change);
                            
                            //bc_solo_score, bc_solo_nb_scores
                            
                            // Nb of games OK?
//                            if (eval(data.okgame_nb_matches_played_for_belt)>=data.bc_solo_score){
//                                log2("true1");
//                                 // Rating OK?
//                                if (data.bc_rating_min<=new_rating){
//                                    log2("true2");
//                                    belt=true;
//                                }
//                            }
                        }else{
                            // 2-player games (first belts)
                            if (eval(data.okgame_nb_matches_played_for_belt)+1.4*data.okgame_nb_matches_won_for_belt>=data.bc_nb_of_games){
                                log2("true1")
                                //log2("data.okgame_nb_matches_played_for_belt+1.4*data.okgame_nb_matches_won_for_belt:"+data.okgame_nb_matches_played_for_belt+1.4*data.okgame_nb_matches_won_for_belt)
                                //log2("data.bc_nb_of_games:"+data.bc_nb_of_games)
                                //log2("data.bc_nb_of_games:"+data.bc_nb_of_games)

                                belt=true;
                            }else if (data.bc_nb_of_wins!=0 && data.okgame_nb_matches_won_for_belt>=data.bc_nb_of_wins){
                                log2("true2")
                                belt=true;
                            }else if (data.bc_nb_of_successive_wins!=0 && data.okgame_nb_successive_matches_won_for_belt>=data.bc_nb_of_successive_wins){
                                log2("true3")
                                belt=true;
                            }
                        }
                    }else{ // Black suit (belt) !
                        // We need the experience AND the min rating!!

                        //belt=false;

                        if (data.okgame_belt==15){ // We don't get a new meeple after black 6.
                            log2("Black meeple 6 already!!")
                        }
                        
                        // Solo after online match
//                        else if (g_game_info[game_id].game_solo){
//                            
//                            //Mysql_check_puzzle_awards_for_low_belts(pubid, user_id, game_id, typ, Number(data.okgame_belt), Number(data.bc_solo_stars), Number(data.bc_solo_score), Number(data.bc_solo_nb_scores),0,0);
//                            
//                            // Nb of games OK?
////                            if (eval(data.okgame_nb_matches_played_for_belt)>=data.bc_nb_of_games){
////                                log2("true1");
////                                 // Rating OK?
////                                if (data.bc_rating_min<=new_rating){
////                                    log2("true2");
////                                    belt=true;
////                                }
////                            }
//                        }
                        
                        else{ // Not last belt, but any other black belt
                            //
                            // Experience ok?
                            if (eval(data.okgame_nb_matches_played_for_belt)+1.4*data.okgame_nb_matches_won_for_belt>=data.bc_nb_of_games){
                                log2("true1")
                                //log2("data.okgame_nb_matches_played_for_belt+1.4*data.okgame_nb_matches_won_for_belt:"+data.okgame_nb_matches_played_for_belt+1.4*data.okgame_nb_matches_won_for_belt)
                                //log2("data.bc_nb_of_games:"+data.bc_nb_of_games)
                                //log2("data.bc_nb_of_games:"+data.bc_nb_of_games)
                                //var new_rating=1630;

                                // Rating min ok ?
                                if (data.bc_rating_min<=new_rating){
                                    log2("true2");
                                    //var rating_min=true;
                                    belt=true;
                                }
                            }
                        }
                    }
                }                
                
                // To force the belt, just for test purpose:
                //belt=true;
                
                if (typ==MODE_PUZZLE){
                    // We don't send the "belt" info just yet, we need to make some calls before...
                    // Done by calling Mysql_check_puzzle_awards_for_low_belts() above.
                }else{
                    // (typ==MODE_PUZZLE && data.okgame_belt<=8) ||
                    
                    if (typ==MODE_FULL_PLAY && data.okgame_belt<=8 && g_game_info[game_id].game_solo){
                        // Do nothing. "belt" will be sent via Mysql_check_puzzle_awards_for_low_belts() come later. See above.
                        
                    }else if ( (typ==MODE_TRAINING && data.okgame_belt==0 && !g_game_info[game_id].game_solo) || typ==MODE_FULL_PLAY){ // &&(!g_game_info[game_id].game_solo || data.okgame_belt>8)
                        log2("sndRaw dt.okgame_belt:"+data.okgame_belt);

                        //log2("sendRaw belt");
                        // This log gives an undefined in case typ=1
                        // And it seems that all things that are undefined in the sendRaw below are ignored (there are quite a few actually)
                        // It does not generate a bug, so it is fine (although worrying)
                        if (typ==MODE_FULL_PLAY) log2("data.okgame_nb_successive_matches_won_for_belt:"+data.okgame_nb_successive_matches_won_for_belt)
                        //pipe.sendRaw("belt", {"user_id":user_id,"game_id":game_id,'typ_connection':typ,'belt':belt,'nb_matches_played_for_belt':data.okgame_nb_matches_played_for_belt, 'nb_matches_won_for_belt':data.okgame_nb_matches_won_for_belt,'nb_successive_matches_won_for_belt':data.okgame_nb_successive_matches_won_for_belt, 'bc_nb_of_games':bc_nb_of_games,'bc_nb_of_wins':bc_nb_of_wins,'bc_nb_of_successive_wins':bc_nb_of_successive_wins, 'belt_before_match':data.okgame_belt, 'nb_of_offline_games':data.okgame_nb_of_offline_games, 'rating_min':data.bc_rating_min,'old_rating':old_rating, 'rating_change':rating_change,'nb_of_rated_games':data.okgame_nb_of_rated_games});
                        send_custom_raw(pubid, user_id,"belt", {
                            "match_id":match_id,
                            "user_id":user_id,
                            "game_id":game_id,
                            'typ_connection':typ,
                            'belt':belt,
                            'nb_matches_played_for_belt':data.okgame_nb_matches_played_for_belt,
                            'nb_matches_won_for_belt':data.okgame_nb_matches_won_for_belt,
                            'nb_successive_matches_won_for_belt':data.okgame_nb_successive_matches_won_for_belt,
                            'bc_nb_of_games':bc_nb_of_games,
                            'bc_nb_of_wins':bc_nb_of_wins,
                            'bc_nb_of_successive_wins':bc_nb_of_successive_wins,
                            'belt_before_match':data.okgame_belt,
                            'nb_of_offline_games':data.okgame_nb_of_offline_games,
                            'bc_rating_min':data.bc_rating_min,
                            'old_rating':old_rating,
                            'rating_change':rating_change,
                            'nb_of_rated_games':data.okgame_nb_of_rated_games});
                    }else{
                        //pipe.sendRaw("belt", {belt:"NO_DATA"});
                        send_custom_raw(pubid, user_id, "belt", {"match_id":match_id, "belt":"NO_DATA"});
                    }

                    if (belt==true){
                        Mysql_credit_meeple(user_id, game_id, data.okgame_belt);
                    }
                }
            });
            
            /////////////////////
            // Unlock bot??    //
            /////////////////////

            //
            // If the player has won the match, has he unlocked a new robot?
            //

            log2("match_won:"+match_won+" user_id:"+user_id+" user_id_is_robot(user_id):"+user_id_is_robot(user_id)+" new_rating:"+new_rating);
            
            // Not in solo games
            if (match_won && user_id_is_human(user_id) && !g_game_info[game_id].game_solo && can_play_with_at_least_one_bot_online(game_id)){
                log2("bot_unlock?????");
                var nb_bots_unlocked=g_user_info[user_id][game_id]['bot_unlocked'][0] ;//g_bots_unlocked[user_id][game_id][0];
                log2("nb_bots_unlocked:"+nb_bots_unlocked);

                if (nb_bots_unlocked<=11){
                    for (var i=1;i<=12;i++){
                        //log2("g_user_robot[i].rating[game_id]:"+g_user_robot[i].rating[game_id] +"unlocked:"+g_user_info[user_id][game_id]['bot_unlocked'][i]);

                        //log2("new_rating:"+new_rating)
                        //log2("new_rating>g_user_robot[i].rating[game_id]:"+new_rating>g_user_robot[i].rating[game_id])
                        
                        var threshold_rating_for_unlocking;
                        if (g_user_robot[i].rating[game_id]>1900) threshold_rating_for_unlocking=100;
                        else if (g_user_robot[i].rating[game_id]>1750) threshold_rating_for_unlocking=50;
                        else threshold_rating_for_unlocking=30;
                        
                        //if (g_bots_unlocked[user_id][game_id][i]==0 && new_rating>g_user_robot[i].rating[game_id])
                        if (g_user_info[user_id][game_id]['bot_unlocked'][i]==0 && new_rating>g_user_robot[i].rating[game_id]-threshold_rating_for_unlocking){
                            // Update the array containing the info
                            unlock_bot_in_array(user_id,game_id,i);
                                        
                            var chaine_update_bot_result="UPDATE t_bot_result SET br_unlocked=1 WHERE br_user_id="+user_id + " AND br_bot_id="+i+ " AND br_game_id="+game_id;
                            log2 (chaine_update_bot_result);

                            // We load these variables here and not after the query as res_bounty may change by the time the query is finished
                            // Typical case: 5 consecutive wins is triggered also if 5 cons. wins for the 1st time. So it meant a bug in the display of the news.
                            var news_typ_bu="bot_unlock";
                            //var news_details_bu="game_id;"+game_id+";bot_id;"+i;
                            var news_details_bu=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                                 news_details_bu["game_id"]=game_id;
                                 news_details_bu["bot_id"]=i;
                                 
                            query(SQL_ALL,chaine_update_bot_result,function(res,errorNo){
                                if (errorNo){
                                    log2("Error 11")
//                                    log2('Request error : ' + errorNo + ' : '+ this.errorString());
                                }else{
                                    // If there were several bots unlocked at the same time, then new_typ_bu and new_detail_bu would be incorrect (since only the last modification would be used here because of the delay of the request)
                                    send_news_in_new_format(news_typ_bu,news_details_bu,user_id, 0)
                                }
                            });
                            break;
                        }
                    }
                }
            }
        }
    }
    );
}

                            
function Mysql_check_puzzle_awards_for_low_belts(pubid, user_id, game_id, typ, old_belt, stars_needed, score_needed, nb_scores_needed, old_rating, rating_change){
    log2("Mysql_check_puzzle_awards_for_low_belts user_id:"+user_id+" game_id:"+game_id+" typ:"+typ+ " old_belt:"+old_belt+" stars_needed:"+stars_needed+ " score_needed:"+score_needed+ " nb_scores_needed:"+nb_scores_needed+" old_rating:"+old_rating+" rating_change:"+rating_change); //user_id, game_id, typ, old_belt, stars_needed, score_needed, nb_scores_needed, old_rating, rating_change
    
    var belt=false;
    
    if (stars_needed>0){
        var chaine_nb_stars="SELECT sum(pr_stars) as nb_stars FROM t_puzzle_result WHERE pr_user_id="+user_id+" AND pr_game_id="+game_id;
    
        // CHECK WHAT HAPPENS IF there is no line. Is sum defined as 0?)
        // Well it returns NULL
        // Well it returns NULL
        // Well it returns NULL
        // Well it returns NULL
        // Well it returns NULL
        // Well it returns NULL. See below.
    }else{
        var chaine_nb_stars="SELECT 0 as nb_stars"; // We don't need this info so we keep the query as simple as possible.
    }
            
    log2(chaine_nb_stars);

    query(SQL_ALL,chaine_nb_stars,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_check_puzzle_awards_for_low_belts 1")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());;

        }else{
            res.each(function(data){
                var nb_stars=data.nb_stars;
                if (nb_stars==null){
                    log2("WARNING! IS THIS NORMAL? data.nb_stars is NULL. nb_stars set at 0.");
                    nb_stars=0;
                }
                
                if (nb_stars>0 && nb_stars>=stars_needed){
                    belt=true;
                }

                if (nb_scores_needed>0){
                    var chaine_nb_scores_above_threshold="SELECT count(match_score_1) as nb_scores FROM t_match WHERE match_type=2 AND match_score_1>="+score_needed+" AND match_player1_id="+user_id+" AND match_game_id="+game_id;
                }else{
                    var chaine_nb_scores_above_threshold="SELECT 0 as nb_scores"; // We don't need to launch a complicated query. We don't really need this info.
                }
                // SELECT count(match_score_1) FROM t_match WHERE match_score_1>=60 AND match_player1_id=100105 AND match_game_id=502
                log2(chaine_nb_scores_above_threshold);
                query(SQL_ALL,chaine_nb_scores_above_threshold,function(res2,errorNo){
                    if (errorNo){
                        log2("Error Mysql_check_puzzle_awards_for_low_belts 2")
//                        log2('Request error : ' + errorNo + ' : '+ this.errorString());
                    }else{

                        res2.each(function(data){
                            var nb_scores=data.nb_scores;
                            if (nb_scores==null){
                                log2("WARNING! IS THIS NORMAL? data.nb_scores is NULL. nb_scores set at 0.");
                                nb_scores=0;
                            }else{
                                if (nb_scores_needed>0 && nb_scores>=nb_scores_needed){
                                    belt=true;
                                }
                                
                                if (belt==true){
                                    Mysql_credit_meeple(user_id, game_id, old_belt);
                                }
                                
                                // Send "belt" info.
                                send_custom_raw(pubid, user_id,"belt", {
                                    "user_id":user_id,
                                    "game_id":game_id,
                                    'typ_connection':typ,
                                    'belt':belt, 
                                    'belt_before_match':old_belt,
                                    'old_rating':old_rating,
                                    'rating_change':rating_change,
                                    'nb_stars':nb_stars,
                                    'bc_stars_needed':stars_needed,
                                    'bc_nb_scores':nb_scores,
                                    'bc_nb_scores_needed':nb_scores_needed,
                                    'bc_score_needed':score_needed
                                });
                            }
                        });

                    }
                });  
            });
        }
    });

}

function Mysql_credit_meeple(user_id, game_id, old_belt){

    log2("Mysql_credit_meeple() user_id:"+user_id+" game_id:"+game_id+ " old_belt:"+old_belt);
    
    var chaine_level=",okgame_level=50";
    // Addition from 27/02/2020.
    // Previously, g_user_info[user_id][game_id]["level"] was not changed here (only in the database).
    // It meant that if the player played a training game before the online game for solo games, the level was updated to 40, giving the player no change to upgrade to 50 anymore (solo games).
    // Then  meanrecorded at 40, meaning that next time they played a training match, 
    g_user_info[user_id][game_id]["level"]=50;
    
    // From now on, we give the right to play online as soon as you get the white meeple,
    
    // but also after an online match
    // Indeed we can now play an online match by invitation, which means we can get the white meeple without playing offline.
    // Conclusion: we need to put okgame_level at 50 in this case.
    // 
    // Same need for the solo games anyway.

    /*
    if (typ==1 || belt==true){
        // Now full play is available
        var chaine_level=",okgame_level=50";
    }else{
        chaine_level="";
    }
    */
    chaine="UPDATE t_okgame SET okgame_belt=okgame_belt+1, okgame_nb_matches_played_for_belt=0, okgame_nb_matches_won_for_belt=0, okgame_nb_successive_matches_won_for_belt=0" + chaine_level + " WHERE okgame_game_id="+game_id+" AND okgame_user_id="+user_id;

    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 10")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
//            var new_belt=eval(Number(data.okgame_belt)+1);
            var new_belt=eval(Number(old_belt)+1);
            g_user_info[user_id][game_id]["belt"]=new_belt;
            g_user_info[user_id]["meeples_count"]++;
            var nb_meeples=g_user_info[user_id]["meeples_count"];

            log2("sendRaw new_belt? :"+new_belt);

            var gold_earned=g_belt_prize[new_belt];
            var HP_earned=g_HP_gain_meeples[new_belt];

            log2("g_new_house_for_nb_meeples[nb_meeples]:"+g_new_house_for_nb_meeples[nb_meeples]);
            if (g_new_house_for_nb_meeples[nb_meeples]){ // && nb_houses<g_nb_houses_according_to_nb_meeples[nb_meeples]){
                // 
                // Check that the number of houses does not already exceed the number of houses required.
                var chaine_nb_houses="SELECT Count(house_id) as nb_houses FROM (SELECT house_id FROM t_building INNER JOIN t_house ON building_house_id1=house_id WHERE building_house_id1!=0 AND building_user_id="+user_id+
                        " UNION SELECT house_id FROM t_building INNER JOIN t_house ON building_house_id2=house_id WHERE building_house_id2!=0 AND building_user_id="+user_id+
                        ") as t";
                log2(chaine_nb_houses);
                query(SQL_ALL,chaine_nb_houses,function(res_nb_houses,errorNo){
                    if (errorNo){
                        log2("Error 10")
//                        log2('Request error : ' + errorNo + ' : '+ this.errorString());
                    }else{      
                        res_nb_houses.each(function(data){
                            
                            var nb_houses=data.nb_houses;
                            log2("current nb of houses: "+nb_houses);
                            
                            // This is the number of houses we will now have.
                            var house_counter=g_nb_houses_according_to_nb_meeples[nb_meeples];
                            log2("house_counter:"+house_counter);

                            if (nb_houses<house_counter){
                                var news_details_nb=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                                    news_details_nb["game_id"]=game_id;
                                    news_details_nb["new_belt"]=new_belt;
                                    news_details_nb["nb_meeples"]=nb_meeples;  
                                    news_details_nb["house_counter"]=house_counter;
                                send_news_in_new_format("new_house",news_details_nb,user_id,0);  
                            }else{
                                log2("SPECIAL CASE, we don't build a new house as the user has already more houses than necessary. Cause the criteria for houses has changed.")
                                log2("SPECIAL CASE, we don't build a new house as the user has already more houses than necessary. Cause the criteria for houses has changed.")
                                log2("SPECIAL CASE, we don't build a new house as the user has already more houses than necessary. Cause the criteria for houses has changed.")
                            }
                                
                        });
                    }
                });
            }

            // Send the news
            var news_details_nb=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                news_details_nb["game_id"]=game_id;
                news_details_nb["new_belt"]=new_belt;
                news_details_nb["nb_meeples"]=nb_meeples;  
                news_details_nb["gold"]=gold_earned;  
                news_details_nb["HP"]=HP_earned;  
            send_news_in_new_format("new_belt",news_details_nb,user_id,0);                      

            // Credit for gold and HP
            var chaine="UPDATE t_user SET user_gold=user_gold+"+gold_earned+",user_HP=user_HP+"+HP_earned+" WHERE user_id="+user_id
            log2(chaine);

            query(SQL_ALL,chaine,function(res,errorNo){
                if (errorNo){
                    log2("Error 9")
//                    log2('Request error Mysql_update_ressource: ' + errorNo + ' : '+ this.errorString());
                }else{

                }
            });

            /////////////////////////////////////////////////////////////////////////////////////////////
            // Let's reward the referer if needed for a white meeple, a blue meeple and a black meeple //
            /////////////////////////////////////////////////////////////////////////////////////////////

            var gold_credited=0;
            var reward_cas="";
            // We only reward the first time a user gets to the meeple. So he must be beating his best meeple.
            if (new_belt>g_user_info[user_id]["best_belt"]){
                // We update g_user_info[user_id]["best_belt"]
                g_user_info[user_id]["best_belt"]=new_belt;

                // Don't forget to update the faq page for these referer rewards if we change the values!
                if (new_belt==1){
                    gold_credited=200;
                    reward_cas="white_meeple";
                }
                else if (new_belt==5){
                    gold_credited=400;
                    reward_cas="blue_meeple";
                }
                else if (new_belt==9){
                    gold_credited=600;
                    reward_cas="black_meeple";
                }

                if (gold_credited){
                    // The user_id of the referer
                    var ref_user_id=g_user_info[user_id]["ref_user_id"];

                    if (ref_user_id!=0){ // Is there really a referer?
                        var chaine_credit_gold_to_referer="UPDATE t_user SET user_gold_by_refering=user_gold_by_refering+"+gold_credited+", user_gold=user_gold+"+gold_credited+" WHERE user_id="+ref_user_id;

                        log2(chaine_credit_gold_to_referer);

                        query(SQL_ALL,chaine_credit_gold_to_referer,function(res,errorNo){
                            if (errorNo){
                                log2("Error 21")
//                                log2('Request error Mysql_update_ressource: ' + errorNo + ' : '+ this.errorString());
                            }else{

                            }
                        });

                        var news_typ="gold_earned_by_refering";

                        //var news_detail="gold;"+gold_credited+";cas;"+reward_cas+";player_user_id;"+user_id;
                        //send_news(news_typ,news_detail,ref_user_id, 0)
                        var news_details=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                            news_details["gold"]=gold_credited;
                            news_details["referal_case"]=reward_cas;
                            news_details["refered_player_id"]=user_id;
                        send_news_in_new_format(news_typ,news_details,ref_user_id, 0);
                    }
                }

            }

        }
    });
}
function Mysql_store_match_history(match_id, i_player,user_id){
    log2("Mysql_store_match_history i_pl:"+i_player+" usr_id:"+user_id);
    if (!g_game_history_for_user[user_id]){
        // No history for this match. We don't do anything. Otherwise, g_game_history_for_user[user_id] won't be defined and it may cause issues.
        // This should reach this point, but who knows!
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        log2("WARNING!!! g_game_history_for_user[user_id] does not exist and causes Mysql_store_match_history() to abort.");
        return; 
    }
    var chaine="INSERT INTO t_match_history(mh_match_id,mh_number,mh_user_id,mh_history) VALUES ("+match_id+","+i_player+","+user_id+",'"+mysql_real_escape_string(JSON.stringify(g_game_history_for_user[user_id]))+"')";
    
    // Erase the stored history
    reset_game_history_for_player(user_id);
    
    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_store_match_history")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{

        }
    }
    );
}


// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
//function send_news(news_typ,news_detail,user_id,news_displayed){
//// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
//// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
//// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
//
//    // Update t_news_table
//    var chaine="INSERT INTO t_news(news_typ,news_detail,news_user_id,news_displayed) VALUES ('"+news_typ+"','"+news_detail+"',"+user_id+","+news_displayed+")";
//    log2 (chaine);
//    query(SQL_NEWS,chaine,function(res,errorNo){
//        if (errorNo){
//            log2("Error 12")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
//        }else{
//
//        }
//    }
//    );
//}

// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
function send_news_in_new_format(news_typ,news_detail,user_id,news_displayed){
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// 
// 
// NOW IT DOES...
// ADD CASES IF NECESSARY!

log2("send_news_in_new_format() news_typ:"+news_typ+ " user_id:"+user_id, " news_displayed:"+news_displayed+ " news_detail:"+news_detail);

    var chaine_details_keys="";
    var chaine_details_values="";
    
    for (var key in news_detail) {
        chaine_details_keys+=",";
        chaine_details_keys+="news_"+key;
        
        chaine_details_values+=",";
        
        // Is this a string that we need to :
        // 1) put between ' and '
        // 2) escape
        switch (key){
            case "referal_case":
                log2("key needs quotes key:"+key);
                var quotes_if_needed="'";
                // Escape string
                log2("news_detail[key]:"+news_detail[key])
                news_detail[key]=mysql_real_escape_string(news_detail[key])
                //log2("news_detail[key]:"+news_detail[key])
                break;
            default:
                var quotes_if_needed="";
                
        }
        
        chaine_details_values+=quotes_if_needed+news_detail[key]+quotes_if_needed;
        //log2(quotes_if_needed);
        //log2(quotes_if_needed+news_detail[key]+quotes_if_needed);
        //log2(chaine_details_values);
        
    }
    log2(chaine_details_keys);
    log2(chaine_details_values);
    
    
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
// 
    // Update t_news_table
    var chaine="INSERT INTO t_news(news_typ,news_user_id,news_displayed"+chaine_details_keys+") VALUES ('"+news_typ+"',"+user_id+","+news_displayed+chaine_details_values+")";
    log2 (chaine);
    query(SQL_NEWS,chaine,function(res,errorNo)    {
        if (errorNo){
            log2("Error 12")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{

        }
    }
    );
    
    // BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
    // BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
    // BE CAREFUL !! THIS does not use mysql_realmysql_real_escape_string() so cannot work with strings as is.
}

function store_msg_like(msg_id,channel_name,liker_user_id,liker_user_name){
    log2("store_msg_like() msg_id:"+msg_id + " channel_name:"+channel_name +" liker_user_id:"+liker_user_id+" liker_user_name:"+liker_user_name)
    // We update the single_chat object for that message (if it still exists in history).
    var msg_id_in_history=g_single_chats_id_in_history[msg_id];
    log2("msg_id_in_history:"+msg_id_in_history);
    var sc=g_chat_history[channel_name][msg_id_in_history];
    log2("sc:"+mydump(sc));
    
    var liker={"user_id": liker_user_id, "user_name": liker_user_name};
    if (sc!=null){
        sc.likes+=1;
        sc.likers.push(liker);
        //log2(mydump(sc.likers));
        //var likers_to_record=sc.likers;
    } else {
        // NOPE OBSOLETE -> We don't record the new liker, only add +1 to "likes" count in database
        //likers_to_record=0
        log2("Message is not in history anymore!");
    }
    
    Mysql_store_like(msg_id,liker);
}
        
function store_single_chat(channel,sender_pipe,user_id,user_name,user_team, msg){

    log2("sender_pipe in store_single_chat:"+sender_pipe);
    
    if (g_user_info[user_id]["admin"]["is_admin"]==1) var is_admin=1;
    else is_admin=0;
    
    // Store in memory
    var single_chat=create_new_single_chat(
            0, // We don't know the id yet
            channel,
            sender_pipe,
            user_id,
            msg,
            user_name,
            user_team,
            Math.floor(new Date()/1000),
            0,
            0,
            is_admin,
            0,
            []);
    
    log2(mydump(single_chat));
    //for (var i=1;i<=100;i++) 
    record_chat_message_and_get_unique_id(single_chat);
}


function create_new_single_chat(msg_id, channel,sender_pipe,user_id,msg,user_name,user_team,timestamp,admin_reward,deleted,is_admin,likes,likers){
    
    //log2("user_name:"+user_name);
    var single_chat=new Object();

    single_chat.msg_id=msg_id;
    single_chat.channel=channel;
    single_chat.sender_pipe=sender_pipe;
    single_chat.user_id=user_id;
    single_chat.msg=msg;
    single_chat.user_name=user_name;
    single_chat.user_team=user_team;
    single_chat.timestamp=timestamp;
    single_chat.admin_reward=admin_reward;
    single_chat.deleted=deleted;
    single_chat.is_admin=is_admin;
    single_chat.likes=likes;
    single_chat.likers=likers;
    
    return single_chat;
}

function record_chat_message_and_get_unique_id(single_chat){
    log2("sender_pipe in record_chat_message_and_get_unique_id:"+single_chat.sender_pipe);
    
    log2("record_chat_message_and_get_unique_id()");

    chaine_value=
            "\"" + mysql_real_escape_string(single_chat.channel) + "\""
            + "," + single_chat.user_id
            + ",\"" + mysql_real_escape_string(single_chat.msg) + "\""
            + ",FROM_UNIXTIME(" + single_chat.timestamp + ")"
            + ",\"" + mysql_real_escape_string(single_chat.user_name) + "\""
            + ",\"" + mysql_real_escape_string(single_chat.user_team) + "\""
            + "," + single_chat.is_admin;
//    log2(chaine_value);
    
    // Update t_chat
    var chaine="INSERT INTO t_chat(chat_channel, chat_user_id, chat_msg, chat_timestamp, chat_user_name, chat_user_team, chat_is_admin) VALUES (" + chaine_value + ")";
    log2 (chaine);
    
//    for (var i=1;i<=1000;i++){
    query(SQL_CHAT,chaine,function(res,errorNo){
//            log2("Insert:"+g_sql_con[SQL_CHAT].getInsertId());
        if (errorNo){
            log2("Error 21b");
//            log2(this);
//            log2('Request error : ' + errorNo + ' : '+ g_sql_con[SQL_CHAT].errorString()); // this is global now, not the sql object anymore because we call the query via the query function()
        }else{
            log2("Recording chat message --> Success!");

             var chat_message_id=g_sql_con[SQL_CHAT].getInsertId();
            //log2("Getting last insert_id() --> Success!");
//                var chat_message_id=res2[0]["LAST_INSERT_ID()"];
            log2("chat_message_id:"+chat_message_id);

            single_chat.msg_id=chat_message_id;

            //
            // Store the message in the history array (g_chat_history) with its id that we now have.
            //
            store_message_in_history(single_chat);

            var channel = Ape.getChannelByName(single_chat.channel);
            channel.pipe.sendRaw('channel_custom_data', {
                'msg_id':chat_message_id,
                'msg':single_chat.msg,
                'user_id':single_chat.user_id,
                'user_name':single_chat.user_name,
                'user_team':single_chat.user_team,
                'sender_pipe':single_chat.sender_pipe,
                'channel_name':single_chat.channel,
                'timestamp':single_chat.timestamp,
                'admin_reward':single_chat.admin_reward,
                'is_admin':single_chat.is_admin,
                'likes':single_chat.likes,
                'likers':single_chat.likers
            });
        }
    }
    );
//    }
    
//    query(SQL_CHAT,chaine,function(res,errorNo){
//        log2("Insert:"+g_sql_con[SQL_CHAT].getInsertId());
//        if (errorNo){
//            log2("Error 21b");
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
//        }else{
//            log2("Recording chat message --> Success!");
//        }
//    }
//    );

    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // BEWARE THIS ASSUMES THAT this query will be executed just after the previous one!
    // This should not be a problem with APE (and mysac implementation), but this needs to be checked.
//    var chaine_last_id="SELECT LAST_INSERT_ID()";
//    log2 (chaine_last_id);
//    query(SQL_CHAT,chaine_last_id,function(res2,errorNo){
//        if (errorNo){
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
//        }else{
//            //log2("Getting last insert_id() --> Success!");
//            var chat_message_id=res2[0]["LAST_INSERT_ID()"];
//            log2("chat_message_id:"+chat_message_id);
//            
//            single_chat.msg_id=chat_message_id;
//            
//            //
//            // Store the message in the history array (g_chat_history) with its id that we now have.
//            //
//            store_message_in_history(single_chat);
//
//            var channel = Ape.getChannelByName(single_chat.channel);
//            channel.pipe.sendRaw('channel_custom_data', {
//                'msg_id':chat_message_id,
//                'msg':single_chat.msg,
//                'user_id':single_chat.user_id,
//                'user_name':single_chat.user_name,
//                'user_team':single_chat.user_team,
//                'sender_pipe':single_chat.sender_pipe,
//                'channel_name':single_chat.channel,
//                'timestamp':single_chat.timestamp,
//                'admin_reward':single_chat.admin_reward,
//                'is_admin':single_chat.is_admin,
//                'likes':single_chat.likes,
//                'likers':single_chat.likers
//            });
//        }
//    }
//    );
    
}

function store_message_in_history(single_chat){
    var channel_name=single_chat.channel;

    // Create the g_chat_history array if it does not exist yet for this channel
    if (g_chat_history[channel_name]==null){
        log2 ("Creation of g_chat_history for channel: "+channel_name);
        g_chat_history[channel_name]={};
        g_chat_msg_counter[channel_name]=0;
    }

    // Store the new message
    g_chat_msg_counter[channel_name]++;
    g_chat_history[channel_name][g_chat_msg_counter[channel_name]]=single_chat; // was single_chat2
    // We record the id of the message in the chat_history
    g_single_chats_id_in_history[single_chat.msg_id]=g_chat_msg_counter[channel_name];

//    log2("g_chat_history: --------------------------------------- "+mydump(g_chat_history));

    // Delete the old message if there are already too many
    if (g_chat_msg_counter[channel_name]>g_max_number_of_messages_in_chat) {
        delete(g_chat_history[channel_name][g_chat_msg_counter[channel_name]-g_max_number_of_messages_in_chat]);
    } 
}

//    Mysql_record_puzzle_match(user.user_id, params.game_id, params.match_id, params.puzzle_id params.score, params.stars, params.match_key, end_match_type);
function Mysql_record_puzzle_match(pubid, user_id, game_id, match_id, puzzle_id, score, stars, puzzle_is_tutorial, match_key, end_match_type){
    log2("Mysql_record_puzzle_match()");
    
//    if (end_match_type!=END_MATCH_RESIGNED) Mysql_check_awards(null, 1, user.user_id, user.getProperty('pubid'), params.game_id, params.result, 0,0, (params.result=="WIN"));
    
    if (g_shunt_mysql) return;
    
    var chaine_update_nb_puzzles_completed="UPDATE t_okgame SET okgame_nb_of_puzzles_completed=okgame_nb_of_puzzles_completed+1 WHERE okgame_user_id="+user_id + " AND okgame_game_id="+game_id;
    log2 (chaine_update_nb_puzzles_completed);
    query(SQL_ALL,chaine_update_nb_puzzles_completed,function(res,errorNo){
        if (errorNo){
            log2("Error chaine_update_nb_puzzles_completed")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{

        }
    });
    
    // Record result in t_match
    if (stars>0) var match_result=1; // Success
    else match_result=2; // Fail
    
    var chaine_update_match="UPDATE t_match SET match_score_1="+ score +", match_stars = "+ stars + ", match_length=TIME(SEC_TO_TIME(UNIX_TIMESTAMP(CURRENT_TIMESTAMP)-UNIX_TIMESTAMP(match_timestamp))), match_result="+match_result+", match_end_type= " + end_match_type + " WHERE match_id=" + match_id +" AND match_key="+match_key;
    log2 (chaine_update_match);
    query(SQL_ALL,chaine_update_match,function(res,errorNo){
        if (errorNo){
            log2("Error chaine_update_match")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{

        }
    });
    
    var line_counter=0;
    if (stars>=1){
        var chaine_current_puzzle_stars="SELECT pr_stars FROM t_puzzle_result WHERE pr_user_id="+user_id + " AND pr_game_id="+game_id+" AND pr_puzzle_id="+puzzle_id;
        log2 (chaine_current_puzzle_stars);
        query(SQL_ALL,chaine_current_puzzle_stars,function(res,errorNo){
            if (errorNo){
                log2("Error chaine_current_puzzle_stars")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }
            else{
                res.each(function(data){
                    line_counter++;
                    if (line_counter>1){
                        log2("ERROR multiple lines in Mysql_record_puzzle_match() SELECT pr_stars FROM t_puzzle_result")
                    }else{
//                        var HP_gain_for_one_successful_puzzle=1;
                        if (data.pr_stars==0){
                            var chaine_gain_HP="UPDATE t_user SET user_HP=user_HP+"+g_HP_gain_per_puzzle_success+" WHERE user_id="+user_id;
                            log2 (chaine_gain_HP);
                            query(SQL_ALL,chaine_gain_HP,function(res,errorNo){
                                if (errorNo){
                                    log2("Error chaine_gain_HP")
//                                    log2('Request error : ' + errorNo + ' : '+ this.errorString());
                                }else{               
                                    // Storing the news that some King's favour has been gained.
                                    var news_typ_puzzle_success="puzzle_success";
                                    var news_details_puzzle_success=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                                    news_details_puzzle_success["game_id"]=game_id;
                                    news_details_puzzle_success["HP"]=g_HP_gain_per_puzzle_success;
                                    news_details_puzzle_success["puzzle_id"]=puzzle_id;

                                    send_news_in_new_format(news_typ_puzzle_success, news_details_puzzle_success, user_id, 0);
                                }
                            });
                        }
                    }
                })
            }
        });
    }

    // Only record a Personal Best if we scored one star at least.
    if (stars>=1){
        var chaine_update_stars_and_score="pr_stars=GREATEST("+stars+",pr_stars),pr_best_score=GREATEST(pr_best_score,"+score +")";
        var chaine_update_pr_nb_games_for_success=", pr_nb_games_for_success=IF(pr_nb_games_for_success=0,pr_played,pr_nb_games_for_success)";

        var chaine_update_puzzle_result="UPDATE t_puzzle_result SET " + chaine_update_stars_and_score + chaine_update_pr_nb_games_for_success + " WHERE pr_user_id="+user_id + " AND pr_game_id="+game_id+" AND pr_puzzle_id="+puzzle_id;
        log2 (chaine_update_puzzle_result);
        query(SQL_ALL,chaine_update_puzzle_result,function(res,errorNo){
            if (errorNo){
                log2("Error chaine_update_puzzle_result");
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }else{
                
                // We have updated the number of stars earned so we can call Mysql_check_awards() now.
//                function Mysql_check_awards(match_id, typ, user_id, pubid, game_id, result_white_belt, old_rating, rating_change, match_won){
                Mysql_check_awards(null, MODE_PUZZLE, user_id, pubid, game_id, "RESULT_NOT_IMPORTANT", 0,0, 1);
        
                // Update t_puzzle_record table if we scored 3 stars. Or create it if it does not exist yet
                if (stars>=3){
                    
                    // Getting WR value and comparing to see if we beat it. If so, store a news.
                    var chaine_world_record="SELECT prec_best_score, prec_nb_records FROM t_puzzle_record WHERE prec_game_id="+game_id+" AND prec_puzzle_id="+puzzle_id;
                    log2(chaine_world_record);
                    var prec_best_score; // Must be here not in the res.each function, otherwise, we have one in and one out. We want only one variable.
                    var prec_nb_records; // Idem
                    query(SQL_ALL,chaine_world_record,function(res,errorNo){
                        var NO_WORLD_RECORD=-99999999;
                        if (errorNo){
                            log2("Error chaine_world_record")
//                            log2('Request error : ' + errorNo + ' : '+ this.errorString());
                        }else{
//                            log2(data)
                            log2("chaine_world_record queried OK")
//                            log2(mydump(res));
                            if (res.length>=1){
                                res.each(function(data){ // It will have only one line if everything is correct.
                                    log2("data.prec_best_score:"+data.prec_best_score);
                                    prec_best_score=Number(data.prec_best_score);
                                    prec_nb_records=Number(data.prec_nb_records);
                                });
                            }else{
                                prec_best_score=NO_WORLD_RECORD;
                                prec_nb_records=0;
                            }
                            log2("prec_best_score:"+prec_best_score);
//                            res.each(function(data){ // It will have only one line if everything is correct.
//                                log2("data.prec_best_score:"+data.prec_best_score);

                            // We don't store a world record for tutorial puzzles.
                            if (!puzzle_is_tutorial && score>prec_best_score){
                                
                                var reward_in_HP_for_world_record=get_reward_in_HP_for_puzzle_world_record(prec_nb_records);
                                var reward_in_gold_for_world_record=get_reward_in_gold_for_puzzle_world_record(prec_nb_records);
                                
                                // Storing the news that a WR has been broken.
                                var news_typ_puzzle_record="puzzle_record";
                                var news_details_puzzle_record=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                                news_details_puzzle_record["game_id"]=game_id;
                                news_details_puzzle_record["puzzle_id"]=puzzle_id;
                                news_details_puzzle_record["puzzle_best_score"]=score;
                                news_details_puzzle_record["HP"]=reward_in_HP_for_world_record;
                                news_details_puzzle_record["gold"]=reward_in_gold_for_world_record;

                                send_news_in_new_format(news_typ_puzzle_record, news_details_puzzle_record, user_id, 0);
                                
                                // Credit HP and gold
                                var chaine_gain_HP_for_record="UPDATE t_user SET user_HP=user_HP+"+reward_in_HP_for_world_record+", user_gold=user_gold+"+ reward_in_gold_for_world_record+" WHERE user_id="+user_id;
                                log2 (chaine_gain_HP_for_record);
                                query(SQL_ALL,chaine_gain_HP_for_record,function(res,errorNo){
                                    if (errorNo){
                                        log2("Error chaine_gain_HP_for_record")
//                                        log2('Request error : ' + errorNo + ' : '+ this.errorString());
                                    }else{               
                                        log2("HP given for world record")
                                    }
                                });
                            }
                        }
                    });
                                 
                    // BEWARE!!! We must update prec_nb_records before changing the value of prec_best_score. Otherwise, the counter is never incremented.
                    var chaine_update_puzzle_record="INSERT INTO t_puzzle_record (prec_game_id,prec_puzzle_id,prec_best_score) VALUES("+game_id+","+puzzle_id+","+score+") ON DUPLICATE KEY UPDATE prec_nb_records=prec_nb_records+IF("+score+">prec_best_score,1,0), prec_best_score = GREATEST(prec_best_score,"+score+")";                    
                    log2(chaine_update_puzzle_record);
                    query(SQL_ALL,chaine_update_puzzle_record,function(res,errorNo){
                        if (errorNo){
                            log2("Error chaine_update_puzzle_record")
//                            log2('Request error : ' + errorNo + ' : '+ this.errorString());
                        }else{
                            log2("t_puzzle_record updated");
                        }
                    });   
                }
            }
        });
    }else{
        //user_id, game_id, match_id, puzzle_id, score, stars, puzzle_is_tutorial, match_key, end_match_type){
        
//        Mysql_check_awards()
//        function Mysql_check_awards(match_id, typ, user_id, pubid, game_id, result_white_belt, old_rating, rating_change, match_won){
        Mysql_check_awards(null, MODE_PUZZLE, user_id, pubid, game_id, "RESULT_NOT_IMPORTANT", 0,0, 1);
    }
}

function Mysql_record_training_match(user_id, bot_id, game_id, match_id, result, integer_result, score_player, score_1, score_2, match_key,end_match_type){ // result = "WIN"/"LOSS"/"DRAW" integer_result=1/2/255
    /*
     * String to update database after updates for okgame_level
     *
    UPDATE t_okgame SET okgame_level=50 WHERE okgame_level=2
    UPDATE t_okgame SET okgame_level=40 WHERE okgame_level=1 A  ND okgame_nb_of_offline_games>0
    UPDATE t_okgame SET okgame_level=30 WHERE okgame_level=1 AND okgame_nb_of_offline_games=0
    On met Keltis Card en inactif
    UPDATE t_okgame SET okgame_level=10 WHERE okgame_game_id=4 AND okgame_level<30 AND okgame_user_id<>101
    */

    log2("Mysql_record_training_match() user_id:"+user_id+" score_player:"+score_player+" score_1:"+score_1+" score_2:"+score_2+ "result:"+result);
//    log2("Mysql_record_training_match()");

    if (g_shunt_mysql) return;

    log2("g_user_info[user_id][game_id]['level']:user_id - user_id :"+game_id+ "-"+game_id+ " - "+g_user_info[user_id][game_id]['level'])

    // On ne modifie game_level que si nécessaire
    if (g_user_info[user_id][game_id]["level"]<=30){ // It was ==30 before but this resulted in a bug if the user unlocked the game in the same session (indeed, level was then at 20 and we did not go to 40 in that case
        var chaine_new_level=",okgame_level=40";
        g_user_info[user_id][game_id]["level"]=40;
    }
    else chaine_new_level="";

    if (result=="WIN"){
        var chaine_record_win=",okgame_nb_of_offline_won_games=okgame_nb_of_offline_won_games+1"
    }else chaine_record_win="";
    
    if (bot_id!=100){
        var chaine_best_training_score=", okgame_best_training_score=GREATEST(okgame_best_training_score,"+score_player+")";
    }else{
        chaine_best_training_score="";
    }
    // We record the game (even tutorial games)
    //var chaine="UPDATE t_okgame SET okgame_nb_of_offline_games=okgame_nb_of_offline_games+1, okgame_level=IF(okgame_level=30,40,okgame_level) WHERE okgame_user_id="+user_id + " AND okgame_game_id="+game_id;
    var chaine="UPDATE t_okgame SET okgame_nb_of_offline_games=okgame_nb_of_offline_games+1"+chaine_record_win+chaine_new_level+chaine_best_training_score+" WHERE okgame_user_id="+user_id + " AND okgame_game_id="+game_id;
    log2 (chaine);
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 13")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{

        }
    });

    // We record the game (even tutorial games)
    // Update result of the training match id database
//    Mysql_update_result_match(match_id, match_key, integer_result, END_MATCH_NORMAL, 0, score_1, score_2);
    Mysql_update_result_match(match_id, match_key, integer_result, end_match_type, 0, score_1, score_2);


    // If it is a win, we record it as it is used to give bot awards.
    Mysql_record_win_vs_bot(user_id, bot_id, game_id, result);

}

function Mysql_record_win_vs_bot(user_id, bot_id, game_id, result){
    log2("Mysql_record_win_vs_bot()");
    
    if (g_shunt_mysql) return;

    log2("Mysql_record_win_vs_bot()2 g_shunt_mysql:"+g_shunt_mysql);

    if (result=="WIN"){
        // In tuto mode, we do it anyway, but as there is nothing in t_bot_result for bot_id=100, this query does nothing actually.
        var chaine="UPDATE t_bot_result SET br_nb_of_wins=br_nb_of_wins+1 WHERE br_user_id="+user_id + " AND br_bot_id="+bot_id  + " AND br_game_id="+game_id;
        log2 (chaine);
        query(SQL_ALL,chaine,function(res,errorNo){
            if (errorNo){
                log2("Error 14")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
            }else{
                //
                // Have we made a new achievement in the bot challenge?
                //

                log2("bot achievement?????");

                if (bot_id!=100){ // Do not do the following in tutorial mode of course.
                    var t=g_user_info[user_id][game_id]['bot_nb_of_wins'];
                    log2("g_user_info[user_id][game_id]['bot_nb_of_wins'][bot_id]:"+g_user_info[user_id][game_id]['bot_nb_of_wins'][bot_id]);
                    log2("t[bot_id]:"+t[bot_id]);
                    t[bot_id]+=1;
                    log2("t[bot_id]:"+t[bot_id]);
                    if (t[bot_id]==1){
                        t[0]++;

                        if (t[0]==3 || t[0]==6 || t[0]==9 || t[0]==12){
                            var bounty_bot_challenge=0;
                            var bounty_HP_bc=g_HP_gain_bc[t[0]];

                            // Was 35/70/100/200 before 17/12/2019
                            // Was 50/75 before 23/03/2017
                            if (t[0]==3){
                                bounty_bot_challenge=35;
                            }else if (t[0]==6){
                                bounty_bot_challenge=70;
                            }else if (t[0]==9){
                                bounty_bot_challenge=100;
                            }else if (t[0]==12){
                                bounty_bot_challenge=150;
                            }

                            var chaine_res_bounty="UPDATE t_user SET user_gold=user_gold+"+ bounty_bot_challenge+",user_HP=user_HP+" + bounty_HP_bc + " WHERE user_id="+user_id;
                            log2(chaine_res_bounty);

                            // We load these variables here and not after the query as res_bounty may change by the time the query is finished
                            // Typical case: 5 consecutive wins is triggered also if 5 cons. wins for the 1st time. So it meant a bug in the display of the news.
                            var news_typ_abc="achievement_bot_challenge";
                            //var news_details_abc="game_id;"+game_id+";nb_of_bots_beaten;"+t[0]+";gold;"+bounty_bot_challenge;
                            //var news_details_abc="game_id;"+game_id+";nb_of_bots_beaten;"+t[0]+";gold;"+bounty_bot_challenge;
                            var news_details_abc=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
                                 news_details_abc["game_id"]=game_id;
                                 news_details_abc["nb_of_bots_beaten"]=t[0];
                                 news_details_abc["gold"]=bounty_bot_challenge;
                                 news_details_abc["HP"]=bounty_HP_bc;

                            query(SQL_ALL,chaine_res_bounty,function(res,errorNo){
                                if (errorNo){
                                    log2("Error 21")
//                                    log2('Request error : ' + errorNo + ' : '+ this.errorString());
                                }else{
                                    // Attention à ce que les variables soient les bonnes (the query was delayed so this line too)
                                    // This would fail if several send_news of this sort were sent, but there can only be one achievement here
                                    send_news_in_new_format(news_typ_abc, news_details_abc, user_id, 0)
                                }
                            });
                        }
                    }
                    log2("g_user_info[user_id][game_id]['bot_nb_of_wins'][0]:"+g_user_info[user_id][game_id]['bot_nb_of_wins'][0]);
                    //Slog2("t[0]:"+t[0]);
                }
            }
        });
    }
}

function Mysql_get_last_match_id(){
    log2("Mysql_get_last_match_id() - retrieving last_match_id");

    var chaine="SELECT MAX( match_id ) as M FROM `t_match`";
    //log2 (chaine);

    log2("g_match_id_offset:"+g_match_id_offset)

    // On the staging APE server, we use negative match_id and
    // so in this case, we take the highest of negative match_ids
    if (g_match_id_offset<0) chaine+=" WHERE match_id<0";

    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 15")
//                log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("MYSQL OK - last_match_id retrieved");
            
            g_match_counter= Math.floor(res[0].M);
            log2("Max:"+g_match_counter);

            g_counter_matches_opened=0;

            if (true && g_load_test==true) test_bot_vs_bot();

            if (false && g_load_test==true){
                for (var k=1;k<=1;k++){
                    var i_max=4*1;
                    var mc=0;
                    for (var i=1;i<=i_max;i++){
                        //log2("Load test match "+i+"/"+i_max);
                        mc=get_match_counter();
                        log2("Load test match "+i+"/"+i_max);
                        //mc=mc+1;

                        /*
                        if (game_id==1)
                        {
                            g_matches[mc]=new Tictactoe_Game('s', game_id, mc,"local",0,0,1);
                        }
                        else if (game_id==2)
                        {
                            g_matches[mc]=new Finito_Game('s', game_id, mc,"local",0,0,1);
                        }
                        else if (game_id==3)
                        {
                            g_matches[mc]=new LC_Game('s', game_id, mc,"local",0,0,1);
                        }
                        else if (game_id==4)
                        {
                            g_matches[mc]=new KeltisCard_Game('s', game_id, mc,"local",0,0,1);
                        }
                        */
                        g_counter_matches_opened++;
                        g_matches[mc]=new Finito_Game("s",1,mc,"local","local",0,1,2,false);
                        Mysql_insert_online_match(MODE_FULL_PLAY,g_matches[mc]);
                        g_matches[mc].game_start_game();

                        run_game_manager(g_matches[mc]);

                    }
                }

            }
            
            increase_g_server_ready();
        }
    }
    );
}

function Mysql_get_games_info(update_server_ready_counter){
    log2("Mysql_get_games_info() - retrieving game_info");

    var chaine="SELECT game_id, game_short_name, game_name, game_food_cost, game_food_per_win, game_solo, game_solo_perf_base, game_solo_perf_coef, game_solo_perf_min,game_solo_perf_max, game_solo_perf_speed FROM t_game WHERE game_available=1 ORDER BY game_order ASC"; // Yes they are in game_order (don't change it, it may help find bugs in match_players with game comparison)

    //log2 (chaine);
    
    // Test to make sure there is no memory_leak
//    for (var i=1;i<=1000000;i++){
//        log2(i);
//        var table_name=create_lobby_table("main_lobby",2);
//        close_lobby_table("main_lobby",table_name);
//    }
        
    g_nb_of_games=0;

    //log2(chaine)
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 16")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("MYSQL OK - game_info retrieved");

            res.each(function(data){
                g_nb_of_games++;
                //log2("g_game_ids[nb_of_games]:"+g_game_ids[g_nb_of_games])
                g_game_ids[g_nb_of_games]=data.game_id;
                //log2("1")
                g_game_info[data.game_id]=new Object();
                
                g_nb_of_games_provisional_rating[data.game_id]=25;
                
                //log2("2")
                g_game_info[data.game_id].game_short_name=data.game_short_name;
                //log2("3")
                g_game_info[data.game_id].game_name=data.game_name;

                // food_cost
                g_game_info[data.game_id].game_food_cost=data.game_food_cost;
                // food_per_win
                g_game_info[data.game_id].game_food_per_win=data.game_food_per_win;
                
                if (data.game_solo==1) g_game_info[data.game_id].game_solo=true; // Otherwise we have issues with 0 and 1 (probably because they are "0" and "1".
                else g_game_info[data.game_id].game_solo=false;
                
                
                log2("Game name: "+data.game_name + " - Game short name:"+data.game_short_name+ " --- Solo: "+g_game_info[data.game_id].game_solo);
                
//                g_game_info[data.game_id].game_solo=data.game_solo;
//                log2();
                
                g_perf_param[data.game_id]={};
                g_perf_param[data.game_id]["perf_base"]=Number(data.game_solo_perf_base);
                g_perf_param[data.game_id]["perf_coef"]=Number(data.game_solo_perf_coef);
                g_perf_param[data.game_id]["perf_min"]=Number(data.game_solo_perf_min);
                g_perf_param[data.game_id]["perf_max"]=Number(data.game_solo_perf_max);
                g_perf_param[data.game_id]["perf_speed"]=Number(data.game_solo_perf_speed);
                
//                log2(mydump(g_perf_param));
                
                //if (data.game_id>=6) create_lobby_table("main_lobby",data.game_id);

            });
            
            if (update_server_ready_counter) increase_g_server_ready();
        }

    }
    );
    //log2("JSON.stringify():  "+JSON.stringify(g_lobby_tables["main_lobby"]));
}

function Mysql_store_login(user_id,user_agent,user_ip){
    log2("Mysql_store_login() user_id:"+user_id);

    var chaine="UPDATE t_user SET user_timestamp_last_login=CURRENT_TIMESTAMP WHERE user_id="+user_id;

    log2(chaine)
    // ALWAYS USE SQL_ALL for this as we don't allow registration before SQL_ALL is loaded.
    query(SQL_ALL,chaine,function(res, errorNo){
        if (errorNo){
            log2("Error 17")
//            log2('Mysql_store_login -- Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            g_login_counter++;
            log2("Last login stored in t_user");
        }
    }
    );
    
    var chaine_insert="INSERT INTO t_login(login_user_id, login_user_agent, login_IP) VALUES ("+user_id+",\"" +mysql_real_escape_string(user_agent)+"\",\"" +user_ip+"\")";

    log2(chaine_insert);
    // ALWAYS USE SQL_ALL for this as we don't allow registration before SQL_ALL is loaded.
    query(SQL_ALL,chaine_insert,function(res, errorNo){
        if (errorNo){
            log2("Error 17b")
//            log2('Mysql_store_login b -- Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("login stored in t_login");
        }
    }
    );
}

function Mysql_get_robots_info(){
    log2("Mysql_get_robots_info() - retrieving robots_info");

    var chaine="SELECT user_id,user_first_name, okgame_game_id, okgame_rating FROM t_user INNER JOIN t_okgame ON okgame_user_id = user_id WHERE user_id<=100 AND user_bot_active=true ORDER BY user_id ASC, okgame_game_id ASC";
    
    //log2 (chaine);
    //var bot_counter=0;
    
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 18")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("MYSQL OK - robots_info retrieved");
        
            //log2("test");
            var last_bot=0;
            g_nb_of_bots=0;
            //var first_bot_id=0;
            var ub;
            res.each(function(data){
                if (last_bot!=data.user_id){
                    g_nb_of_bots++;
                    //if (first_bot_id==0) first_bot_id=data.user_id;
                    last_bot=data.user_id;
                    //log2("bot_counter:"+bot_counter)
                    //bot_counter++;
                    //var ratings_counter=0;
                    g_user_robot[last_bot]=new Object();
                    ub=g_user_robot[last_bot];
                    ub.user_id=data.user_id;
                    ub.user_name=data.user_first_name;
                    ub.rating=new Array();
                }
                //ratings_counter++;
                //log2("data.game_id")
                ub.rating[data.okgame_game_id]=Number(data.okgame_rating);
                //if (data.user_id==first_bot_id)
                //log2("ub.rating:"+ub.ratings[data.okgame_game_id])
            });
            
                       
           // log2(mydump(g_user_robot));

            // On rajoute un ROBOT_ID
            //if (load_test==false)
            for (var i=1;i<=g_nb_of_bots;i++){
                //log2("ROBOT_PUBID")
                //g_waiting_list.set(-i,i); // negative pubid for bots
                g_last_pubid[i]=-i;
            }

            increase_g_server_ready();

        }
    }
    );
}

function Mysql_get_chat_history(channel_name,user,user_id){
    log2("Mysql_get_chat_history() - retrieving chat history for channel: "+channel_name +" - user_id: "+user_id);

    var chaine="SELECT * FROM (SELECT * FROM t_chat WHERE t_chat.chat_channel='"+channel_name+"' ORDER BY chat_msg_id DESC LIMIT 0,"+g_max_number_of_messages_in_chat+") t ORDER BY chat_msg_id ASC";
    log2 (chaine);
    
    // Test purpose
    // To test it is asynchronous 
    /*query(SQL_ALL,"SELECT log_number, log_timestamp FROM t_log LIMIT 0,8000",function(res,errorNo)
    {
        if (errorNo)
        {
            log2("Error 18a")
            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }
        log2("T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE ");
        log2("T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE ");
        log2("T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE T_LOG DONE ");
    });
    */
    
    //log2("INTERMEDIATE ---------------------------------------");
    
    query(SQL_CHAT,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 18");
//            log2('Request error : ' + errorNo + ' : '+ g_sql_con[SQL_CHAT].errorString());
        }else{
            log2("DONE Mysql_get_chat_history query")
            //log2("data.likes:"+data.chat_likes)
            res.each(function(data){
                
                var likers=data.chat_likers.split("+-,-+");
                //log2("likers before:")
                //log2(mydump(likers));
                var len=likers.length;
                //likers[len]="a";
                //lkers[len+1]="a";
                //log2("ll:"+likers[len])
                //log2("likers length:"+likers.length);
                likers.splice(len-1,2); // delete the last element that is empty anyway. Splice does this.
                //log2("likers length:"+likers.length);
                
                // Put them into an object format (with eval)
                len=likers.length;
                for (var i=0;i<=len-1;i++){
                    //likers[i]=eval("({\"user_id\":100286,\"user_name\":\"Nico\"})");
                    likers[i]=eval("("+likers[i] +")");
                    //log2("a:"+mydump(likers[i]))
                    //likers[i]=eval("{\"user_id\":100286,\"user_name\":\"L'%C3%A9cole%22toto%20G.\"}");
                }
                //log2("likers after:")
                //log2(mydump(likers));
                
                // To avoid having strings, we just use Number(). Otherwise it generates weird bugs and not consistenly.
//                for (var i=1;i<=100;i++){
//                log2("i:"+i);
                var single_chat=create_new_single_chat(
                       Number(data.chat_msg_id),
                       data.chat_channel,
                       0,
                       Number(data.chat_user_id),
                       data.chat_msg,
                       data.chat_user_name,
                       data.chat_user_team,
                       Date.createFromMysql(data.chat_timestamp)/1000,
                       Number(data.chat_admin_reward), 
                       Number(data.chat_deleted),
                       Number(data.chat_is_admin),
                       Number(data.chat_likes),
                       likers
                       )
//                }
               
               //log2("# of chat_likers:"+mydump(data.chat_likes));
               //log2("single_chat:"+mydump(single_chat));
               //log2(Date.createFromMysql(data.chat_timestamp)/1000)
               store_message_in_history(single_chat);
               
               /*
               "SELECT chat_msg_id, chat_channel, chat_user_id, chat_msg, chat_timestamp, user_first_name, \n\
user_last_name, chat_deleted, chat_admin_reward \n\
FROM t_chat INNER JOIN t_user ON t_user.user_id=t_chat.chat_user_id ORDER BY chat_msg_id DESC LIMIT 300";
               */
            });
            
            //
            //log2("MYSQL OK - Chat history retrieved for channel:"+channel_name);
            //log2("USER NAME: "+user.name +" XXXXXXXXXXXXXXXXXXXX"); // For test purpose. See function test();
            //if (channel_name=="main_chat") increase_g_server_ready();
            
            g_chat_history_loaded[channel_name]=true;
            
            if (channel_name!="system_news"){ //chat_is_one_to_one(channel_name)){
                // We have tested with function test(). It seems that the user sent via the parameter (coming from send_chat_history()) cannot be modified 
                // while the Mysql data is fetched (in case two people ask for an history at the same time);
                // But just to be certain, we will check the user_id all the same. So we are certain the right info is sent to the right person. 
                // In case of trouble, we don't send.
                if (user.user_id==user_id){
                    send_chat_history(channel_name,user,user_id);
                }else log2("ERROR in Mysql_get_chat_history for channel "+channel_name+". The user has changed in the meantime.")
            }
        }
    }
    );
}

function mysql_record_one_to_one_chat_opening(user_id, invited_user_id, invited_user_name){
    log2("mysql_record_one_to_one_chat_opening() - user_id: "+user_id +" - invited_user_id: "+invited_user_id + " invited_user_name: "+invited_user_name);

    var channel_name=get_one_to_one_chat_name(user_id, invited_user_id);
    
    //var chaine="INSERT INTO t_news(news_typ,news_detail,news_user_id,news_displayed) VALUES ('"+news_typ+"','"+news_detail+"',"+user_id+","+news_displayed+")";
    var chaine="INSERT INTO t_one_to_one_chat_opening(otoco_user_id, otoco_invited_user_id, otoco_invited_user_name, otoco_channel_name) VALUES ("+user_id+","+invited_user_id+",'"+mysql_real_escape_string(invited_user_name)+"','"+mysql_real_escape_string(channel_name)+"')";
    log2 (chaine);
    
    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 18b");
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("DONE mysql_record_one_to_one_chat_opening for user_id: "+user_id +" - invited_user_id: "+invited_user_id + " invited_user_name: "+invited_user_name);
        }
    });
}

/*
function get_rating(user_id,game_id)
{
    if (user_id>=101) {
        //log2(mydump(g_user_info))
        return g_user_info[user_id][game_id]["rating"];
    }
    else return g_user_robot[user_id].rating[game_id];
}  */


//
// User info.user.name instead of this (that is not ready anyway):
//
//function get_user_name(user_id)
//{
//    if (typeof g_user_info[user_id]=="undefined"){
//        log2("BEWARE! get_user_name("+user_id+") can't return anything. User does not exist anymore!!");
//        return "User logged out??";
//    }
//    else return g_user_info[user_id]["user_name"];
//}

function get_user_rating(user_id,game_id){
    if (user_id==100){
        return 1699;
    }else if (user_id_is_robot(user_id)){
        return g_user_robot[user_id].rating[game_id];
    }else{
        //log2("user_id: "+user_id+" game_id: "+ game_id);
        return g_user_info[user_id][game_id]["rating"];
    }
}
// Not used as we have not populated g_user_info[].user_name!!
//function get_user_name(user_id,game_id){
//    if (user_id_is_robot(user_id))
//    {
//        return g_user_robot[user_id].user_name;
//    }
//    else 
//    {
//        //log2("user_id: "+user_id+" game_id: "+ game_id);
//        return g_user_info[user_id].user_name;
//    }
//}

function Mysql_credit_gold(user_id,amount,cas,extra_data_to_store){
    
    log2("Mysql_credit_gold()");
    var chaine_credit_gold="UPDATE t_user SET user_gold=user_gold+"+amount+" WHERE user_id="+user_id;

    //log2(chaine_credit_gold);
    query(SQL_ALL,chaine_credit_gold,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_credit_gold")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            var news_details=extra_data_to_store;
            // We add the gold info to the list of details to store.
            news_details["gold"]=amount;
            
            send_news_in_new_format(cas,news_details, user_id,1);
            // admin_chat_reward_message
        }
    });
}

function Mysql_ban_user(banned_user_id,admin_user_id,nb_of_hours){
    
    log2("Mysql_ban_user() banned_user_id: "+banned_user_id + " admin_user_id: "+admin_user_id+ " nb_of_hours: "+nb_of_hours);
    //var chaine_update_chat_ban_end="UPDATE t_user SET user_chat_ban_end=CURRENT_TIMESTAMP+3600*"+nb_of_hours+" WHERE user_id="+banned_user_id;
    var chaine_update_chat_ban_end="UPDATE t_user SET user_chat_ban_end=ADDDATE(CURRENT_TIMESTAMP, INTERVAL "+nb_of_hours+" HOUR) WHERE user_id="+banned_user_id;
    log2(chaine_update_chat_ban_end);
    
    var d=new Date().addHours(nb_of_hours);
    log2("user banned until :"+d);
    
            
    //log2(chaine_credit_gold);
    query(SQL_ALL,chaine_update_chat_ban_end,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_ban_user")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            var news_details=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
            news_details["chat_ban_nb_of_hours"]=nb_of_hours;
            news_details["admin_id"]=admin_user_id;
            
            send_news_in_new_format("admin_chat_ban_user",news_details, banned_user_id,1);
            // admin_chat_reward_message
        }
    });
    
    // If user exists, mark it as banned
    if (g_user_info[banned_user_id]!=null) {
        log2("STORING in array BAN of user "+banned_user_id)
        g_user_info[banned_user_id].chat_ban_end=d;
    }
}
function Mysql_delete_msg(msg_id,admin_user_id,sender_user_id){
    
    log2("Mysql_delete_msg() msg_id: "+msg_id + " admin_user_id: "+admin_user_id+" sender_user_id:"+sender_user_id);
    var chaine_delete_msg="UPDATE t_chat SET chat_deleted=1 WHERE chat_msg_id="+msg_id;
    log2(chaine_delete_msg);

    query(SQL_CHAT,chaine_delete_msg,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_delete_msg")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            var news_details=new Object(); //Must be an object not an array. Otherwise, sends_new_in_new_format crashes (lots of extra things in the array).
            news_details["chat_msg_id"]=msg_id;
            news_details["admin_id"]=admin_user_id;
            
            send_news_in_new_format("admin_delete_msg",news_details, sender_user_id,1);
        }
    });
}

function Mysql_store_msg_reward(msg_id,admin_reward){
    
    log2("Mysql_store_msg_reward_total() msg_id: "+msg_id +" admin_reward:"+admin_reward);
    var chaine_store_total="UPDATE t_chat SET chat_admin_reward=chat_admin_reward+"+admin_reward+" WHERE chat_msg_id="+msg_id;
    log2(chaine_store_total);

    query(SQL_CHAT,chaine_store_total,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_store_msg_reward_total")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            log2("Mysql_store_msg_reward_total() query = SUCCESS")
        }
    });
}

function Mysql_store_like(msg_id,liker){
    
    log2("Mysql_store_like() msg_id: "+msg_id +" liker: "+liker.user_name);
    
    //log2("mysql_real_escape_string(JSON.stringify(liker)):"+mysql_real_escape_string(JSON.stringify(liker)))
    // ??????????????????????????????????????????
    var chaine_store_like="UPDATE t_chat SET chat_likes=chat_likes+1 ,chat_likers=CONCAT(chat_likers,\""+mysql_real_escape_string(JSON.stringify(liker))+"+-,-+\") WHERE chat_msg_id="+msg_id;  //mysql_real_escape_string(JSON.stringify(liker))
    log2(chaine_store_like);

    query(SQL_CHAT,chaine_store_like,function(res,errorNo){
        if (errorNo){
            log2("Error Mysql_store_like")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
        }else{
            // Add the like in a t_msg_like table here!
            
            log2("Mysql_store_like() query = SUCCESS")
        }
    });
}
    
function Mysql_get_user_infos_if_necessary(user_id,pubid){
    log2("Mguiin() uid:"+user_id+" pubid:"+pubid)
    
    // In case the user had recently logged out, we remove him from the deletion list.
    remove_user_from_deletion_list_if_exists(user_id);
    
    //log2("tt1");
    
    // Now we check whether we have information about the user and refetch it if necessary.
    // Remember that this info is fetched a first time in REGISTER_USER_NEW.
    if (!g_user_info[user_id]){
        g_user_info[user_id]={};
        Mysql_get_bots_allowed(user_id,pubid);
    }else do_stuffs_after_user_info_is_fetched(user_id,pubid);
}
        
function Mysql_get_bots_allowed(user_id,pubid){
    log2("Mysql_get_bots_allowed(user_id):"+user_id);

    var chaine="SELECT br_bot_id, br_game_id, br_unlocked, br_nb_of_wins FROM t_bot_result WHERE t_bot_result.br_user_id="+user_id+" ORDER BY br_game_id ASC, br_bot_id ASC";
    log2 (chaine);

    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 19");
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
            return false;
        }else{
            //log2("TTTTT");
            log2("Mysql_get_bots_allowed(user_id):"+user_id + " - OK");
            var last_game_id=0;
            res.each(function(data){
                if (last_game_id!=data.br_game_id){
                    //if (first_bot_id==0) first_bot_id=data.user_id;
                    last_game_id=data.br_game_id;
                    //log2("last_game_id:"+last_game_id)
                    //bot_counter++;
                    //var ratings_counter=0;
                    g_user_info[user_id][last_game_id]={};
                    
                    g_user_info[user_id][last_game_id]['bot_unlocked']={}; // Is bot x unlocked?
                    g_user_info[user_id][last_game_id]['bot_unlocked'][0]=0; // Nb of bots unlocked

                    g_user_info[user_id][last_game_id]['bot_nb_of_wins']={}; // How many times has bot x been beaten?
                    g_user_info[user_id][last_game_id]['bot_nb_of_wins'][0]=0; // Nb of bots beaten
                    
                }

                g_user_info[user_id][last_game_id]['bot_unlocked'][data.br_bot_id]=Number(data.br_unlocked);
                g_user_info[user_id][last_game_id]['bot_nb_of_wins'][data.br_bot_id]=Number(data.br_nb_of_wins);

               
                if (data.br_unlocked==1) g_user_info[user_id][last_game_id]['bot_unlocked'][0]+=1;
                if (data.br_nb_of_wins>0) g_user_info[user_id][last_game_id]['bot_nb_of_wins'][0]+=1;  
                
                //log2("g_user_info[user_id][last_game_id]['bot_unlocked'][0]:"+g_user_info[user_id][last_game_id]['bot_unlocked'][0])
            });
            
            var test_load=false;
            if (test_load==false) Mysql_get_user_info(user_id,pubid);
        }
    }
    );

    return true;
}

function Mysql_get_user_info(user_id,pubid){
    log2("Mysql_get_user_info(user_id):"+user_id);

    var belt;
    var meeples_count=0;


    // Here we get the user_max_waiting. That's the only info that we get about the user!!
    // Incredible!!!
    // This query is not very efficient as we return user_max_waiting for every line, but hey that's probably better than another call to t_user
    //
    // Actually we now get user_ref_user_id too!!!  <<------------------
    //
    // okgame_id<1000 !!
    
    // When we add a new user_admin, it must be put a few lines below too!
    var chaine="SELECT user_max_waiting, okgame_game_id, okgame_level, okgame_nb_successive_wins, okgame_rating,\n\
             okgame_longest_series, \n\
            okgame_belt,\n\
            user_ref_user_id,\n\
            user_language,\n\
            user_first_name,\n\
            user_last_name,\n\
            user_team,\n\
            user_admin_chat_reward, \n\
            user_admin_chat_delete_msg, \n\
            user_admin_chat_ban_user, \n\
            user_chat_ban_end, \n\
            user_potion_end \n\
            FROM t_okgame INNER JOIN t_user ON user_id=okgame_user_id WHERE okgame_game_id<1000 AND okgame_user_id="+user_id+" ORDER BY okgame_game_id ASC";
    log2(chaine);

    //var bot_counter=0;

    // Tells the server that the player can ask for another game.
    g_user_info[user_id]["can_start_another_game"]=true;

    // Resets the user best belt before updating it in the loop below.
    g_user_info[user_id]["best_belt"]=0;
    
    g_user_info[user_id]["last_message_timestamp"]=0;
    g_user_info[user_id]["nb_messages_posted_last_minute"]=g_max_nb_of_messages_per_minute/2;
    g_user_info[user_id]["nb_messages_posted_last_5_minutes"]=g_max_nb_of_messages_per_5_minutes/2;
    
    // This log is temporary. It can be deleted later. Debug purpose.
    //log2("g_user_info[user_id]['best_belt']:"+g_user_info[user_id]["best_belt"]);

    query(SQL_ALL,chaine,function(res,errorNo){
        if (errorNo){
            log2("Error 20")
//            log2('Request error : ' + errorNo + ' : '+ this.errorString());
            return false;
        }else{
            var last_game_id=0;
            res.each(function(data){
                if (last_game_id!=data.okgame_game_id){
                    g_user_info[user_id]["max_waiting"]=data.user_max_waiting; // 1000ms in one second
                    g_user_info[user_id]["ref_user_id"]=data.user_ref_user_id; // Referer user id
                    g_user_info[user_id]["language"]=data.user_language; // Referer user id
                    g_user_info[user_id]["first_name"]=data.user_first_name; // Referer user id
                    g_user_info[user_id]["last_name"]=data.user_last_name; // Referer user id
//                    g_user_info[user_id]["username"]=data.user_first_name & " " & data.user_last_name; // Referer user id
                    g_user_info[user_id]["user_team"]=data.user_team; // Referer user id
                    g_user_info[user_id]["potion_end"]=Date.createFromMysql(data.user_potion_end).getTime(); //Date.createFromMysql(data.user_potion_end);
                    
                    g_user_info[user_id]["admin"]={};
                        // set_admin_right() sets also "is_admin"
                        set_admin_right(user_id,"chat_reward",data);
                        set_admin_right(user_id,"chat_ban_user",data);
                        set_admin_right(user_id,"chat_delete_msg",data);

                    //var t = data.user_chat_ban_end.split(/[- :]/);
                    //var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                    g_user_info[user_id]["chat_ban_end"]=Date.createFromMysql(data.user_chat_ban_end); //new Date(d); // When does the ban end? 0 if never banned.
                    //log2("g_user_info[user_id]['chat_ban_end']:"+g_user_info[user_id]["chat_ban_end"])
                    
                    g_user_info[user_id]["last_name"]=data.user_last_name; // Referer user id
                    
                    //log2("max waiting:"+g_user_info[user_id]["max_waiting"]);
                    //
                    //log2 ("data.okgame_belt:"+data.okgame_belt);

                    belt=Number(data.okgame_belt);
                    meeples_count+=belt;
                    
                    // We store the best belt of the user so that his referer gets his reward on the white, blue, black meeples (only once!)
                    if (belt>g_user_info[user_id]["best_belt"]){
                        g_user_info[user_id]["best_belt"]=belt;
                        // This log is temporary. It can be deleted later. Debug purpose.
                        //log2("g_user_info[user_id]['best_belt']:"+g_user_info[user_id]["best_belt"])
                    }

                    //if (first_bot_id==0) first_bot_id=data.user_id;
                    last_game_id=data.okgame_game_id;
                    //log2("last_game_id:"+last_game_id)
                    //bot_counter++;
                    //var ratings_counter=0;
                }

                if (last_game_id==2) log2('Name: '+g_user_info[user_id]["first_name"]+ " "+g_user_info[user_id]["last_name"]);
                log2("game_id:"+last_game_id + " Rating: "+data.okgame_rating);

                g_user_info[user_id][last_game_id]["belt"]=Number(data.okgame_belt);
                g_user_info[user_id][last_game_id]["rating"]=Number(data.okgame_rating);
                g_user_info[user_id][last_game_id]["successive_wins"]=Number(data.okgame_nb_successive_wins);
                g_user_info[user_id][last_game_id]["longest_series"]=Number(data.okgame_longest_series);
                g_user_info[user_id][last_game_id]["level"]=Number(data.okgame_level);

            });

            g_user_info[user_id]["meeples_count"]=meeples_count;
            
            //log2("g_user_info[user_id]: "+mydump(g_user_info[user_id]));
            //log2("ZZZZZZZZZZZZZZZZZZ: "+mydump_with_count(g_user_info[user_id]));
            
           
            do_stuffs_after_user_info_is_fetched(user_id,pubid);
    
            /*
            log2("-----------------------")
            log2("-----------------------")
            log2("-----------------------")
            log2("-----------------------")

            log2("meeples_count:"+meeples_count);

            log2("-----------------------")
            log2("-----------------------")
            log2("-----------------------")
            log2("-----------------------")
            */
            //*/
        }
    }
    );

    //log2("g_user_info[user_id]:"+g_user_info[user_id]);
    
    return true;
}

function set_admin_right(user_id,key,data){
    var val=data["user_admin_"+key];
    if (val==true) log2("set_admin_right user_id:"+user_id + " - key:"+key + " - val:"+val);
    g_user_info[user_id]["admin"][key]=val;
    if (val==1) g_user_info[user_id]["admin"]["is_admin"]=true;
}

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
                char= "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
                break;
            case "%": //This was removed by NG. the PHP mysql_real_escape_string does not escape % so why should we here? Moreover it prevents JSON.parse on the client side!!
                char= "%"; // So we don't modify it!
                break;
        }
        return char;
    });
}

function potion_is_active(user_id){
    log2("g_user_info[user_id][potion_end]:"+g_user_info[user_id]["potion_end"]);
    log2("get_time():"+get_time());
    log2("toto:"+(g_user_info[user_id]["potion_end"]-get_time()));
    var start_log="potion_is_active("+user_id+")?? ";
    if (g_user_info[user_id]["potion_end"]<get_time()){
        log2(start_log+"FALSE");
        return false;
    }else{
        log2(start_log+"TRUE");
        return true;
    }
}