/*global describe, it */
'use strict';
(function () {

  var Topic;

  beforeEach(function () {

    Topic = new Timers();
  });

  describe('Timers (background)', function () {

    describe('#remove', function () {

      it('should remove timer from hash and sorted array', function () {

        Topic.add({
          'id': 1,
          'label': 'foo',
          'duration': 1000
        });

        function getIndex () {

          return _.findIndex(Topic.timersSorted, function (timer) {

            return timer.id === 1;
          });
        }

        var index = getIndex();
        expect(Topic.timers[1]).to.be.truthy;
        expect(index).to.equal(0);

        Topic.remove(1);

        index = getIndex();
        expect(Topic.timers[1]).to.be.undefined;
        expect(index).to.equal(-1);
      });
    });
  });
})();