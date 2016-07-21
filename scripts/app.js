(function(module){

  //handle ui stuff
  var $tourneyModules = $('#tourney-modules');
  var numberOfTourneys = 3;

  if(localStorage.playerList) {
    TourneyController.playerList = JSON.parse(localStorage.getItem('playerList'));
  } else {
    TourneyController.createPlayerList();
  }

  for (var i = 0; i < numberOfTourneys; i += 1) {
    TourneyController.tourneys.push(new Tourney({
      active_players : TourneyController.playerList.slice(),
      index : i
    }));
    TourneyController.tourneys[i].init();

    var html = TourneyController.tourneys[i].updateHtml();
    $tourneyModules.append(html);
  }

  $('#temp-go').on('click', function(){
    setInterval(function(){
      TourneyController.tourneys.forEach(function(tourney){
        if(tourney.active_players.length > 1){
          tourney.gameLoop();
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

})(window);
