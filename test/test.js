var Set = require('../');
var assert = require('assert');

describe('static functions', function(){
	
	describe('create()', function(){
		it('should return an empty object', function(){
			var o = Set.create();
			assert.strictEqual('object', typeof o);
			var i = 0;
			for (var k in o) i++;
			assert.strictEqual(0, i);
			assert.strictEqual(undefined, o.hasOwnProperty);
		});
	});

	describe('has()', function(){
		it('should return an empty object', function(){
			var o = Set.create();
			assert.strictEqual(false, Set.has(o, 'foo'));
			Set.add(o, 'foo');
			assert.strictEqual(true, Set.has(o, 'foo'));
			o.foo = null;
			assert.strictEqual(true, Set.has(o, 'foo'));
			delete o.foo;
			assert.strictEqual(false, Set.has(o, 'foo'));
		});
	});

	describe('add()', function(){
		it('should return an empty object', function(){
			var o = Set.create();
			assert.strictEqual(false, Set.has(o, 'foo'));
			var added = Set.add(o, 'foo');
			assert.strictEqual(true, Set.has(o, 'foo'));
			assert.strictEqual(true, added);
			added = Set.add(o, 'foo');
			assert.strictEqual(false, added);
		});
	});

	describe('remove()', function(){
		it('should return an empty object', function(){
			var o = Set.create();
			assert.strictEqual(false, Set.has(o, 'foo'));
			var added = Set.add(o, 'foo');
			assert.strictEqual(true, Set.has(o, 'foo'));
			assert.strictEqual(true, added);
			added = Set.add(o, 'foo');
			assert.strictEqual(false, added);
		});
	});

});
