// Generated by CoffeeScript 1.7.1
var HINT1_DELAY, HINT2_DELAY, MAX_UNANSWERED_QUESTIONS, PAUSE_DELAY, QUESTION_DELAY, Question, Quizz, ROOT_DIR, fs, path;

fs = require('fs');

path = require('path');

Question = require('./Question');

MAX_UNANSWERED_QUESTIONS = 3;

QUESTION_DELAY = 30000;

HINT1_DELAY = 10000;

HINT2_DELAY = 20000;

PAUSE_DELAY = 5000;

ROOT_DIR = path.resolve(__dirname, "../");

Quizz = (function() {
  function Quizz(questions_file, scores, print) {
    if (questions_file == null) {
      questions_file = "./questions/fr/database.txt";
    }
    if (scores == null) {
      scores = {};
    }
    this.questions = Quizz.loadQuestions(questions_file);
    this.scores = scores;
    this.unanswered_questions = 0;
    if (print) {
      this.print = print;
    }
    return;
  }

  Quizz.prototype.start = function() {
    this.print("Starting Quizz...");
    this.nextQuestion();
  };

  Quizz.prototype.pickQuestion = function() {
    var question;
    question = this.questions[Math.floor(Math.random() * this.questions.length)];
    return new Question(question);
  };

  Quizz.prototype.ask = function() {
    this.current_question = this.pickQuestion();
    this.print(this.current_question.question);
    this.qto = setTimeout(((function(_this) {
      return function() {
        return _this.timeout();
      };
    })(this)), QUESTION_DELAY);
    this.h1to = setTimeout(((function(_this) {
      return function() {
        return _this.giveHint(1);
      };
    })(this)), HINT1_DELAY);
    this.h2to = setTimeout(((function(_this) {
      return function() {
        return _this.giveHint(2);
      };
    })(this)), HINT2_DELAY);
    this.unanswered_questions += 1;
  };

  Quizz.prototype.giveHint = function(level) {
    if (level == null) {
      level = 1;
    }
    this.print(this.current_question.hint(level));
  };

  Quizz.prototype.check = function(answer, user) {
    this.unanswered_questions = 0;
    if (this.current_question && this.current_question.check(answer)) {
      this.print("" + user + " found the answer:   " + this.current_question.answer);
      this.reward(user, 10);
      this.clearTimers();
      this.nextQuestion();
    }
  };

  Quizz.prototype.timeout = function() {
    this.print("The answer was: " + this.current_question.answer);
    if (this.unanswered_questions > MAX_UNANSWERED_QUESTIONS) {
      this.stop();
      return;
    }
    this.nextQuestion();
  };

  Quizz.prototype.reward = function(user, points) {
    var _base;
    (_base = this.scores)[user] || (_base[user] = 0);
    return this.scores[user] += points;
  };

  Quizz.prototype.nextQuestion = function() {
    this.current_question = null;
    this.qto = setTimeout(((function(_this) {
      return function() {
        return _this.ask();
      };
    })(this)), PAUSE_DELAY);
  };

  Quizz.prototype.getTop = function(n) {
    var score, user;
    return ((function() {
      var _ref, _results;
      _ref = this.scores;
      _results = [];
      for (user in _ref) {
        score = _ref[user];
        _results.push({
          score: score,
          user: user
        });
      }
      return _results;
    }).call(this)).sort(function(a, b) {
      return a.score < b.score;
    }).slice(0, +(n - 1) + 1 || 9e9);
  };

  Quizz.prototype.displayTop = function(n) {
    var entry, index, res, top, _i, _len;
    top = this.getTop(n);
    res = "TOP " + n;
    for (index = _i = 0, _len = top.length; _i < _len; index = ++_i) {
      entry = top[index];
      res += "\n" + (index + 1) + ". " + entry.user + ":  " + entry.score;
    }
    this.print(res);
  };

  Quizz.prototype.print = function(n) {
    console.log(n);
  };

  Quizz.prototype.clearTimers = function() {
    clearTimeout(this.qto);
    delete this.qto;
    clearTimeout(this.h1to);
    delete this.h1to;
    clearTimeout(this.h2to);
    delete this.h2to;
  };

  Quizz.prototype.stop = function() {
    this.print("Stopping Quizz...");
    this.clearTimers();
  };

  Quizz.loadQuestions = function(filePath) {
    var file, _filePath;
    _filePath = path.resolve(ROOT_DIR, filePath);
    file = fs.readFileSync(_filePath);
    return file.toString().split("\n");
  };

  return Quizz;

})();

module.exports = Quizz;
