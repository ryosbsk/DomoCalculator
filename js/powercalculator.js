$(function() {
  // ダメージ欄クリア
  $('#btn-clear-damage').click(function() {
    $('.damage').each(function(index, el) {
      $(this).val('');
    });
  });
  // 計算
  $('#btn-calculator').click(function() {
    var PHYSICAL_CONSTANT = 7.5,
      MAGIC_CONSTANT = 6.25,
      MAGIC_ELEMENT = 50,
      POWER_RANGE = 0.005;
    var calculator, Physical, Magic, matrix, power;

    matrix = [];
    mode = 0;

    calculator = new PowerCalculator( // isSkillType, skillAmplification, enemyJobDamageUpRate, enemyLevelCorrection, skillLevelCorrection, jobTypeCorrection
      $('#skill-power-type').val() - 0,
      $('#skill-amplification-rate').val() / 100, // %
      $('#job-increase-rate').val() / 100 + 1, // %
      $('#enemy-level-gap').val() - 0,
      $('#skill-level-gap').val() - 0,
      $('#job-type-gap').val() - 0
    );

    Physical = new Status( // attack, deffence, damageUpRate, element, elementType, constant
      $('#physical-attack').val() - 0,
      $('#enemy-physical-deffence').val() - 0,
      $('#physical-damage-increase-rate').val() - 0 + 1,
      $('#physical-element').val() - 0,
      $('#physical-element-type').val() - 0,
      PHYSICAL_CONSTANT
    );

    Magic = new Status( // attack, deffence, damageUpRate, element, elementType, constant
      $('#magic-attack').val() - 0,
      $('#enemy-magic-deffence').val() - 0,
      $('#magic-damage-increase-rate').val() - 0 + 1,
      MAGIC_ELEMENT,
      $('#magic-element-type').val() - 0,
      MAGIC_CONSTANT
    );

    if (!calculator.checkUniqueDamages()) {
      alert('入力されたダメージに重複があります。');
      return;
    }

    if (calculator.isSkillType) { // 1: 物理 0: 法術
      if (calculator.skillAmplification) {
        matrix = calculator.getPowerMatrixWithAmplification(Physical, Physical);
      } else {
        matrix = calculator.getPowerMatrixWithoutAmplification(Physical);
      }
    } else {
      if (calculator.skillAmplification) {
        matrix = calculator.getPowerMatrixWithAmplification(Magic, Physical);
      } else {
        matrix = calculator.getPowerMatrixWithoutAmplification(Magic);
      }
    }

    power = calculator.getMode(matrix, POWER_RANGE);
    $('#result').val(power);
  });

  function PowerCalculator(isSkillType, skillAmplification, enemyJobDamageUpRate, enemyLevelCorrection, skillLevelCorrection, jobTypeCorrection) {
    this.isSkillType = isSkillType;
    this.skillAmplification = skillAmplification;
    this.correctionC = enemyJobDamageUpRate * enemyLevelCorrection * skillLevelCorrection * jobTypeCorrection;
    this.DAMAGE_RANDOM_NUMBERS = [0.95, 0.96, 0.97, 0.98, 0.99, 1, 1.01, 1.02, 1.03, 1.04, 1.05];

  }

  PowerCalculator.prototype.checkUniqueDamages = function() {
    var array;
    array = [];
    array = this.getDamages();
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < array.length; j++) {
        if (i===j) {
          j++;
        }
        if (array[i]===array[j]) {
          return false;
        }
      }
    }
    return true;
  };

  PowerCalculator.prototype.getDamages = function() {
    var damages;

    damages = $('.damage').map(function(i, e) {
      if ($(this).val()) {
        return $(this).val() - 0;
      }
    }).get();

    return damages;
  };


  PowerCalculator.prototype.getPowerMatrixWithAmplification = function(status, Physical) {
    var damages, array, count, matrix, correctionC, attack, deffence, skillAmplification, damageUpRate, element, basicDamage, physicalAttack, physicalDeffence, physicalDamageUpRate, physicalElement;
    damages = this.getDamages();
    correctionC = this.correctionC;
    attack = status.attack;
    deffence = status.deffence;
    skillAmplification = this.skillAmplification;
    damageUpRate = status.damageUpRate;
    element = status.correctElement();
    basicDamage = status.getBasicDamage();
    physicalAttack = Physical.attack;
    physicalDeffence = Physical.deffence;
    physicalDamageUpRate = Physical.damageUpRate;
    physicalElement = Physical.correctElement();
    constant = status.constant;
    DAMAGE_RANDOM_NUMBERS = this.DAMAGE_RANDOM_NUMBERS;
    matrix = [];
    for (var i = 0; i < damages.length; i++) {
      array = [];
      count = 0;
      for (var j = 0; j < DAMAGE_RANDOM_NUMBERS.length; j++) {
        for (var k = 0; k < DAMAGE_RANDOM_NUMBERS.length; k++) {
          array[count] = Math.round((damages[i] / correctionC - (attack - deffence) * skillAmplification * physicalDamageUpRate * physicalElement * DAMAGE_RANDOM_NUMBERS[j]) / (basicDamage / constant) / DAMAGE_RANDOM_NUMBERS[k] / damageUpRate / element);
          count++;
        }
      }
      matrix[i] = $.unique(array);
    }
    return matrix;
  };

  PowerCalculator.prototype.getPowerMatrixWithoutAmplification = function(status) {
    var damages, array, matrix, correctionC, attack, deffence, skillAmplification, damageUpRate, element, basicDamage;
    damages = this.getDamages();
    correctionC = this.correctionC;
    attack = status.attack;
    deffence = status.deffence;
    skillAmplification = this.skillAmplification;
    damageUpRate = status.damageUpRate;
    element = status.correctElement();
    basicDamage = status.getBasicDamage();
    constant = status.constant;
    DAMAGE_RANDOM_NUMBERS = this.DAMAGE_RANDOM_NUMBERS;
    matrix = [];
    for (var i = 0; i < damages.length; i++) {
      array = [];
      count = 0;
      for (var j = 0; j < DAMAGE_RANDOM_NUMBERS.length; j++) {
        array[j] = Math.round((damages[i] / correctionC) / (basicDamage / constant) / DAMAGE_RANDOM_NUMBERS[j] / damageUpRate / element);
      }
      matrix[i] = $.unique(array);
    }
    return matrix;
  };

  PowerCalculator.prototype.getMode = function(matrix, range) {
    var mode, count, countMax;
    mode = 0;
    countMax = 0;
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        count = 0;
        for (var k = 0; k < matrix.length; k++) {
          if (i === k) {
            break;
          }
          for (var l = 0; l < matrix[k].length; l++) {
            if (matrix[i][j] >= matrix[k][l] * (1 - range) && matrix[i][j] <= matrix[k][l] * (1 + range)) {
              count++;
            }
          }
        }
        // console.log('(count, matrix[i].length) =(' + count + ', ' + matrix[i].length + ')');
        if (count >= countMax) {
          mode = matrix[i][j];
          countMax = count;
          // console.log('(countMax, matrix[' + i + '][' + j + ']) = (' + countMax + ' ,' + matrix[i][j] + ')');
        }
      }
    }
    return mode;
  };

  function Status(attack, deffence, damageUpRate, element, elementType, constant) {
    this.attack = attack;
    this.deffence = deffence;
    this.damageUpRate = damageUpRate;
    this.element = element;
    this.elementType = elementType;
    this.constant = constant;
  }

  Status.prototype.getBasicDamage = function() {
    var basicDamage = this.attack / this.deffence;
    if (basicDamage > this.constant) {
      basicDamage = this.constant;
    }
    return basicDamage;
  };
  Status.prototype.correctElement = function() {
    var element = this.element;
    element += 1 / 2;
    element /= 100;
    if (this.elementType === 1) { // 1: 弱点 0: 普通 -1: 抵抗
      if (element > 2) {
        return 2;
      } else {
        element += 1;
      }
    } else if (this.elementType === -1) {
      if (element < 0.2) {
        return 0.2;
      } else {
        element = 1 - element;
      }
    } else {
      return 1;
    }
    return element;
  };

});
