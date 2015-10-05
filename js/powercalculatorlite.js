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
      $('#physical-damage-increase-rate').val() / 100 + 1,
      $('#physical-element').val() - 0,
      $('#physical-element-type').val() - 0,
      PHYSICAL_CONSTANT
    );

    Magic = new Status( // attack, deffence, damageUpRate, element, elementType, constant
      $('#magic-attack').val() - 0,
      $('#enemy-magic-deffence').val() - 0,
      $('#magic-damage-increase-rate').val() / 100 + 1,
      MAGIC_ELEMENT,
      $('#magic-element-type').val() - 0,
      MAGIC_CONSTANT
    );

    if (!calculator.checkUniqueDamages()) {
      alert('入力されたダメージに重複があります。');
      return;
    }

    if (calculator.isSkillType) {
      power = calculator.getPowerLite(Physical);
    } else {
      power = calculator.getPowerLite(Magic);
    }

    if (power) {
      $('#result').val(power);
    } else {
      alert('最大値と最小値を計算できませんでした。\nデータが不足しています。');
    }
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
        if (i === j) {
          j++;
        }
        if (array[i] === array[j]) {
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

  PowerCalculator.prototype.getMedian = function() {
    var max, min;
    max = this.getMax();
    min = this.getMin();
    max /= 1.05;
    min /= 0.95;
    if (max <= min + 1 && max >= min - 1) {
      return max;
    } else {
      return false;
    }
  };

  PowerCalculator.prototype.getMax = function() {
    var array, max, count, countMax;
    array = this.getDamages();
    max = 0;
    countMax = 0;
    for (i = 0; i < array.length; i++) {
      count = 0;
      for (j = 0; j < array.length; j++) {
        if (array[i] > array[j]) {
          count++;
        }
      }
      if (count > countMax) {
        max = array[i];
        countMax = count;
      }
    }
    return max;
  };
  PowerCalculator.prototype.getMin = function() {
    var array, min, count, countMax;
    array = this.getDamages();
    min = 0;
    countMax = 0;
    for (i = 0; i < array.length; i++) {
      count = 0;
      for (j = 0; j < array.length; j++) {
        if (array[i] < array[j]) {
          count++;
        }
      }
      if (count > countMax) {
        min = array[i];
        countMax = count;
      }
    }
    return min;
  };

  PowerCalculator.prototype.getPowerLite = function(status) {
    var damage, correctionC, attack, deffence, damageUpRate, element, basicDamage;
    damage = this.getMedian();
    correctionC = this.correctionC;
    attack = status.attack;
    deffence = status.deffence;
    damageUpRate = status.damageUpRate;
    element = status.correctElement();
    basicDamage = status.getBasicDamage();
    constant = status.constant;
    power = Math.round((damage / correctionC) / (basicDamage / constant) / damageUpRate / element);
    return power;
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
