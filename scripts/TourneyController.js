(function(module){

  var TourneyController = {
    tourneys : [],
    playerList : [],
    participants : 64
  };

  TourneyController.addInBattleStyle = function(t_index, p1, p2){
    var $thisTourney = $('#tourney-' + t_index);
    var $playerList = $thisTourney.find('.player_list');
    var $p1 = $playerList.find('[data-id="' + p1.id + '"]');
    var $p2 = $playerList.find('[data-id="' + p2.id + '"]');

    $.each([$p1, $p2], function(){
      $(this).addClass('in-battle').fadeIn(1200).delay(1200).animate({opacity: 0});
    });

    $thisTourney.find('tourney-player1').text(p1.name);

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

  TourneyController.capitalise = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  module.TourneyController = TourneyController;

})(window);
