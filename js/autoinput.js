$(function() {
  var PATH = './csv/enemy.csv',
    ENEMY_LIST = '#enemy-list';
  $.get(PATH, function(csv) {
    var matrix, enemy;
    matrix = [];
    enemy = {};
    matrix = convertCsvToArray(csv);
    enemy = getEnemyObject(matrix);


  });

  function convertCsvToArray(csv) {
    var array, matrix;
    array = [];
    matrix = [];
    array = csv.split('\n');
    for (var i = 0; i < array.length; i++) {
      matrix[i] = array[i].split(',');
    }
    return matrix;
  }

  function getEnemyObject(matrix) {
    var enemy, enemyId;
    enemy = {};
    enemyId = '';
    for (var i = 0; i < matrix.length; i++) {
      enemyId = '';
      enemyId = 'enemyId' + i;
      enemy[enemyId] = {};
      for (var j = 0; j < matrix[0].length; j++) {
        enemy[enemyId][matrix[0][j]] = matrix[i][j];
      }
    }
    return enemy;
  }

  function hoge(enemy) {
    var li = '<li>';
    $(ENEMY_LIST).append();
  }

});
