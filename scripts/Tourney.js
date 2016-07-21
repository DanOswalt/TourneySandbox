(function(module){

  var Tourney = function(opts){
    this.index = opts.index;
    this.active_players = opts.active_players || null;
    this.name = opts.name || TourneyController.randomName();
    this.colorBonus = opts.colorBonus || TourneyController.randomColor();
    this.typeBonus = opts.typeBonus || TourneyController.randomType();
    this.starting_chips = opts.starting_chips || 3;
    this.player1 = '';
    this.player2 = '';
  };

  Tourney.prototype.adjustChipCounts = function (index, result) {
    var adjustment;
    var winner = result.winner.tourneys[index];
    var loser = result.loser.tourneys[index];

    if(winner.chips >= this.current_bet && loser.chips >= this.current_bet) {
      adjustment = this.current_bet;
    } else {
      adjustment = winner.chips > loser.chips ? loser.chips : winner.chips;
    }

    winner.chips += adjustment;
    loser.chips -= adjustment;

    result.winner.calcRankScore(result.winner.tourneys[index]);
    result.loser.calcRankScore(result.loser.tourneys[index]);
  };

  Tourney.prototype.init = function(){
    var self = this;

    //set the tournament's initial values
    self.total_players = self.active_players.length;
    self.total_chips = self.total_players * self.starting_chips;
    self.average_stack = self.calcAverageStack();
    self.current_bet = self.calcCurrentBet();
    self.finished_players = [];

    //initialize each player
    self.active_players.forEach(function(player, starting_index){
      player.tourneys.push({
        t_name : self.name,
        t_id : self.index,
        chips : self.starting_chips,
        id : starting_index,
        starting_index_score : self.total_players - starting_index,
        status : 'active',
        rankScore : null,
        rank : starting_index + 1, //initially just the order in which they loaded
        finish : null
      });
      player.calcRankScore(player.tourneys[self.index]);
    });

  };

  Tourney.prototype.calcAverageStack = function() {
    return this.total_chips / this.active_players.length;
  };

  Tourney.prototype.calcCurrentBet = function() {
    return Math.floor(this.average_stack / 3);
  };

  Tourney.prototype.removeDead = function (loser, t_index) {
    var self = this;
    var p_index = self.active_players.indexOf(loser);
    var removed_player = self.active_players.splice(p_index, 1);
    self.finished_players.unshift(removed_player[0]);
    loser.tourneys[t_index].status = 'out';
    loser.tourneys[t_index].finish = self.active_players.length + 1;
  };

  //later: call w/ GO button
  Tourney.prototype.gameLoop = function(){
    var self = this;
    var result;
    var html;
    var $tourneyModules = $('#tourney-modules');
    var killCount = 0;
    var chips_in_play;

    self.getTwoPlayers();
    // TourneyController.addInBattleStyle(self.index, self.player1, self.player2);
    $('#tourney-' + self.index).empty().append(self.updateHtml());
    result = self.getBattleResult();

    self.adjustChipCounts(self.index, result);
    chips_in_play = self.active_players.reduce(function(a,b){
      return a += b.tourneys[self.index].chips;
    }, 0);

    console.log(result.loser.tourneys[self.index].chips);
    if(result.loser.tourneys[self.index].chips === 0) {
      self.removeDead(result.loser, self.index);
    }

    chips_in_play = self.active_players.reduce(function(a,b){
      return a += b.tourneys[self.index].chips;
    }, 0);
    console.log('after remove dead:', self.name, chips_in_play);
    console.log('*************************************');

    console.log('active list:', self.active_players);
    console.log('finished list:', self.finished_players);

    if(self.active_players.length > 1) {
      self.sort(self.index);
      self.average_stack = self.calcAverageStack();
      self.current_bet = self.calcCurrentBet();
    }

    $('#tourney-' + self.index).empty().append(self.updateHtml());



    //run step 2 of the ui: fadeIn w/ winner/loser colors
    //update chipcount, sort the new list, remove loser if at 0
    //run step 3 of the ui: fadeOut entire list
    //refresh html
    //run step 4 of the ui: fadeIn entire list with the last players still highlighted, then fadeOut highlights

  };

  //is this a good way of getting 2 random players?
  //find algorithm for getting 2 unique values from an array

  Tourney.prototype.getTwoPlayers = function () {
    var self = this;
    var choice = TourneyController.randNum(0, self.active_players.length-1);
    self.player1 = self.active_players[choice];

    do {
      self.player2 = self.active_players[TourneyController.randNum(0,self.active_players.length-1)];
    } while (self.player1 === self.player2);
  };

  Tourney.prototype.getBattleResult = function() {
    if(Math.random() * this.player1.skill > Math.random() * this.player2.skill) {
      return {winner : this.player1, loser : this.player2};
    } else {
      return {winner : this.player2, loser : this.player1};
    }
  };

  Tourney.prototype.sort = function (index) {
    this.active_players.sort(function(a, b) {
      return b.tourneys[index].rankScore - a.tourneys[index].rankScore;
    });
  };

  Tourney.prototype.updateHtml = function(){
    var self = this;
    var htmlHeader =
    '<div id="tourney-' + self.index + '"class="tourney-container">' +
    '<h2 class="tourney-name">' + self.name + '</h2>' +
    '<div class="btn go-btn">Go</div>' +
    '<div class="btn pause-btn">Pause</div>' +
    '<h4 class="tourney-bonus"> Bonus: ' + self.colorBonus + ' ' + self.typeBonus + '</h4>' +
    '<h4 class="tourney-bet">Stakes: ' + self.current_bet + '</h4>' +
    '<h4 class="tourney-bet">Avg Stack: ' + self.average_stack.toFixed(2) + '</h4>';
    // '<h4 class="tourney-player1">Player1 <' + self.player1.description + '> </h4>' +
    // '<h4 class="tourney-player2">Player2 <' + self.player2.description + '> </h4>';

    var activeList = '<ol class="player_list">';

    self.active_players.forEach(function(player, index){
      activeList += '<li class="player_description" data-id="' + player.tourneys[self.index].id + '">';
      activeList += player.description;
      activeList += ' [' + player.tourneys[self.index].chips + ']';
      activeList += '</li>';
    });

    activeList += '</ol>';

    var finishedList = '<ul class="finished_list">';

    self.finished_players.forEach(function(player, index){
      finishedList += '<li class="player_description" data-id="' + player.tourneys[self.index].id + '">';
      finishedList += player.tourneys[self.index].finish + '. ';
      finishedList += player.description;
      finishedList += '</li>';
    });

    finishedList += '</ul></div>';


    return htmlHeader + activeList + finishedList;

  };



  module.Tourney = Tourney;

})(window);
