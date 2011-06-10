describe("Vector", function() {
   var vector;
   var vectorCopy;
   var vector2;
   
   beforeEach(function() {
      vector = new Vector(3,4);
      vectorCopy = new Vector (3,4);
      vector2 = new Vector(10,10);
   });
   
   it("should initialize properly", function() {
      expect(vector.x).toEqual(3);
      expect(vector.y).toEqual(4);
      expect(vector2.x).toEqual(10);
      expect(vector2.y).toEqual(10);
   });


   it("should have a correct magnitude", function() {
      expect(vector.getMagnitude()).toEqual(5);
   });
   
   it("Should be able to add another vector", function() {
      vector.add(vector2);
      expect(vector.x).toEqual(vectorCopy.x + vector2.x);
      expect(vector.y).toEqual(vectorCopy.y + vector2.y);
   });
   
   it("Should be creatable by submitting two other vectors", function() {
      var vector3 = vector.vectorTo(vector2);
      expect(vector3.x).toEqual(vector2.x-vector.x);
      expect(vector3.y).toEqual(vector2.y-vector.y);
   });
   
   it("Should be testable to be within bounds", function() {
      expect(vector.withinBounds(new Vector(3,4),0)).toBeTruthy();
      expect(vector.withinBounds(new Vector(3,4),10)).toBeTruthy();
      expect(vector.withinBounds(new Vector(50,50),10)).toBeFalsy();
      expect(vector.withinBounds(new Vector(2,2),5)).toBeTruthy();
      expect(vector.withinBounds(new Vector(2,2),0)).toBeFalsy();
   });
   
   it("Should return a clockwise angle zeroed from 3 o'clock", function() {
      expect(new Vector(5,5).getAngleDegrees()).toEqual(45);
      expect(new Vector(Math.sqrt(3),-1).getAngleDegrees().toFixed(0)).toEqual('330');
      expect(new Vector(-5,5).getAngleDegrees()).toEqual(135);
      expect(new Vector(-5,-5).getAngleDegrees()).toEqual(225);
      expect(new Vector(5,-5).getAngleDegrees()).toEqual(315);
      expect(new Vector(30,-8).getAngleDegrees().toFixed(0)).toEqual('345');
   });

   describe("Points", function() {
      var point;
      
       beforeEach(function() {
         point = new Point(25,50);
       });

      it("Should copy itself with no references", function() {
         var newPoint = point.copy();
         point.x = 10;
         point.y = 10;
         point.multiply(10);
         expect(newPoint.x).not.toEqual(point.x);
         expect(newPoint.y).not.toEqual(point.y);
      });
  });

});