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
    this.status = 'active';
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
        averageRank : null,
        averageRankScore : null,
        rank : starting_index + 1, //initially just the order in which they loaded
        rankScore : null,
        finish : null
      });
      player.calcRankScore(player.tourneys[self.index]);
      player.getAverageRank();
      player.calcAverageRankScore();
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
    loser.tourneys[t_index].rank = self.active_players.length + 1; //rank equals finish
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
    result = self.getBattleResult();
    self.adjustChipCounts(self.index, result);

    if(result.loser.tourneys[self.index].chips === 0) {
      self.removeDead(result.loser, self.index);
    }

    if(self.active_players.length > 1) {
      self.sort(self.index);
      self.active_players.forEach(function(player, index){
        player.tourneys[self.index].rank = index + 1;
      });
      TourneyController.playerList.forEach(function(player){
        player.getAverageRank();
        player.calcAverageRankScore();
      });
      TourneyController.sortLeaderboard();
      self.average_stack = self.calcAverageStack();
      self.current_bet = self.calcCurrentBet();
    } else {
      self.status = 'finished';
    }

    $('#tourney-' + self.index).empty().append(self.updateHtml());
    $('#tourney-overall').empty().append(TourneyController.updateOverallStandingsHTML());

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
    var player1_bonus = this.player1.getPlayerBonus(this.index);
    var player2_bonus = this.player2.getPlayerBonus(this.index);

    if(Math.random() * (this.player1.skill + player1_bonus) > Math.random() * (this.player2.skill + player2_bonus)) {
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
    '<h2 class="tourney-name">' + self.name + ' (' + self.current_bet + ')</h2>' +
    '<h4 class="tourney-bonus"> Bonus: ' + self.colorBonus + ' ' + self.typeBonus + '</h4>';

    var activeList = '<ul class="player_list">';

    self.active_players.forEach(function(player, index){
      var liStarter = player.tourneys[self.index].id === TourneyController.selected ?
        '<li class="player_description selected" data-id="' :
        '<li class="player_description" data-id="';

      activeList += liStarter + player.tourneys[self.index].id + '">';
      activeList += player.tourneys[self.index].rank + '. ';
      activeList += player.description;
      activeList += ' [' + player.tourneys[self.index].chips + ']';
      activeList += '</li>';
    });

    activeList += '</ul>';

    var finishedList = '<ul class="finished_list">';

    self.finished_players.forEach(function(player, index){
      var liStarter = player.tourneys[self.index].id === TourneyController.selected ?
        '<li class="player_description selected" data-id="' :
        '<li class="player_description" data-id="';

      finishedList += liStarter + player.tourneys[self.index].id + '">';
      finishedList += player.tourneys[self.index].finish + '. ';
      finishedList += player.description;
      finishedList += '</li>';
    });

    finishedList += '</ul></div>';
    return htmlHeader + activeList + finishedList;

  };

  module.Tourney = Tourney;

})(window);
