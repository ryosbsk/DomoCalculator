/*
# したいことリスト
- フローチャートの簡素化
ｰ クラスの簡素化
-- 一つにまとめるか?
ｰ クラスにプロパティを追加するのを、工夫したい。
*/

$(function() {
  // 計算
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
    if (this.elementType === 1) { // 1: 弱点 0: 普通 -1: 抵抗
      if (element > 1) {
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

  function Calculator (skillType, skillAmplification, enemyJobDamageUpRate, enemyLevelCorrection, skillLevelCorrection, jobTypeCorrection){
    this.skillType = skillType;
    this.skillAmplification = skillAmplification;
    this.enemyJobDamageUpRate = enemyJobDamageUpRate;
    this.enemyLevelCorrection = enemyLevelCorrection;
    this.skillLevelCorrection = skillLevelCorrection;
    this.jobTypeCorrection = jobTypeCorrection;
  }
});
