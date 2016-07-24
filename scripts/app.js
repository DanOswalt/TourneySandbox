(function(module){

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
    TourneyController.removeOldestGroup(4);
    TourneyController.createNewPlayers(4, 64);
    localStorage.setItem('playerList', JSON.stringify(TourneyController.playerList));
    TourneyController.newGame();
  });

  TourneyController.newGame();

})(window);
