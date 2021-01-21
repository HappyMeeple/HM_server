var g_userlist = new $H;

Ape.registerHookCmd("connect", function(params, info){
    // We go through this function only if there was not an active session
    // running. So most of the time, in game.php we do not send a command that reaches this function
    
//    Ape.log("----------");
    Ape.log("CONNECT with name (user_name):"+params.user_name);
//    Ape.log("params.user_id:"+params.user_id);
//    Ape.log("params:");
    Ape.log(mydump(params));
    Ape.log("info:");
    Ape.log(mydump(info));
//    Ape.log("----------");

    if (!$defined(params.name)) return 0;
    
    Ape.log("params.name.toLowerCase():"+params.name.toLowerCase());
////    Ape.log("g_user_list:")
//    Ape.log(mydump(g_userlist))
    
    // A remettre
    //if (g_userlist.has(params.name.toLowerCase())) return ["005", "NICK_USED"];
    if (g_userlist.has(params.user_id)) {
        Ape.log("ERROR user is already logged in!")
        return ["005", "NICK_USED"];
    }
    // A remettre

    //if (params.name.length > 16 || params.name.test('[^a-zA-Z0-9]', 'i')) return ["006", "BAD_NICK"];

    // Check that the user asking for connection is the one that logged in with PHP
    // Check_key is php session id to start with but it could be something else (random generated for example)

//    Ape.log("g_check_key[params.user_id]:"+g_check_key[params.user_id]);
//    Ape.log("params.check_key:"+params.check_key);
    
    if (g_check_key[params.user_id]==null){  // && connection_typ!="full" ??? Yes but anyway, the next check will also fail in
        Ape.log("check_key does not exist on APE server!!! The server has just been restarted?")
        return ["444", "NO_CHECK_KEY"];
    }else if (g_check_key[params.user_id]!=params.check_key){ // User asked for full connection. It failed. Wrong check key.
        Ape.log("222, BAD_CHECK_KEY");
        return ["222", "BAD_CHECK_KEY"];
    }

    info.user.name= params.user_name;
    info.user.user_id= params.user_id;
    info.user.check_key=params.check_key;
    
    // Those properties are "public" properties that are sent via the channels. The other ones above are private! So info.user.user_id is not the same as info.user.getProperty("user_id");
    info.user.setProperty("user_name",params.user_name);
    info.user.setProperty("user_id",params.user_id);
    
    if (g_array_match_ids[params.user_id]==null) g_array_match_ids[params.user_id]=NO_MATCH;
    if (g_array_training_match_ids[params.user_id]==null) g_array_training_match_ids[params.user_id]=NO_MATCH;
    if (g_array_puzzle_match_ids[params.user_id]==null) g_array_puzzle_match_ids[params.user_id]=NO_MATCH;

   g_user_counter++;
   return 1;
   
})

Ape.registerHookCmd("session", function(params, info){
    Ape.log("---------");
    Ape.log("SESSION XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    Ape.log("params: "+mydump(params));
    Ape.log("info: "+mydump(info));

    //Ape.log("params.ac_key:"+params.ac_key);
    Ape.log("info.user.user_id:"+info.user.user_id); 
    Ape.log("XXXXXXXXXXXXXXXXXX");

    //info.user.quit();
    
    //return -1; //["004", "BAD_SESSION"]; //["006", "BLABLA"]
    return 1;
    
});


Ape.addEvent('adduser', function(user){
    Ape.log("adduser event");
    
    var user_id=user.user_id;
    Ape.log("user.user_id:"+user_id);

    g_last_login[user_id]=get_time();
    
    // We want the game_history arrays to be defined at least 
    // So as to prevent bugs when they are not.
    // reset_game_history_for_player(user_id);
    
    // If we test on several machines, the test_user_id may have be given twice to clients
    // so we need to use this array
    if (g_temporary_locked_test_user_id[user_id]==true){
        //g_temporary_locked_test_user_id[user_id]=false;
    }
    //g_userlist.set(user.name.toLowerCase(), true);
    
    g_last_pubid[user_id]=user.getProperty('pubid');
    //Ape.log("---------------------------->>>>>g_last_pubid[user_id]:"+g_last_pubid[user_id])
    //Ape.log("---------------------------->>>>>user.pubid:"+user.pubid)
    //Ape.log("---------------------------->>>>>user.getProperty('pubid'):"+user.getProperty('pubid'))
    g_userlist.set(user_id, true);

    //Ape.log(g_userlist);
    Ape.log("adduser fin");

    //send_custom_raw(user.pipe, user.user_id, ", raw_details)
});

Ape.addEvent('deluser', function(user){
    // We can't really delete the g_user_info for the user as the user may want to carry on playing before his PHP session
    // is over which would mean he would not get g_user_info back (as it is only fetched on REGISTER_USER_NEW)

    var user_id=user.user_id;

    Ape.log("delusr uid:"+user_id);
            
    //g_userlist.erase(user.name.toLowerCase());
    
    g_last_pubid[user_id]=null;
    g_userlist.erase(user_id);
    g_user_counter--;
//    Print_User_Counter();

    //user_id=user.getProperty("user_id"));
    Ape.log("array_match_ids[user_id]:"+g_array_match_ids[user_id]);

    // We delete the timeout if any
    final_erase_timeout_existing_user(user,"deluser");

    // If the game has not really started, then the opponent will never receive the info that the match will not be played
    // Later he will, as his opponent will fail to make a move and will lose on time
    var pubid=user.getProperty('pubid');
    
    Ape.log("dl2 pubid:"+pubid);
    
//    Ape.log("pubid:"+pubid)
    // We erase the user from the waiting list if needed.
    //g_waiting_list.erase(pubid); // If we do not do that, then list in g_waiting_list will grow (and also it was causing a bug, because it did not like to have a pubid that was null for user_id leading to crashing match_players().

    Ape.log("dl3");

    //var match_id=user.match_id;
    var match_id=g_array_match_ids[user_id];

    Ape.log("dl4");

    var g=g_matches[match_id];

    Ape.log("dl5");

    if (match_id!=NO_MATCH){
        if (g.game_started==true){
            Ape.log("dl6a");
            //if the match has started, the disconnected player loses the match.
            make_user_lose_current_match(user_id, END_MATCH_DISCONNECTION);
            Ape.log("dl6b");
        }
        // else if the match has not started, then the match is simply cancelled
        else{
            Ape.log("dl7a");
            delete_match_cause_cancel(match_id)
            Ape.log("dl7b");
        }
    }else{
        Ape.log("match_id=NO_MATCH. The player was not playing");// Is this WEIRD??????????????????");
    }

    delete(g_array_match_ids[user_id]);
    delete(g_array_training_match_ids[user_id]);
    delete(g_array_puzzle_match_ids[user_id]);
    
    // In case the user has been deleted recently, the user may still be in the deletion list. 
    // This means the counter g_marked_for_deletion will be too high (+1) after we have done the following two lines
    remove_user_from_deletion_list_if_exists(user_id);
    // The following two lines
    g_marked_for_deletion++;
    g_user_marked_for_deletion[user_id]=get_time();
    
    // Close all tables in the lobby rooms.
    make_user_leave_all_tables(user_id);
    
    // This must be at the end, at least after make_user_lose_current_match() as we need the info to store the end_match info in the history when the game is ended.
//    reset_game_history_for_player(user_id);
    delete(g_game_history_for_user_counter[user_id]); // What if this does not exist? Seems fine.
    delete(g_game_history_for_user[user_id])
    
    Ape.log("g_marked_for_deletion++: "+g_marked_for_deletion);
    //delete (g_user_info[user_id]);
    
    Ape.log("dlsr END");

}
);


Ape.addEvent('mkchan', function(channel) {
    var channel_name=channel.getProperty('name');
    Ape.log("Added channel "+channel_name)
    g_channel_list[channel_name]=1;
    g_channels_counter++;
    g_channel_list_of_users[channel_name]={};
    //g_channel_user_counter[channel_name]=0;
});
Ape.addEvent('rmchan', function(channel) {
    var channel_name=channel.getProperty('name');
    Ape.log("Removed channel "+channel_name)
    // delete the channel from the list of channels
    //g_channel_list.splice(g_channel_list.indexOf(channel_name),1);
    delete g_channel_list[channel_name];
    g_channels_counter--;
    delete(g_channel_list_of_users[channel_name]);
    
    //g_channel_user_counter[channel]=0;
    
    // When a channel is removed (all users left), we must free the memory by deleting all information related to this channel
    // g_chat history
    // g_chat_msg_counter
    // g_single_chats_id_in_history    
    var arr=g_chat_history[channel_name];
    for (var key in arr){
        if (arr.hasOwnProperty(key)){
            //Ape.log("key:"+key+" arr[key]:"+mydump(arr[key]));
            var sc=arr[key];
            //Ape.log("sc.msg_id:"+sc.msg_id);
            delete(g_single_chats_id_in_history[sc.msg_id]);
            delete(arr[key]); // Not sc otherwise it won't be deleted properly
            // Was created like this:
            // g_single_chats_id_in_history[single_chat.msg_id]=g_chat_msg_counter[channel_name];
        }
    }
    delete(g_chat_msg_counter[channel_name]);
    delete(g_chat_history_loaded[channel_name]);
    delete(g_chat_history[channel_name]);
});

// User has just joined a channel
Ape.addEvent('afterJoin', function(user, channel) {
    var user_id=user.user_id;
    var channel_name=channel.getProperty('name');
    
    //g_channel_user_counter[channel_name]++;
    g_channel_list_of_users[channel_name][user_id]=true;
    
    Ape.log("Joined channel "+channel_name+" nb_of_users:"+get_object_length(g_channel_list_of_users[channel_name])); //g_channel_user_counter[channel_name]);
    Ape.log("-> Joined channel:"+mydump(g_channel_list_of_users[channel_name])); //g_channel_user_counter[channel_name]);
});

Ape.addEvent('left', function(user, channel) {
    var channel_name=channel.getProperty('name');
    var user_id=user.user_id;
    
    var user_in_channel=is_user_in_channel(channel_name,user_id);
    
    if (user_in_channel){
        //g_channel_user_counter[channel_name]--;
        delete(g_channel_list_of_users[channel_name][user_id]);
        Ape.log("Lft ch:"+channel_name); //+ " nb_of_users:"+g_channel_user_counter[channel_name]);

        /*
        // We decided that we wanted the link with the chat to stay open when the user logged out, because it allowed to reopen the chat next time the user logs in.
        // Otherwise, the messages sent in-between were lost.
        if (chat_is_one_to_one(channel_name)){
            // Extract the 2 user ids for this channel
            var obj=get_one_to_one_users_id(channel_name);
            // Find out which one is the other player id
            if (obj.user_id_1==user_id){
                //var main_user_id=obj.user_id_1;
                var invited_user_id=obj.user_id_2;
            }else{
                //main_user_id=obj.user_id_2;
                invited_user_id=obj.user_id_1;
            }
            delete_one_to_one_chats_object(user_id,invited_user_id);

            // It seems channels are automatically killed when the number of users is 0.
            // if (g_channel_user_counter[channel_name]==0) Ape.rmChan(channel_name);
        }
        */
//        Ape.log("Lft ch:"+channel_name);//+ " nb_of_users:"+g_channel_user_counter[channel_name]);
    }
    
});

function is_user_in_channel(channel_name, user_id){
    if (typeof g_channel_list_of_users[channel_name][user_id]!="undefined"){
        return true;
    }
    else return false;
}