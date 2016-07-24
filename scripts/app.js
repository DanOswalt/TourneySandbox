(function(module){

  //handle ui stuff
  var $tourneyModules = $('#tourney-modules');
  var numberOfTourneys = 7;

  if(localStorage.playerList) {
    TourneyController.playerList = JSON.parse(localStorage.getItem('playerList'));
    TourneyController.playerList = TourneyController.playerList.map(function(player){
      return new Player({
        id : player.id,
        name : player.name,
        color : player.color,
        type : player.type,
        age : player.age,
        skill : player.skill,
        description : player.description,
        tourneys : [],
        averageRank : player.id,
        rankList : ''
      });
    });

    TourneyController.playerList.sort(function(a, b){
      return b.age - a.age;
    });

  } else {
    TourneyController.createPlayerList();
    localStorage.setItem('playerList', JSON.stringify(TourneyController.playerList));
  }

  for (var i = 0; i < numberOfTourneys; i += 1) {
    TourneyController.tourneys.push(new Tourney({
      active_players : TourneyController.playerList.slice(),
      index : i
    }));
    TourneyController.tourneys[i].init();

    $('#tourney-overall').empty().append(TourneyController.updateOverallStandingsHTML());
    $tourneyModules.append(TourneyController.tourneys[i].updateHtml());
  }

  $('#go').on('click', function(){
    setInterval(function(){
      TourneyController.tourneys.forEach(function(tourney){
        if(tourney.active_players.length > 1){
          tourney.gameLoop();
        }
        if(tourney.status === 'finished') {
          TourneyController.finished_tourneys += 1;
          if(TourneyController.finished_tourneys === TourneyController.tourneys.length) {
            $('#next').show();
          }
        }
      });
    }, 1000);
  });

  $('#one-go').on('click', function(){
    TourneyController.tourneys.forEach(function(tourney){
      if(tourney.active_players.length > 1){
        tourney.gameLoop();
      }
    });
  });

  $('#next').on('click', function(){
    console.log('doink');
    //list of clean-up and resetting scripts, save the info, year-up
    TourneyController.removeOldestGroup(4);
    TourneyController.createNewPlayers(4, 64);
  });

})(window);
