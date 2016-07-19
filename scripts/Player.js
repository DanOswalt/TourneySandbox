(function(module){

  var Player = function(opts){
    this.id = opts.id;
    this.name = opts.name;
    this.color = opts.color;
    this.type = opts.type;
    this.age = opts.age || 1;
    this.skill = opts.skill || TourneyController.randNum(0, 15) * this.age;
    this.description = this.name + ' the ' + this.color + ' ' + this.type;
    this.tourneys = [];
  };

  Player.prototype.calcRankScore = function(tourney){
    tourney.rankScore = tourney.chips * 10000 + tourney.starting_index_score;
  };

  module.Player = Player;

})(window);
