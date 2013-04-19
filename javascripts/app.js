$(function() {
    window.app = new Hangman();

    $(document).on('click', '#alphabet button', function(e) {
        var letter = $(this).data('letter');
        app.makeAttempt(letter);
    });

    //$('#body-part').html(bodyParts[errorCount]);

    app.redraw();
});

var Hangman = (function() {
    function Hangman() {
        this.errorCount = 0;
        this.alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
        this.bodyParts = [
            'LIVE',
            'head',
            'torso',
            'leftarm',
            'rightarm',
            'leftleg',
            'rightleg',
            'DEATH'
        ];

        this.words = [
            'cat',
            'hippopotomus',
            'hip hop anonymous'
        ];

        this.$el       = $('#body-part');
        this.$guesses  = $('#guesses');
        this.$word     = $('#word');
        this.$alphabet = $('#alphabet');
        this.gameWord  = this.words[_.random(0, this.words.length - 1)];
        this.populateAlphabet();
        this.populatePlaceholders();
    }

    Hangman.prototype.populateAlphabet = function () {
        _.each(this.alphabet, function(letter) {
            this.$alphabet.append('<li><button class="btn" data-letter="'+letter+'">'+letter+'</button></li>');
        }, this);
    };

    Hangman.prototype.populatePlaceholders = function () {
        var placeholder;
        _.each(this.gameWord.split(''), function(letter) {
            placeholder = letter === ' ' ? ' ' : '_';
            this.$word.append('<li class="btn">'+placeholder+'</li>');
        }, this);
    };

    Hangman.prototype.error = function() {
        this.errorCount++;
        this.redraw();
        return null;
    };

    Hangman.prototype.makeAttempt = function(letter) {
        // Evaluate usage
        // Remove from availability
        // Redraw hangman
        this.$guesses.append('<li>'+letter+' &nbsp;</li>');
        this.revealLetter(letter);
        this.removeChar(letter);
        this.evalWin();
    };

    Hangman.prototype.evalWin = function () {
        var placeholders = this.$word.find('li');
        var remaining = _.filter(placeholders, function(letter) {
            console.log($(letter).html());
            return $(letter).html() === '_';
        });

        if (remaining <= 0) {
            $('.span12').html('<h1>YOU WIN</h1><p><button onclick="location=\'index.html\'">play again</button>');
        }

        if (this.errorCount >= 7) {
            $('.span12').html('<h1>YOU LOSE</h1><p><button onclick="location=\'index.html\'">play again</button>');
        }
    };

    Hangman.prototype.revealLetter = function (letter) {
        var matches = [];

        _.each(this.gameWord.split(''), function(val, key) {
            if (val === letter) {
                matches.push(key);
            }
        });

        if (matches.length > 0) {
            var placeholders = this.$word.find('li');

            _.each(matches, function (index) {
                $(placeholders[index]).html(letter);
            });
        } else {
            this.error();
        }
    };

    Hangman.prototype.removeChar = function(letter) {
        var charIndex = _.indexOf(this.alphabet, letter);
            characters = this.$alphabet.find('li');
        this.alphabet = _.reject(this.alphabet, function(char) { return letter == char; });
        $('[data-letter='+letter+']').remove();
    };

    Hangman.prototype.redraw = function () {
        this.$el.html(this.bodyParts[this.errorCount]);
    };

    return Hangman;
})();
