var assert = chai.assert;
var expect = chai.expect;

describe('Item', function() {
  describe('#name()', function() {
    it('Check that names exist for all items', function() {
      for (let item of potions) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of armours) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of helmets) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of shields) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of staffs) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of swords) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of axes) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of bows) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of arrows) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of throwing) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of spells) {
        expect(item.name).to.not.equal('undefined');
      }
      for (let item of treasures) {
        expect(item.name).to.not.equal('undefined');
      }
    });
  });
  describe('#sprite()', function() {
    it('Check that sprites exist for all items', function() {
      for (let item of potions) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of armours) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of helmets) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of shields) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of staffs) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of swords) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of axes) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of bows) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of arrows) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of throwing) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of spells) {
        expect(item.sprite).to.not.equal('undefined');
      }
      for (let item of treasures) {
        expect(item.sprite).to.not.equal('undefined');
      }
    });
  });
});