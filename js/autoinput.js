$(function() {
  // csv からオブジェクトを作る
  $.get('./csv/enemy.20150930.csv', function(data) {
    var array, matrix, enemy, enemyId;
    array = [];
    matrix = [];
    enemy = {};
    array = data.split('\n');

    for (var i = 0; i < array.length; i++) {
      matrix[i] = array[i].split(',');
    }

    for (i = 0; i < matrix.length; i++) {
      enemyId = '';
      enemyId = 'enemy' + i;
      enemy[enemyId] = {};
      enemy[enemyId] = new Enemy( // hasDefined, nameArea, name, level, element, job, hp, exp, physicalAttack, physicalDeffence, physicalAccuracy, physicalEvasion, magicAttack, magicDeffence, magicAccuracy, magicEvasion, expEffeciency, area, isBoss, orb
        matrix[i][0], matrix[i][1], matrix[i][2], matrix[i][3], matrix[i][4], matrix[i][5], matrix[i][6], matrix[i][7], matrix[i][8], matrix[i][9], matrix[i][10], matrix[i][11], matrix[i][12], matrix[i][13], matrix[i][14], matrix[i][15], matrix[i][16], matrix[i][17], matrix[i][18], matrix[i][19]
      );
    }

    
  });

  function Enemy(hasDefined, nameArea, name, level, element, job, hp, exp, physicalAttack, physicalDeffence, physicalAccuracy, physicalEvasion, magicAttack, magicDeffence, magicAccuracy, magicEvasion, expEffeciency, area, isBoss, orb) { // 定義, 名称（出現場所）, 名前, レベル, 属性, 職業, HP, EXP, 物攻, 物防, 命中, 回避, 法攻, 法防, 法命中, 法回避, 効率, 出現場所, BOSS, 霊気
    this.hasDefined = hasDefined;
    this.nameArea = nameArea;
    this.name = name;
    this.level = level;
    this.element = element;
    this.job = job;
    this.hp = hp;
    this.exp = exp;
    this.physicalAttack = physicalAttack;
    this.physicalDeffence = physicalDeffence;
    this.physicalAccuracy = physicalAccuracy;
    this.physicalEvasion = physicalEvasion;
    this.magicAttack = magicAttack;
    this.magicDeffence = magicDeffence;
    this.magicAccuracy = magicAccuracy;
    this.magicEvasion = magicEvasion;
    this.expEffeciency = expEffeciency;
    this.area = area;
    this.isBoss = isBoss;
    this.orb = orb;
  }
});
