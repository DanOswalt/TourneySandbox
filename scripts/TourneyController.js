(function(module){

  var TourneyController = {
    tourneys : [],
    playerList : [],
    participants : 64,
    selected : null,
    numberOfTourneys : 7,
    finished_tourneys : 0
  };

  TourneyController.capitalise = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  TourneyController.createPlayerList = function(){
    var age = 1;
    for (var i = 0; i < this.participants; i++) {

      this.playerList.push(new Player({
        id : i,
        name : this.randomName(),
        color : this.randomColor(),
        type : this.randomType(),
        age : age
      }));

      //age up after every group of 4
      if((i + 1) % 4 === 0) {
        age += 1;
      }
    }
  };

  TourneyController.createNewPlayers = function(n, id) {
    for (var i = 0; i < n; i++) {
      this.playerList.push(new Player({
        id : id + i,
        name : this.randomName(),
        color : this.randomColor(),
        type : this.randomType(),
        age : 1
      }));
    }
  };

  TourneyController.newGame = function() {
    var self = this;

    if(localStorage.playerList) {
      self.playerList = JSON.parse(localStorage.getItem('playerList'));
      self.playerList = self.playerList.map(function(player){
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

      self.playerList.sort(function(a, b){
        return b.age - a.age;
      });

    } else {
      self.createPlayerList();
      localStorage.setItem('playerList', JSON.stringify(self.playerList));
    }

    for (var i = 0; i < self.numberOfTourneys; i += 1) {
      self.tourneys.push(new Tourney({
        active_players : self.playerList.slice(),
        index : i
      }));
      self.tourneys[i].init();

      $('#tourney-overall').empty().append(self.updateOverallStandingsHTML());
      $('#tourney-modules').append(self.tourneys[i].updateHtml());
    }
  };

  TourneyController.removeOldestGroup = function(n) {
    //sort by youngest to oldest
    TourneyController.playerList.sort(function(a, b){
      return b.age - a.age;
    });
    //remove the first n
    var removedPlayers = TourneyController.playerList.splice(0, n);
  };

  TourneyController.randomName = function() {
    var chars = this.randNum(3,8);
    var pattern = this.randNum(0,2);
    var word;
    var vowels = ['a','a','a','a','a','a','a','a','a','a',
	                 'e','e','e','e','e','e','e','e','e','e',
	                 'o','o','o','o','o','o','o','o','o','o',
	                 'i','i','i','i','i','u','u','u','u','u',
	                 'ae','ai','au','aa','ea','ee','ei','eu','ia','ie',
	                 'io','ua','ue','ui','uo','eau','oa','oi','ou','ea'
	                ];

    var first_conson = ['B','C','D','F','G','H','J','K','L','M',
	                       'N','N','P','Q','R','S','T','V','W','X',
	                       'Y','Z','Ch','Sh','Ph','Th','Sh','Str','Sk','Sp',
	                       'Kr','Kl','Qu','Fr','Bl','Pl','Tr','Tw','Dr','Br',
	                       'Gh','Gr','Gl','Pr','Zh','Fl','Cl','Cr','Chr','Spr',
	                       'R','S','T','L','N','R','S','T','L','N'
	                      ];

    var other_conson = ['b','c','d','f','g','h','j','k','l','m',
	                       'n','n','p','q','r','s','t','u','v','x',
	                       'y','z','ch','sh','ph','th','st','str','sk','sp',
	                       'ss','tt','qu','mm','nn','gg','tr','rt','lt','ft',
	                       'gh','rg','dd','rp','ll','ck','rf','cr','chr','spr',
	                       'r','s','t','l','n','r','s','t','l','n'
	                      ];

    if(pattern < 2 ) {
      word = first_conson[this.randNum(0,59)] +
	                  vowels[this.randNum(0,59)] +
	                  other_conson[this.randNum(0,59)] +
	                  vowels[this.randNum(0,59)] +
	                  other_conson[this.randNum(0,59)];

    } else {
      word = vowels[this.randNum(0,59)] +
	                  other_conson[this.randNum(0,59)] +
	                  vowels[this.randNum(0,59)] +
	                  other_conson[this.randNum(0,59)] +
	                  vowels[this.randNum(0,59)];
      word = this.capitalise(word);
    }

    word = word.substr(0,chars);

    return word;
  };

  TourneyController.randomColor = function() {
    var choice = this.randNum(0,31);
    var choices = ['yellow', 'yellow', 'yellow', 'yellow',
                   'green', 'green', 'green', 'green',
                   'red', 'red', 'red', 'red',
                   'blue', 'blue', 'blue', 'blue',
                   'pink', 'pink', 'brown', 'brown',
                   'black', 'black', 'white', 'white',
                   'orange', 'orange', 'purple', 'purple',
                   'golden', 'silver', 'bronze', 'platinum'
                 ];
    return choices[choice];
  };

  TourneyController.randomType = function() {
    var choice = this.randNum(0,31);
    var choices = ['cat', 'cat', 'cat', 'cat',
                   'dog', 'dog', 'dog', 'dog',
                   'fish', 'fish', 'fish', 'fish',
                   'bird', 'bird', 'bird', 'bird',
                   'whale', 'whale', 'elephant', 'elephant',
                   'horse', 'horse', 'pig', 'pig',
                   'chicken', 'chicken', 'goat', 'goat',
                   'narwhal', 'unicorn', 'shark', 'cheetah'
                 ];
    return choices[choice];
  };

  TourneyController.randNum = function(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  TourneyController.sortLeaderboard = function() {
    this.playerList.sort(function(a, b) {
      return a.averageRankScore - b.averageRankScore;
    });
  };

  TourneyController.updateOverallStandingsHTML = function() {
    var self = this;
    var header = '<h2 class="tourney-overall-header">Leaderboard</h2>';
    var list = '<ol class="overall_list">';

    self.playerList.forEach(function(player, index){
      if(index < 10) {
        list += '<li class="player_description" data-id="' + player.id + '">';
        list += player.description;
        list += ' [' + player.averageRank.toFixed(2) + '] ';
        list += '</li>';
        list += '<span class="ranklist">' + player.updateRankList() + '</span>';
      }
    });

    list += '</ol>';

    return header + list;

  };


  module.TourneyController = TourneyController;

})(window);
