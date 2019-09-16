var wrect = {};

(function() {
    "use strict";


    wrect = wrect || {};
    wrect.Physics = wrect.Physics || {};

    /**
     * @class Vector
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     * @constructor
     */
    wrect.Physics.Vector = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };

    var Vector = wrect.Physics.Vector;

    /**
     * Calculates the distance between 2 vectors.
     * @param {wrect.Physics.Vector} v
     * @returns {Number}
     */
    Vector.prototype.distance = function (v) {
        var resultVector = this.subtract(v);
        return resultVector.len();
    };

    /**
     * subtracts vectors
     * @param {wrect.Physics.Vector} v vector
     * @returns {wrect.Physics.Vector} vector
     */
    Vector.prototype.subtract = function(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };

    /**
     * adds vectors
     * @param {wrect.Physics.Vector} v vector
     * @returns {wrect.Physics.Vector} vector
     */
    Vector.prototype.add = function(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };

    /**
    *
    * @param {Number} s
    * @returns {wrect.Physics.Vector}
    */
    Vector.prototype.scale = function(s) {
      return new Vector(this.x * s, this.y * s);
    };

    /**
     * multiply vector with scalar or other vector
     * @param {Number|wrect.Physics.Vector} v vector or number
     * @returns {Number|wrect.Physics.Vector} result
     */
    Vector.prototype.multiply = function(v) {
        if (typeof v === 'number') {
            return new Vector(this.x * v, this.y * v);
        }

        return new Vector(this.x * v.x, this.y * v.y);
    };

    /**
     * @param {Number} v
     */
    Vector.prototype.divide = function(v) {
        if (typeof v === 'number') {
            return new Vector(this.x / v, this.y / v);
        }
        throw new Error('only divide by scalar supported');
    };

    /**
     * @returns {Number} length of vector
     */
    Vector.prototype.len = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * normalize vector to unit vector
     * @returns {wrect.Physics.Vector} unit vector [v0, v1]
     */
    Vector.prototype.unit = function() {
        var l = this.len();
        if(l) {
            return new Vector(this.x / l, this.y / l);
        }
        return new Vector(0, 0);
    };

    /**
     *
     * @param scalar
     * @returns {Number|wrect.Physics.Vector}
     */
      Vector.prototype.unitScalar = function(scalar) {
        return this.unit().multiply(scalar);
      };

    Vector.prototype.cross = function(v) {
      return (this.x * v.y - this.y * v.x);
    };

  /**
   *
   * @param {Number} angle
   * @param {wrect.Physics.Vector} vector
   * @returns {wrect.Physics.Vector}
   */
    Vector.prototype.rotate = function(angle, vector) {
      var x = this.x - vector.x;
      var y = this.y - vector.y;

      return new Vector(
          vector.x + ((x * Math.cos(angle)) - (y * Math.sin(angle))),
          vector.y + ((x * Math.sin(angle)) + (y * Math.cos(angle)))
      );
    };

    /**
     * rotate vector
     * @param {Number} angle to rotate vector by, radians. can be negative
     * @returns {wrect.Physics.Vector} rotated vector
     */
    Vector.prototype.rotateAngle = function(angle){
      angle = window.game.getHelpers().math.normaliseRadians(angle);
      return new Vector(this.x * Math.cos(angle)- this.y * Math.sin(angle),
          this.x * Math.sin(angle)+this.y*Math.cos(angle));
    };

    /**
     *
     * calculate vector dot product
     * @param {wrect.Physics.Vector} v
     * @returns {Number} dot product of this vector and vector v
     */
    Vector.prototype.dot = function(v){
        return (this.x * v.x) + (this.y * v.y);
    };

    /**
     *
     * calculate angle between vectors
     * @param {wrect.Physics.Vector} v
     * @returns {Number} angle between this vector and v in radians
     */
    Vector.prototype.angle=function(v){
        var perpDot = this.x * v.y - this.y * v.x;
        return Math.atan2(perpDot, this.dot(v));
    };

    /**
     * @returns {wrect.Physics.Vector} vector with max length as specified.
     */
    Vector.prototype.truncate = function(maxLength) {
        if (this.len() > maxLength) {
            var unitVector = this.unit();
            return unitVector.multiply(maxLength);
        }
        return this;
    };

  /**
   * Get the perpendicular vector to this edge.
   * @returns {wrect.Physics.Vector}
   */
    Vector.prototype.perpendicular = function() {
      return new Vector(-this.y, this.x);
    };
}());
