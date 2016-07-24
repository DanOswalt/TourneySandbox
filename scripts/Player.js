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
    this.averageRank = opts.id;
    this.rankList = '';
  };

  Player.prototype.calcRankScore = function(tourney){
    tourney.rankScore = tourney.chips * 10000 + tourney.starting_index_score;
  };

  Player.prototype.calcAverageRankScore = function(){
    this.averageRankScore = this.averageRank * 10000 + parseInt(this.id);
  };

  Player.prototype.getAverageRank = function() {
    var sum = this.tourneys.reduce(function(acc, tourney){
      return acc += parseInt(tourney.rank);
    }, 0);
    this.averageRank = sum / this.tourneys.length;
  };

  Player.prototype.getPlayerBonus = function(t_index) {
    var bonus = 0;
    var tourney = TourneyController.tourneys[t_index];
    if(tourney.colorBonus === this.color) {
      bonus += this.skill * 0.5;
    }
    if(tourney.typeBonus === this.type) {
      bonus += this.skill * 0.5;
    }
    if(tourney.colorBonus === this.color && tourney.typeBonus === this.type) {
      bonus += this.skill * 0.5;
    }
    console.log('bonus:', bonus);
    return bonus;
  };

  Player.prototype.updateRankList = function () {
    return this.tourneys.map(function(tourney){
      return '<span class="rank-' + tourney.rank + '">' + tourney.rank + '</span>';
    }).join(' ');
  };

  module.Player = Player;

})(window);
